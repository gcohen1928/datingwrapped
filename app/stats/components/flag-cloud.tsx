'use client';

import { useState, useEffect } from 'react';

interface FlagCloudProps {
  flags: Array<{
    text: string;
    count: number;
  }>;
  colorClass: string;
}

export function FlagCloud({ flags, colorClass }: FlagCloudProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sort flags by count (most frequent first)
  const sortedFlags = [...flags].sort((a, b) => b.count - a.count);

  if (!isClient) {
    return (
      <div className="flex flex-wrap gap-2 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="h-8 bg-gray-50 rounded-full w-20"
          ></div>
        ))}
      </div>
    );
  }

  if (flags.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="text-gray-500">No flags recorded yet</span>
      </div>
    );
  }

  // Format color class based on type
  let flagColorClass = colorClass === 'text-red-500' 
    ? 'text-brand-pink-500 border-brand-pink-200 bg-brand-pink-100/30' 
    : 'text-brand-mint-500 border-brand-mint-200 bg-brand-mint-100/30';

  return (
    <div className="flex flex-wrap gap-2">
      {sortedFlags.map((flag, index) => {
        // Calculate font size based on frequency (between 0.8rem and 1.5rem)
        const maxCount = Math.max(...flags.map(f => f.count));
        const minSize = 0.8;
        const maxSize = 1.5;
        const fontSize = minSize + ((flag.count / maxCount) * (maxSize - minSize));
        
        return (
          <div 
            key={index}
            className={`px-3 py-1 rounded-full border ${flagColorClass}`}
            style={{ fontSize: `${fontSize}rem` }}
          >
            <span>{flag.text}</span>
            {flag.count > 1 && (
              <span className="ml-1 opacity-70">({flag.count})</span>
            )}
          </div>
        );
      })}
    </div>
  );
} 