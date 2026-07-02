import { supabaseServer } from './supabaseServer';

export type SearchParams = {
  q?: string;
  country?: string;
  category?: string;
  page?: string;
  per_page?: string;
};

export type ValidatedSearchParams = {
  q: string;
  country: string;
  category: string;
  page: number;
  per_page: number;
  errors: string[];
};

export type SearchResult = {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  country_id: string;
  category_id: string;
  language_id: string;
};

export type SearchResponse = {
  channels: SearchResult[];
  total: number;
  page: number;
  per_page: number;
};

export function validateSearchParams(params: SearchParams): ValidatedSearchParams {
  const errors: string[] = [];

  const q = params.q ? String(params.q).trim().slice(0, 200) : '';
  const country = params.country ? String(params.country).trim().slice(0, 100) : '';
  const category = params.category ? String(params.category).trim().slice(0, 100) : '';

  let page = 1;
  if (params.page) {
    const parsedPage = parseInt(String(params.page), 10);
    if (isNaN(parsedPage) || parsedPage < 1) {
      errors.push('page must be a positive integer');
    } else {
      page = parsedPage;
    }
  }

  let per_page = 10;
  if (params.per_page) {
    const parsedPerPage = parseInt(String(params.per_page), 10);
    if (isNaN(parsedPerPage) || parsedPerPage < 1) {
      errors.push('per_page must be a positive integer');
    } else if (parsedPerPage > 50) {
      errors.push('per_page cannot exceed 50');
    } else {
      per_page = parsedPerPage;
    }
  }

  return {
    q,
    country,
    category,
    page,
    per_page,
    errors,
  };
}

export async function executeSearch(
  validated: ValidatedSearchParams
): Promise<SearchResponse | null> {
  try {
    let query = supabaseServer
      .from('channels')
      .select('id, slug, name, description, logo_url, website_url, country_id, category_id, language_id', {
        count: 'exact',
      });

    // Apply text search filters (name, description)
    if (validated.q) {
      query = query.or(`name.ilike.%${validated.q}%,description.ilike.%${validated.q}%`);
    }

    // Apply country filter
    if (validated.country) {
      query = query.eq('country_id', validated.country);
    }

    // Apply category filter
    if (validated.category) {
      query = query.eq('category_id', validated.category);
    }

    // Apply pagination
    const offset = (validated.page - 1) * validated.per_page;
    query = query.range(offset, offset + validated.per_page - 1).order('created_at', { ascending: false });

    const { data: channels, count, error } = await query;

    if (error) {
      console.error('Supabase search error:', error);
      return null;
    }

    const total = count || 0;

    return {
      channels: channels || [],
      total,
      page: validated.page,
      per_page: validated.per_page,
    };
  } catch (err) {
    console.error('Search execution error:', err);
    return null;
  }
}
