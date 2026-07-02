import { NextRequest, NextResponse } from 'next/server';
import { validateSearchParams, executeSearch } from '../../../lib/searchServer';

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
    const params = {
      q: searchParams.get('q') || undefined,
      country: searchParams.get('country') || undefined,
      category: searchParams.get('category') || undefined,
      page: searchParams.get('page') || undefined,
      per_page: searchParams.get('per_page') || undefined,
    };

    const validated = validateSearchParams(params);

    if (validated.errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.errors },
        { status: 400 }
      );
    }

    const result = await executeSearch(validated);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to search channels' },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
