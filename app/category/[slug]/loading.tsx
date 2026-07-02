import React from 'react';

export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-white/6 rounded w-1/3 mb-4" />
        <div className="h-6 bg-white/4 rounded w-1/6 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-white/4 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
