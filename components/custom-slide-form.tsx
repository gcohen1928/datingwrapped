'use client'

import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X } from 'lucide-react'

interface CustomSlide {
  title: string
  description: string
}

interface CustomSlideFormProps {
  showForm: boolean
  onSubmit: (slide: CustomSlide) => void
  onCancel: () => void
}

export function CustomSlideForm({ showForm, onSubmit, onCancel }: CustomSlideFormProps) {
  const [customSlide, setCustomSlide] = useState<CustomSlide>({
    title: '',
    description: ''
  })
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(customSlide)
    setCustomSlide({ title: '', description: '' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg bg-white shadow-sm relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.button
            type="button"
            onClick={onCancel}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4 text-gray-600" />
          </motion.button>
        )}
      </AnimatePresence>
      <input
        type="text"
        maxLength={50}
        value={customSlide.title}
        onChange={e => setCustomSlide(prev => ({ ...prev, title: e.target.value }))}
        className="w-full px-3 py-2 text-lg font-semibold bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400"
        placeholder="Enter slide title..."
        required
      />
      <input
        type="text"
        maxLength={100}
        value={customSlide.description}
        onChange={e => setCustomSlide(prev => ({ ...prev, description: e.target.value }))}
        className="w-full px-3 py-2 text-sm text-gray-600 bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400 mb-3"
        placeholder="Enter slide description..."
        required
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
          Custom
        </span>
        <Button type="submit" size="sm" className="text-xs h-6 px-3">
          Save Slide
        </Button>
      </div>
    </form>
  )
} 