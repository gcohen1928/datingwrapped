'use client';

import { useEffect, useState } from 'react';
import DataTable from '../components/data-table';
import AuthDebug from '../components/auth-debug';
import { FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'next/navigation';

export default function YourDates() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [showDebug, setShowDebug] = useState(false); // Set to false by default

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

  // If not authenticated after loading, show a message and debug info
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
        
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Debug Information</h2>
          <AuthDebug />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Dating Log</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Log your dating experiences in the table below. Your data will automatically sync to your account.
        </p>
        
        <div className="bg-brand-lavender-50 border border-brand-lavender-200 rounded-lg p-4 flex items-start mb-8">
          <FaInfoCircle className="text-brand-lavender-500 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-brand-lavender-700 mb-1">Tips for using the data table:</h3>
            <ul className="text-sm text-brand-lavender-700 list-disc list-inside space-y-1">
              <li>Click "Add Person" to add a new row to the table</li>
              <li>Changes save automatically as you edit each field</li>
              <li>Use the Rating stars to rate your experiences from 1-5</li>
              <li>Add notes to remember special moments or details</li>
              <li>Visit the Stats page to see insights based on your data</li>
            </ul>
          </div>
        </div>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
          
          {showDebug && (
            <div className="mb-8">
              <AuthDebug />
            </div>
          )}
        </>
      )}
      
      <DataTable />
    </div>
  );
} 