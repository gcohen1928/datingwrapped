'use client';

import { useEffect } from 'react';

interface StatsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StatsError({ error, reset }: StatsErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Stats page error:', error);
  }, [error]);

  return (
    <div className="rounded-lg bg-brand-pink-100 p-8 text-center border border-brand-pink-200">
      <h2 className="text-xl font-bold text-brand-pink-600 mb-2">
        Something went wrong!
      </h2>
      <p className="text-brand-pink-500 mb-6">
        {error.message || 'Failed to load your dating stats.'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-brand-pink-500 text-white rounded-md hover:bg-brand-pink-600 focus:outline-none focus:ring-2 focus:ring-brand-pink-400 focus:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
} 