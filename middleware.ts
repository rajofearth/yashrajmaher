import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin/:path*']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, redirectToSignIn } = await auth();
  const adminId = process.env.ADMIN_USER_ID;
  if (isAdminRoute(request) && userId !== adminId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: ['/admin/:path*'],
}; 