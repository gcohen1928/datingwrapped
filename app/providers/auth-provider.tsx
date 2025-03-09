'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      // Only log in development environment
      if (process.env.NODE_ENV === 'development') {
        console.log('Session refreshed:', {
          hasSession: !!data.session,
          userId: data.session?.user?.id?.substring(0, 8) + '...'
        });
      }
      
      return data.session;
    } catch (error) {
      console.error('Error refreshing session:', error);
      setSession(null);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setIsLoading(true);
      await refreshSession();
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Only log in development environment
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state changed:', event);
        }
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);

        // Only log in development environment
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth event:', {
            event,
            hasSession: !!newSession,
            userId: newSession?.user?.id?.substring(0, 8) + '...'
          });
        }

        // Handle redirects based on auth state
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // If on an auth page, redirect to dashboard
          if (pathname?.startsWith('/auth') && pathname !== '/auth/callback') {
            router.push('/dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          // If signed out, redirect to login
          router.push('/auth/login');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsLoading(false);
    router.push('/auth/login');
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 