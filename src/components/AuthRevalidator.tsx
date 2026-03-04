'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserProfile } from '@/store/slices/authSlice';

// A lightweight wrapper that surrounds your app, actively listening
// to the route and testing backend tokens when a protected route is visited.
export function AuthRevalidator({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(false);

  // Define paths that require active token checks
  const protectedPaths = ['/dashboard', '/profile', '/sell-crypto', '/withdraw', '/trade-history'];

  useEffect(() => {
    // Determine if the current page requires token validation
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    // If we're not on a protected route, or we don't have enough auth info, do nothing
    if (!isProtected || !isAuthenticated || !user) return;

    let isMounted = true;

    const validateToken = async () => {
      try {
        setIsChecking(true);
        const userId = user.userid || user._id || user.id;

        if (!userId) {
          throw new Error('No user ID found to validate the session.');
        }

        // Hit the profile endpoint securely
        const response = await dispatch(fetchUserProfile(userId)).unwrap();

        // If fetch returns normally, token is valid
        if (!response) throw new Error('Empty response from profile endpoint');
      } catch (error: any) {
        if (!isMounted) return;

        console.error('Token validation failed (expired/invalid):', error);
        
        // Log out immediately to wipe Redux store, LocalStorage, and cookies
        logout();

        // Redirect safely back to the login page
        router.replace('/login');
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
    // Only rerun when the route actually changes or authentication status changes.
    // Intentionally omitting `logout`, `dispatch`, `router` — these are stable references
    // but their identity changes each render in Next.js, which would cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isAuthenticated, user?.userid]);

  // Optionally block rendering while aggressively checking
  // if (isChecking) return null; // Uncomment to show an aggressive block during check

  return <>{children}</>;
}
