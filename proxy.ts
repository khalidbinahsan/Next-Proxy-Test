import { NextResponse, type NextRequest } from "next/server";

const WP_ORIGIN = "https://student.realezy.com";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

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