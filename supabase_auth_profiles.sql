-- ====================================================================
-- RETRO Qatar — Supabase Auth & Profiles Schema Migration
-- Compliant with Supabase Security Checklist & Modern RLS Standards
-- ====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------
-- 1. PROFILES TABLE (Linked to auth.users)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager', 'technician', 'cashier', 'owner')),
    membership_level TEXT DEFAULT 'Bronze' CHECK (membership_level IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grant access to public schema for anon and authenticated roles
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

-- ----------------------------------------------------
-- 2. SECURE ROW LEVEL SECURITY (RLS) POLICIES
-- Note: Uses modern `TO authenticated` and avoids deprecated auth.role()
-- ----------------------------------------------------

-- Drop older policies to ensure clean state
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;

-- SELECT policy: Users can read their own profile (or all authenticated can view basic public profile info)
CREATE POLICY "Allow users to read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING ((select auth.uid()) = id);

-- INSERT policy: User can only insert their own profile
CREATE POLICY "Allow users to insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK ((select auth.uid()) = id);

-- UPDATE policy: Requires BOTH USING and WITH CHECK to prevent ownership escalation
CREATE POLICY "Allow users to update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING ((select auth.uid()) = id)
    WITH CHECK ((select auth.uid()) = id);

-- ----------------------------------------------------
-- 3. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- Automatically runs when a user registers via Supabase Auth
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
        COALESCE(NEW.raw_app_meta_data->>'role', 'customer')
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        updated_at = CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------
-- 4. HELPER: PROMOTE USER TO ADMIN
-- To promote any user to Admin securely, execute:
--
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = 'admin@retroqatar.com';
--
-- UPDATE auth.users 
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb 
-- WHERE email = 'admin@retroqatar.com';
-- ----------------------------------------------------

