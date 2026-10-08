import { clerkMiddleware } from "@clerk/nextjs/server";

const authenticate = clerkMiddleware();

export default async function middleware(
  request: import("next/server").NextRequest,
  event: import("next/server").NextFetchEvent,
) {
  const response = await authenticate(request, event);
  // Clerk 6 encodes continuation as a same-URL rewrite. Newer Next 15
  // releases can proxy that rewrite back to this server indefinitely.
  // Preserve Clerk's verified request headers and resume routing directly.
  const rewrite = response?.headers.get("x-middleware-rewrite");
  if (response && rewrite === request.url) {
    response.headers.delete("x-middleware-rewrite");
    response.headers.set("x-middleware-next", "1");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|webmanifest)).*)", "/(api|trpc)(.*)"],
};
