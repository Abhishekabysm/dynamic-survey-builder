'use client';

import { useEffect } from 'react';
import { useAppSelector } from '../lib/store';
import { usePathname, useRouter } from 'next/navigation';

// Define the routes that are part of the authentication flow
const AUTH_ROUTES = ['/login', '/register'];
// Public routes are for everyone.
const PUBLIC_ROUTES = ['/'];

/**
 * This component is a client-side guard that handles all authentication-related
 * redirection logic. It is the single source of truth for navigation based on
 * the user's authentication state. It does not render any UI.
 */
export const AuthHandler = () => {
  const { user, needsEmailVerification, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while the initial user state is loading.
    if (isLoading) {
      return;
    }

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/survey');
    const isProtectedRoute = !isPublicRoute && !isAuthRoute && pathname !== '/verify-email';

    // If not logged in and trying to access a protected route, redirect to login.
    if (!user && isProtectedRoute) {
      router.push('/login');
      return;
    }

    if (user) {
      // If logged in, but email not verified...
      if (!user.emailVerified) {
        // ...and they are not on the verify-email page, redirect them there.
        if (pathname !== '/verify-email') {
          router.push('/verify-email');
        }
      }
      // If logged in AND email is verified...
      else {
        // ...and they are on a page for unauthenticated users (login/register) or the verify-email page,
        // redirect them to the dashboard.
        if (AUTH_ROUTES.includes(pathname) || pathname === '/verify-email') {
          router.push('/dashboard');
        }
      }
    }
  }, [user, pathname, router]);

  return null; // This component renders nothing.
}; 