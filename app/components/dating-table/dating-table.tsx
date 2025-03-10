'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
} from '@tanstack/react-table';
import { FaPlus, FaHeart } from 'react-icons/fa';
import { Tables } from '../../utils/supabase';
import { useTableColumns } from './table-columns';
import { fetchUserEntries, saveEntry, deleteEntry, createNewEntry } from './data-service';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

export default function DatingTable() {
  const [data, setData] = useState<(DatingEntry | NewDatingEntry)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [columnSizing, setColumnSizing] = useState({});
  const tableContainerRef = useRef<HTMLDivElement>(null);

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
    } catch (error: any) {
      console.error('Error deleting row:', error);
      setError(error.message);
    }
  };

  // Get columns with handlers
  const columns = useTableColumns(handleCellUpdate, handleDeleteRow);

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    state: {
      columnSizing,
    },
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    defaultColumn: {
      minSize: 60,
      maxSize: 500,
      size: 150,
    },
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-4xl bg-gray-100 rounded"></div>
        </div>
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

  // Render table
  return (
    <div className="mb-8 font-inter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-lavender-500 to-brand-pink-500 bg-clip-text text-transparent">Your Dating Log</h2>
          <p className="text-gray-500 mt-1">Log your dating experiences in the table below. Your data will automatically sync to your account.</p>
        </div>
        <button
          onClick={handleAddRow}
          className="flex items-center space-x-2 bg-gradient-to-r from-brand-lavender-500 to-brand-pink-500 text-white font-medium py-2 px-4 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          <FaPlus className="text-sm" />
          <span>Add Person</span>
        </button>
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
        <div className="bg-white/80 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
          <div ref={tableContainerRef} className="overflow-hidden">
            <div className="overflow-x-auto custom-table-container" style={{ scrollbarWidth: 'thin' }}>
              <table 
                className="min-w-full divide-y divide-gray-200 border-collapse"
                style={{ width: table.getTotalSize() }}
              >
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="bg-gradient-to-r from-brand-lavender-100 to-brand-pink-100">
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="relative px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sticky top-0 whitespace-nowrap border-b border-gray-200 select-none"
                          style={{
                            width: header.getSize(),
                          }}
                        >
                          <div className="flex items-center justify-between">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </div>
                          {header.column.getCanResize() && (
                            <div
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              onClick={e => {
                                e.stopPropagation();
                              }}
                              className="resizer"
                              data-is-resizing={header.column.getIsResizing() ? 'true' : 'false'}
                            />
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map(row => (
                      <tr 
                        key={row.id} 
                        className="hover:bg-brand-lavender-50 transition-colors"
                      >
                        {row.getVisibleCells().map(cell => (
                          <td 
                            key={cell.id} 
                            className="px-6 py-3 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 relative"
                            style={{
                              width: cell.column.getSize(),
                            }}
                          >
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
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="bg-brand-lavender-100 p-3 rounded-full">
                            <FaHeart className="h-6 w-6 text-brand-lavender-500" />
                          </div>
                          <p>No dating entries found. Add your first one by clicking the "Add Person" button!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
          <p>Scroll horizontally to see all columns. Click on any field to edit.</p>
          <p>Drag the edge of column headers to resize.</p>
        </div>
      </div>
      
      <div className="mt-6 bg-brand-mint-50 border border-brand-mint-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-brand-mint-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Tips for using the data table:
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-brand-mint-700">
          <li>Click "Add Person" to add a new row to the table</li>
          <li>Changes save automatically as you edit each field</li>
          <li>Use the Rating stars to rate your experiences from 1-5</li>
          <li>Add notes to remember special moments or details</li>
          <li>Visit the Stats page to see insights based on your data</li>
        </ul>
      </div>
      
      <style jsx global>{`
        .resizer {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 8px;
          background: rgba(0, 0, 0, 0);
          cursor: col-resize;
          user-select: none;
          touch-action: none;
          z-index: 10;
        }
        
        .resizer:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .resizer[data-is-resizing="true"] {
          background: rgba(0, 0, 0, 0.1);
        }
        
        /* Custom table styles for dropdowns */
        .custom-table-container {
          position: relative;
        }
        
        .custom-table-container td {
          overflow: visible !important;
        }
        
        /* Ensure dropdowns appear above other elements */
        .custom-table-container [role="listbox"] {
          z-index: 50;
        }
      `}</style>
    </div>
  );
} 