import { Suspense } from 'react'
import WrappedContent from './wrapped-content'
import WrappedLoading from './loading'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function WrappedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dating Wrapped</h1>
      <p className="text-gray-600 mb-8">
        Generate your personalized dating year in review and create a beautiful presentation.
      </p>
      
      <Suspense fallback={<WrappedLoading />}>
        <WrappedContent />
      </Suspense>
    </div>
  )
} 