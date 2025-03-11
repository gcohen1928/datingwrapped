'use client';

import { useState } from 'react';
import DatingCards from './dating-cards/dating-cards';
import DatingTable from './dating-table/dating-table';
import { FaTable, FaThLarge } from 'react-icons/fa';

export default function DataTable() {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-brand-lavender-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaThLarge className="mr-2" />
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-brand-lavender-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaTable className="mr-2" />
            Table
          </button>
        </div>
      </div>
      
      {viewMode === 'cards' ? <DatingCards /> : <DatingTable />}
    </div>
  );
} 