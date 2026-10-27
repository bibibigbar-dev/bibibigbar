"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SiteMenuProps {
  blogHref: string;
  shopHref: string;
  workHref: string;
  aboutHref: string;
  adminHref: string;
  onShopHost: boolean;
}

function mark(active: boolean) {
  return active ? "page" : undefined;
}

export function SiteMenu({ blogHref, shopHref, workHref, aboutHref, adminHref, onShopHost }: SiteMenuProps) {
  const path = usePathname() || "/";
  const shopActive = onShopHost
    ? path === "/" || path === "/shop" || path.startsWith("/shop/")
    : path === "/shop" || path.startsWith("/shop/");

  return (
    <nav aria-label="Main" className="site-nav">
      <a href={blogHref}>Blog</a>
      {shopHref.startsWith("http") ? (
        <a href={shopHref} aria-current={mark(shopActive)}>
          Shop
        </a>
      ) : (
        <Link href={shopHref} aria-current={mark(shopActive)}>
          Shop
        </Link>
      )}
      <Link href={workHref} aria-current={mark(path === "/work" || path.startsWith("/work/"))}>
        Work
      </Link>
      <Link href={aboutHref} aria-current={mark(path === "/about" || path.startsWith("/about/"))}>
        About
      </Link>
      <Link href={adminHref} aria-current={mark(path === "/admin" || path.startsWith("/admin/"))}>
        Admin
      </Link>
    </nav>
  );
}
