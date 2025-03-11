'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPlus, FaMousePointer } from 'react-icons/fa';
import DatingCard from './dating-card';
import { Tables } from '../../utils/supabase';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

interface CardStackProps {
  data: (DatingEntry | NewDatingEntry)[];
  onUpdate: (index: number, id: string, value: any) => void;
  onDelete: (index: number) => void;
  onAddNew: () => void;
}

export default function CardStack({ data, onUpdate, onDelete, onAddNew }: CardStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardStackRef = useRef<HTMLDivElement>(null);

  // Reset active index if data changes
  useEffect(() => {
    if (data.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= data.length) {
      setActiveIndex(data.length - 1);
    }
  }, [data, activeIndex]);

  // Handle wheel event for card navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;
      
      // Prevent default scrolling behavior when we're handling card navigation
      e.preventDefault();
      
      // Determine scroll direction
      if (e.deltaY > 0) {
        // Scrolling down - go to previous card (reversed direction)
        if (activeIndex > 0) {
          goToPrevious();
        }
      } else {
        // Scrolling up - go to next card (reversed direction)
        if (activeIndex < data.length - 1) {
          goToNext();
        }
      }
    };

    const cardStackElement = cardStackRef.current;
    if (cardStackElement) {
      // Use passive: false to allow preventDefault()
      cardStackElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (cardStackElement) {
        cardStackElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [activeIndex, isAnimating, data.length]);

  // Handle navigation
  const goToNext = () => {
    if (isAnimating) return;
    if (activeIndex < data.length - 1) {
      // Reversed direction - now using 'left' for next
      setDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 150); // Reduced from 300ms to 150ms for faster animation
    }
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    if (activeIndex > 0) {
      // Reversed direction - now using 'right' for previous
      setDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex(prev => prev - 1);
        setIsAnimating(false);
      }, 150); // Reduced from 300ms to 150ms for faster animation
    }
  };

  // Handle delete with animation
  const handleDelete = (index: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Animate out - reversed direction
    setDirection(index < activeIndex ? 'left' : 'right');
    
    setTimeout(() => {
      onDelete(index);
      
      // Adjust active index if needed
      if (index === activeIndex && activeIndex === data.length - 1) {
        setActiveIndex(Math.max(0, activeIndex - 1));
      }
      
      setIsAnimating(false);
    }, 150); // Reduced from 300ms to 150ms for faster animation
  };

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Dating Entries Yet</h3>
          <p className="text-gray-500">Start tracking your dating experiences by adding your first entry.</p>
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center space-x-2 bg-gradient-to-r from-brand-lavender-500 to-brand-pink-500 text-white font-medium py-3 px-6 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          <FaPlus className="text-sm" />
          <span>Add Your First Date</span>
        </button>
      </div>
    );
  }

  // Animation variants - reversed directions
  const cardContainerVariants = {
    initial: (direction: 'left' | 'right' | null) => ({
      x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
      opacity: direction ? 0 : 1,
      scale: direction ? 0.8 : 1,
      rotateY: direction === 'left' ? -5 : direction === 'right' ? 5 : 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 25 }, // Increased stiffness, reduced damping for faster animation
        opacity: { duration: 0.15 }, // Reduced from 0.2 to 0.15
        rotateY: { type: 'spring', stiffness: 400, damping: 25 }, // Increased stiffness, reduced damping
      },
    },
    exit: (direction: 'left' | 'right' | null) => ({
      x: direction === 'right' ? -300 : direction === 'left' ? 300 : 0,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === 'right' ? -5 : direction === 'left' ? 5 : 0,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 25 }, // Increased stiffness, reduced damping for faster animation
        opacity: { duration: 0.15 }, // Reduced from 0.2 to 0.15
        rotateY: { type: 'spring', stiffness: 400, damping: 25 }, // Increased stiffness, reduced damping
      },
    }),
  };

  // Calculate how many cards to show in each stack
  const maxStackSize = 3; // Maximum number of cards to show in a stack
  
  // Previous cards stack (left side)
  const prevStackCards = Math.min(activeIndex, maxStackSize);
  
  // Next cards stack (right side)
  const nextStackCards = Math.min(data.length - activeIndex - 1, maxStackSize);

  return (
    <div className="relative">
      {/* Card Stack */}
      <div 
        ref={cardStackRef}
        className="relative h-[550px] flex items-center justify-center perspective group"
      >
        {/* Mouse wheel indicator - only shows on hover */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center gap-2">
          <FaMousePointer className="text-brand-lavender-500" />
          <span className="text-xs text-gray-700 font-medium">Scroll to navigate</span>
        </div>
        
        {/* Previous cards stack (left side) */}
        {prevStackCards > 0 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-0">
            {Array.from({ length: prevStackCards }).map((_, i) => (
              <div 
                key={`prev-${i}`}
                className="absolute w-full max-w-md transform bg-white rounded-xl shadow-sm border border-gray-100"
                style={{ 
                  zIndex: prevStackCards - i,
                  opacity: 0.5 - (i * 0.1),
                  transform: `translateX(${-20 * (i + 1)}px) scale(${0.9 - (i * 0.05)}) rotate(${-5 * (i + 1)}deg)`,
                  height: '450px',
                  width: '300px'
                }}
              />
            ))}
          </div>
        )}
        
        {/* Next cards stack (right side) */}
        {nextStackCards > 0 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-0">
            {Array.from({ length: nextStackCards }).map((_, i) => (
              <div 
                key={`next-${i}`}
                className="absolute w-full max-w-md transform bg-white rounded-xl shadow-sm border border-gray-100"
                style={{ 
                  zIndex: nextStackCards - i,
                  opacity: 0.5 - (i * 0.1),
                  transform: `translateX(${20 * (i + 1)}px) scale(${0.9 - (i * 0.05)}) rotate(${5 * (i + 1)}deg)`,
                  height: '450px',
                  width: '300px'
                }}
              />
            ))}
          </div>
        )}
        
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={cardContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 10 }}
          >
            {data[activeIndex] && (
              <div className="w-[350px]">
                <DatingCard
                  key={activeIndex}
                  entry={data[activeIndex]}
                  index={activeIndex}
                  onUpdate={onUpdate}
                  onDelete={handleDelete}
                  isActive={true}
                  isEditing={false}
                  setIsEditing={() => {}}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls - Moved outside the card stack container */}
      <div className="flex justify-center items-center space-x-6 mt-8 relative z-20">
        <button
          onClick={goToPrevious}
          disabled={activeIndex === 0 || isAnimating}
          className={`p-4 rounded-full bg-white shadow-md text-brand-lavender-500 hover:text-brand-pink-500 transition-all ${
            activeIndex === 0 || isAnimating
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-110'
          }`}
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={onAddNew}
          disabled={isAnimating}
          className={`p-4 rounded-full bg-gradient-to-r from-brand-lavender-500 to-brand-pink-500 text-white shadow-md transition-all ${
            isAnimating
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-110'
          }`}
        >
          <FaPlus className="w-6 h-6" />
        </button>
        
        <button
          onClick={goToNext}
          disabled={activeIndex === data.length - 1 || isAnimating}
          className={`p-4 rounded-full bg-white shadow-md text-brand-lavender-500 hover:text-brand-pink-500 transition-all ${
            activeIndex === data.length - 1 || isAnimating
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-110'
          }`}
        >
          <FaChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {/* Pagination Indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex space-x-2">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  // Reversed direction
                  setDirection(index > activeIndex ? 'left' : 'right');
                  setActiveIndex(index);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeIndex
                  ? 'bg-gradient-to-r from-brand-lavender-500 to-brand-pink-500 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
      
      {/* Add perspective styling */}
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
} 