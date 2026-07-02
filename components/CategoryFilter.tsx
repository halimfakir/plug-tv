'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseClient } from '../lib/supabaseClient';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoryFilterProps = {
  selectedCategory?: string;
};

export default function CategoryFilter({ selectedCategory = '' }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('categories')
          .select('id, name, slug')
          .order('name', { ascending: true });

        if (!error && data) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
      params.set('page', '1');
    } else {
      params.delete('category');
      params.set('page', '1');
    }
    router.push(`/search?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Category</label>
        <div className="h-10 bg-white/6 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
