-- supabase/seeds/seed_categories.sql
-- Seed 12 categories for Plug TV

INSERT INTO public.categories (name, slug, description) VALUES
('News','news','Live news channels and news programming'),
('Sports','sports','Live sports channels and sports coverage'),
('Entertainment','entertainment','General entertainment channels'),
('Movies','movies','Movie channels and film programming'),
('Kids','kids','Children\'s programming and kids channels'),
('Music','music','Music channels and live performances'),
('Religious','religious','Religious and faith-based programming'),
('Education','education','Educational channels and learning content'),
('Business','business','Business and finance channels'),
('Lifestyle','lifestyle','Lifestyle and reality programming'),
('Documentary','documentary','Documentary channels and factual programming'),
('Science','science','Science and technology programming')
ON CONFLICT (slug) DO NOTHING;
