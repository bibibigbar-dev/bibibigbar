"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locale";
import { getSiteCopy } from "@/lib/site-copy";

interface SiteMenuProps {
  locale: Locale;
  blogHref: string;
  mapHref: string;
  workHref: string;
  aboutHref: string;
  adminHref: string;
}

function mark(active: boolean) {
  return active ? "page" : undefined;
}

export function SiteMenu({ locale, blogHref, mapHref, workHref, aboutHref, adminHref }: SiteMenuProps) {
  const path = usePathname() || "/";
  const nav = getSiteCopy(locale).nav;

  return (
    <nav aria-label={nav.mainAria} className="site-nav">
      <a href={blogHref}>{nav.blog}</a>
      <Link href={mapHref} aria-current={mark(path === "/travel-map" || path.startsWith("/travel-map/"))}>
        {nav.map}
      </Link>
      <Link href={workHref} aria-current={mark(path === "/work" || path.startsWith("/work/"))}>
        {nav.work}
      </Link>
      <Link href={aboutHref} aria-current={mark(path === "/about" || path.startsWith("/about/"))}>
        {nav.about}
      </Link>
      <Link href={adminHref} aria-current={mark(path === "/admin" || path.startsWith("/admin/"))}>
        {nav.admin}
      </Link>
    </nav>
  );
}
