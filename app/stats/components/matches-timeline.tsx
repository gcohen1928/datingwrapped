'use client';

import { useState, useEffect } from 'react';
import { Tables } from '../../utils/supabase';
import { format } from 'date-fns';

type DatingEntry = Tables['dating_entries']['Row'];

interface MatchesTimelineProps {
  entries: DatingEntry[];
}

export function MatchesTimeline({ entries }: MatchesTimelineProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col space-y-4 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="w-16 h-6 bg-gray-50 rounded"></div>
            <div className="flex-1 h-20 bg-gray-50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">No dating history yet</span>
      </div>
    );
  }

  // Sort entries by date (newest to oldest)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Group entries by month
  const entriesByMonth: Record<string, DatingEntry[]> = {};
  sortedEntries.forEach(entry => {
    const date = new Date(entry.created_at);
    const monthYear = format(date, 'MMMM yyyy');
    if (!entriesByMonth[monthYear]) {
      entriesByMonth[monthYear] = [];
    }
    entriesByMonth[monthYear].push(entry);
  });

  // Get outcome color
  const getOutcomeColor = (outcome: string): string => {
    switch (outcome.toLowerCase()) {
      case 'relationship':
        return 'bg-brand-mint-100 text-brand-mint-600';
      case 'ghosted':
        return 'bg-brand-pink-100 text-brand-pink-600';
      case 'rejected':
        return 'bg-orange-100 text-orange-600';
      case 'friend':
        return 'bg-blue-100 text-blue-600';
      case 'ongoing':
        return 'bg-brand-lavender-100 text-brand-lavender-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Get rating stars
  const getRatingStars = (rating: number): string => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="flex flex-col space-y-8">
      {Object.entries(entriesByMonth).map(([month, monthEntries]) => (
        <div key={month} className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">{month}</h4>
          <div className="border-l-2 border-brand-lavender-200 pl-4 space-y-6">
            {monthEntries.map((entry) => (
              <div key={entry.id} className="relative pb-4">
                {/* Timeline dot */}
                <div className="absolute -left-6 h-4 w-4 rounded-full bg-brand-lavender-500 border-2 border-white"></div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex flex-wrap items-start gap-2 mb-2">
                    <h5 className="text-md font-medium text-gray-900">
                      {entry.person_name}
                    </h5>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getOutcomeColor(entry.outcome)}`}>
                      {entry.outcome}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-lavender-100 text-brand-lavender-600">
                      {entry.platform}
                    </span>
                    {entry.age && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {entry.age} years
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                    <div>
                      <p className="text-xs text-gray-500">Dates</p>
                      <p className="font-medium">{entry.num_dates}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Spent</p>
                      <p className="font-medium">${entry.total_cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rating</p>
                      <p className="text-yellow-500 font-medium">{getRatingStars(entry.rating)}</p>
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <div className="mt-2 text-sm text-gray-600 italic">
                      "{entry.notes}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 