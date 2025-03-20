export default function StatsLoading() {
  return (
    <div className="space-y-8">
      {/* Main stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-xl animate-pulse border border-gray-100">
            <div className="h-4 bg-gray-100 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-100 rounded w-12"></div>
          </div>
        ))}
      </div>
      
      {/* Charts skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse border border-gray-100">
            <div className="h-5 bg-gray-100 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-24 mb-4"></div>
            <div className="h-48 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse border border-gray-100">
            <div className="h-5 bg-gray-100 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-24 mb-4"></div>
            <div className="h-48 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
      
      {/* Flags skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse border border-gray-100">
            <div className="h-5 bg-gray-100 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-24 mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="h-6 bg-gray-100 rounded-full w-16"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 