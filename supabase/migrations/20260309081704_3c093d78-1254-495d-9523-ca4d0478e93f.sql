
-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);
CREATE POLICY "Users can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Manga table
CREATE TABLE public.manga (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'manga',
  status text NOT NULL DEFAULT 'ongoing',
  author text NOT NULL DEFAULT '',
  artist text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  alt_titles text[] DEFAULT '{}',
  cover_url text NOT NULL DEFAULT '',
  banner_url text,
  rating numeric DEFAULT 0,
  released integer NOT NULL DEFAULT 2024,
  genres text[] DEFAULT '{}',
  content_warnings text[] DEFAULT '{}',
  views integer DEFAULT 0,
  bookmarks integer DEFAULT 0,
  pinned boolean DEFAULT false,
  featured boolean DEFAULT false,
  trending boolean DEFAULT false,
  premium boolean DEFAULT false,
  discord_webhook_url text,
  discord_channel_name text,
  discord_primary_role_id text,
  discord_secondary_role_id text,
  discord_notification_template text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
CREATE POLICY "Anyone can read manga" ON public.manga FOR SELECT USING (true);
CREATE POLICY "Admins can insert manga" ON public.manga FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update manga" ON public.manga FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete manga" ON public.manga FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Chapters table
CREATE TABLE public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manga_id uuid REFERENCES public.manga(id) ON DELETE CASCADE NOT NULL,
  number integer NOT NULL,
  title text DEFAULT '',
  pages text[] DEFAULT '{}',
  premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);
CREATE POLICY "Anyone can read chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Admins can insert chapters" ON public.chapters FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update chapters" ON public.chapters FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete chapters" ON public.chapters FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Site settings (key-value store)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now() NOT NULL
);
CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('general', '{"site_name": "Kayn Scan", "site_description": "Read the latest manga, manhwa, and manhua translations.", "footer_text": "Kayn Scan", "footer_tagline": "Your gateway to manga"}'),
  ('announcements', '{"message": ""}'),
  ('upload', '{"max_size_mb": 10, "allowed_formats": "jpg, png, webp"}');
