'use client';

import { useState, useEffect } from 'react';

interface ScoreDashboardProps {
  scores: Array<{
    label: string;
    value: number;  // Should be between 0 and 1
    color: string;
  }>;
}

export function ScoreDashboard({ scores }: ScoreDashboardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-50 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {scores.map((score, index) => {
        const percentage = Math.round(score.value * 100);
        let colorClass = '';
        
        switch (score.color) {
          case 'green':
            colorClass = 'text-brand-mint-500';
            break;
          case 'blue':
            colorClass = 'text-blue-500';
            break;
          case 'indigo':
            colorClass = 'text-brand-lavender-500';
            break;
          case 'red':
            colorClass = 'text-brand-pink-500';
            break;
          default:
            colorClass = 'text-gray-500';
        }
        
        return (
          <div key={index} className="flex flex-col items-center">
            <div className="relative flex items-center justify-center w-28 h-28">
              {/* Background circle */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  className="text-gray-100"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  className={colorClass}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute text-2xl font-bold">{percentage}%</div>
            </div>
            <div className="mt-2 text-center">
              <h4 className="font-medium">{score.label}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
} 