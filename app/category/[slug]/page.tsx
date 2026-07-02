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
      title: 'Category not found - Plug TV',
      description: 'Category not found',
    };
  }

  // Fetch category name for metadata
  try {
    const { data: categoryData, error: categoryError } = await supabaseClient
      .from('categories')
      .select('name')
      .eq('slug', slug)
      .limit(1);

    if (!categoryData || categoryData.length === 0) {
      return {
        title: 'Category not found - Plug TV',
        description: 'Category not found',
      };
    }

    const category = categoryData[0];
    return {
      title: `${category.name} Channels — Plug TV`,
      description: `Discover official and legal live TV channels in the ${category.name} category. Browse channels from around the world.`,
      openGraph: {
        title: `${category.name} Channels — Plug TV`,
        description: `Discover official and legal live TV channels in the ${category.name} category.`,
      },
    };
  } catch (err) {
    return {
      title: 'Category channels — Plug TV',
      description: 'Browse official channels by category',
    };
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  if (!slug || typeof slug !== 'string' || slug.length === 0) {
    notFound();
  }

  // Fetch category by slug
  const { data: categoryRows, error: categoryError } = await supabaseClient
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .limit(1);

  if (categoryError) {
    console.error('Error fetching category:', categoryError);
    notFound();
  }

  if (!categoryRows || categoryRows.length === 0) {
    notFound();
  }

  const category = categoryRows[0] as { id: string; name: string; slug: string };

  // Fetch channels for category
  const { data: channelsRows, error: channelsError } = await supabaseClient
    .from('channels')
    .select('*')
    .eq('category_id', category.id)
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
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-sm text-white/70 mb-6">Total channels: 0</p>
        <EmptyState title={`No channels in ${category.name}`} description={`There are currently no channels listed in the ${category.name} category.`} />
      </main>
    );
  }

  // Map channels to the shape ChannelGrid expects (id, name, country, category, logo, website)
  // Fetch country names and language names in bulk to avoid N+1 queries
  const countryIds = Array.from(new Set(channels.map((c) => c.country_id).filter(Boolean))) as string[];
  const languageIds = Array.from(new Set(channels.map((c) => c.language_id).filter(Boolean))) as string[];

  const countriesMap: Record<string, { name: string }> = {};
  if (countryIds.length > 0) {
    const { data: countries } = await supabaseClient.from('countries').select('id,name').in('id', countryIds);
    (countries || []).forEach((country: any) => {
      countriesMap[country.id] = { name: country.name };
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
    country: c.country_id ? (countriesMap[c.country_id]?.name ?? '') : '',
    category: category.name,
    logo: c.logo_url ?? '/logos/placeholders/default-tv.svg',
    website: c.website_url ?? '#',
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-sm text-white/70">Total channels: {channels.length}</p>
      </header>

      <section>
        <ChannelGrid channels={channelsForGrid} />
      </section>
    </main>
  );
}
