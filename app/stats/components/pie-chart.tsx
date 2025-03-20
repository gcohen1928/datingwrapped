'use client';

import { useState, useEffect } from 'react';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

// Brand theme colors
const COLORS = [
  '#8C45FF', // brand-lavender-500
  '#FF2C94', // brand-pink-500
  '#24FF97', // brand-mint-500
  '#6A1DE0', // brand-lavender-600
  '#E60077', // brand-pink-600
  '#00E676', // brand-mint-600
  '#BD95FF', // brand-lavender-300
  '#FF88C2', // brand-pink-300
];

export function PieChart({ data }: PieChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter out items with zero value
  const chartData = data.filter(item => item.value > 0);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg animate-pulse">
        <span className="text-gray-400">Loading chart...</span>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="text-gray-500">No data available</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, 'Count']} />
          <Legend />
        </RechartsChart>
      </ResponsiveContainer>
    </div>
  );
} 