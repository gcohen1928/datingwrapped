'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { defaultSlides, SlideTemplate, TAG_COLORS, TagColor } from './default-slides'
import { useRouter } from 'next/navigation'
import { CustomSlideForm } from '@/components/custom-slide-form'
import { motion, AnimatePresence } from 'framer-motion'

interface DateEntry {
  id: string
  user_id: string
  date: string
  name: string
  age: number
  occupation: string
  location: string
  how_we_met: string
  notes: string
  liked: boolean
  ghosted: boolean
  second_date: boolean
  third_date: boolean
  why_ended: string
  created_at: string
}

interface GeneratedSlide extends SlideTemplate {
  data: any
}

interface GenerateSlidesProps {
  dateEntries: DateEntry[]
}

interface CustomSlide {
  title: string
  description: string
  type: 'stat' | 'insight' | 'fun_fact'
}

export default function GenerateSlides({ dateEntries }: GenerateSlidesProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<TagColor | null>(null)
  const [showCustomSlideForm, setShowCustomSlideForm] = useState(false)
  const [customSlides, setCustomSlides] = useState<SlideTemplate[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('customSlides')
    return stored ? JSON.parse(stored) : []
  })
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('selectedSlides')
    return stored ? JSON.parse(stored) : []
  })
  
  // Get selected templates
  const selectedTemplates = [...defaultSlides, ...customSlides].filter(slide => selectedTemplateIds.includes(slide.id))
  
  // Get all unique tags
  const allTags = Object.keys(TAG_COLORS) as TagColor[]
  
  // Filter slides by selected tag
  const filteredSlides = selectedTag 
    ? [...defaultSlides, ...customSlides].filter(slide => slide.tags?.includes(selectedTag))
    : [...defaultSlides, ...customSlides]

  // Get generated slides from localStorage
  const [generatedSlides, setGeneratedSlides] = useState<GeneratedSlide[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('generatedSlides')
    return stored ? JSON.parse(stored) : []
  })

  // Update localStorage when states change
  useEffect(() => {
    if (customSlides.length > 0) {
      localStorage.setItem('customSlides', JSON.stringify(customSlides))
    } else {
      localStorage.removeItem('customSlides')
    }
  }, [customSlides])

  useEffect(() => {
    if (selectedTemplateIds.length > 0) {
      localStorage.setItem('selectedSlides', JSON.stringify(selectedTemplateIds))
    } else {
      localStorage.removeItem('selectedSlides')
    }
  }, [selectedTemplateIds])

  useEffect(() => {
    if (generatedSlides.length > 0) {
      localStorage.setItem('generatedSlides', JSON.stringify(generatedSlides))
    }
  }, [generatedSlides])

  const generateSlides = async () => {
    if (selectedTemplates.length === 0) {
      setError('Please select at least one slide template')
      return
    }

    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/wrapped/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          dateEntries,
          selectedTemplates 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate slides')
      }

      const data = await response.json()
      setGeneratedSlides(data.slides)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating slides')
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleSlideSelection = (slide: SlideTemplate) => {
    setSelectedTemplateIds(prev => {
      if (prev.includes(slide.id)) {
        return prev.filter(id => id !== slide.id)
      }
      if (prev.length >= 10) {
        return prev
      }
      return [...prev, slide.id]
    })
  }

  const resetSelection = () => {
    setGeneratedSlides([])
    setSelectedTemplateIds([])
    setCustomSlides([])
    localStorage.removeItem('generatedSlides')
    localStorage.removeItem('selectedSlides')
    localStorage.removeItem('customSlides')
  }

  const handleCustomSlideButtonClick = () => {
    setShowCustomSlideForm(!showCustomSlideForm)
  }

  const handleCustomSlideSubmit = (customSlide: CustomSlide) => {
    if (customSlide.title.length > 50 || customSlide.description.length > 100) {
      setError('Title must be under 50 characters and description under 100 characters')
      return
    }
    
    const customSlideTemplate: SlideTemplate = {
      id: `custom-${Date.now()}`,
      ...customSlide,
      tags: ['custom']
    }
    
    setCustomSlides(prev => [...prev, customSlideTemplate])
    setSelectedTemplateIds(prev => 
      prev.length < 10 ? [...prev, customSlideTemplate.id] : prev
    )
    setShowCustomSlideForm(false)
  }

  if (generatedSlides.length > 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {generatedSlides.map((slide, index) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg"
              >
                <h3 className="font-semibold mb-2">{slide.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{slide.description}</p>
                <div className="space-y-2">
                  {Object.entries(slide.data).map(([key, value]) => (
                    <p key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {String(value)}
                    </p>
                  ))}
                </div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    slide.type === 'stat' ? 'bg-green-100 text-green-800' :
                    slide.type === 'insight' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {slide.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-end">
          <Button onClick={resetSelection}>
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded-full text-sm ${
            !selectedTag 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTag === tag
                ? TAG_COLORS[tag].replace('100', '500').replace('800', '50')
                : TAG_COLORS[tag]
            }`}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Custom Slide Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleCustomSlideButtonClick}
          variant="outline"
          className="mb-4"
        >
          {showCustomSlideForm ? 'Cancel Custom Slide' : 'Create Custom Slide'}
        </Button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Custom Slide Form */}
        <CustomSlideForm
          showForm={showCustomSlideForm}
          onSubmit={handleCustomSlideSubmit}
          onCancel={() => setShowCustomSlideForm(false)}
        />
        
        <AnimatePresence>
          {filteredSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 200,
                delay: index * 0.05
              }}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTemplateIds.includes(slide.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => toggleSlideSelection(slide)}
            >
              <h3 className="font-semibold mb-2">{slide.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{slide.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  slide.type === 'stat' ? 'bg-green-100 text-green-800' :
                  slide.type === 'insight' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {slide.type}
                </span>
                {slide.tags?.map(tag => (
                  <span key={tag} className={`text-xs px-2 py-1 rounded ${TAG_COLORS[tag as TagColor] || TAG_COLORS.custom}`}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Selected {selectedTemplateIds.length} of 10 slides
        </p>
        <Button
          onClick={generateSlides}
          disabled={isGenerating || selectedTemplateIds.length === 0}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Your Dating Wrapped...
            </>
          ) : (
            'Generate Your Dating Wrapped'
          )}
        </Button>
      </div>
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
    </div>
  )
} 