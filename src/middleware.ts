import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the public routes that shouldn't be blocked.
// Everything else runs through authentication.
const isPublicRoute = createRouteMatcher([
    "/",               // Landing page
    "/sign-in(.*)",    // Login pages
    "/sign-up(.*)",    // Sign-up pages
    "/privacy",        // Privacy policy
    "/terms",          // Terms of Service
    "/cookies",        // Cookie policy
    "/comingsoon",     // Coming soon (About/Blog/Contact)
    "/waitlist",       // Product waitlist capture
    "/test(.*)",       // Any testing routes during dev
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        // If not public, ensure user is authenticated.
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
