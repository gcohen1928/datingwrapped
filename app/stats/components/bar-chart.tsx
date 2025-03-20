'use client';

import { useState, useEffect } from 'react';
import { BarChart as RechartsChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  xLabel?: string;
  yLabel?: string;
}

export function BarChart({ data, xLabel, yLabel }: BarChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Limit to top 8 items for better visualization if there's many
  const chartData = data
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

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
        <RechartsChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            label={{ 
              value: xLabel, 
              position: 'insideBottom', 
              offset: -10 
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ 
              value: yLabel, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip formatter={(value) => [value, yLabel || 'Value']} />
          <Bar dataKey="value" fill="#8C45FF" barSize={30} radius={[4, 4, 0, 0]} />
        </RechartsChart>
      </ResponsiveContainer>
    </div>
  );
} 