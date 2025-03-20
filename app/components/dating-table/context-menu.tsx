'use client';

import { useEffect, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
}

export default function ContextMenu({ x, y, onClose, onDelete }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position to ensure menu stays within viewport
  const adjustedPosition = {
    x: Math.min(x, window.innerWidth - 200),
    y: Math.min(y, window.innerHeight - 100)
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y
      }}
    >
      <button
        onClick={onDelete}
        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
      >
        <FaTrash className="w-4 h-4" />
        Delete Entry
      </button>
    </div>
  );
} 