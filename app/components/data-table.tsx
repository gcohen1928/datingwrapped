'use client';

import { useState, useEffect } from 'react';
import DatingTable from './dating-table/dating-table';
import { supabase } from '../utils/supabase';
import { FaSearch } from 'react-icons/fa';

export default function DataTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Just check if we can access the data
        const { error } = await supabase
          .from('dating_entries')
          .select('id', { count: 'exact', head: true });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-brand-pink-100/80 via-brand-lavender-100/70 to-brand-mint-100/80 rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-brand-lavender-500 mb-2">Dating Tracker</h1>
        <p className="text-brand-lavender-300 mb-6">
          Log and track your dating experiences to discover patterns and insights.
        </p>
        
        {/* Search Row */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-brand-lavender-300" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="block w-full pl-10 pr-3 py-2 border border-brand-lavender-200 rounded-md leading-5 bg-white placeholder-brand-lavender-300 focus:outline-none focus:ring-2 focus:ring-brand-lavender-300 focus:border-brand-lavender-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Guidance Text */}
      <div className="bg-brand-lavender-100 border-l-4 border-brand-lavender-500 p-4 mb-8 rounded-r-md">
        <h2 className="text-lg font-medium text-brand-lavender-600 mb-1">Getting Started</h2>
        <p className="text-brand-lavender-500">
          Use the table below to track your dating experiences. Click "Add Person" to create a new entry.
          Fill in details about your dates including platform, cost, rating, and outcome.
          All your data is private and only visible to you.
        </p>
      </div>
      
      {/* Table Component with Search Filter */}
      <DatingTable searchFilter={searchTerm} />
    </div>
  );
}