'use client';

import { useState, useEffect } from 'react';
import { LineChart as RechartsChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  xLabel?: string;
  yLabel?: string;
}

export function LineChart({ data, xLabel, yLabel }: LineChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const chartData = [...data].sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8C45FF" 
            strokeWidth={2}
            activeDot={{ r: 6, fill: "#8C45FF" }}
            dot={{ r: 4, fill: "#8C45FF" }}
          />
        </RechartsChart>
      </ResponsiveContainer>
    </div>
  );
} 