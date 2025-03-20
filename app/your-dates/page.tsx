'use client';

import { useEffect, useState } from 'react';
import DataTable from '../components/data-table';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'next/navigation';
import { FaHeart, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import LoadingSpinner from '../components/loading-spinner';

export default function YourDates() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" color="#9370DB" />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" color="#9370DB" />
      </div>
    );
  }

  // If not authenticated after loading, show a message
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-4">You need to be logged in to view this page.</p>
        <button
          onClick={() => router.push('/auth/login')}
          className="px-4 py-2 bg-brand-lavender-500 text-white rounded-md mb-8"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <DataTable />
    </div>
  );
} 