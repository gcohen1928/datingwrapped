'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Tables } from '../../utils/supabase';
import { fetchUserEntries, saveEntry, deleteEntry, createNewEntry } from '../dating-table/data-service';
import SimpleCard from './simple-card';
import LoadingSpinner from '../../components/loading-spinner';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

export default function DatingCards() {
  const [data, setData] = useState<(DatingEntry | NewDatingEntry)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { userId, entries } = await fetchUserEntries();
        setUserId(userId);
        setData(entries);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Handler for updating a cell
  const handleCellUpdate = async (index: number, id: string, value: any) => {
    if (!userId) return;
    
    try {
      // Update local state
      const newData = [...data];
      (newData[index] as any)[id] = value;
      setData(newData);
      
      // Save to database
      const row = newData[index];
      const savedEntry = await saveEntry(userId, row);
      
      // If this was a new entry, update with the returned data
      if (savedEntry && !('id' in row)) {
        setData(prev => 
          prev.map((item, i) => i === index ? savedEntry : item)
        );
      }
    } catch (error: any) {
      console.error('Error updating cell:', error);
      setError(error.message);
    }
  };

  // Handler for adding a new row
  const handleAddRow = () => {
    if (!userId) return;
    
    const newRow = createNewEntry(userId, data.length);
    setData([newRow, ...data]);
    setEditingIndex(0);
  };

  // Handler for deleting a row
  const handleDeleteRow = async (index: number) => {
    try {
      const row = data[index];
      
      // If it has an ID, delete from database
      if ('id' in row && row.id) {
        await deleteEntry(row.id);
      }
      
      // Remove from local state
      setData(prev => prev.filter((_, i) => i !== index));
      
      // Reset editing index if the deleted card was being edited
      if (editingIndex === index) {
        setEditingIndex(null);
      } else if (editingIndex !== null && editingIndex > index) {
        // Adjust editing index if a card before the edited one was deleted
        setEditingIndex(editingIndex - 1);
      }
    } catch (error: any) {
      console.error('Error deleting row:', error);
      setError(error.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" color="#9370DB" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-8 font-inter">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Dating Entries</h2>
        <button
          onClick={handleAddRow}
          className="flex items-center space-x-2 bg-brand-lavender-500 text-white font-medium py-2 px-4 rounded-md hover:bg-brand-lavender-600 transition-colors"
        >
          <FaPlus className="text-sm" />
          <span>Add Person</span>
        </button>
      </div>
      
      {data.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No dating entries yet. Add your first one!</p>
          <button
            onClick={handleAddRow}
            className="inline-flex items-center space-x-2 bg-brand-lavender-500 text-white font-medium py-2 px-4 rounded-md hover:bg-brand-lavender-600 transition-colors"
          >
            <FaPlus className="text-sm" />
            <span>Add Your First Date</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((entry, index) => (
            <SimpleCard
              key={index}
              entry={entry}
              index={index}
              onUpdate={handleCellUpdate}
              onDelete={() => handleDeleteRow(index)}
              isEditing={editingIndex === index}
              setIsEditing={(editing) => setEditingIndex(editing ? index : null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}