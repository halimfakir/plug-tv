-- supabase/migrations/0001_init.sql
-- Initial database schema for Plug TV (improved)
-- Supabase-compatible SQL migration
--
-- Improvements:
-- - UUID primary keys
-- - created_at and updated_at timestamps with auto-update trigger
-- - RLS enabled with public SELECT; write policies are marked TODO for admin-only rules
-- - ON DELETE behaviors for foreign keys
-- - CHECK constraints for slugs and URLs
-- - UNIQUE constraints for iso_code and language codes
-- - Indexes for performance

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------
-- Table: countries
-- Purpose: Countries where channels are based. Used for filtering and display.
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  iso_code text,
  flag_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT countries_slug_nonempty CHECK (char_length(trim(slug)) > 0),
  CONSTRAINT countries_iso_code_unique UNIQUE (iso_code)
);

-- Trigger to update updated_at
CREATE TRIGGER trg_countries_updated_at
BEFORE UPDATE ON public.countries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Row Level Security and policies for countries
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
-- Allow public read access
CREATE POLICY IF NOT EXISTS "countries_public_select" ON public.countries FOR SELECT USING (true);
-- TODO: In production, replace the following permissive write policies with admin-only policies.
-- Example: CREATE POLICY "countries_admin_write" ON public.countries FOR ALL TO <role_or_function> USING (<condition>) WITH CHECK (<condition>);
-- Do NOT grant INSERT/UPDATE/DELETE to the generic "authenticated" role in production unless you restrict to admins.

-- Indexes
CREATE INDEX IF NOT EXISTS idx_countries_slug ON public.countries (slug);
CREATE INDEX IF NOT EXISTS idx_countries_iso_code ON public.countries (iso_code);

COMMENT ON TABLE public.countries IS 'List of countries used to categorize channels (slug unique, iso_code unique).';

-- --------------------------------------------------
-- Table: categories
-- Purpose: Channel categories (e.g., News, Sports, Entertainment).
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_slug_nonempty CHECK (char_length(trim(slug)) > 0)
);

CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "categories_public_select" ON public.categories FOR SELECT USING (true);
-- TODO: In production, implement admin-only INSERT/UPDATE/DELETE policies here.

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);

COMMENT ON TABLE public.categories IS 'Categories for channels, used for filtering and discovery (slug unique).';

-- --------------------------------------------------
-- Table: languages
-- Purpose: Languages available for channels (language code is unique).
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT languages_code_unique UNIQUE (code)
);

CREATE TRIGGER trg_languages_updated_at
BEFORE UPDATE ON public.languages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "languages_public_select" ON public.languages FOR SELECT USING (true);
-- TODO: In production, implement admin-only INSERT/UPDATE/DELETE policies here.

CREATE INDEX IF NOT EXISTS idx_languages_code ON public.languages (code);

COMMENT ON TABLE public.languages IS 'Languages used by channels (code must be unique, e.g., en, fr).';

-- --------------------------------------------------
-- Table: channels
-- Purpose: Main channels table containing metadata and links to official websites. No unauthorized streams are stored.
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  country_id uuid REFERENCES public.countries(id) ON DELETE RESTRICT,
  category_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  language_id uuid REFERENCES public.languages(id) ON DELETE SET NULL,
  logo_url text,
  website_url text,
  embed_allowed boolean DEFAULT false,
  embed_url text,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT channels_slug_nonempty CHECK (char_length(trim(slug)) > 0),
  CONSTRAINT channels_website_url_valid CHECK (website_url IS NULL OR website_url ~* '^(https?://)'),
  CONSTRAINT channels_embed_url_valid CHECK (embed_url IS NULL OR embed_url ~* '^(https?://)')
);

CREATE TRIGGER trg_channels_updated_at
BEFORE UPDATE ON public.channels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Row Level Security and policies for channels
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
-- Allow public read access to channels
CREATE POLICY IF NOT EXISTS "channels_public_select" ON public.channels FOR SELECT USING (true);
-- TODO: In production, replace the following permissive write policies with admin-only policies.
-- Example admin policy:
-- CREATE POLICY "channels_admin_write" ON public.channels FOR ALL TO <admin_role> USING (<condition>) WITH CHECK (<condition>);
-- Do NOT grant broad INSERT/UPDATE/DELETE rights to the authenticated role in production.

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_channels_country_id ON public.channels (country_id);
CREATE INDEX IF NOT EXISTS idx_channels_category_id ON public.channels (category_id);
CREATE INDEX IF NOT EXISTS idx_channels_language_id ON public.channels (language_id);
CREATE INDEX IF NOT EXISTS idx_channels_created_at ON public.channels (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_channels_slug ON public.channels (slug);
-- GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_channels_tags ON public.channels USING GIN (tags);
-- Index for fast website lookups
CREATE INDEX IF NOT EXISTS idx_channels_website_url ON public.channels (website_url);
-- Index for embed flag
CREATE INDEX IF NOT EXISTS idx_channels_embed_allowed ON public.channels (embed_allowed);
-- Case-insensitive slug lookup
CREATE INDEX IF NOT EXISTS idx_channels_slug_lower ON public.channels (lower(slug));

COMMENT ON TABLE public.channels IS 'Official channel metadata; only official website URLs or officially embeddable players should be stored. No pirate playlists or streams.';

-- --------------------------------------------------
-- Additional notes
-- - This migration creates the core schema for countries, categories, languages, and channels.
-- - UUIDs are used as primary keys via gen_random_uuid() (pgcrypto extension).
-- - Row Level Security (RLS) is enabled for each table with public SELECT policies; write policies are left as TODO comments — implement admin-only policies before enabling public write access.
-- - Triggers keep updated_at current on updates.
-- - Indexes added for common lookup columns.

-- Migration complete.
