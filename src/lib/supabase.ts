import { createClient } from '@supabase/supabase-js';

const isOldBlockedProject = (url?: string) => !url || url.includes('qdozfcplmd') || url.includes('vjodbkieotbmphzopgtt') || url.includes('placeholder');

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseUrl: string = isOldBlockedProject(rawUrl)
  ? 'https://kqtkwwgxmsnjqwylsopq.supabase.co'
  : (rawUrl || 'https://kqtkwwgxmsnjqwylsopq.supabase.co');

const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const supabaseAnonKey: string = (isOldBlockedProject(rawUrl) || !rawKey || rawKey.length < 20 || rawKey.includes('placeholder'))
  ? 'sb_publishable_f-3DLGzU9xi5NpB_eWhnYg_Vbl7Akr7'
  : rawKey;

export const isSupabaseConfigured: boolean = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

export function sanitizeImageUrl(url?: string | null, fallback = '/media/image53.jpeg'): string {
  if (!url || typeof url !== 'string' || url.trim() === '') return fallback;
  if (url.includes('qdozfcplmd')) return fallback;
  return url;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Compresses and converts an image File in the browser to an optimized WebP Data URL
 * (preserving aspect ratio and transparency) so cloud DB persistence is fast and lightweight.
 */
export async function compressImageFileToDataUrl(
  file: File,
  maxDim = 900,
  quality = 0.84
): Promise<string | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  return new Promise<string | null>((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      if (!rawDataUrl) {
        resolve(null);
        return;
      }
      // Keep SVG or very small files as-is
      if (file.type === 'image/svg+xml' || rawDataUrl.length < 60_000) {
        resolve(rawDataUrl);
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width >= height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const webpUrl = canvas.toDataURL('image/webp', quality);
          resolve(webpUrl && webpUrl.startsWith('data:image/') ? webpUrl : rawDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to Supabase Storage and returns the public URL (or an optimized WebP Data URL
 * that persists directly in Supabase PostgreSQL tables when Storage buckets are not provisioned).
 */
export async function uploadImageToSupabase(file: File, folder = 'products'): Promise<string | null> {
  if (!isSupabaseConfigured) {
    return compressImageFileToDataUrl(file);
  }

  try {
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const fileName = `${folder}/${Date.now()}_${cleanName}`;

    // Try 'media' bucket
    const { error: err1 } = await supabase.storage.from('media').upload(fileName, file, {
      cacheControl: '0',
      upsert: true
    });

    if (!err1) {
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      return `${data.publicUrl}?t=${Date.now()}`;
    }

    // Try 'products' bucket
    const { error: err2 } = await supabase.storage.from('products').upload(fileName, file, {
      cacheControl: '0',
      upsert: true
    });

    if (!err2) {
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return `${data.publicUrl}?t=${Date.now()}`;
    }

    return await compressImageFileToDataUrl(file);
  } catch {
    return await compressImageFileToDataUrl(file);
  }
}

