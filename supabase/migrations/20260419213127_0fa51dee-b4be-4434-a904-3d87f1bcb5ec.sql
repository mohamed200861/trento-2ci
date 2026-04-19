-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-assign admin to predefined email
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'ashmawi.2009@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- ============ TIMESTAMP TRIGGER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ SITE CONTENT (key/value testi modificabili) ============
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert content" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content" ON public.site_content
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete content" ON public.site_content
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Default content
INSERT INTO public.site_content (key, value) VALUES
  ('home_intro', 'La nostra classe ha vissuto una visita d''istruzione a Trento, una città dove scienza, natura e storia si intrecciano in modo sorprendente. Siamo partiti alle 6 del mattino, con la mattina dedicata al MUSE e il pomeriggio al centro storico.'),
  ('home_three_ways_subtitle', 'Un''esperienza come questa può essere raccontata in modi diversi: attraverso le immagini, i video e gli articoli scritti da ognuno di noi.'),
  ('home_three_ways_extra', 'Il viaggio è raccontato da ognuno di noi tramite fotografie, video di gruppo e articoli personali, che raccolgono osservazioni, emozioni e riflessioni nate durante la visita.'),
  ('home_experience_title', 'Un''esperienza vissuta insieme'),
  ('home_experience_text', 'Questa visita ci ha permesso di osservare da vicino ambienti, paesaggi, fenomeni naturali e aspetti storici studiati in classe. Attraverso il museo, il centro storico e il lavoro svolto dopo il viaggio, abbiamo potuto raccontare l''esperienza con i nostri occhi e con le nostre parole.'),
  ('home_story_title', 'Il nostro racconto'),
  ('home_story_text', 'Ogni studente ha contribuito in modo diverso: con un articolo, con immagini, con un video o con il lavoro di gruppo. Il sito raccoglie tutto questo in un unico spazio, costruito per ricordare e presentare al meglio la nostra esperienza a Trento.'),
  ('galleria_intro', 'Le fotografie raccolgono i momenti più significativi della nostra visita al MUSE e della passeggiata nel centro storico di Trento.'),
  ('video_intro', 'La classe si è divisa in otto squadre di lavoro: ciascuna ha realizzato un breve video dedicato alla giornata trentina.'),
  ('articoli_intro', 'Ogni studente ha raccontato l''esperienza con il proprio articolo, mettendo in evidenza osservazioni, momenti significativi e riflessioni personali.'),
  ('footer_phrase', 'Un progetto realizzato dagli studenti della 2CI dopo il viaggio a Trento, con il contributo di tutti i compagni di classe.'),
  ('teachers_thanks', 'Grazie ai professori per l''attenzione e per il tempo dedicato alla visione del nostro lavoro. Abbiamo cercato di raccontare questa esperienza con impegno, attenzione e creatività.')
ON CONFLICT DO NOTHING;

-- ============ GALLERY PHOTOS ============
CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  storage_path TEXT,
  caption TEXT DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery insert" ON public.gallery_photos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage gallery update" ON public.gallery_photos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage gallery delete" ON public.gallery_photos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ ARTICLES ============
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  pdf_url TEXT,
  pdf_storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Admins insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update articles" ON public.articles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete articles" ON public.articles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.articles (student_name, description) VALUES
  ('Tessarin', 'Riflessioni e racconto della giornata a Trento.'),
  ('La Perna', 'Riflessioni e racconto della giornata a Trento.'),
  ('Fossati', 'Riflessioni e racconto della giornata a Trento.'),
  ('Perndreca', 'Riflessioni e racconto della giornata a Trento.'),
  ('Piva', 'Riflessioni e racconto della giornata a Trento.'),
  ('Ganzi', 'Riflessioni e racconto della giornata a Trento.'),
  ('Delpero', 'Riflessioni e racconto della giornata a Trento.'),
  ('Mohamed (Retag)', 'Riflessioni e racconto della giornata a Trento.'),
  ('Loria', 'Riflessioni e racconto della giornata a Trento.'),
  ('Quagliana', 'Riflessioni e racconto della giornata a Trento.'),
  ('Valarezo', 'Riflessioni e racconto della giornata a Trento.'),
  ('Zappalà', 'Riflessioni e racconto della giornata a Trento.'),
  ('Abdelhamid', 'Riflessioni e racconto della giornata a Trento.'),
  ('Di Trapani', 'Riflessioni e racconto della giornata a Trento.'),
  ('Padonou', 'Riflessioni e racconto della giornata a Trento.'),
  ('Saturno', 'Riflessioni e racconto della giornata a Trento.'),
  ('Tognin', 'Riflessioni e racconto della giornata a Trento.'),
  ('Selim', 'Riflessioni e racconto della giornata a Trento.'),
  ('Campana', 'Riflessioni e racconto della giornata a Trento.'),
  ('Francese', 'Riflessioni e racconto della giornata a Trento.'),
  ('Bianchi', 'Riflessioni e racconto della giornata a Trento.'),
  ('Gilardi', 'Riflessioni e racconto della giornata a Trento.'),
  ('Cavallaro', 'Riflessioni e racconto della giornata a Trento.');

-- ============ GROUP VIDEOS ============
CREATE TABLE public.group_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_number INT NOT NULL UNIQUE,
  members TEXT[] NOT NULL DEFAULT '{}',
  description TEXT DEFAULT '',
  video_url TEXT,
  video_storage_path TEXT,
  thumbnail_url TEXT,
  thumbnail_storage_path TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read videos" ON public.group_videos FOR SELECT USING (true);
CREATE POLICY "Admins insert videos" ON public.group_videos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update videos" ON public.group_videos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete videos" ON public.group_videos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_group_videos_updated_at
  BEFORE UPDATE ON public.group_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.group_videos (group_number, members, description) VALUES
  (1, ARRAY['Tessarin','La Perna'], 'Il gruppo 1 ha raccontato alcuni momenti significativi della visita.'),
  (2, ARRAY['Fossati','Perndreca','Piva'], 'Il gruppo 2 ha raccontato alcuni momenti significativi della visita.'),
  (3, ARRAY['Ganzi','Delpero','Mohamed (Retag)','Loria'], 'Il gruppo 3 ha raccontato alcuni momenti significativi della visita.'),
  (4, ARRAY['Quagliana','Valarezo'], 'Il gruppo 4 ha raccontato alcuni momenti significativi della visita.'),
  (5, ARRAY['Zappalà','Abdelhamid','Di Trapani','Padonou'], 'Il gruppo 5 ha raccontato alcuni momenti significativi della visita.'),
  (6, ARRAY['Saturno','Tognin','Selim','Campana'], 'Il gruppo 6 ha raccontato alcuni momenti significativi della visita.'),
  (7, ARRAY['Francese','Bianchi'], 'Il gruppo 7 ha raccontato alcuni momenti significativi della visita.'),
  (8, ARRAY['Gilardi','Cavallaro'], 'Il gruppo 8 ha raccontato alcuni momenti significativi della visita.');

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('articles-pdf', 'articles-pdf', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true) ON CONFLICT DO NOTHING;

-- Public read for all buckets
CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public read pdfs" ON storage.objects FOR SELECT USING (bucket_id = 'articles-pdf');
CREATE POLICY "Public read videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Public read thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
CREATE POLICY "Public read site-images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');

-- Admin full access
CREATE POLICY "Admin upload gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin upload pdfs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'articles-pdf' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update pdfs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'articles-pdf' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete pdfs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'articles-pdf' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin upload videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'videos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update videos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'videos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete videos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin upload thumbs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'thumbnails' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update thumbs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'thumbnails' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete thumbs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'thumbnails' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin upload site" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update site" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete site" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));