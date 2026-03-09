-- Fix the manga status check constraint to allow all valid status values
ALTER TABLE public.manga DROP CONSTRAINT IF EXISTS manga_status_check;
ALTER TABLE public.manga ADD CONSTRAINT manga_status_check 
  CHECK (status IN ('ongoing', 'completed', 'hiatus', 'season end', 'cancelled'));

-- Add Discord notification fields to manga table
ALTER TABLE public.manga
  ADD COLUMN IF NOT EXISTS discord_channel_name text,
  ADD COLUMN IF NOT EXISTS discord_primary_role_id text,
  ADD COLUMN IF NOT EXISTS discord_secondary_role_id text,
  ADD COLUMN IF NOT EXISTS discord_notification_template text DEFAULT 'New chapter released: {manga_title} - Chapter {chapter_number}: {chapter_title}';