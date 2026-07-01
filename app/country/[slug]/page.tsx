import React from 'react';
import { notFound } from 'next/navigation';
import ChannelGrid from '../../../components/ChannelGrid';
import EmptyState from '../../../components/EmptyState';
import { supabaseClient } from '../../../lib/supabaseClient';

type ChannelRow = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  country_id?: string | null;
  category_id?: string | null;
  language_id?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  created_at?: string;
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  if (!slug || typeof slug !== 'string') {
    return {
      title: 'Country not found - Plug TV',
      description: 'Country not found',
    };
  }

  // Fetch country name for metadata
  try {
    const { data: countryData, error: countryError } = await supabaseClient
      .from('countries')
      .select('name')
      .eq('slug', slug)
      .limit(1);

    if (!countryData || countryData.length === 0) {
      return {
        title: 'Country not found - Plug TV',
        description: 'Country not found',
      };
    }

    const country = countryData[0];
    return {
      title: `${country.name} Channels — Plug TV`,
      description: `Discover official and legal live TV channels from ${country.name}. Browse by category and stay informed.`,
      openGraph: {
        title: `${country.name} Channels — Plug TV`,
        description: `Discover official and legal live TV channels from ${country.name}.`,
      },
    };
  } catch (err) {
    return {
      title: 'Country channels — Plug TV',
      description: 'Browse official channels by country',
    };
  }
}

export default async function CountryPage({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  if (!slug || typeof slug !== 'string' || slug.length === 0) {
    notFound();
  }

  // Fetch country by slug
  const { data: countryRows, error: countryError } = await supabaseClient
    .from('countries')
    .select('id, name, slug')
    .eq('slug', slug)
    .limit(1);

  if (countryError) {
    console.error('Error fetching country:', countryError);
    notFound();
  }

  if (!countryRows || countryRows.length === 0) {
    notFound();
  }

  const country = countryRows[0] as { id: string; name: string; slug: string };

  // Fetch channels for country
  const { data: channelsRows, error: channelsError } = await supabaseClient
    .from('channels')
    .select('*')
    .eq('country_id', country.id)
    .order('created_at', { ascending: false });

  if (channelsError) {
    console.error('Error fetching channels:', channelsError);
    // In case of error, show notFound to avoid empty page
    notFound();
  }

  const channels: ChannelRow[] = (channelsRows || []) as ChannelRow[];

  if (!channels || channels.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">{country.name}</h1>
        <p className="text-sm text-white/70 mb-6">Total channels: 0</p>
        <EmptyState title={`No channels in ${country.name}`} description={`There are currently no channels listed for ${country.name}.`} />
      </main>
    );
  }

  // Map channels to the shape ChannelGrid expects (id, name, country, category, logo, website)
  // Fetch category names and language names in bulk to avoid N+1 queries
  const categoryIds = Array.from(new Set(channels.map((c) => c.category_id).filter(Boolean))) as string[];
  const languageIds = Array.from(new Set(channels.map((c) => c.language_id).filter(Boolean))) as string[];

  const categoriesMap: Record<string, { name: string }> = {};
  if (categoryIds.length > 0) {
    const { data: cats } = await supabaseClient.from('categories').select('id,name').in('id', categoryIds);
    (cats || []).forEach((cat: any) => {
      categoriesMap[cat.id] = { name: cat.name };
    });
  }

  const languagesMap: Record<string, { code: string; name: string }> = {};
  if (languageIds.length > 0) {
    const { data: langs } = await supabaseClient.from('languages').select('id,code,name').in('id', languageIds);
    (langs || []).forEach((l: any) => {
      languagesMap[l.id] = { code: l.code, name: l.name };
    });
  }

  const channelsForGrid = channels.map((c) => ({
    id: c.id,
    name: c.name,
    country: country.name,
    category: c.category_id ? (categoriesMap[c.category_id]?.name ?? '') : '',
    logo: c.logo_url ?? '/logos/placeholders/default-tv.svg',
    website: c.website_url ?? '#',
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{country.name}</h1>
        <p className="text-sm text-white/70">Total channels: {channels.length}</p>
      </header>

      <section>
        <ChannelGrid channels={channelsForGrid} />
      </section>
    </main>
  );
}
