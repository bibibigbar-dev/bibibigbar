import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import {
  createTopicAction,
  deleteTopicAction,
  generateTopicAction,
  requeueTopicAction,
  runQueueAction,
} from "@/lib/actions/blog";
import { isAutoPublishEnabled } from "@/lib/blog/config";
import { readEdition } from "@/lib/blog/schedule";
import { requireAdminPage } from "@/lib/blog/guard";
import { getBlogRepository } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Topic queue" };

interface TopicQueuePageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function TopicQueuePage({ searchParams }: TopicQueuePageProps) {
  await requireAdminPage("/admin/blog/topics");
  const { error } = await searchParams;
  const topics = await getBlogRepository().listTopics();

  return (
    <div className="container py-12">
      <AdminNav current="blog" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl font-bold text-[var(--sky-deep)]">Topic queue</h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            At 5:00 KST the job writes five English briefings. At 6:00, 9:00, 12:00, 15:00, and 18:00 KST it publishes the briefing that is due. The button below writes the next manual topic as a
            {isAutoPublishEnabled() ? " published post." : " draft."}
          </p>
        </div>
        <form action={runQueueAction}>
          <button type="submit" className="btn btn-primary">
            Write the next topic
          </button>
        </form>
      </div>

      {error ? <p className="blog-error mt-6">{error}</p> : null}

      <form action={createTopicAction} className="surface mt-8 grid gap-4 rounded-[1.5rem] p-5 md:grid-cols-2">
        <label className="field md:col-span-2">
          <span>Topic</span>
          <input name="title" required placeholder="US ESTA fee increase" />
        </label>
        <label className="field">
          <span>Destination</span>
          <input name="destination" placeholder="United States" />
        </label>
        <label className="field">
          <span>Angle</span>
          <input name="angle" placeholder="Whether Korean travelers can still enter, and what changed" />
        </label>
        <label className="field md:col-span-2">
          <span>Keywords</span>
          <input name="keywords" placeholder="ESTA, visa, entry fee" />
        </label>
        <label className="field md:col-span-2">
          <span>Notes for the writer</span>
          <textarea name="notes" rows={4} placeholder="Only confirmed fees and dates. Link the official page." />
        </label>
        <button type="submit" className="btn btn-secondary md:col-span-2">
          Add to queue
        </button>
      </form>

      <div className="mt-8 grid gap-4">
        {topics.length ? (
          topics.map((topic) => {
            const edition = readEdition(topic.notes);
            return (
            <article key={topic.id} className="surface rounded-[1.5rem] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--sunset)]">{topic.status}</p>
                  <h2 className="display mt-1 text-2xl font-bold text-[var(--sky-deep)]">{topic.title}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {[edition ? `${String(edition.hour).padStart(2, "0")}:00 KST` : "", topic.destination, topic.angle].filter(Boolean).join(" · ") || "No extra direction yet."}
                  </p>
                  {topic.error ? <p className="mt-2 text-sm text-[#b42318]">{topic.error}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {topic.postId ? (
                    <Link href={`/admin/blog/${topic.postId}`} className="btn btn-secondary !min-h-10 text-sm">
                      Open post
                    </Link>
                  ) : null}
                  {topic.status === "queued" || topic.status === "failed" ? (
                    <>
                      <form action={generateTopicAction}>
                        <input type="hidden" name="topicId" value={topic.id} />
                        <button type="submit" name="mode" value="draft" className="btn btn-secondary !min-h-10 text-sm">
                          Generate draft
                        </button>
                      </form>
                      <form action={generateTopicAction}>
                        <input type="hidden" name="topicId" value={topic.id} />
                        <button type="submit" name="mode" value="publish" className="btn btn-primary !min-h-10 text-sm">
                          Generate and publish
                        </button>
                      </form>
                    </>
                  ) : null}
                  {topic.status === "generating" || topic.status === "failed" ? (
                    <form action={requeueTopicAction}>
                      <input type="hidden" name="topicId" value={topic.id} />
                      <button type="submit" className="btn btn-secondary !min-h-10 text-sm">
                        Requeue
                      </button>
                    </form>
                  ) : null}
                  <form action={deleteTopicAction}>
                    <input type="hidden" name="topicId" value={topic.id} />
                    <button type="submit" className="btn btn-secondary !min-h-10 text-sm">
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            </article>
            );
          })
        ) : (
          <p className="text-[var(--muted)]">Queue a place you want to write about.</p>
        )}
      </div>
    </div>
  );
}
