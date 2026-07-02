'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

type SearchBarProps = {
  initialQuery?: string;
};

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q') as string;

    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query.trim());
      params.set('page', '1');
    } else {
      params.delete('q');
      params.set('page', '1');
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          name="q"
          placeholder="Search channels by name or description..."
          defaultValue={initialQuery}
          className="w-full px-4 py-3 pl-10 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
      </div>
    </form>
  );
}
