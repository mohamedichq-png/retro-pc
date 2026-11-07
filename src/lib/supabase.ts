import { createBrowserClient } from '@supabase/ssr';

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

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

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
 * Uploads an image file to Supabase Storage ('retro-images') or local server (/api/upload)
 * and returns a clean, short URL (e.g. https://.../retro-images/... or /media/uploads/...).
 * Avoids storing raw Base64 data URLs so links are always short and readable.
 */
export async function uploadImageToSupabase(file: File, folder = 'products'): Promise<string | null> {
  try {
    // 1. Primary: Server-side upload (/api/upload) using privileged Supabase Storage client ('retro-images')
    if (typeof window !== 'undefined') {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          if (json.url && typeof json.url === 'string') {
            return json.url;
          }
        }
      } catch (apiErr) {
        console.warn('/api/upload warning, trying client storage:', apiErr);
      }
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const fileName = `${folder}/${Date.now()}_${cleanName}`;

    if (isSupabaseConfigured) {
      // Target primary bucket: 'retro-images'
      const { error: errRetro } = await supabase.storage.from('retro-images').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (!errRetro) {
        const { data } = supabase.storage.from('retro-images').getPublicUrl(fileName);
        return data.publicUrl;
      }

      // Secondary fallback: 'media'
      const { error: err1 } = await supabase.storage.from('media').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (!err1) {
        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        return data.publicUrl;
      }

      // Tertiary fallback: 'products'
      const { error: err2 } = await supabase.storage.from('products').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (!err2) {
        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        return data.publicUrl;
      }
    }

    // Last resort offline fallback
    const fallbackDataUrl = await compressImageFileToDataUrl(file);
    return fallbackDataUrl;
  } catch (err) {
    console.warn('uploadImageToSupabase error, attempting fallback:', err);
    try {
      return await compressImageFileToDataUrl(file);
    } catch {
      return null;
    }
  }
}

/**
 * Converts an existing Base64 Data URL ('data:image/...') into a clean, short file URL ('/media/uploads/...')
 */
export async function convertBase64ToCleanUrl(dataUrl: string, folder = 'sections'): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  if (typeof window === 'undefined') {
    return dataUrl;
  }
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, folder }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.url && typeof json.url === 'string') {
        return json.url;
      }
    }
  } catch (err) {
    console.warn('convertBase64ToCleanUrl warning:', err);
  }
  return dataUrl;
}

