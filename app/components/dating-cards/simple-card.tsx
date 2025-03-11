'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaTrash, FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import { Tables } from '../../utils/supabase';
import { platformOptions, outcomeOptions, relationshipStatusOptions, statusOptions } from './dating-card';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

interface SimpleCardProps {
  entry: DatingEntry | NewDatingEntry;
  index: number;
  onUpdate: (index: number, id: string, value: any) => void;
  onDelete: () => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export default function SimpleCard({
  entry,
  index,
  onUpdate,
  onDelete,
  isEditing,
  setIsEditing
}: SimpleCardProps) {
  // Local state for form values
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Initialize form values from entry
  useEffect(() => {
    setFormValues({ ...entry });
  }, [entry]);

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
          case 'Tinder': return 'bg-red-100 text-red-800';
          case 'Hinge': return 'bg-pink-100 text-pink-800';
          case 'Bumble': return 'bg-yellow-100 text-yellow-800';
          case 'Coffee Meets Bagel': return 'bg-amber-100 text-amber-800';
          case 'Match': return 'bg-blue-100 text-blue-800';
          case 'IRL': return 'bg-green-100 text-green-800';
          case 'Through Friends': return 'bg-indigo-100 text-indigo-800';
          case 'Work': return 'bg-gray-100 text-gray-800';
          case 'School': return 'bg-orange-100 text-orange-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      case 'outcome':
        switch (option) {
          case 'Ghosted': return 'bg-gray-100 text-gray-800';
          case 'Relationship': return 'bg-pink-100 text-pink-800';
          case 'Ongoing': return 'bg-green-100 text-green-800';
          case 'Friends': return 'bg-blue-100 text-blue-800';
          case 'One-time': return 'bg-purple-100 text-purple-800';
          case 'Blocked': return 'bg-red-100 text-red-800';
          case 'Mutual End': return 'bg-yellow-100 text-yellow-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render star rating
  const renderStars = (value: number | undefined) => {
    const stars = [];
    const rating = value || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          {i <= rating ? <FaStar className="w-4 h-4 inline" /> : <FaRegStar className="w-4 h-4 inline" />}
        </span>
      );
    }
    
    return <div className="flex space-x-1">{stars}</div>;
  };

  // Render editable star rating
  const renderEditableStars = (value: number | undefined, fieldId: string) => {
    const stars = [];
    const rating = value || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => handleInputChange(fieldId, i)}
          className={`transition-all ${i <= rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
        >
          {i <= rating ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
        </button>
      );
    }
    
    return <div className="flex space-x-1">{stars}</div>;
  };

  // Render select options
  const renderSelectOptions = (options: string[], fieldId: string) => {
    return (
      <select
        value={formValues[fieldId] || ''}
        onChange={(e) => handleInputChange(fieldId, e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md text-sm"
      >
        <option value="">Select {fieldId.replace('_', ' ')}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        {isEditing ? (
          <input
            type="text"
            value={formValues.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Name"
            className="font-medium text-lg w-full border-b border-gray-300 focus:border-brand-lavender-500 focus:outline-none"
          />
        ) : (
          <h3 className="font-medium text-lg">{entry.name || 'Unnamed'}</h3>
        )}
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="text-green-500 hover:text-green-600"
                title="Save"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => {
                  setFormValues({ ...entry });
                  setIsEditing(false);
                }}
                className="text-red-500 hover:text-red-600"
                title="Cancel"
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-brand-lavender-500 hover:text-brand-lavender-600"
                title="Edit"
              >
                <FaPen />
              </button>
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-600"
                title="Delete"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Platform */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Platform</div>
          {isEditing ? (
            renderSelectOptions(platformOptions, 'platform')
          ) : (
            entry.platform ? (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorForOption(entry.platform, 'platform')}`}>
                {entry.platform}
              </span>
            ) : (
              <span className="text-gray-400 text-sm">Not specified</span>
            )
          )}
        </div>
        
        {/* Date */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Date</div>
          {isEditing ? (
            <input
              type="date"
              value={formValues.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          ) : (
            <div className="text-sm">
              {entry.date ? new Date(entry.date).toLocaleDateString() : 'Not specified'}
            </div>
          )}
        </div>
        
        {/* Ratings */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Personality</div>
            {isEditing ? renderEditableStars(entry.personality_rating, 'personality_rating') : renderStars(entry.personality_rating)}
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Looks</div>
            {isEditing ? renderEditableStars(entry.looks_rating, 'looks_rating') : renderStars(entry.looks_rating)}
          </div>
        </div>
        
        {/* Outcome */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Outcome</div>
          {isEditing ? (
            renderSelectOptions(outcomeOptions, 'outcome')
          ) : (
            entry.outcome ? (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorForOption(entry.outcome, 'outcome')}`}>
                {entry.outcome}
              </span>
            ) : (
              <span className="text-gray-400 text-sm">Not specified</span>
            )
          )}
        </div>
        
        {/* Notes */}
        {isEditing && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Notes</div>
            <textarea
              value={formValues.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add notes..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm min-h-[80px]"
            />
          </div>
        )}
        
        {/* Display notes if they exist and not editing */}
        {!isEditing && entry.notes && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Notes</div>
            <p className="text-sm text-gray-700 line-clamp-3">{entry.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
} 