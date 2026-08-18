import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-domain-never-use.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads an image file to Supabase Storage and returns the public URL.
 * Automatically tries 'media' bucket, then 'products' bucket.
 */
export async function uploadImageToSupabase(file: File, folder = 'products'): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-domain')) {
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

    console.warn('Supabase storage upload error:', err1 || err2);
    return null;
  } catch (err) {
    console.warn('Exception during image upload:', err);
    return null;
  }
}

