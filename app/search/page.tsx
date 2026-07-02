import React from 'react';
import { Metadata } from 'next';
import SearchBar from '../../components/SearchBar';
import CountryFilter from '../../components/CountryFilter';
import CategoryFilter from '../../components/CategoryFilter';
import ChannelGrid from '../../components/ChannelGrid';
import EmptyState from '../../components/EmptyState';
import { validateSearchParams, executeSearch } from '../../lib/searchServer';

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';

  let title = 'Search Channels';
  let description = 'Search for your favorite TV channels';

  if (q) {
    title = `Search: ${q} - Plug TV`;
    description = `Search results for "${q}" on Plug TV`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const validated = validateSearchParams({
    q: typeof params.q === 'string' ? params.q : undefined,
    country: typeof params.country === 'string' ? params.country : undefined,
    category: typeof params.category === 'string' ? params.category : undefined,
    page: typeof params.page === 'string' ? params.page : undefined,
    per_page: typeof params.per_page === 'string' ? params.per_page : undefined,
  });

  if (validated.errors.length > 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h1 className="text-lg font-semibold text-red-400 mb-2">Invalid Search Parameters</h1>
          <p className="text-red-300/80">{validated.errors.join(', ')}</p>
        </div>
      </main>
    );
  }

  const result = await executeSearch(validated);

  if (!result) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h1 className="text-lg font-semibold text-red-400 mb-2">Search Error</h1>
          <p className="text-red-300/80">Failed to search channels. Please try again later.</p>
        </div>
      </main>
    );
  }

  const queryString = new URLSearchParams();
  if (validated.q) queryString.set('q', validated.q);
  if (validated.country) queryString.set('country', validated.country);
  if (validated.category) queryString.set('category', validated.category);

  const prevPage = validated.page > 1 ? validated.page - 1 : null;
  const nextPage = validated.page * validated.per_page < result.total ? validated.page + 1 : null;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Search Channels</h1>
        <p className="text-white/60">
          {result.total} result{result.total !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar initialQuery={validated.q} />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <CountryFilter selectedCountry={validated.country} />
        <CategoryFilter selectedCategory={validated.category} />
      </div>

      {/* Active Filters */}
      {(validated.q || validated.country || validated.category) && (
        <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-sm text-white/70">
            <span className="font-semibold">Active filters:</span>
            {validated.q && ` Query: "${validated.q}"`}
            {validated.country && ` Country: "${validated.country}"`}
            {validated.category && ` Category: "${validated.category}"`}
          </p>
        </div>
      )}

      {/* Results */}
      {result.channels.length > 0 ? (
        <>
          <ChannelGrid channels={result.channels} />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-12">
            {prevPage ? (
              <a
                href={`/search?${queryString.toString()}${queryString.toString() ? '&' : ''}page=${prevPage}`}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                ← Previous
              </a>
            ) : (
              <div />
            )}

            <span className="text-white/60">
              Page {validated.page} of {Math.ceil(result.total / validated.per_page)}
            </span>

            {nextPage ? (
              <a
                href={`/search?${queryString.toString()}${queryString.toString() ? '&' : ''}page=${nextPage}`}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Next →
              </a>
            ) : (
              <div />
            )}
          </div>
        </>
      ) : (
        <EmptyState title="No channels found" description="Try adjusting your search criteria or filters." />
      )}
    </main>
  );
}
