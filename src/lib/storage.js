import { supabase, supabaseConfigError } from './supabaseClient.js';

export const AUTOS_BUCKET = 'fotos-autos';

function buildStoragePath(file) {
  const safeName = file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .toLowerCase();

  return `autos/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
}

export async function uploadCarImages(files) {
  if (supabaseConfigError || !supabase) {
    throw new Error(supabaseConfigError || 'No se pudo inicializar Supabase.');
  }

  const uploadedUrls = [];

  for (const file of files) {
    const storagePath = buildStoragePath(file);

    const { error: uploadError } = await supabase.storage
      .from(AUTOS_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(AUTOS_BUCKET).getPublicUrl(storagePath);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
}

export function extractStoragePath(publicUrl) {
  const marker = `/storage/v1/object/public/${AUTOS_BUCKET}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return publicUrl.slice(markerIndex + marker.length);
}

export async function removeCarImages(urls = []) {
  if (supabaseConfigError || !supabase) {
    return;
  }

  const paths = urls.map(extractStoragePath).filter(Boolean);

  if (!paths.length) {
    return;
  }

  const { error } = await supabase.storage.from(AUTOS_BUCKET).remove(paths);

  if (error) {
    throw error;
  }
}
