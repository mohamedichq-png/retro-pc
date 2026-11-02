import { createClient } from '@supabase/supabase-js';

const isOldBlockedProject = (url?: string) => !url || url.includes('qdozfcplmd') || url.includes('placeholder');

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseUrl: string = isOldBlockedProject(rawUrl)
  ? 'https://vjodbkieotbmphzopgtt.supabase.co'
  : (rawUrl || 'https://vjodbkieotbmphzopgtt.supabase.co');

const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const supabaseAnonKey: string = (isOldBlockedProject(rawUrl) || !rawKey || rawKey.length < 20 || rawKey.includes('placeholder'))
  ? 'sb_publishable_8GU7X8Qxh9JPjcJzcKlBGQ_IeSk8N-e'
  : rawKey;

export const isSupabaseConfigured: boolean = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

export function sanitizeImageUrl(url?: string | null, fallback = '/media/image53.jpeg'): string {
  if (!url || typeof url !== 'string' || url.trim() === '') return fallback;
  if (url.includes('qdozfcplmd')) return fallback;
  return url;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads an image file to Supabase Storage and returns the public URL.
 * Automatically tries 'media' bucket, then 'products' bucket.
 */
export async function uploadImageToSupabase(file: File, folder = 'products'): Promise<string | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const fileName = `${folder}/${Date.now()}_${cleanName}`;

    // Try 'media' bucket
    const { error: err1 } = await supabase.storage.from('media').upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

    if (!err1) {
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      return data.publicUrl;
    }

    // Try 'products' bucket
    const { error: err2 } = await supabase.storage.from('products').upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

    if (!err2) {
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    }

    console.warn('Supabase storage upload unavailable or quota exceeded. Using optimized local data URL fallback:', err1 || err2);
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  } catch (err) {
    console.warn('Exception during image upload:', err);
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }
}

