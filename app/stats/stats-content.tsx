'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../providers/auth-provider';
import { Tables } from '../utils/supabase';
import { fetchDatingStats } from './stats-service';
import { PieChart } from './components/pie-chart';
import { BarChart } from './components/bar-chart';
import { LineChart } from './components/line-chart';
import { SummaryCard } from './components/summary-card';
import { StatGrid } from './components/stat-grid';
import { ScoreDashboard } from './components/score-dashboard';
import { MatchesTimeline } from './components/matches-timeline';
import { FlagCloud } from './components/flag-cloud';
import StatsError from './error';

type DatingEntry = Tables['dating_entries']['Row'];

export default function StatsContent() {
  const { user, isLoading: authLoading } = useAuth();
  const [entries, setEntries] = useState<DatingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (authLoading) return;
      
      if (!user) {
        setError(new Error('Not authenticated'));
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await fetchDatingStats(user);
        setEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load stats'));
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return <div className="text-gray-500 py-8 text-center">Loading statistics...</div>;
  }
  
  if (error) {
    return <StatsError error={error} reset={() => window.location.reload()} />;
  }
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
        <h3 className="text-xl font-medium mb-2">No Dating Data Yet</h3>
        <p className="text-gray-500 mb-4">
          Add some entries to see your personalized dating statistics.
        </p>
        <a 
          href="/your-dates" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-lavender-500 hover:bg-brand-lavender-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lavender-500"
        >
          Add Your Dates
        </a>
      </div>
    );
  }

  // Calculate statistics
  const totalDates = entries.reduce((sum, entry) => sum + entry.num_dates, 0);
  const totalPeople = entries.length;
  const totalSpent = entries.reduce((sum, entry) => sum + entry.total_cost, 0);
  const avgRating = entries.reduce((sum, entry) => sum + entry.rating, 0) / entries.length;
  const avgCostPerDate = totalDates > 0 ? totalSpent / totalDates : 0;
  
  // Platform distribution
  const platformCounts = entries.reduce((acc, entry) => {
    acc[entry.platform] = (acc[entry.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Outcome distribution
  const outcomeCounts = entries.reduce((acc, entry) => {
    acc[entry.outcome] = (acc[entry.outcome] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Rating distribution
  const ratingCounts = entries.reduce((acc, entry) => {
    acc[entry.rating] = (acc[entry.rating] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Collect all flags
  const redFlags = entries.flatMap(entry => entry.red_flags || []);
  const greenFlags = entries.flatMap(entry => entry.green_flags || []);
  
  // Count flag frequencies
  const redFlagCounts = redFlags.reduce((acc, flag) => {
    acc[flag] = (acc[flag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const greenFlagCounts = greenFlags.reduce((acc, flag) => {
    acc[flag] = (acc[flag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-10">
      {/* Summary stats */}
      <StatGrid 
        stats={[
          { label: 'Total Dates', value: totalDates },
          { label: 'People Met', value: totalPeople },
          { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}` },
          { label: 'Avg. Rating', value: avgRating.toFixed(1) },
          { label: 'Cost Per Date', value: `$${avgCostPerDate.toFixed(2)}` },
        ]}
      />

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryCard title="Dating Platforms" subtitle="Where you meet your matches">
          <PieChart 
            data={Object.entries(platformCounts).map(([name, value]) => ({ name, value }))} 
          />
        </SummaryCard>
        
        <SummaryCard title="Outcomes" subtitle="How your dates concluded">
          <PieChart 
            data={Object.entries(outcomeCounts).map(([name, value]) => ({ name, value }))} 
          />
        </SummaryCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryCard title="Rating Distribution" subtitle="Your date satisfaction scores">
          <BarChart 
            data={Array.from({ length: 5 }, (_, i) => ({ 
              name: (i + 1).toString(), 
              value: ratingCounts[i + 1] || 0 
            }))}
            xLabel="Rating"
            yLabel="Number of People"
          />
        </SummaryCard>
        
        <SummaryCard title="Date Cost Analysis" subtitle="Investment per connection">
          <BarChart 
            data={entries.slice(0, 8).map(entry => ({ 
              name: entry.person_name, 
              value: entry.total_cost / entry.num_dates 
            }))}
            xLabel="Person"
            yLabel="Avg. Cost per Date ($)"
          />
        </SummaryCard>
      </div>
      
      {/* Red & Green Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryCard title="Red Flags" subtitle="Warning signs you've encountered">
          <FlagCloud 
            flags={Object.entries(redFlagCounts).map(([text, count]) => ({ text, count }))}
            colorClass="text-red-500"
          />
        </SummaryCard>
        
        <SummaryCard title="Green Flags" subtitle="Positive traits you've found">
          <FlagCloud 
            flags={Object.entries(greenFlagCounts).map(([text, count]) => ({ text, count }))}
            colorClass="text-green-500"
          />
        </SummaryCard>
      </div>
      
      {/* Score Dashboard */}
      <SummaryCard title="Overall Dating Report Card" subtitle="Your dating metrics">
        <ScoreDashboard 
          scores={[
            { label: 'Avg. Rating', value: avgRating / 5, color: 'indigo' },
            { label: 'Success Rate', value: outcomeCounts['Relationship'] ? outcomeCounts['Relationship'] / totalPeople : 0, color: 'green' },
            { label: 'Dating Frequency', value: Math.min(totalDates / (totalPeople * 3), 1), color: 'blue' },
          ]}
        />
      </SummaryCard>
      
      {/* Matches Timeline */}
      <SummaryCard title="Dating Timeline" subtitle="Your dating journey over time">
        <MatchesTimeline entries={entries} />
      </SummaryCard>
    </div>
  );
} 