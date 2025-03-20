'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import LoadingSpinner from '../../components/loading-spinner';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback initiated');
        
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
        
        // Redirect to your-dates on successful authentication
        console.log('Authentication successful, redirecting to your dates');
        
        // Short delay to ensure session is properly set
        setTimeout(() => {
          router.push('/your-dates');
        }, 1000);
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        setError(error.message || 'Authentication failed');
        
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
        {error ? (
          <div className="text-red-500 mb-4 text-sm">{error}</div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            <LoadingSpinner size="lg" color="#9370DB" />
          </div>
        )}
      </div>
    </div>
  );
} 