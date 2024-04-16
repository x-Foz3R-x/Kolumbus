import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { checkRole } from "./lib/clerk";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const isProtectedRoute = createRouteMatcher(["/t(.*)", "/library(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Restrict admin routes to admin users
  if (isAdminRoute(req) && !checkRole("admin")) return auth().redirectToSignIn();

  // Restrict protected routes to signed in users
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
};
