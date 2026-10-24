"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { blogAuthorName } from "@/lib/blog/config";
import { excerptFrom, plainText, readingMinutes, sanitizePostHtml } from "@/lib/blog/html";
import { storeBlogImage } from "@/lib/blog/images";
import { getBlogRepository } from "@/lib/blog";
import { generateTopicIntoPost, revalidateBlog, runPublishQueue } from "@/lib/blog/publish";
import { readHttpUrl, readTags } from "@/lib/blog/slug";
import type { BlogPost, BlogPostStatus } from "@/lib/blog/types";

function topicError(message: string): never {
  redirect(`/admin/blog/topics?error=${encodeURIComponent(message)}`);
}

function asStatus(value: string): BlogPostStatus {
  if (value === "published" || value === "scheduled" || value === "draft") return value;
  return "draft";
}

export async function saveBlogPostAction(formData: FormData): Promise<{ error?: string } | void> {
  const user = await requireAdmin();
  const repository = getBlogRepository();
  const id = String(formData.get("id") || "");
  const existing = id ? await repository.getPostById(id) : null;
  const title = String(formData.get("title") || "").trim().slice(0, 180);
  if (!title) return { error: "Add a title before saving." };

  const slugInput = String(formData.get("slug") || "").trim();
  if (slugInput && !slugify(slugInput)) {
    return { error: "Use an English slug with letters, numbers, and hyphens." };
  }

  const posts = await repository.listPosts();
  const taken = new Set(posts.filter((post) => post.id !== existing?.id).map((post) => post.slug));
  const slug = slugify(slugInput || title);
  if (!slug) return { error: "Add an English slug. The title itself can stay in any language." };
  if (taken.has(slug)) return { error: "That slug is already used." };

  const coverValue = String(formData.get("coverImageUrl") || "");
  const coverImageUrl = readHttpUrl(coverValue);
  if (coverImageUrl === null) return { error: "Cover image must be an http or https URL." };

  const content = sanitizePostHtml(String(formData.get("content") || "")).slice(0, 200000);
  const intent = String(formData.get("intent") || "save");
  let status = asStatus(String(formData.get("status") || "draft"));
  if (intent === "publish") status = "published";
  if (intent === "draft") status = "draft";

  const scheduledRaw = String(formData.get("scheduledAt") || "");
  const scheduledDate = scheduledRaw ? new Date(scheduledRaw) : null;
  if (status === "scheduled" && (!scheduledDate || Number.isNaN(scheduledDate.getTime()))) {
    return { error: "Choose a time to schedule this post." };
  }
  if (status === "published" && plainText(content).length < 20) {
    return { error: "Write a little more before publishing." };
  }

  const now = new Date().toISOString();
  const excerpt = String(formData.get("excerpt") || "").trim().slice(0, 300) || excerptFrom(content);
  const post: BlogPost = {
    id: existing?.id || `blog-${randomUUID()}`,
    slug,
    title,
    excerpt,
    content,
    coverImageUrl,
    destination: String(formData.get("destination") || "").trim().slice(0, 80),
    tags: readTags(String(formData.get("tags") || "")),
    status,
    publishedAt: status === "published" ? existing?.publishedAt || now : null,
    scheduledAt: status === "scheduled" && scheduledDate ? scheduledDate.toISOString() : null,
    seoTitle: (String(formData.get("seoTitle") || "").trim() || title).slice(0, 70),
    seoDescription: (String(formData.get("seoDescription") || "").trim() || excerpt).slice(0, 180),
    authorName: existing?.authorName || user.name || blogAuthorName(),
    readingMinutes: readingMinutes(content),
    source: existing?.source || "manual",
    aiPrompt: existing?.aiPrompt || "",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await repository.savePost(post);
  revalidateBlog(existing?.slug);
  revalidateBlog(post.slug);
  redirect(`/admin/blog/${post.id}?saved=1`);
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const repository = getBlogRepository();
  const existing = await repository.getPostById(id);
  if (existing) {
    await repository.deletePost(id);
    revalidateBlog(existing.slug);
  }
  redirect("/admin/blog");
}

export async function createTopicAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim().slice(0, 160);
  if (!title) topicError("Add a topic title.");

  const now = new Date().toISOString();
  await getBlogRepository().saveTopic({
    id: `topic-${randomUUID()}`,
    title,
    destination: String(formData.get("destination") || "").trim().slice(0, 80),
    angle: String(formData.get("angle") || "").trim().slice(0, 240),
    keywords: readTags(String(formData.get("keywords") || "")),
    notes: String(formData.get("notes") || "").trim().slice(0, 2000),
    status: "queued",
    postId: null,
    error: "",
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath("/admin/blog/topics");
  redirect("/admin/blog/topics");
}

export async function deleteTopicAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("topicId") || "");
  if (id) await getBlogRepository().deleteTopic(id);
  revalidatePath("/admin/blog/topics");
  redirect("/admin/blog/topics");
}

export async function requeueTopicAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("topicId") || "");
  const repository = getBlogRepository();
  const topic = (await repository.listTopics()).find((item) => item.id === id);
  if (!topic) redirect("/admin/blog/topics");
  await repository.saveTopic({
    ...topic,
    status: "queued",
    error: "",
    updatedAt: new Date().toISOString(),
  });
  revalidatePath("/admin/blog/topics");
  redirect("/admin/blog/topics");
}

export async function uploadBlogImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Choose an image." };
  try {
    return { url: await storeBlogImage(file) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not upload the image." };
  }
}

export async function generateTopicAction(formData: FormData) {
  await requireAdmin();
  const topicId = String(formData.get("topicId") || "");
  const mode = String(formData.get("mode") || "") === "publish" ? "publish" : "draft";
  let post;
  try {
    post = await generateTopicIntoPost(topicId, mode);
  } catch (error) {
    topicError(error instanceof Error ? error.message : "Failed to generate a post.");
  }
  redirect(`/admin/blog/${post.id}`);
}

export async function runQueueAction() {
  await requireAdmin();
  const report = await runPublishQueue(1);
  const failure = report.failed[0]?.error;
  if (failure) topicError(failure);
  const created = report.generated[0];
  if (created) redirect(`/admin/blog/${created.postId}`);
  redirect("/admin/blog/topics?error=No%20queued%20topics.");
}
