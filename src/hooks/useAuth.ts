'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore, type AuthUser } from '@/store/authStore';

/**
 * SSR-safe auth hook. Fetches session on mount, returns user state.
 * Follows the same pattern as useCart for hydration safety.
 */
export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading } =
    useAuthStore();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user as AuthUser | null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    fetchSession();
  }, [setUser, setLoading]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setUser(null);
    window.location.href = '/';
  };

  return { user, isLoading, isAuthenticated, logout };
}
