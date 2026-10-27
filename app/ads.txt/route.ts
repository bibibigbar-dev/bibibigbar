import { headers } from "next/headers";
import { adsensePublisherId } from "@/lib/blog/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const headerStore = await headers();
  const publisherId = adsensePublisherId();
  const onJournal = headerStore.get("x-bibibig-blog-mount") === "subdomain";
  if (!onJournal || !publisherId) {
    return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
