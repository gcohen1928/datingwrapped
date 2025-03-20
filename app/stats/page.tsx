import { Suspense } from 'react';
import StatsContent from './stats-content';
import StatsLoading from './loading';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Your Dating Stats</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Discover insights about your dating life with these personalized statistics.
        </p>
        
        <Suspense fallback={<StatsLoading />}>
          <StatsContent />
        </Suspense>
      </div>
    </div>
  );
}