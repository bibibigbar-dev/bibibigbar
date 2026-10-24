import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { blogOrigin, mainOrigin } from "@/lib/blog/config";

function blogHosts() {
  const hosts = new Set(["blog.bibibigbar.com", "blog.localhost"]);
  try {
    hosts.add(new URL(blogOrigin()).hostname.toLowerCase());
  } catch {
    return hosts;
  }
  return hosts;
}

function isBlogHost(hostname: string) {
  return blogHosts().has(hostname.toLowerCase());
}

function apexOrigin(request: NextRequest, hostname: string) {
  if (hostname === "blog.localhost" || hostname.endsWith(".localhost")) {
    const port = request.nextUrl.port;
    return `http://localhost${port ? `:${port}` : ""}`;
  }
  return mainOrigin();
}

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname, search } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  if (!isBlogHost(hostname)) {
    const isBlogPath = pathname === "/blog" || pathname.startsWith("/blog/");
    requestHeaders.set("x-bibibig-site", isBlogPath ? "blog" : "main");
    requestHeaders.set("x-bibibig-blog-mount", "path");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  requestHeaders.set("x-bibibig-site", "blog");
  requestHeaders.set("x-bibibig-blog-mount", "subdomain");

  const studioPaths = ["/admin", "/login", "/register", "/my", "/boards"];
  if (studioPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.redirect(`${apexOrigin(request, hostname)}${pathname}${search}`);
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
