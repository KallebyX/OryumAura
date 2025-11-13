import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'table' | 'chart';
  rows?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'text', rows = 3 }) => {
  if (type === 'text') {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${Math.random() * 30 + 70}%` }}></div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="animate-pulse bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 p-4 flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200 flex gap-4">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="animate-pulse bg-white p-6 rounded-lg shadow-md">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
