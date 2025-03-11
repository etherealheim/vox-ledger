import { authMiddleware } from "@clerk/nextjs/server";

/**
 * Clerk authentication middleware configuration
 * 
 * This middleware protects routes based on authentication status.
 * It allows public access to specified routes while requiring authentication for others.
 */
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",                    // Home page
    "/api/webhook",         // Webhooks
    "/api/search",          // Search API
    "/api/track-search",    // Search tracking API
    "/api/attendance/(.*)", // Attendance data API
    "/sign-in",             // Sign in page
    "/sign-up",             // Sign up page
    "/manifesto",           // Manifesto page
    "/api/(.*)public(.*)",  // Any API route with 'public' in the path
  ],
  
  // Routes to ignore (not checked by Clerk)
  ignoredRoutes: [
    "/api/webhook",         // Webhooks
    "/_next/static/(.*)",   // Next.js static files
    "/favicon.ico",         // Favicon
    "/api/health",          // Health check endpoint
  ],
  
  // Disable debug mode to prevent terminal spam
  debug: false,
});

/**
 * Matcher configuration for the middleware
 * 
 * This defines which routes the middleware should run on.
 * It includes all routes except static files, Next.js internals, and specific API routes.
 */
export const config = {
  matcher: [
    // Match all routes except static files, api routes, and Next.js internals
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};