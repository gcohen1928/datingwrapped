'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Completing authentication...');

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback initiated');
        setMessage('Processing authentication...');
        
        // Get the auth code from the URL
        const hash = window.location.hash;
        const query = window.location.search;
        
        console.log('URL hash:', hash);
        console.log('URL query:', query);

        // Exchange the auth code for a session
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Session data:', data);
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        if (!data.session) {
          console.error('No session found');
          throw new Error('No session found');
        }
        
        // Store the session in localStorage for debugging
        localStorage.setItem('authDebug', JSON.stringify({
          timestamp: new Date().toISOString(),
          sessionExists: !!data.session,
          userId: data.session?.user?.id
        }));
        
        // Redirect to dashboard on successful authentication
        console.log('Authentication successful, redirecting to dashboard');
        setMessage('Authentication successful! Redirecting...');
        
        // Short delay to ensure session is properly set
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        setError(error.message || 'Authentication failed');
        setMessage('Authentication failed. Redirecting to login...');
        
        // Short delay before redirecting
        setTimeout(() => {
          router.push('/auth/login?error=Authentication%20failed');
        }, 1000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-pink-100 via-white to-brand-mint-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <div className="w-16 h-16 border-t-4 border-brand-lavender-500 border-solid rounded-full animate-spin mx-auto"></div>
        )}
        <p className="mt-4 text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  );
} 