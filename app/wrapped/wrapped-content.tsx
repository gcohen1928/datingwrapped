'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../providers/auth-provider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import GenerateSlides from './generate-slides'
import { redirect } from 'next/navigation'
import { fetchUserEntries } from '../components/dating-table/data-service'

export default function WrappedContent() {
  const { user, isLoading: authLoading } = useAuth()
  const [dateEntries, setDateEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const loadDateEntries = async () => {
      if (authLoading) return
      
      if (!user) {
        redirect('/auth')
        return
      }
      
      try {
        setLoading(true)
        const { userId, entries } = await fetchUserEntries()
        setDateEntries(entries || [])
      } catch (err) {   
        console.error('Error loading date entries:', err)
        setError(err instanceof Error ? err : new Error('Failed to load date entries'))
      } finally {
        setLoading(false)
      }
    }
    
    loadDateEntries()
  }, [user, authLoading, supabase])

  if (loading || authLoading) {
    return <div className="text-gray-500 py-8 text-center">Loading your dating history...</div>
  }

  if (error) {
    return (
      <div className="text-red-500 py-8 text-center">
        Error loading your dating history. Please try again later.
      </div>
    )
  }

  if (dateEntries.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
        <h3 className="text-xl font-medium mb-2">No Dating Data Yet</h3>
        <p className="text-gray-500 mb-4">
          Add some entries to generate your Dating Wrapped experience.
        </p>
        <a 
          href="/your-dates" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Your Dates
        </a>
      </div>
    )
  }

  return <GenerateSlides dateEntries={dateEntries} />
} 