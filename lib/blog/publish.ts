import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { gatherTravelBriefs, generateTravelPost } from "./ai";
import { blogAuthorName, isAutoPublishEnabled } from "./config";
import { readingMinutes } from "./html";
import { getBlogRepository } from "./index";
import { editionTag, GATHER_HOUR, isPublishHour, PUBLISH_HOURS, readEdition, seoulClock, seoulSlotIso } from "./schedule";
import { ensureSlug } from "./slug";
import type { BlogPost, BlogTopic } from "./types";

export interface EditionReport {
  dateKey: string;
  hour: number;
  action: "idle" | "gather" | "publish" | "skip";
  gathered: number;
  scheduled: number;
  published: { topicId: string; postId: string } | null;
  error?: string;
}

export interface QueueReport {
  promoted: number;
  mode: "draft" | "publish";
  generated: Array<{ topicId: string; postId: string; status: "draft" | "published" }>;
  failed: Array<{ topicId: string; error: string }>;
}

function isStuck(topic: BlogTopic) {
  if (topic.status !== "generating") return false;
  return Date.now() - Date.parse(topic.updatedAt) > 10 * 60 * 1000;
}

export function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/blog/topics");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function generateTopicIntoPost(
  topicId: string,
  mode: "draft" | "publish" | "schedule",
  scheduledAt?: string,
) {
  const repository = getBlogRepository();
  const topic = (await repository.listTopics()).find((item) => item.id === topicId);
  if (!topic) throw new Error("Topic not found.");
  if (topic.status === "generating" && !isStuck(topic)) {
    throw new Error("This topic is already being written.");
  }
  if (topic.status === "drafted" || topic.status === "published") {
    throw new Error("This topic already has a post. Queue another topic to write a new one.");
  }

  const stamp = new Date().toISOString();
  await repository.saveTopic({ ...topic, status: "generating", error: "", updatedAt: stamp });

  try {
    const article = await generateTravelPost(topic);
    const posts = await repository.listPosts();
    const slug = ensureSlug(article.slug || article.title, new Set(posts.map((post) => post.slug)));
    const now = new Date().toISOString();
    const post: BlogPost = {
      id: `blog-${randomUUID()}`,
      slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.contentHtml,
      coverImageUrl: article.coverImageUrl,
      destination: article.destination,
      tags: article.tags,
      status: mode === "publish" ? "published" : mode === "schedule" ? "scheduled" : "draft",
      publishedAt: mode === "publish" ? now : null,
      scheduledAt: mode === "schedule" ? scheduledAt || null : null,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      authorName: blogAuthorName(),
      readingMinutes: readingMinutes(article.contentHtml),
      source: "ai",
      aiPrompt: [topic.title, topic.destination, topic.angle, topic.notes].filter(Boolean).join("\n"),
      createdAt: now,
      updatedAt: now,
    };
    await repository.savePost(post);
    await repository.saveTopic({
      ...topic,
      status: mode === "publish" ? "published" : "drafted",
      postId: post.id,
      error: "",
      updatedAt: now,
    });
    revalidateBlog(post.slug);
    return post;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate a post.";
    await repository.saveTopic({
      ...topic,
      status: "failed",
      error: message,
      updatedAt: new Date().toISOString(),
    });
    revalidateBlog();
    throw new Error(message);
  }
}

export async function runPublishQueue(limit: number): Promise<QueueReport> {
  const repository = getBlogRepository();
  const promoted = await repository.promoteScheduled();
  const mode = isAutoPublishEnabled() ? "publish" : "draft";
  const topics = (await repository.listTopics())
    .filter((topic) => topic.status === "queued")
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .slice(0, limit);

  const generated: QueueReport["generated"] = [];
  const failed: QueueReport["failed"] = [];

  for (const topic of topics) {
    try {
      const post = await generateTopicIntoPost(topic.id, mode);
      generated.push({
        topicId: topic.id,
        postId: post.id,
        status: mode === "publish" ? "published" : "draft",
      });
    } catch (error) {
      failed.push({
        topicId: topic.id,
        error: error instanceof Error ? error.message : "Failed to generate a post.",
      });
    }
  }

  if (promoted) revalidateBlog();
  return { promoted, mode, generated, failed };
}

function slotTopics(topics: BlogTopic[], dateKey: string, hour: number) {
  return topics.filter((topic) => {
    const edition = readEdition(topic.notes);
    return edition?.dateKey === dateKey && edition.hour === hour;
  });
}

async function ensureDailyBriefs(dateKey: string, hours: number[]) {
  const repository = getBlogRepository();
  const current = await repository.listTopics();
  const missing = hours.filter((hour) => slotTopics(current, dateKey, hour).length === 0);
  if (!missing.length) return 0;

  const [posts, topics] = await Promise.all([repository.listPosts(), repository.listTopics()]);
  const recent = [...posts.map((post) => post.title), ...topics.map((topic) => topic.title)];
  const briefs = await gatherTravelBriefs(recent, missing.length);
  const now = new Date().toISOString();
  let created = 0;

  for (let index = 0; index < missing.length; index += 1) {
    const brief = briefs[index];
    const hour = missing[index];
    if (!brief) break;
    if (slotTopics(await repository.listTopics(), dateKey, hour).length) continue;
    await repository.saveTopic({
      id: `topic-${randomUUID()}`,
      title: brief.title,
      destination: brief.destination,
      angle: brief.angle,
      keywords: brief.keywords,
      notes: `${editionTag(dateKey, hour)}\n${brief.notes}`,
      status: "queued",
      postId: null,
      error: "",
      createdAt: now,
      updatedAt: now,
    });
    created += 1;
  }

  if (created) revalidateBlog();
  return created;
}

export async function runDailyEdition(now = new Date()): Promise<EditionReport> {
  const clock = seoulClock(now);
  const report: EditionReport = {
    dateKey: clock.dateKey,
    hour: clock.hour,
    action: "idle",
    gathered: 0,
    scheduled: 0,
    published: null,
  };
  const gathering = clock.hour === GATHER_HOUR;
  const publishing = isPublishHour(clock.hour);
  if (!gathering && !publishing) return report;

  const repository = getBlogRepository();
  const promoted = await repository.promoteScheduled();
  await markLiveTopics();
  if (promoted) revalidateBlog();

  const hours = publishing ? PUBLISH_HOURS.filter((hour) => hour >= clock.hour) : [...PUBLISH_HOURS];
  if (hours.length) {
    report.gathered = await ensureDailyBriefs(clock.dateKey, hours);
    report.error = await scheduleEditionHours(clock.dateKey, hours, report);
  }
  if (publishing) report.action = promoted ? "publish" : report.scheduled ? "gather" : "skip";
  else report.action = "gather";
  return report;
}

async function scheduleEditionHours(dateKey: string, hours: number[], report: EditionReport) {
  const topics = await getBlogRepository().listTopics();
  const errors: string[] = [];
  for (const hour of hours) {
    const slots = slotTopics(topics, dateKey, hour);
    const finished = slots.some((topic) => {
      if (topic.status === "published" || topic.status === "drafted") return true;
      return topic.status === "generating" && !isStuck(topic);
    });
    if (finished) continue;
    const topic = slots.find((item) => item.status === "queued" || item.status === "failed");
    if (!topic) continue;
    try {
      await generateTopicIntoPost(topic.id, "schedule", seoulSlotIso(dateKey, hour));
      report.scheduled += 1;
      return undefined;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Failed to schedule a briefing.");
      return errors.join(" ");
    }
  }
  return undefined;
}

async function markLiveTopics() {
  const repository = getBlogRepository();
  const [posts, topics] = await Promise.all([repository.listPosts(), repository.listTopics()]);
  const live = new Set(posts.filter((post) => post.status === "published").map((post) => post.id));
  const now = new Date().toISOString();
  for (const topic of topics) {
    if (!topic.postId || topic.status !== "drafted" || !live.has(topic.postId)) continue;
    await repository.saveTopic({ ...topic, status: "published", updatedAt: now });
  }
}
