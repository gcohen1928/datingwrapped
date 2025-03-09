'use client';

import { useState, useEffect } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { FaPlus, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import { supabase } from '../utils/supabase';
import { Tables } from '../utils/supabase';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

const platformOptions = [
  'Tinder',
  'Hinge',
  'Bumble',
  'OkCupid',
  'Coffee Meets Bagel',
  'Match',
  'IRL',
  'Through Friends',
  'Work',
  'School',
  'Other'
];

const outcomeOptions = [
  'Ghosted',
  'Relationship',
  'Ongoing',
  'Friends',
  'One-time',
  'Blocked',
  'Mutual End',
  'Other'
];

const columnHelper = createColumnHelper<DatingEntry | NewDatingEntry>();

export default function DataTable() {
  const [data, setData] = useState<(DatingEntry | NewDatingEntry)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        setUserId(user.id);
        
        // Fetch entries for this user
        const { data: entries, error } = await supabase
          .from('dating_entries')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setData(entries || []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const addNewRow = () => {
    if (!userId) return;
    
    // Add a new empty row at the beginning of the data
    const newRow: NewDatingEntry = {
      user_id: userId,
      person_name: `Date #${data.length + 1}`,
      platform: 'Tinder',
      num_dates: 1,
      total_cost: 0,
      avg_duration: 0,
      rating: 0,
      outcome: 'Ongoing',
      notes: '',
    };
    
    setData([newRow, ...data]);
  };

  const saveRow = async (index: number) => {
    if (!userId) return;
    
    const row = data[index];
    
    try {
      if ('id' in row) {
        // Update existing entry
        const { error } = await supabase
          .from('dating_entries')
          .update({
            person_name: row.person_name,
            platform: row.platform,
            num_dates: row.num_dates,
            total_cost: row.total_cost,
            avg_duration: row.avg_duration,
            rating: row.rating,
            outcome: row.outcome,
            notes: row.notes,
          })
          .eq('id', row.id);
          
        if (error) throw error;
      } else {
        // Insert new entry
        const { data: insertedData, error } = await supabase
          .from('dating_entries')
          .insert({
            user_id: userId,
            person_name: row.person_name,
            platform: row.platform,
            num_dates: row.num_dates,
            total_cost: row.total_cost,
            avg_duration: row.avg_duration,
            rating: row.rating,
            outcome: row.outcome,
            notes: row.notes,
          })
          .select();
          
        if (error) throw error;
        
        // Update local data with the inserted row including its ID
        if (insertedData && insertedData.length > 0) {
          setData(prev => 
            prev.map((item, i) => i === index ? insertedData[0] : item)
          );
        }
      }
    } catch (error: any) {
      console.error('Error saving row:', error);
      setError(error.message || 'Failed to save data');
    }
  };

  const deleteRow = async (index: number) => {
    const row = data[index];
    
    try {
      if ('id' in row) {
        // Delete from database
        const { error } = await supabase
          .from('dating_entries')
          .delete()
          .eq('id', row.id);
          
        if (error) throw error;
      }
      
      // Remove from local state
      setData(prev => prev.filter((_, i) => i !== index));
    } catch (error: any) {
      console.error('Error deleting row:', error);
      setError(error.message || 'Failed to delete data');
    }
  };

  const columns = [
    columnHelper.accessor('person_name', {
      header: 'Name',
      cell: ({ row, getValue, column: { id } }) => (
        <input
          type="text"
          value={getValue() || ''}
          onChange={e => {
            const newData = [...data];
            (newData[row.index] as any)[id] = e.target.value;
            setData(newData);
            saveRow(row.index);
          }}
          className="w-full input-field px-2 py-1 text-sm"
          placeholder="Person's name"
        />
      ),
    }),
    columnHelper.accessor('platform', {
      header: 'Platform',
      cell: ({ row, getValue, column: { id } }) => (
        <select
          value={getValue() || ''}
          onChange={e => {
            const newData = [...data];
            (newData[row.index] as any)[id] = e.target.value;
            setData(newData);
            saveRow(row.index);
          }}
          className="w-full input-field px-2 py-1 text-sm"
        >
          {platformOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ),
    }),
    columnHelper.accessor('num_dates', {
      header: '# of Dates',
      cell: ({ row, getValue, column: { id } }) => (
        <input
          type="number"
          value={getValue() || 0}
          onChange={e => {
            const newData = [...data];
            (newData[row.index] as any)[id] = parseInt(e.target.value, 10) || 0;
            setData(newData);
            saveRow(row.index);
          }}
          className="w-full input-field px-2 py-1 text-sm"
          min="0"
        />
      ),
    }),
    columnHelper.accessor('total_cost', {
      header: 'Total Cost ($)',
      cell: ({ row, getValue, column: { id } }) => (
        <input
          type="number"
          value={getValue() || 0}
          onChange={e => {
            const newData = [...data];
            (newData[row.index] as any)[id] = parseFloat(e.target.value) || 0;
            setData(newData);
            saveRow(row.index);
          }}
          className="w-full input-field px-2 py-1 text-sm"
          min="0"
          step="0.01"
        />
      ),
    }),
    columnHelper.accessor('avg_duration', {
      header: 'Avg Duration (hrs)',
      cell: ({ row, getValue, column: { id } }) => (
        <input
          type="number"
          value={getValue() || 0}
          onChange={e => {
            const newData = [...data];
            (newData[row.index] as any)[id] = parseFloat(e.target.value) || 0;
            setData(newData);
            saveRow(row.index);
          }}
          className="w-full input-field px-2 py-1 text-sm"
          min="0"
          step="0.5"
        />
      ),
    }),
    columnHelper.accessor('rating', {
      header: 'Rating',
      cell: ({ row, getValue, column: { id } }) => {
        const rating = getValue() || 0;
        return (
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  const newData = [...data];
                  (newData[row.index] as any)[id] = star;
                  setData(newData);
                  saveRow(row.index);
                }}
                className="text-lg focus:outline-none"
              >
                {star <= rating ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-gray-300" />
                )}
              </button>
            ))}
          </div>
        );
      },
    }),
    columnHelper.accessor('outcome', {
      header: 'Outcome',
      cell: ({ row, getValue, column: { id } }) => (
        <select
          value={getValue() || ''}
          onChange={e => {
            const newData = [...data];
            (newData[row.index] as any)[id] = e.target.value;
            setData(newData);
            saveRow(row.index);
          }}
          className="w-full input-field px-2 py-1 text-sm"
        >
          {outcomeOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ),
    }),
    columnHelper.accessor('notes', {
      header: 'Notes',
      cell: ({ row, getValue, column: { id } }) => (
        <textarea
          value={getValue() || ''}
          onChange={e => {
            const newData = [...data];
            (newData[row.index] as any)[id] = e.target.value;
            setData(newData);
            saveRow(row.index);
          }}
          className="w-full input-field px-2 py-1 text-sm resize-none"
          rows={2}
          placeholder="Add notes..."
        />
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={() => deleteRow(row.index)}
          className="text-red-500 hover:text-red-700 p-1"
          title="Delete entry"
        >
          <FaTrash />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <div className="text-center py-8">Loading your dating data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Dating Log</h2>
        <button
          onClick={addNewRow}
          className="flex items-center space-x-2 bg-brand-pink-500 hover:bg-brand-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
        >
          <FaPlus />
          <span>Add Person</span>
        </button>
      </div>
      
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No dating entries found. Add your first one by clicking the "Add Person" button!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 