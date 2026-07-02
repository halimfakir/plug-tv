'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseClient } from '../lib/supabaseClient';

type Country = {
  id: string;
  name: string;
  slug: string;
};

type CountryFilterProps = {
  selectedCountry?: string;
};

export default function CountryFilter({ selectedCountry = '' }: CountryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('countries')
          .select('id, name, slug')
          .order('name', { ascending: true });

        if (!error && data) {
          setCountries(data);
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (countryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (countryId) {
      params.set('country', countryId);
      params.set('page', '1');
    } else {
      params.delete('country');
      params.set('page', '1');
    }
    router.push(`/search?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Country</label>
        <div className="h-10 bg-white/6 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">Country</label>
      <select
        value={selectedCountry}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Countries</option>
        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}
