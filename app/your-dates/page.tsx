'use client';

import { useEffect, useState } from 'react';
import DataTable from '../components/data-table';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'next/navigation';
import { FaHeart, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

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
        <div className="w-16 h-16 border-t-4 border-brand-lavender-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-brand-lavender-500 border-solid rounded-full animate-spin"></div>
        <p className="ml-4">Loading your data...</p>
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
      <div className="mb-8 bg-gradient-to-r from-brand-lavender-500/10 to-brand-pink-500/10 rounded-xl p-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-lavender-600 to-brand-pink-600">
            Your Dating Journey
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
            Track, analyze, and reflect on your dating experiences. Your personal dating log helps you understand patterns and grow from each relationship.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
              <div className="rounded-full bg-brand-lavender-100 p-2 mr-3">
                <FaHeart className="text-brand-lavender-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Track Matches</h3>
                <p className="text-sm text-gray-500">Log each person you date</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
              <div className="rounded-full bg-brand-pink-100 p-2 mr-3">
                <FaCalendarAlt className="text-brand-pink-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Date History</h3>
                <p className="text-sm text-gray-500">Record outcomes and experiences</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-2 mr-3">
                <FaChartLine className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Identify Patterns</h3>
                <p className="text-sm text-gray-500">See your dating trends over time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DataTable />
    </div>
  );
} 