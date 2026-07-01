-- supabase/seeds/seed_languages.sql
-- Seed 15 languages for Plug TV

INSERT INTO public.languages (name, code) VALUES
('English','en'),
('Bengali','bn'),
('Hindi','hi'),
('Urdu','ur'),
('Nepali','ne'),
('Sinhalese','si'),
('Arabic','ar'),
('French','fr'),
('German','de'),
('Italian','it'),
('Spanish','es'),
('Japanese','ja'),
('Korean','ko'),
('Portuguese','pt'),
('Turkish','tr')
ON CONFLICT (code) DO NOTHING;
