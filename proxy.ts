import { NextResponse, type NextRequest } from "next/server";

const WP_ORIGIN = "https://student.realezy.com";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // wp-admin is a real folder; add the slash here so Apache doesn't redirect to the subdomain
  if (pathname === "/students/wp-admin") {
    return NextResponse.redirect(new URL("/students/wp-admin/" + search, request.url), 308);
  }

  // Tell WordPress which address the visitor actually used
  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", request.nextUrl.host);
  headers.set("x-forwarded-proto", "https");

  return NextResponse.rewrite(new URL(pathname + search, WP_ORIGIN), {
    request: { headers },
  });
}

export const config = {
  matcher: ["/students", "/students/:path*"],
};