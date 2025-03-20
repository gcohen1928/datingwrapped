'use client';

import { FaStar, FaRegStar, FaFlag } from 'react-icons/fa';
import { Tables } from '../../utils/supabase';
import { useState, useEffect, useRef } from 'react';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

// Extended types to include temporary animation properties
type ExtendedDatingEntry = DatingEntry & { tempId?: string };
type ExtendedNewDatingEntry = NewDatingEntry & { tempId?: string };

// Format the field name for display
const formatFieldName = (fieldName: string) => {
  return fieldName
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Options for select inputs
export const platformOptions = [
  'Tinder',
  'Hinge',
  'Bumble',
  'Match',
  'IRL',
  'Through Friends',
  'Work',
  'School',
  'Other'
];

export const outcomeOptions = [
  'Ghosted',
  'Relationship',
  'Ongoing',
  'Friends',
  'One-time',
  'Blocked',
  'Mutual End',
  'Other'
];

export const relationshipStatusOptions = [
  'Single',
  'Married',
  'Divorced',
  'Separated',
  'Complicated',
  'Unknown'
];

export const statusOptions = [
  'Active',
  'Inactive',
  'Archived'
];

// Common flag options
export const greenFlagOptions = [
  'Great communication',
  'Emotionally available',
  'Respects boundaries',
  'Financially responsible',
  'Supportive',
  'Good listener',
  'Family-oriented',
  'Ambitious',
  'Sense of humor',
  'Consistent'
];

export const redFlagOptions = [
  'Poor communication',
  'Controlling behavior',
  'Disrespects boundaries',
  'Financially irresponsible',
  'Love bombing',
  'Jealousy issues',
  'Emotionally unavailable',
  'Constantly on phone',
  'Doesn\'t ask questions',
  'Inconsistent'
];

// Base props for all cell types
interface BaseCellProps {
  row: ExtendedDatingEntry | ExtendedNewDatingEntry;
  rowIndex: number;
  id: string;
  value: any;
  onUpdate: (index: number, id: string, value: any) => void;
}

// Text input cell
export function TextCell({ row, rowIndex, id, value, onUpdate }: BaseCellProps) {
  const [localValue, setLocalValue] = useState(() => {
    // Don't autopopulate certain fields for new rows
    if (row.id === undefined && ['name'].includes(id)) {
      return '';
    }
    return value || '';
  });
  
  // Ref to track if update is in progress
  const isUpdatingRef = useRef(false);
  
  // Update local value when prop value changes, but only if not in the middle of an update
  useEffect(() => {
    // Don't autopopulate certain fields for new rows
    if (row.id === undefined && ['name'].includes(id)) {
      return;
    }
    
    // Only update if we're not currently in the middle of an update operation
    if (!isUpdatingRef.current) {
      setLocalValue(value || '');
    }
  }, [value, id, row.id]);
  
  const handleBlur = () => {
    // Set flag to prevent useEffect from overriding our value during the update cycle
    isUpdatingRef.current = true;
    
    // Update the parent component
    onUpdate(rowIndex, id, localValue);
    
    // Reset the flag after a small delay to allow the update to propagate
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };
  
  return (
    <input
      type="text"
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none"
      placeholder={formatFieldName(id)}
    />
  );
}

// Number input cell
export function NumberCell({ 
  row, 
  rowIndex, 
  id, 
  value, 
  onUpdate,
  min = "0",
  max,
  step = "1",
  placeholder
}: BaseCellProps & { 
  min?: string; 
  max?: string; 
  step?: string;
  placeholder?: string;
}) {
  const [localValue, setLocalValue] = useState<string | number>(() => {
    // Don't autopopulate certain fields for new rows
    if (row.id === undefined && ['number_of_dates', 'total_cost', 'avg_duration'].includes(id)) {
      return '';
    }
    return value ?? '';
  });
  
  // Ref to track if update is in progress
  const isUpdatingRef = useRef(false);
  
  // Update local value when prop value changes, but only if not in the middle of an update
  useEffect(() => {
    // Don't autopopulate certain fields for new rows
    if (row.id === undefined && ['number_of_dates', 'total_cost', 'avg_duration'].includes(id)) {
      return;
    }
    
    // Only update if we're not currently in the middle of an update operation
    if (!isUpdatingRef.current) {
      setLocalValue(value ?? '');
    }
  }, [value, id, row.id]);
  
  const handleBlur = () => {
    // Set flag to prevent useEffect from overriding our value during the update cycle
    isUpdatingRef.current = true;
    
    // Update the parent component
    const val = localValue ? parseFloat(localValue.toString()) : undefined;
    onUpdate(rowIndex, id, val);
    
    // Reset the flag after a small delay to allow the update to propagate
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };
  
  return (
    <input
      type="number"
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none"
      min={min}
      max={max}
      step={step}
      placeholder={placeholder || formatFieldName(id)}
    />
  );
}

// Select input cell
export function SelectCell({ 
  row, 
  rowIndex, 
  id, 
  value, 
  onUpdate,
  options
}: BaseCellProps & { options: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(() => {
    // Don't autopopulate certain fields for new rows
    if (row.id === undefined && ['relationship_status', 'platform', 'outcome', 'status'].includes(id)) {
      return null;
    }
    return value || null;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update selected option when prop value changes
  useEffect(() => {
    // Don't autopopulate certain fields for new rows
    if (row.id === undefined && ['relationship_status', 'platform', 'outcome', 'status'].includes(id)) {
      return;
    }
    setSelectedOption(value || null);
  }, [value, id, row.id]);
  
  // Color mapping for different dropdown values
  const getColorForOption = (option: string, fieldId: string) => {
    // Platform colors
    if (fieldId === 'platform') {
      const platformColors: Record<string, string> = {
        'Tinder': 'bg-red-500',
        'Hinge': 'bg-pink-500',
        'Bumble': 'bg-yellow-500',
        'Match': 'bg-orange-500',
        'IRL': 'bg-green-500',
        'Through Friends': 'bg-purple-500',
        'Work': 'bg-gray-500',
        'School': 'bg-indigo-500',
        'Other': 'bg-gray-400'
      };
      return platformColors[option] || 'bg-gray-400';
    }
    
    // Relationship status colors
    if (fieldId === 'relationship_status') {
      const statusColors: Record<string, string> = {
        'Single': 'bg-green-500',
        'Married': 'bg-blue-500',
        'Divorced': 'bg-orange-500',
        'Separated': 'bg-yellow-500',
        'Complicated': 'bg-red-500',
        'Unknown': 'bg-gray-500'
      };
      return statusColors[option] || 'bg-gray-400';
    }
    
    // Outcome colors
    if (fieldId === 'outcome') {
      const outcomeColors: Record<string, string> = {
        'Ghosted': 'bg-gray-500',
        'Relationship': 'bg-pink-500',
        'Ongoing': 'bg-green-500',
        'Friends': 'bg-blue-500',
        'One-time': 'bg-purple-500',
        'Blocked': 'bg-red-500',
        'Mutual End': 'bg-yellow-500',
        'Other': 'bg-gray-400'
      };
      return outcomeColors[option] || 'bg-gray-400';
    }
    
    // Status colors
    if (fieldId === 'status') {
      const statusColors: Record<string, string> = {
        'Active': 'bg-green-500',
        'Inactive': 'bg-gray-500',
        'Archived': 'bg-blue-500'
      };
      return statusColors[option] || 'bg-gray-400';
    }
    
    return 'bg-gray-400';
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onUpdate(rowIndex, id, option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Badge/Button that opens dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full group"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value ? (
          <div className="flex items-center">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getColorForOption(value, id)} transition-all hover:shadow-md group-hover:scale-105`}
            >
              {value}
            </span>
            <svg 
              className={`ml-2 h-4 w-4 text-gray-400 transition-transform group-hover:text-gray-600 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center text-gray-400 text-sm group-hover:text-gray-600">
            <span>Select {formatFieldName(id)}</span>
            <svg 
              className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </button>
      
      {/* Animated inline options */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
          <div className="flex flex-col divide-y divide-gray-100 max-h-36 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`flex items-center px-3 py-2.5 text-sm cursor-pointer transition-all ${
                  value === option 
                    ? 'bg-brand-lavender-50 text-brand-lavender-800 font-medium' 
                    : 'hover:bg-gray-50'
                }`}
                role="option"
                aria-selected={value === option}
              >
                <span 
                  className={`mr-3 w-3 h-3 rounded-full ${getColorForOption(option, id)} transition-transform ${
                    value === option ? 'scale-125' : ''
                  }`}
                ></span>
                <span>{option}</span>
                {value === option && (
                  <svg className="ml-auto h-4 w-4 text-brand-lavender-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Star rating cell
export function StarRatingCell({ 
  row, 
  rowIndex, 
  id, 
  value, 
  onUpdate,
  colorClass = "text-yellow-400"
}: BaseCellProps & { colorClass?: string }) {
  const rating = value || 0;
  const [hoverRating, setHoverRating] = useState(0);
  
  // Determine color based on field type
  const getStarColor = () => {
    if (id === 'hotness') return 'text-brand-pink-500';
    if (id === 'rating') return 'text-brand-lavender-500';
    return colorClass;
  };
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onUpdate(rowIndex, id, star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="text-lg focus:outline-none transition-transform hover:scale-110 px-0.5"
        >
          {star <= (hoverRating || rating) ? (
            <FaStar 
              className={`${getStarColor()} ${hoverRating > 0 && star <= hoverRating ? 'animate-pulse' : ''}`} 
            />
          ) : (
            <FaRegStar className="text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
}

// Textarea cell
export function TextareaCell({ 
  row, 
  rowIndex, 
  id, 
  value, 
  onUpdate,
  rows = 2,
  placeholder
}: BaseCellProps & { rows?: number; placeholder?: string }) {
  const [localValue, setLocalValue] = useState(value || '');
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);
  
  return (
    <textarea
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      onBlur={() => onUpdate(rowIndex, id, localValue)}
      className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none"
      rows={rows}
      placeholder={placeholder || formatFieldName(id)}
    />
  );
}

// Flags cell (for array values)
export function FlagsCell({ 
  row, 
  rowIndex, 
  id, 
  value, 
  onUpdate,
  flagColor = "text-red-500"
}: BaseCellProps & { flagColor?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [flags, setFlags] = useState<string[]>(Array.isArray(value) ? value : []);
  const [inputValue, setInputValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [flagToRemove, setFlagToRemove] = useState<string | null>(null);
  const [newFlag, setNewFlag] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Update local flags when prop value changes
  useEffect(() => {
    setFlags(Array.isArray(value) ? value : []);
  }, [value]);


  const addFlag = (flag: string, updateParent = false) => {
    if (flag.trim() && !flags.includes(flag.trim())) {
      const trimmedFlag = flag.trim();
      setNewFlag(trimmedFlag);
      const newFlags = [...flags, trimmedFlag];
      setFlags(newFlags);
      setHasChanges(true);
      
      if (updateParent) {
        onUpdate(rowIndex, id, newFlags);
        setHasChanges(false);
      }
      
      setInputValue('');
      
      // Clear the new flag highlight after animation completes
      setTimeout(() => {
        setNewFlag(null);
      }, 1000);
    }
  };

  const removeFlag = (flag: string, updateParent = false) => {
    setFlagToRemove(flag);
    // Use setTimeout to allow animation to complete before removing from state
    setTimeout(() => {
      const newFlags = flags.filter(f => f !== flag);
      setFlags(newFlags);
      setHasChanges(true);
      
      if (updateParent) {
        onUpdate(rowIndex, id, newFlags);
        setHasChanges(false);
      }
      
      setFlagToRemove(null);
    }, 300); // Match the duration of the animation
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addFlag(inputValue, false);
    } else if (e.key === 'Backspace' && inputValue === '' && flags.length > 0) {
      const lastFlag = flags[flags.length - 1];
      removeFlag(lastFlag, false);
    }
  };

  // Save changes when the dropdown is closed
  const handleToggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // If closing the dropdown and there are changes, update the parent
    if (!newIsOpen && hasChanges) {
      onUpdate(rowIndex, id, flags);
      setHasChanges(false);
    }
  };

  // Get flag options based on the flag type
  const getFlagOptions = () => {
    if (id === 'green_flags') return greenFlagOptions;
    if (id === 'red_flags') return redFlagOptions;
    return [];
  };

  // Determine the color of the badges based on flagColor
  const getBadgeColor = () => {
    if (flagColor === 'text-red-500') return 'bg-red-500';
    if (flagColor === 'text-green-500') return 'bg-green-500';
    return 'bg-gray-500';
  };

  // Filter options that are not already selected
  const filteredOptions = getFlagOptions().filter(option => !flags.includes(option));
  // Filter options based on input value
  const matchingOptions = filteredOptions.filter(option => 
    inputValue ? option.toLowerCase().includes(inputValue.toLowerCase()) : true
  );
  
  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Badges container */}
      <div 
        onClick={handleToggleDropdown}
        className="flex flex-wrap gap-1 min-h-[24px] cursor-pointer"
      >
        {flags.length > 0 ? (
          flags.map((flag, index) => (
            <div 
              key={index} 
              className={`flex items-center transition-all duration-300 ${
                flagToRemove === flag ? 'scale-0 opacity-0' : 
                newFlag === flag ? 'scale-105 opacity-100 animate-pulse' : 'scale-100 opacity-100'
              }`}
            >
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getBadgeColor()} transition-all hover:shadow-md ${
                  newFlag === flag ? 'shadow-md' : ''
                }`}
              >
                {flag}
                <button
                  type="button"
                  className="ml-1 text-white focus:outline-none hover:text-gray-200 inline-flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFlag(flag, false);
                  }}
                >
                  ×
                </button>
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">
            Add {formatFieldName(id)}...
          </div>
        )}
      </div>

      {/* Animated input field and options */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
          <div className="flex flex-col divide-y divide-gray-100">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or select a flag..."
              className="w-full p-2 border-b border-gray-200 focus:ring-0 focus:outline-none text-sm"
            />
            
            {/* Common flags options */}
            <div className="mt-2 py-2">
              <div className="text-xs text-gray-500 mb-2 px-2">Common {formatFieldName(id)}:</div>
              <div className="flex flex-col divide-y divide-gray-100 max-h-36 overflow-y-auto">
                {matchingOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => addFlag(option, false)}
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-all"
                    role="option"
                  >
                    <span 
                      className={`mr-3 w-3 h-3 rounded-full ${getBadgeColor()} transition-transform`}
                    ></span>
                    <span>{option}</span>
                  </div>
                ))}
                {matchingOptions.length === 0 && inputValue && (
                  <div className="px-3 py-2 text-sm text-gray-500 italic">
                    Press Enter to add "{inputValue}"
                  </div>
                )}
              </div>
            </div>
            
            {/* Current flags */}
            {flags.length > 0 && (
              <div className="mt-2 pt-2">
                <div className="text-xs text-gray-500 mb-1 px-2">Current {formatFieldName(id)}:</div>
                <div className="flex flex-wrap gap-1 px-2 pb-1">
                  {flags.map((flag, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center transition-all duration-300 ${
                        flagToRemove === flag ? 'scale-0 opacity-0' : 
                        newFlag === flag ? 'scale-105 opacity-100 animate-pulse' : 'scale-100 opacity-100'
                      }`}
                    >
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getBadgeColor()} transition-all hover:shadow-md ${
                          newFlag === flag ? 'shadow-md' : ''
                        }`}
                      >
                        {flag}
                        <button
                          type="button"
                          className="ml-1 text-white focus:outline-none hover:text-gray-200 inline-flex"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFlag(flag, false);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Flag header component
export function FlagHeader({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center">
      <FaFlag className={`${color} mr-1`} />
      <span className="font-medium">{label}</span>
    </div>
  );
}