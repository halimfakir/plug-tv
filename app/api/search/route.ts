import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

type SearchParams = {
  q?: string;
  country?: string;
  category?: string;
  page?: string;
  per_page?: string;
};

// TODO: In-memory rate limiter is for development only.
// For production, use a distributed rate limiting solution:
// - Redis (self-hosted or cloud)
// - Upstash (serverless Redis)
// - Vercel KV (built-in Vercel solution)
// - dedicated rate limiting service
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function validateSearchParams(params: SearchParams) {
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

export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getRateLimitKey(request);
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 30 requests per minute.' },
        { status: 429 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const params: SearchParams = {
      q: searchParams.get('q') || undefined,
      country: searchParams.get('country') || undefined,
      category: searchParams.get('category') || undefined,
      page: searchParams.get('page') || undefined,
      per_page: searchParams.get('per_page') || undefined,
    };

    const { q, country, category, page, per_page, errors } = validateSearchParams(params);

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Build the query
    let query = supabaseServer
      .from('channels')
      .select('id, slug, name, description, logo_url, website_url, country_id, category_id, language_id', {
        count: 'exact',
      });

    // Apply text search filters (name, description)
    if (q) {
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }

    // Apply country filter
    if (country) {
      query = query.eq('country_id', country);
    }

    // Apply category filter
    if (category) {
      query = query.eq('category_id', category);
    }

    // Apply pagination
    const offset = (page - 1) * per_page;
    query = query.range(offset, offset + per_page - 1).order('created_at', { ascending: false });

    const { data: channels, count, error } = await query;

    if (error) {
      console.error('Supabase search error:', error);
      return NextResponse.json(
        { error: 'Failed to search channels' },
        { status: 500 }
      );
    }

    const total = count || 0;

    return NextResponse.json(
      {
        channels: channels || [],
        total,
        page,
        per_page,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
