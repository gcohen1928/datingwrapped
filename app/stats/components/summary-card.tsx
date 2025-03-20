import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SummaryCard({ title, subtitle, children }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
      <div className="px-6 py-5 bg-white">
        {children}
      </div>
    </div>
  );
} 