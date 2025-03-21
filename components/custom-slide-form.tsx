'use client'

import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface CustomSlide {
  title: string
  description: string
  type: 'insight' | 'stat' | 'fun_fact'
}

interface CustomSlideFormProps {
  showForm: boolean
  onSubmit: (slide: CustomSlide) => void
  onCancel: () => void
}

export function CustomSlideForm({ showForm, onSubmit, onCancel }: CustomSlideFormProps) {
  const [customSlide, setCustomSlide] = useState<CustomSlide>({
    title: '',
    description: '',
    type: 'insight'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(customSlide)
    setCustomSlide({ title: '', description: '', type: 'insight' })
  }

  return (
    <AnimatePresence>
      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="p-4 border rounded-lg bg-white shadow-sm relative"
        >
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
        </motion.form>
      )}
    </AnimatePresence>
  )
} 