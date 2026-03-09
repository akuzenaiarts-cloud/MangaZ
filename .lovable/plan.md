

# Comprehensive Fix and Feature Plan

## Root Cause of All Build Errors

The Supabase database has **no tables**. The `types.ts` file shows `[_ in never]: never` for all Tables, Views, Functions, and Enums. Every `Tables<"manga">`, `Tables<"chapters">`, etc. resolves to `never`, causing all 80+ type errors. We must create the database schema first.

## Step 1: Create Database Tables via Migrations

### Migration 1: Core tables (manga, chapters, profiles, user_roles, site_settings)

```sql
-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

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
ALTER TABLE public.manga ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('general', '{"site_name": "Kayn Scan", "site_description": "Read the latest manga, manhwa, and manhua translations.", "footer_text": "Kayn Scan", "footer_tagline": "Your gateway to manga"}'),
  ('announcements', '{"message": ""}'),
  ('upload', '{"max_size_mb": 10, "allowed_formats": "jpg, png, webp"}');
```

### Migration 2: Storage bucket
Create a `manga-assets` storage bucket for covers, banners, and chapter pages.

## Step 2: Add Email Login

### Files to modify:
- **`src/contexts/AuthContext.tsx`**: Add `loginWithEmail` and `signUpWithEmail` methods to the context
- **`src/components/LoginModal.tsx`**: Add email/password form with tabs for Sign In / Sign Up, alongside existing Discord and Google buttons

### Google Login Setup Instructions
After implementing, I will provide step-by-step instructions for:
1. Creating OAuth credentials in Google Cloud Console
2. Adding the authorized redirect URL from Supabase dashboard
3. Enabling Google provider in Supabase Auth settings

## Step 3: Fix Admin Manga Section

### Add Alternative Titles field
- **`src/components/admin/MangaFormModal.tsx`**: Add an `alt_titles` array field in the "Basic Information" tab — a textarea where each line is an alternative title

### Fix overflow + change display format
- **`src/pages/AdminPanel.tsx`**: Replace the list/table layout with a **card grid** layout (like the reference image shows thumbnail + title + author). Each card shows:
  - Cover thumbnail
  - Title (truncated with tooltip on hover)
  - Author
  - Type badge, Status badge
  - View count
  - Flag icons (pinned/featured/trending)
  - Action buttons (chapters, edit, delete)
  - Cards prevent overflow by using `truncate` and fixed widths

## Step 4: Full Site Settings with Database Persistence

### New files:
- **`src/hooks/useSiteSettings.ts`**: Hook to fetch/update `site_settings` table, with React Query caching
- **`src/contexts/SiteSettingsContext.tsx`**: Context provider that makes settings available app-wide

### Modified files:
- **`src/pages/AdminPanel.tsx`** (settings tab): 
  - Show current values loaded from DB (not hardcoded defaults)
  - Add footer text + footer tagline fields
  - Add logo upload
  - Save button actually persists to `site_settings` table
  - Sections: Basic Details (site name, description, logo — show current values), Footer (footer text, tagline), Announcements, Upload Settings

- **`src/components/ui/flickering-footer.tsx`**: Read `footer_text` from site settings context instead of hardcoded "Kayn Scan"

- **`src/components/Navbar.tsx`**: Read `site_name` from settings context for branding

- **`src/components/LoginModal.tsx`**: Read `site_name` from settings context

## Step 5: Fix Remaining Type Issues

After tables are created and types regenerate, all `Tables<"manga">` and `Tables<"chapters">` references will resolve correctly, fixing all 80+ build errors automatically.

## Files Summary

| File | Action |
|------|--------|
| Database migration (SQL) | Create 6 tables + functions + RLS |
| `src/contexts/AuthContext.tsx` | Add email auth methods |
| `src/components/LoginModal.tsx` | Add email login form + use site settings |
| `src/components/admin/MangaFormModal.tsx` | Add alt_titles field |
| `src/pages/AdminPanel.tsx` | Card grid for manga, full settings with DB persistence |
| `src/hooks/useSiteSettings.ts` | New — fetch/update site_settings |
| `src/contexts/SiteSettingsContext.tsx` | New — provide settings app-wide |
| `src/components/ui/flickering-footer.tsx` | Use dynamic footer text |
| `src/components/Navbar.tsx` | Use dynamic site name |

