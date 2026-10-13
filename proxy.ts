import { NextResponse, type NextRequest } from "next/server";

const WP_ORIGIN = "https://student.realezy.com";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  return NextResponse.rewrite(new URL(pathname + search, WP_ORIGIN));
}

export const config = {
  matcher: ["/students", "/students/:path*"],
};