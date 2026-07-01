import React from 'react';

export default function EmptyState({ title = 'No results', description = 'There are no channels to show.' }: { title?: string; description?: string }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <svg className="w-16 h-16 text-white/70 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="4" width="22" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <circle cx="8" cy="11" r="2" fill="currentColor" opacity="0.6"/>
        <rect x="13" y="9" width="6" height="4" rx="1" fill="currentColor" opacity="0.6"/>
      </svg>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/70 max-w-md">{description}</p>
    </div>
  );
}
