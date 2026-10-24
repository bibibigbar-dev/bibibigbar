import { adsensePublisherId } from "@/lib/blog/config";

export const dynamic = "force-dynamic";

export function GET() {
  const publisherId = adsensePublisherId();
  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# AdSense publisher id is not configured yet.\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
