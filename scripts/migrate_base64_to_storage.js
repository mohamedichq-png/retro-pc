/**
 * RETRO QATAR - Base64 to Supabase Storage Migration Utility
 * Converts all legacy Base64 data URLs in PostgreSQL into real image files in Supabase Storage ('retro-images')
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kqtkwwgxmsnjqwylsopq.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_f-3DLGzU9xi5NpB_eWhnYg_Vbl7Akr7';

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
    ext: match[1].split('/')[1] || 'webp'
  };
}

async function migrate() {
  console.log('Testing storage connection to bucket: retro-images...');
  const { data: buckets, error: bErr } = await sb.storage.listBuckets();
  if (bErr) {
    console.error('Cannot access Supabase Storage:', bErr);
    return;
  }
  
  const bucketExists = buckets.some(b => b.id === 'retro-images');
  if (!bucketExists) {
    console.log('Bucket "retro-images" not yet found. Please run supabase_storage_setup.sql in your Supabase SQL Editor first.');
    return;
  }

  console.log('Bucket "retro-images" is ready! Migrating Base64 products...');

  // 1. Migrate Products
  const { data: products, error: pErr } = await sb
    .from('products')
    .select('id, sku, name_en, image_url');

  if (pErr) {
    console.error('Failed to fetch products:', pErr);
    return;
  }

  const base64Products = (products || []).filter(p => p.image_url && p.image_url.startsWith('data:'));
  console.log(`Found ${base64Products.length} products with Base64 images to migrate.`);

  let pSuccess = 0;
  for (const prod of base64Products) {
    const parsed = parseDataUrl(prod.image_url);
    if (!parsed) continue;

    const cleanSku = (prod.sku || prod.id).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filePath = `products/${cleanSku}.${parsed.ext}`;

    const { error: upErr } = await sb.storage
      .from('retro-images')
      .upload(filePath, parsed.buffer, {
        contentType: parsed.contentType,
        upsert: true,
      });

    if (upErr) {
      console.warn(`Failed to upload ${filePath}:`, upErr.message);
      continue;
    }

    const { data: pubData } = sb.storage.from('retro-images').getPublicUrl(filePath);
    const newUrl = pubData.publicUrl;

    const { error: dbErr } = await sb
      .from('products')
      .update({ image_url: newUrl, updated_at: new Date().toISOString() })
      .eq('id', prod.id);

    if (dbErr) {
      console.warn(`Failed to update DB for ${prod.sku}:`, dbErr.message);
    } else {
      pSuccess++;
      console.log(`[${pSuccess}/${base64Products.length}] Migrated ${prod.sku} -> ${filePath}`);
    }
  }

  // 2. Migrate store_settings (retro_brand_logos, etc.)
  console.log('Checking store_settings for Base64 entries...');
  const { data: settings } = await sb.from('store_settings').select('*');
  for (const row of settings || []) {
    if (!row.data || typeof row.data !== 'object') continue;
    let modified = false;
    const cleanData = Array.isArray(row.data) ? [...row.data] : { ...row.data };

    for (const [key, val] of Object.entries(cleanData)) {
      if (typeof val === 'string' && val.startsWith('data:')) {
        const parsed = parseDataUrl(val);
        if (parsed) {
          const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
          const filePath = `settings/${row.id}_${safeKey}.${parsed.ext}`;
          const { error: upErr } = await sb.storage
            .from('retro-images')
            .upload(filePath, parsed.buffer, {
              contentType: parsed.contentType,
              upsert: true,
            });
          if (!upErr) {
            const { data: pubData } = sb.storage.from('retro-images').getPublicUrl(filePath);
            cleanData[key] = pubData.publicUrl;
            modified = true;
            console.log(`Migrated setting ${row.id}.${key} -> ${filePath}`);
          }
        }
      }
    }

    if (modified) {
      await sb
        .from('store_settings')
        .update({ data: cleanData, updated_at: new Date().toISOString() })
        .eq('id', row.id);
      console.log(`Updated store_settings row: ${row.id}`);
    }
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
