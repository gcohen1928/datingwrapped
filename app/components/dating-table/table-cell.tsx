'use client';

import { FaStar, FaRegStar, FaFlag } from 'react-icons/fa';
import { Tables } from '../../utils/supabase';
import { useState, useEffect } from 'react';

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
  return (
    <select
      value={value || ''}
      onChange={e => onUpdate(rowIndex, id, e.target.value)}
      className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none"
    >
      <option value="">Select {id}</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
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
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onUpdate(rowIndex, id, star)}
          className="text-lg focus:outline-none"
        >
          {star <= rating ? (
            <FaStar className={colorClass} />
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
      <FaFlag className={color} />
      <span className="ml-1">{label}</span>
    </div>
  );
} 