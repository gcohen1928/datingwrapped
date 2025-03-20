interface StatGridProps {
  stats: Array<{
    label: string;
    value: string | number;
  }>;
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white overflow-hidden shadow-md rounded-xl p-5 border border-gray-100"
        >
          <dt className="text-sm font-medium text-gray-500 truncate">
            {stat.label}
          </dt>
          <dd className="mt-2 text-3xl font-semibold text-brand-lavender-600">
            {stat.value}
          </dd>
        </div>
      ))}
    </div>
  );
} 