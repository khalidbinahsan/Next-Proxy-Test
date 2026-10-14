import { NextResponse, type NextRequest } from "next/server";

const WP_ORIGIN = "https://student.realezy.com";

// Only cookies WordPress itself uses are forwarded
const WP_COOKIE = /^(wordpress_|wp-|wp_|comment_author|elementor)/;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/students/wp-admin") {
    return NextResponse.redirect(new URL("/students/wp-admin/" + search, request.url), 308);
  }

  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", request.nextUrl.host);
  headers.set("x-forwarded-proto", "https");

  // Never forward the Next.js app's login cookies or auth headers
  headers.delete("authorization");
  const cookie = request.headers.get("cookie");
  if (cookie) {
    const kept = cookie
      .split(";")
      .map((c) => c.trim())
      .filter((c) => WP_COOKIE.test(c.split("=")[0]));
    if (kept.length) headers.set("cookie", kept.join("; "));
    else headers.delete("cookie");
  }

  return NextResponse.rewrite(new URL(pathname + search, WP_ORIGIN), {
    request: { headers },
  });
}

export const config = {
  matcher: ["/students", "/students/:path*"],
};