import React from 'react';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
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
  embed_allowed?: boolean;
  created_at?: string;
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  if (!slug || typeof slug !== 'string') {
    return {
      title: 'Channel not found - Plug TV',
      description: 'Channel not found',
    };
  }

  // Fetch channel name and description for metadata
  try {
    const { data: channelData, error: channelError } = await supabaseClient
      .from('channels')
      .select('name, description')
      .eq('slug', slug)
      .limit(1);

    if (!channelData || channelData.length === 0) {
      return {
        title: 'Channel not found - Plug TV',
        description: 'Channel not found',
      };
    }

    const channel = channelData[0];
    const description = channel.description || 'Watch this official live TV channel on Plug TV';

    return {
      title: `${channel.name} — Plug TV`,
      description: description,
      openGraph: {
        title: `${channel.name} — Plug TV`,
        description: description,
      },
    };
  } catch (err) {
    return {
      title: 'Channel — Plug TV',
      description: 'Watch official live TV channels',
    };
  }
}

export default async function ChannelPage({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  if (!slug || typeof slug !== 'string' || slug.length === 0) {
    notFound();
  }

  // Fetch channel by slug
  const { data: channelRows, error: channelError } = await supabaseClient
    .from('channels')
    .select('*')
    .eq('slug', slug)
    .limit(1);

  if (channelError) {
    console.error('Error fetching channel:', channelError);
    notFound();
  }

  if (!channelRows || channelRows.length === 0) {
    notFound();
  }

  const channel = channelRows[0] as ChannelRow;

  // Fetch country name
  let countryName = '';
  if (channel.country_id) {
    const { data: countryData } = await supabaseClient
      .from('countries')
      .select('name')
      .eq('id', channel.country_id)
      .limit(1);

    if (countryData && countryData.length > 0) {
      countryName = countryData[0].name;
    }
  }

  // Fetch category name
  let categoryName = '';
  if (channel.category_id) {
    const { data: categoryData } = await supabaseClient
      .from('categories')
      .select('name')
      .eq('id', channel.category_id)
      .limit(1);

    if (categoryData && categoryData.length > 0) {
      categoryName = categoryData[0].name;
    }
  }

  // Fetch language name
  let languageName = '';
  if (channel.language_id) {
    const { data: languageData } = await supabaseClient
      .from('languages')
      .select('name')
      .eq('id', channel.language_id)
      .limit(1);

    if (languageData && languageData.length > 0) {
      languageName = languageData[0].name;
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Channel Logo */}
      <div className="mb-8">
        <div className="w-full aspect-video bg-white/4 rounded-lg flex items-center justify-center overflow-hidden">
          {channel.logo_url ? (
            <img
              src={channel.logo_url}
              alt={channel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white/40 text-center">
              <div className="text-6xl mb-2">📺</div>
              <p>No logo available</p>
            </div>
          )}
        </div>
      </div>

      {/* Channel Info */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{channel.name}</h1>

        {channel.description && (
          <p className="text-white/80 text-lg mb-6">{channel.description}</p>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {countryName && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 mb-2">Country</h3>
              <p className="text-white text-lg">{countryName}</p>
            </div>
          )}

          {categoryName && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 mb-2">Category</h3>
              <p className="text-white text-lg">{categoryName}</p>
            </div>
          )}

          {languageName && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 mb-2">Language</h3>
              <p className="text-white text-lg">{languageName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8">
        <p className="text-white/80">
          Streaming is available only on the broadcaster's official website.
        </p>
      </div>

      {/* Visit Website Button */}
      {channel.website_url && (
        <a
          href={channel.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <span>Visit Official Website</span>
          <ExternalLink size={20} />
        </a>
      )}
    </main>
  );
}
