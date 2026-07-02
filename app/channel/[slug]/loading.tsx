import React from 'react';

export default function ChannelLoading() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Channel Logo Skeleton */}
      <div className="mb-8">
        <div className="w-full aspect-video bg-white/6 rounded-lg animate-pulse" />
      </div>

      {/* Channel Info Skeleton */}
      <div className="mb-8">
        {/* Title */}
        <div className="h-10 bg-white/6 rounded w-2/3 mb-4 animate-pulse" />

        {/* Description */}
        <div className="space-y-2 mb-6">
          <div className="h-5 bg-white/4 rounded w-full animate-pulse" />
          <div className="h-5 bg-white/4 rounded w-5/6 animate-pulse" />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-white/4 rounded w-1/2 mb-2 animate-pulse" />
              <div className="h-6 bg-white/6 rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Notice Skeleton */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8">
        <div className="h-5 bg-white/4 rounded w-3/4 animate-pulse" />
      </div>

      {/* Button Skeleton */}
      <div className="h-12 bg-blue-600/50 rounded-lg w-48 animate-pulse" />
    </main>
  );
}
