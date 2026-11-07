/**
 * RETRO QATAR - Base64 to Supabase Storage Migration Utility
 * Converts all legacy Base64 data URLs in PostgreSQL into real image files in Supabase Storage ('retro-images')
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kqtkwwgxmsnjqwylsopq.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_f-3DLGzU9xi5NpB_eWhnYg_Vbl7Akr7';

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
    ext: (match[1].split('/')[1] || 'webp').replace('jpeg', 'jpg'),
  };
}

async function uploadDataUrlToStorage(dataUrl, pathPrefix) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  const filePath = `${pathPrefix}.${parsed.ext}`;
  const { error: upErr } = await sb.storage
    .from('retro-images')
    .upload(filePath, parsed.buffer, {
      contentType: parsed.contentType,
      upsert: true,
    });

  if (upErr) {
    console.warn(`Failed to upload ${filePath}:`, upErr.message);
    return null;
  }

  const { data: pubData } = sb.storage.from('retro-images').getPublicUrl(filePath);
  return pubData?.publicUrl || null;
}

async function migrateNestedValue(value, pathPrefix) {
  if (typeof value === 'string') {
    if (value.startsWith('data:image/')) {
      const publicUrl = await uploadDataUrlToStorage(value, pathPrefix);
      if (publicUrl) {
        console.log(`  Migrated nested image -> ${publicUrl}`);
        return { value: publicUrl, modified: true };
      }
    }
    return { value, modified: false };
  }

  if (Array.isArray(value)) {
    let anyModified = false;
    const nextArr = [];
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const itemId = (item && typeof item === 'object' && (item.id || item.key || i)) || i;
      const safeId = String(itemId).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const res = await migrateNestedValue(item, `${pathPrefix}_${safeId}`);
      nextArr.push(res.value);
      if (res.modified) anyModified = true;
    }
    return { value: nextArr, modified: anyModified };
  }

  if (value && typeof value === 'object') {
    let anyModified = false;
    const nextObj = {};
    for (const [k, v] of Object.entries(value)) {
      const safeKey = k.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const res = await migrateNestedValue(v, `${pathPrefix}_${safeKey}`);
      nextObj[k] = res.value;
      if (res.modified) anyModified = true;
    }
    return { value: nextObj, modified: anyModified };
  }

  return { value, modified: false };
}

async function migrate() {
  console.log('Ensuring Supabase Storage buckets exist...');
  const { data: buckets, error: bErr } = await sb.storage.listBuckets();
  if (bErr) {
    console.error('Cannot access Supabase Storage:', bErr);
    return;
  }

  for (const bucketName of ['retro-images', 'media', 'products']) {
    if (!buckets.some((b) => b.id === bucketName)) {
      const { error: createErr } = await sb.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760,
      });
      if (createErr) {
        console.warn(`Could not create bucket ${bucketName}:`, createErr.message);
      } else {
        console.log(`Created bucket "${bucketName}"!`);
      }
    }
  }

  console.log('Bucket "retro-images" is ready! Checking products for Base64 images...');

  // 1. Migrate Products
  const { data: products, error: pErr } = await sb
    .from('products')
    .select('id, sku, name_en, image_url');

  if (pErr) {
    console.error('Failed to fetch products:', pErr);
    return;
  }

  const base64Products = (products || []).filter(
    (p) => p.image_url && p.image_url.startsWith('data:')
  );
  console.log(`Found ${base64Products.length} products with Base64 images to migrate.`);

  let pSuccess = 0;
  for (const prod of base64Products) {
    const cleanSku = (prod.sku || prod.id).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const newUrl = await uploadDataUrlToStorage(prod.image_url, `products/${cleanSku}`);
    if (!newUrl) continue;

    const { error: dbErr } = await sb
      .from('products')
      .update({ image_url: newUrl, updated_at: new Date().toISOString() })
      .eq('id', prod.id);

    if (dbErr) {
      console.warn(`Failed to update DB for ${prod.sku}:`, dbErr.message);
    } else {
      pSuccess++;
      console.log(`[${pSuccess}/${base64Products.length}] Migrated ${prod.sku} -> ${newUrl}`);
    }
  }

  // 2. Migrate store_settings recursively (retro_brand_logos, retro_custom_brands, retro_pc_categories, etc.)
  console.log('Checking store_settings for Base64 entries...');
  const { data: settings } = await sb.from('store_settings').select('*');
  for (const row of settings || []) {
    console.log(`Inspecting store_settings row: ${row.id}`);
    if (!row.data) continue;
    const res = await migrateNestedValue(row.data, `settings/${row.id}`);
    if (res.modified) {
      const { error: upSetErr } = await sb
        .from('store_settings')
        .update({ data: res.value, updated_at: new Date().toISOString() })
        .eq('id', row.id);
      if (upSetErr) {
        console.error(`Failed to update store_settings row ${row.id}:`, upSetErr.message);
      } else {
        console.log(`Updated store_settings row: ${row.id}`);
      }
    }
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
