-- ==============================================================================
-- RETRO QATAR - SUPABASE STORAGE BUCKET & RLS POLICIES SETUP
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kqtkwwgxmsnjqwylsopq/sql/new
-- ==============================================================================

-- 1. Create the public storage bucket 'retro-images'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'retro-images',
  'retro-images',
  true,
  52428800, -- 50MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public Read retro-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload retro-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update retro-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete retro-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow All retro-images" ON storage.objects;

-- 3. Create full public access policies (allows anon and authenticated to upload, view, edit, delete)
CREATE POLICY "Allow All retro-images"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'retro-images')
WITH CHECK (bucket_id = 'retro-images');

-- 4. Enable public read access for storage objects in retro-images bucket
GRANT ALL ON SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated, service_role;

-- 5. Helper function to ensure retro-images bucket is always healthy
CREATE OR REPLACE FUNCTION public.init_storage_bucket()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('retro-images', 'retro-images', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
  RETURN 'Bucket retro-images is ready and active!';
END;
$$;

GRANT EXECUTE ON FUNCTION public.init_storage_bucket() TO anon, authenticated, service_role;
