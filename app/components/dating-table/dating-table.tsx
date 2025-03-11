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
        <h2 className="text-xl font-semibold">Your Dating Entries</h2>
        <button
          onClick={handleAddRow}
          className="flex items-center space-x-2 bg-brand-lavender-500 text-white font-medium py-2 px-4 rounded-md hover:bg-brand-lavender-600 transition-colors"
        >
          <FaPlus className="text-sm" />
          <span>Add Person</span>
        </button>
      </div>
      
      {table.getRowModel().rows.length === 0 ? (
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
        <div ref={tableContainerRef} className="border border-gray-200 rounded-lg overflow-auto shadow-sm">
          <table 
            className="min-w-full divide-y divide-gray-200 border-collapse"
            style={{ width: table.getTotalSize() }}
          >
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="relative px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 select-none"
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
              {table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 transition-all duration-300 ease-in-out"
                >
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id} 
                      className="px-6 py-3 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 relative transition-all duration-300 ease-in-out"
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
              ))}
            </tbody>
          </table>
        </div>
      )}
      
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
        
        .resizer[data-is-resizing="true"] {
          background: rgba(0, 0, 0, 0.1);
        }
        
        /* Animation for row height transitions */
        tr {
          will-change: height;
        }
        
        td {
          will-change: padding;
        }
      `}</style>
    </div>
  );
} 