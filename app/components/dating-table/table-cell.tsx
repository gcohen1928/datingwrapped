'use client';

import { FaStar, FaRegStar, FaFlag } from 'react-icons/fa';
import { Tables } from '../../utils/supabase';
import { useState, useEffect, useRef } from 'react';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

// Options for select inputs
export const platformOptions = [
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

// Base props for all cell types
interface BaseCellProps {
  row: DatingEntry | NewDatingEntry;
  rowIndex: number;
  id: string;
  value: any;
  onUpdate: (index: number, id: string, value: any) => void;
}

// Text input cell
export function TextCell({ row, rowIndex, id, value, onUpdate }: BaseCellProps) {
  const [localValue, setLocalValue] = useState(value || '');
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);
  
  return (
    <input
      type="text"
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      onBlur={() => onUpdate(rowIndex, id, localValue)}
      className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none"
      placeholder={`Enter ${id}`}
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
  const [localValue, setLocalValue] = useState<string | number>(value ?? '');
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);
  
  return (
    <input
      type="number"
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      onBlur={() => {
        const val = localValue ? parseFloat(localValue.toString()) : undefined;
        onUpdate(rowIndex, id, val);
      }}
      className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none"
      min={min}
      max={max}
      step={step}
      placeholder={placeholder || `Enter ${id}`}
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
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
  
  // Reset highlighted index when dropdown opens/closes
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);
  
  // Color mapping for different dropdown values
  const getColorForOption = (option: string, fieldId: string) => {
    // Platform colors
    if (fieldId === 'platform') {
      const platformColors: Record<string, string> = {
        'Tinder': 'bg-red-500',
        'Hinge': 'bg-pink-500',
        'Bumble': 'bg-yellow-500',
        'OkCupid': 'bg-blue-500',
        'Coffee Meets Bagel': 'bg-brown-500',
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
    onUpdate(rowIndex, id, option);
    setIsOpen(false);
  };

  // Format the field name for display
  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="relative" ref={dropdownRef}>
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
      
      {/* Custom dropdown */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-1 w-56 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200 right-0 animate-fadeIn"
          role="listbox"
        >
          <div className="py-1">
            {options.map((option, index) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseLeave={() => setHighlightedIndex(-1)}
                className={`flex items-center px-3 py-2 text-sm cursor-pointer transition-colors ${
                  highlightedIndex === index 
                    ? 'bg-brand-lavender-50' 
                    : 'hover:bg-gray-50'
                } ${value === option ? 'bg-brand-lavender-50/50' : ''}`}
                role="option"
                aria-selected={value === option}
              >
                <span 
                  className={`mr-2 w-3 h-3 rounded-full ${getColorForOption(option, id)} transition-transform ${
                    highlightedIndex === index || value === option ? 'scale-125' : ''
                  }`}
                ></span>
                <span className={`${value === option ? 'font-medium text-brand-lavender-700' : ''} transition-colors`}>
                  {option}
                </span>
                {value === option && (
                  <svg className="ml-auto h-4 w-4 text-brand-lavender-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
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
      placeholder={placeholder || `Enter ${id}`}
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
  const flags = value || [];
  const [localValue, setLocalValue] = useState(Array.isArray(flags) ? flags.join(', ') : '');
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(Array.isArray(flags) ? flags.join(', ') : '');
  }, [flags]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };
  
  const handleBlur = () => {
    // Split by commas and trim whitespace
    const flagsArray = localValue.split(',').map(flag => flag.trim()).filter(Boolean);
    onUpdate(rowIndex, id, flagsArray);
  };
  
  return (
    <textarea
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none"
      rows={2}
      placeholder={`Comma-separated ${id}...`}
    />
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