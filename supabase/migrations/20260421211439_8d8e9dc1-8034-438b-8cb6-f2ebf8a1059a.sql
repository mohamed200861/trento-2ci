
-- Add class_name to group_videos
ALTER TABLE public.group_videos ADD COLUMN IF NOT EXISTS class_name TEXT NOT NULL DEFAULT '2CI';

-- Drop old unique on group_number if any, allow same group_number per class
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_videos_group_number_key') THEN
    ALTER TABLE public.group_videos DROP CONSTRAINT group_videos_group_number_key;
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS group_videos_class_group_uniq ON public.group_videos(class_name, group_number);

-- Add content_type and link_url to articles
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'pdf';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS link_url TEXT;

-- Seed 2BLS groups
INSERT INTO public.group_videos (class_name, group_number, members, description) VALUES
  ('2BLS', 1, ARRAY['Sergiu Marandiuc','Lekaj Gabriele'], 'Video di gruppo della classe 2BLS.'),
  ('2BLS', 2, ARRAY['Eva Taglialatela','Sara Famigliari'], 'Video di gruppo della classe 2BLS.'),
  ('2BLS', 3, ARRAY['Giacomo Morandi','Marta Bonomi'], 'Video di gruppo della classe 2BLS.'),
  ('2BLS', 4, ARRAY['Fabio Degiuli','Pietro Zhang'], 'Video di gruppo della classe 2BLS.'),
  ('2BLS', 5, ARRAY['Aasem Dawas','Megi Porja'], 'Video di gruppo della classe 2BLS.'),
  ('2BLS', 6, ARRAY['Martina Orlandi','Alì Roa'], 'Video di gruppo della classe 2BLS.'),
  ('2BLS', 7, ARRAY['Riccardo Basirico','Asamuel Onokusi'], 'Video di gruppo della classe 2BLS.'),
  ('2BLS', 8, ARRAY['Fabio Mestice','Claudio Cutelli'], 'Video di gruppo della classe 2BLS.')
ON CONFLICT DO NOTHING;

-- Set Zappalà as external link
UPDATE public.articles
SET content_type = 'link', link_url = 'https://civica-zappala-2ci.pages.dev/'
WHERE student_name ILIKE '%Zappal%';
