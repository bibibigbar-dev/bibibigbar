import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { blogOrigin, mainOrigin, shopOrigin } from "@/lib/blog/config";

function hostsFor(origin: () => string, defaults: string[]) {
  const hosts = new Set(defaults);
  try {
    hosts.add(new URL(origin()).hostname.toLowerCase());
  } catch {
    return hosts;
  }
  return hosts;
}

function blogHosts() {
  return hostsFor(blogOrigin, ["blog.bibibigbar.com", "blog.localhost"]);
}

function shopHosts() {
  return hostsFor(shopOrigin, ["shop.bibibigbar.com", "shop.localhost"]);
}

function isBlogHost(hostname: string) {
  return blogHosts().has(hostname.toLowerCase());
}

function isShopHost(hostname: string) {
  return shopHosts().has(hostname.toLowerCase());
}

function apexOrigin(request: NextRequest, hostname: string) {
  if (hostname.endsWith(".localhost")) {
    const port = request.nextUrl.port;
    return `http://localhost${port ? `:${port}` : ""}`;
  }
  return mainOrigin();
}

function isStudioPath(pathname: string) {
  return ["/admin", "/login", "/register", "/my", "/boards"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname, search } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-bibibig-path", pathname);

  if (isShopHost(hostname)) {
    requestHeaders.set("x-bibibig-site", "shop");
    requestHeaders.set("x-bibibig-shop-mount", "subdomain");

    if (isStudioPath(pathname)) {
      return NextResponse.redirect(`${apexOrigin(request, hostname)}${pathname}${search}`);
    }

    if (pathname === "/blog" || pathname.startsWith("/blog/")) {
      const blogPathname = pathname.replace(/^\/blog/, "") || "/";
      return NextResponse.redirect(`${blogOrigin()}${blogPathname === "/" ? "" : blogPathname}${search}`);
    }

    if (pathname === "/shop" || pathname.startsWith("/shop/")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/shop/, "") || "/";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const url = request.nextUrl.clone();
    url.pathname = "/shop";
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  if (!isBlogHost(hostname)) {
    const isBlogPath = pathname === "/blog" || pathname.startsWith("/blog/");
    const isShopPath = pathname === "/shop" || pathname.startsWith("/shop/");
    if (process.env.NODE_ENV === "production" && isShopPath) {
      const shopPathname = pathname.replace(/^\/shop/, "") || "/";
      return NextResponse.redirect(`${shopOrigin()}${shopPathname === "/" ? "" : shopPathname}${search}`);
    }
    requestHeaders.set("x-bibibig-site", isBlogPath ? "blog" : "main");
    requestHeaders.set("x-bibibig-blog-mount", "path");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  requestHeaders.set("x-bibibig-site", "blog");
  requestHeaders.set("x-bibibig-blog-mount", "subdomain");

  if (isStudioPath(pathname)) {
    return NextResponse.redirect(`${apexOrigin(request, hostname)}${pathname}${search}`);
  }

  if (pathname === "/shop" || pathname.startsWith("/shop/")) {
    const shopPathname = pathname.replace(/^\/shop/, "") || "/";
    return NextResponse.redirect(`${shopOrigin()}${shopPathname === "/" ? "" : shopPathname}${search}`);
  }

  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/blog/, "") || "/";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/blog" : `/blog${pathname}`;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
