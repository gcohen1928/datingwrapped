'use client';

import { useState, useEffect, useRef } from 'react';
import { FaStar, FaRegStar, FaTrash, FaFlag, FaPen, FaCheck, FaTimes, FaEdit } from 'react-icons/fa';
import { Tables } from '../../utils/supabase';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

// Options for select inputs
export const platformOptions = [
  'Tinder', 'Hinge', 'Bumble', 'Coffee Meets Bagel', 
  'Match', 'IRL', 'Through Friends', 'Work', 'School', 'Other'
];

export const outcomeOptions = [
  'Ghosted', 'Relationship', 'Ongoing', 'Friends', 
  'One-time', 'Blocked', 'Mutual End', 'Other'
];

export const relationshipStatusOptions = [
  'Single', 'Married', 'Divorced', 'Separated', 'Complicated', 'Unknown'
];

export const statusOptions = [
  'Active', 'Inactive', 'Archived'
];

interface DatingCardProps {
  entry: DatingEntry | NewDatingEntry;
  index: number;
  onUpdate: (index: number, id: string, value: any) => void;
  onDelete: (index: number) => void;
  isActive: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export default function DatingCard({
  entry,
  index,
  onUpdate,
  onDelete,
  isActive,
  isEditing,
  setIsEditing
}: DatingCardProps) {
  // Local state for form values
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [nameEditing, setNameEditing] = useState(false);
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const selectRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Initialize form values from entry
  useEffect(() => {
    setFormValues({ ...entry });
  }, [entry]);

  // Focus name input when editing
  useEffect(() => {
    if (nameEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [nameEditing]);

  // Handle input changes
  const handleInputChange = (id: string, value: any) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
    onUpdate(index, id, value);
  };

  // Get color for option
  const getColorForOption = (option: string, fieldId: string) => {
    switch (fieldId) {
      case 'platform':
        switch (option) {
          case 'Tinder': return 'bg-red-500 text-white';
          case 'Hinge': return 'bg-pink-500 text-white';
          case 'Bumble': return 'bg-yellow-500 text-black';
          case 'Match': return 'bg-blue-500 text-white';
          case 'IRL': return 'bg-green-500 text-white';
          case 'Through Friends': return 'bg-indigo-500 text-white';
          case 'Work': return 'bg-gray-500 text-white';
          case 'School': return 'bg-orange-500 text-white';
          default: return 'bg-gray-200 text-gray-800';
        }
      case 'status':
        switch (option) {
          case 'Active': return 'bg-green-500 text-white';
          case 'Inactive': return 'bg-gray-500 text-white';
          case 'Archived': return 'bg-blue-500 text-white';
          default: return 'bg-gray-200 text-gray-800';
        }
      case 'relationship_status':
        switch (option) {
          case 'Single': return 'bg-green-500 text-white';
          case 'Married': return 'bg-blue-500 text-white';
          case 'Divorced': return 'bg-red-500 text-white';
          case 'Separated': return 'bg-orange-500 text-white';
          case 'Complicated': return 'bg-purple-500 text-white';
          default: return 'bg-gray-200 text-gray-800';
        }
      case 'outcome':
        switch (option) {
          case 'Ghosted': return 'bg-gray-500 text-white';
          case 'Relationship': return 'bg-pink-500 text-white';
          case 'Ongoing': return 'bg-green-500 text-white';
          case 'Friends': return 'bg-blue-500 text-white';
          case 'One-time': return 'bg-purple-500 text-white';
          case 'Blocked': return 'bg-red-500 text-white';
          case 'Mutual End': return 'bg-yellow-500 text-black';
          default: return 'bg-gray-200 text-gray-800';
        }
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Render star rating
  const renderStars = (value: number | undefined, fieldId: string) => {
    const stars = [];
    const rating = value || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => handleInputChange(fieldId, i)}
          className={`transition-all ${i <= rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
        >
          {i <= rating ? <FaStar className="w-5 h-5" /> : <FaRegStar className="w-5 h-5" />}
        </button>
      );
    }
    
    return (
      <div className="flex space-x-1">
        {stars}
      </div>
    );
  };

  // Render select dropdown
  const renderSelect = (fieldId: string, options: string[]) => {
    const currentValue = formValues[fieldId] as string;
    
    // Click outside handler
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          openSelect === fieldId &&
          selectRefs.current[fieldId] &&
          !selectRefs.current[fieldId]?.contains(event.target as Node)
        ) {
          setOpenSelect(null);
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [openSelect, fieldId]);
    
    return (
      <div 
        className="relative"
        ref={(el) => { selectRefs.current[fieldId] = el; }}
      >
        {currentValue ? (
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium inline-block cursor-pointer ${getColorForOption(currentValue, fieldId)}`}
            onClick={() => setOpenSelect(openSelect === fieldId ? null : fieldId)}
          >
            {currentValue}
          </div>
        ) : (
          <div
            className="px-3 py-1 rounded-full text-sm font-medium inline-block cursor-pointer bg-gray-100 text-gray-500 hover:bg-gray-200"
            onClick={() => setOpenSelect(openSelect === fieldId ? null : fieldId)}
          >
            Select {fieldId.replace('_', ' ')}
          </div>
        )}
        
        {openSelect === fieldId && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="py-1">
              {options.map(option => (
                <div
                  key={option}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    currentValue === option ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => {
                    handleInputChange(fieldId, option);
                    setOpenSelect(null);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render flags
  const renderFlags = (flags: string[] | null | undefined, fieldId: string) => {
    const currentFlags = flags || [];
    const [newFlag, setNewFlag] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    
    const handleAddFlag = () => {
      if (newFlag.trim()) {
        const updatedFlags = [...currentFlags, newFlag.trim()];
        handleInputChange(fieldId, updatedFlags);
        setNewFlag('');
        setIsAdding(false);
      }
    };
    
    const handleRemoveFlag = (flag: string) => {
      const updatedFlags = currentFlags.filter(f => f !== flag);
      handleInputChange(fieldId, updatedFlags);
    };
    
    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {currentFlags.map(flag => (
            <div 
              key={flag} 
              className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                fieldId === 'red_flags' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}
            >
              <FaFlag className="w-3 h-3" />
              {flag}
              <button
                onClick={() => handleRemoveFlag(flag)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        
        {isAdding ? (
          <div className="flex items-center mt-1">
            <input
              type="text"
              value={newFlag}
              onChange={e => setNewFlag(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddFlag();
                if (e.key === 'Escape') setIsAdding(false);
              }}
              className="flex-1 p-1 text-sm border border-gray-300 rounded"
              placeholder={`Add ${fieldId === 'red_flags' ? 'red' : 'green'} flag`}
              autoFocus
            />
            <button
              onClick={handleAddFlag}
              className="ml-1 p-1 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className={`text-xs ${
              fieldId === 'red_flags' ? 'text-red-500' : 'text-green-500'
            } hover:underline flex items-center gap-1`}
          >
            <FaFlag className="w-3 h-3" />
            Add {fieldId === 'red_flags' ? 'red' : 'green'} flags
          </button>
        )}
      </div>
    );
  };

  // Render editable field
  const renderEditableField = (fieldId: string, type: 'text' | 'number', placeholder: string, options?: { min?: string, max?: string, step?: string }) => {
    const value = formValues[fieldId];
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue: string | number = e.target.value;
      
      // Convert to number for number inputs
      if (type === 'number' && newValue !== '') {
        newValue = parseFloat(newValue);
      }
      
      handleInputChange(fieldId, newValue);
    };
    
    return (
      <div className="min-h-6">
        {isEditing ? (
          <input
            type={type}
            value={value === undefined || value === null ? '' : value}
            onChange={handleValueChange}
            className="w-full p-1 text-sm border border-gray-300 rounded"
            placeholder={placeholder}
            min={options?.min}
            max={options?.max}
            step={options?.step}
          />
        ) : (
          <div 
            className="cursor-pointer group flex items-center"
            onClick={() => setIsEditing(true)}
          >
            {value !== undefined && value !== null && value !== '' ? (
              <span>{value}</span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
            <FaPen className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  // Render editable notes
  const renderEditableNotes = () => {
    const notes = formValues.notes as string;
    
    return (
      <div className="min-h-6">
        {isEditing ? (
          <textarea
            value={notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded"
            placeholder="Add notes about this date..."
            rows={3}
          />
        ) : (
          <div 
            className="cursor-pointer group"
            onClick={() => setIsEditing(true)}
          >
            {notes ? (
              <p className="text-sm text-gray-700">{notes}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No notes</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        isActive ? 'scale-100' : 'scale-95 opacity-80'
      }`}
      style={{ 
        width: '350px',
        maxHeight: '500px',
        overflowY: 'auto'
      }}
    >
      {/* Delete Button */}
      <button
        onClick={() => onDelete(index)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm z-10 transition-all hover:scale-110"
        title="Delete entry"
      >
        <FaTrash className="w-4 h-4" />
      </button>
      
      {/* Card Header */}
      <div className="bg-gradient-to-r from-brand-lavender-500 to-brand-pink-500 p-4 text-white relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium bg-white/20 rounded-full px-3 py-1">
              Date #{index + 1}
            </span>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 text-white/80 hover:text-white transition-colors"
                title="Save changes"
              >
                <FaCheck className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-white/80 hover:text-white transition-colors"
            title={isEditing ? "Cancel editing" : "Edit entry"}
          >
            {isEditing ? <FaTimes className="w-4 h-4" /> : <FaEdit className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="mt-2">
          {nameEditing ? (
            <input
              type="text"
              value={formValues.person_name || ''}
              onChange={(e) => {
                setFormValues({...formValues, person_name: e.target.value});
                handleInputChange('person_name', e.target.value);
              }}
              onBlur={() => setNameEditing(false)}
              className="w-full p-2 text-xl font-bold bg-white text-gray-800 rounded-md"
              placeholder="Name"
              ref={nameInputRef}
            />
          ) : (
            <h3 
              className="text-2xl font-bold cursor-pointer group flex items-center" 
              onClick={() => setNameEditing(true)}
            >
              {entry.person_name}
              <FaPen className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
          )}
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Top Info Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Platform</p>
            <div className="min-h-6">
              {renderSelect('platform', platformOptions)}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <div className="min-h-6">
              {renderSelect('status', statusOptions)}
            </div>
          </div>
        </div>
        
        {/* Basic Info Row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Age</p>
            {renderEditableField('age', 'number', 'Age', { min: '18', max: '100' })}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Occupation</p>
            {renderEditableField('occupation', 'text', 'Occupation')}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Relationship</p>
            <div className="min-h-6">
              {renderSelect('relationship_status', relationshipStatusOptions)}
            </div>
          </div>
        </div>
        
        {/* Date Info Row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1"># of Dates</p>
            {renderEditableField('num_dates', 'number', '# of Dates', { min: '0' })}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Avg Duration (hrs)</p>
            {renderEditableField('avg_duration', 'number', 'Duration', { min: '0', step: '0.5' })}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Cost ($)</p>
            {renderEditableField('total_cost', 'number', 'Cost', { min: '0', step: '0.01' })}
          </div>
        </div>
        
        {/* Ratings Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Hotness</p>
            {renderStars(formValues.hotness, 'hotness')}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Rating</p>
            {renderStars(formValues.rating, 'rating')}
          </div>
        </div>
        
        {/* Outcome */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Outcome</p>
          <div className="min-h-6">
            {renderSelect('outcome', outcomeOptions)}
          </div>
        </div>
        
        {/* Flags */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Red Flags</p>
            {renderFlags(formValues.red_flags, 'red_flags')}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Green Flags</p>
            {renderFlags(formValues.green_flags, 'green_flags')}
          </div>
        </div>
        
        {/* Notes */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Notes</p>
          {renderEditableNotes()}
        </div>
      </div>
    </div>
  );
} 