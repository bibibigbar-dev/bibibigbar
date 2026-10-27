export interface SetupCheck {
  label: string;
  ready: boolean;
  detail: string;
}

export function blogOrigin() {
  return (process.env.NEXT_PUBLIC_BLOG_URL || "https://blog.bibibigbar.com").replace(/\/$/, "");
}

export function shopOrigin() {
  return (process.env.NEXT_PUBLIC_SHOP_URL || "https://shop.bibibigbar.com").replace(/\/$/, "");
}

export function mainOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://bibibigbar.com").replace(/\/$/, "");
}

export function blogMenuHref() {
  if (process.env.NODE_ENV !== "production") return "/blog";
  return blogOrigin();
}

export function shopMenuHref() {
  if (process.env.NODE_ENV !== "production") return "/shop";
  return shopOrigin();
}

export function adminBlogHref() {
  if (process.env.NODE_ENV !== "production") return "/admin/blog";
  return `${mainOrigin()}/admin/blog`;
}

export function canonicalPostUrl(slug: string) {
  return `${blogOrigin()}/${slug}`;
}

export function readablePostUrl(status: string, slug: string) {
  if (status === "published") return canonicalPostUrl(slug);
  return `${mainOrigin()}/blog/${slug}?preview=1`;
}

export function supabaseProjectUrl() {
  return (process.env.SUPABASE_URL || "https://obpgjzrltdwvhyynafkx.supabase.co").replace(/\/$/, "");
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isAiConfigured() {
  return Boolean(process.env.AI_API_KEY);
}

export function isAutoPublishEnabled() {
  return process.env.BLOG_AUTO_PUBLISH === "true";
}

export function blogAuthorName() {
  return process.env.BLOG_AUTHOR_NAME || "bibibigbar";
}

export function adsenseClient() {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
}

export function adsensePublisherId() {
  const match = adsenseClient().match(/pub-\d+/);
  return match?.[0] || "";
}

export function adsenseSlot(name: "feed" | "article") {
  if (name === "feed") return process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED || "";
  return process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE || "";
}

export function shouldIndexBlog(mount: "subdomain" | "path") {
  return process.env.NODE_ENV === "production" && mount === "subdomain";
}

export function blogSetupChecks(): SetupCheck[] {
  const feedSlot = Boolean(process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED);
  const articleSlot = Boolean(process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE);
  const slotCount = Number(feedSlot) + Number(articleSlot);

  return [
    {
      label: "Storage",
      ready: true,
      detail: isSupabaseConfigured() ? "amatdda Supabase, blog_* tables" : "Local JSON until the amatdda service role is set",
    },
    {
      label: "AI writer",
      ready: isAiConfigured(),
      detail: isAiConfigured() ? process.env.AI_MODEL || "gpt-4o-mini" : "Set AI_API_KEY",
    },
    {
      label: "Daily edition",
      ready: Boolean(process.env.CRON_SECRET),
      detail: "5:00 KST writes five briefings. 6:00, 9:00, 12:00, 15:00, and 18:00 KST publish the one that is due.",
    },
    {
      label: "Cron secret",
      ready: Boolean(process.env.CRON_SECRET),
      detail: process.env.CRON_SECRET ? "Protected" : "Set CRON_SECRET before scheduling",
    },
    {
      label: "AdSense",
      ready: Boolean(adsenseClient()),
      detail: adsenseClient() ? `${slotCount} slot${slotCount === 1 ? "" : "s"} configured` : "Set NEXT_PUBLIC_ADSENSE_CLIENT",
    },
    {
      label: "Google Search",
      ready: Boolean(process.env.GOOGLE_SITE_VERIFICATION),
      detail: process.env.GOOGLE_SITE_VERIFICATION ? "Verification meta is on" : "Set GOOGLE_SITE_VERIFICATION",
    },
  ];
}
