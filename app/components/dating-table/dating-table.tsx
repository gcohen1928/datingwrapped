'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
  getFilteredRowModel,
  ColumnFiltersState,
  FilterFn,
  FilterFnOption,
} from '@tanstack/react-table';
import { FaPlus, FaHeart } from 'react-icons/fa';
import { Tables } from '../../utils/supabase';
import { useTableColumns } from './table-columns';
import { fetchUserEntries, saveEntry, deleteEntry, createNewEntry } from './data-service';
import ContextMenu from './context-menu';
import LoadingSpinner from '../../components/loading-spinner';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

// Extended types to include temporary animation properties
type ExtendedDatingEntry = DatingEntry & { tempId?: string };
type ExtendedNewDatingEntry = NewDatingEntry & { tempId?: string };

interface DatingTableProps {
  searchFilter?: string;
}

export default function DatingTable({ searchFilter = '' }: DatingTableProps) {
  const [data, setData] = useState<(ExtendedDatingEntry | ExtendedNewDatingEntry)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [columnSizing, setColumnSizing] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [animatingRows, setAnimatingRows] = useState<{id: string, action: 'add' | 'remove', index: number}[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; rowIndex: number } | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { userId, entries } = await fetchUserEntries();
        setUserId(userId);
        
        // Migrate existing hotness ratings from 1-5 scale to 1-10 scale
        const migratedEntries = entries.map(entry => {
          // Only convert if it's a number between 1-5
          if (entry.hotness !== null && entry.hotness !== undefined && entry.hotness >= 1 && entry.hotness <= 5) {
            // Convert from 5-star to 10-point scale (multiply by 2)
            return { 
              ...entry, 
              hotness: entry.hotness * 2
            };
          }
          return entry;
        });
        
        setData(migratedEntries);
        
        // Save migrated entries to the database
        const entriesToUpdate = migratedEntries.filter((entry, index) => 
          entry.hotness !== entries[index].hotness && 'id' in entry
        );
        
        // Update migrated entries in the database
        if (entriesToUpdate.length > 0 && userId) {
          await Promise.all(
            entriesToUpdate.map(entry => saveEntry(userId, entry))
          );
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Update column filters when searchFilter changes
  useEffect(() => {
    if (!searchFilter.trim()) {
      setColumnFilters([]);
      return;
    }

    setColumnFilters([
      {
        id: 'person_name',
        value: searchFilter
      }
    ]);
  }, [searchFilter]);

  // Global fuzzy filter function for the table
  const fuzzyFilter: FilterFn<ExtendedDatingEntry | ExtendedNewDatingEntry> = (row, columnId, filterValue) => {
    if (!filterValue.trim()) return true;
    
    const searchTermLower = filterValue.toLowerCase();
    const value = (row.getValue(columnId) || '').toString().toLowerCase();
    
    // Direct match (highest priority)
    if (value.includes(searchTermLower)) {
      return true;
    }
    
    // Fuzzy match - check if characters appear in sequence
    let searchIndex = 0;
    for (let i = 0; i < value.length; i++) {
      if (searchIndex < searchTermLower.length && value[i] === searchTermLower[searchIndex]) {
        searchIndex++;
      }
    }
    
    // If we matched all characters in the search term
    if (searchIndex === searchTermLower.length) {
      return true;
    }
    
    // Check for typos (allowing one character difference)
    if (searchTermLower.length > 2) {
      // Check if removing one char from search term finds a match
      for (let i = 0; i < searchTermLower.length; i++) {
        const typoSearch = searchTermLower.slice(0, i) + searchTermLower.slice(i + 1);
        if (value.includes(typoSearch)) {
          return true;
        }
      }
    }
    
    return false;
  };

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
          prev.map((item, i) => i === index ? { ...savedEntry, tempId: (item as ExtendedNewDatingEntry).tempId } : item)
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
    const newRowId = `new-${Date.now()}`;
    
    // Add animation marker
    setAnimatingRows(prev => [...prev, { id: newRowId, action: 'add', index: data.length }]);
    
    // Add the new row with tempId
    setData([...data, { ...newRow, tempId: newRowId }]);
    
    // Remove animation marker after animation completes
    setTimeout(() => {
      setAnimatingRows(prev => prev.filter(row => row.id !== newRowId));
    }, 500); // Match this with the CSS animation duration
  };

  // Handler for deleting a row
  const handleDeleteRow = async (index: number) => {
    try {
      const row = data[index];
      const rowId = 'id' in row && row.id ? row.id.toString() : (row.tempId || `temp-${index}-${Date.now()}`);
      
      // Add animation marker before removing
      setAnimatingRows(prev => [...prev, { id: rowId, action: 'remove', index }]);
      
      // Wait for animation to complete before removing from state
      setTimeout(async () => {
        // If it has an ID, delete from database
        if ('id' in row && row.id) {
          await deleteEntry(row.id);
        }
        
        // Remove from local state
        setData(prev => prev.filter((_, i) => i !== index));
        
        // Remove animation marker
        setAnimatingRows(prev => prev.filter(row => row.id !== rowId));
      }, 500); // Increased from 300ms to 500ms to match the animation duration
      
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
      columnFilters,
    },
    onColumnSizingChange: setColumnSizing,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableColumnResizing: true,
    defaultColumn: {
      minSize: 60,
      maxSize: 500,
      size: 150,
      filterFn: fuzzyFilter as FilterFnOption<ExtendedDatingEntry | ExtendedNewDatingEntry>,
    },
  });

  // Helper to get animation class for a row
  const getRowAnimationClass = (rowIndex: number) => {
    const animatingRow = animatingRows.find(row => row.index === rowIndex);
    if (!animatingRow) return '';
    
    if (animatingRow.action === 'add') {
      return 'animate-slide-in-from-bottom';
    } else if (animatingRow.action === 'remove') {
      return 'animate-slide-out';
    }
    return '';
  };

  // Helper to get row style based on animation state
  const getRowStyle = (rowIndex: number) => {
    const animatingRow = animatingRows.find(row => row.index === rowIndex && row.action === 'remove');
    if (animatingRow) {
      return { 
        height: '0',
        overflow: 'hidden'
      };
    }
    return {};
  };

  // Handler for right click on row
  const handleRowContextMenu = (event: React.MouseEvent, rowIndex: number) => {
    event.preventDefault(); // Prevent default browser context menu
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      rowIndex
    });
  };

  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Delete row from context menu
  const handleContextMenuDelete = () => {
    if (contextMenu !== null) {
      handleDeleteRow(contextMenu.rowIndex);
      setContextMenu(null);
    }
  };

  // Calculate visible entries count
  const visibleRows = table.getRowModel().rows.length;

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

  // Render table
  return (
    <div className="mb-8 font-inter">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {searchFilter ? `Results for "${searchFilter}"` : 'Your Dating Entries'}
          {searchFilter && ` (${visibleRows} entries)`}
        </h2>
        <button
          onClick={handleAddRow}
          className="flex items-center space-x-2 bg-brand-lavender-500 text-white font-medium py-2 px-4 rounded-md hover:bg-brand-lavender-600 transition-colors"
        >
          <FaPlus className="text-sm" />
          <span>Add Person</span>
        </button>
      </div>
      
      {visibleRows === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          {searchFilter ? (
            <p className="text-gray-500 mb-4">No entries found matching "{searchFilter}".</p>
          ) : (
            <>
              <p className="text-gray-500 mb-4">No dating entries yet. Add your first one!</p>
              <button
                onClick={handleAddRow}
                className="inline-flex items-center space-x-2 bg-brand-lavender-500 text-white font-medium py-2 px-4 rounded-md hover:bg-brand-lavender-600 transition-colors"
              >
                <FaPlus className="text-sm" />
                <span>Add Your First Date</span>
              </button>
            </>
          )}
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
              {table.getRowModel().rows.map(row => {
                // Create a stable row key based on id or tempId
                const rowData = row.original as ExtendedDatingEntry | ExtendedNewDatingEntry;
                const rowKey = 'id' in rowData && rowData.id 
                  ? `row-${rowData.id}` 
                  : `row-temp-${rowData.tempId || row.id}`;
                
                return (
                  <tr 
                    key={rowKey}
                    className={`hover:bg-gray-50 transition-all duration-500 ease-in-out ${getRowAnimationClass(row.index)}`}
                    style={getRowStyle(row.index)}
                    onContextMenu={(e) => handleRowContextMenu(e, row.index)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td 
                        key={`${rowKey}-${cell.column.id}`}
                        className="px-6 py-3 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 relative transition-all duration-500 ease-in-out"
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onDelete={handleContextMenuDelete}
        />
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
          will-change: height, transform, opacity;
          border-color: #f3f4f6 !important; /* Ensure border color stays consistent */
          transform-origin: center top;
          transition: height 500ms ease-in-out, opacity 500ms ease-in-out, transform 500ms ease-in-out;
          box-sizing: border-box;
        }
        
        td {
          will-change: padding;
          transition: padding 500ms ease-in-out;
          box-sizing: border-box;
        }
        
        /* Prevent border color flash */
        tbody tr:first-child {
          border-top-color: #f3f4f6 !important;
        }
        
        tbody.bg-white {
          border-top-color: #f3f4f6 !important;
        }
        
        /* Row animations */
        @keyframes slideInFromBottom {
          0% {
            transform: translateY(20px);
            opacity: 0;
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin-bottom: -1px;
            border-top-width: 0;
          }
          20% {
            border-top-width: 1px;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
            max-height: 100px;
            padding-top: inherit;
            padding-bottom: inherit;
            margin-bottom: 0;
          }
        }
        
        @keyframes slideOut {
          0% {
            transform: translateY(0);
            opacity: 1;
            max-height: 100px;
            padding-top: inherit;
            padding-bottom: inherit;
            border-top-width: 1px;
          }
          40% {
            opacity: 0;
            transform: translateY(-10px);
          }
          60% {
            border-top-width: 0;
          }
          100% {
            transform: translateY(-20px);
            opacity: 0;
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin-top: -1px;
            margin-bottom: -1px;
            border-width: 0;
          }
        }
        
        .animate-slide-in-from-bottom {
          animation: slideInFromBottom 500ms ease-out forwards;
          overflow: hidden;
        }
        
        .animate-slide-out {
          animation: slideOut 500ms ease-in forwards;
          overflow: hidden;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
} 