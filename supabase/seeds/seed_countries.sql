-- supabase/seeds/seed_countries.sql
-- Seed 21 countries for Plug TV (added Qatar)

INSERT INTO public.countries (name, slug, iso_code, flag_url) VALUES
('Bangladesh','bangladesh','BD',NULL),
('India','india','IN',NULL),
('United States','usa','US',NULL),
('United Kingdom','uk','GB',NULL),
('Canada','canada','CA',NULL),
('Australia','australia','AU',NULL),
('Japan','japan','JP',NULL),
('South Korea','south-korea','KR',NULL),
('France','france','FR',NULL),
('Germany','germany','DE',NULL),
('Italy','italy','IT',NULL),
('Spain','spain','ES',NULL),
('Turkey','turkey','TR',NULL),
('Saudi Arabia','saudi-arabia','SA',NULL),
('United Arab Emirates','uae','AE',NULL),
('Pakistan','pakistan','PK',NULL),
('Nepal','nepal','NP',NULL),
('Sri Lanka','sri-lanka','LK',NULL),
('Brazil','brazil','BR',NULL),
('Mexico','mexico','MX',NULL),
('Qatar','qatar','QA',NULL)
ON CONFLICT (slug) DO NOTHING;
