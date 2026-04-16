import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseConfigError } from '../lib/supabaseClient.js';
import { extractStoragePath, removeCarImages, uploadCarImages, AUTOS_BUCKET } from '../lib/storage.js';

function parseOptionalNumber(value) {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function normalizePayload(auto) {
  const precioUSD = parseOptionalNumber(auto.precio);
  const precioARS = parseOptionalNumber(auto.precio_ars);

  if (precioUSD === null && precioARS === null) {
    throw new Error('Debes completar al menos un precio en USD o ARS.');
  }

  return {
    marca: auto.marca.trim(),
    modelo: auto.modelo.trim(),
    anio: Number(auto.anio),
    precio: precioUSD,
    precio_ars: precioARS,
    descripcion: auto.descripcion.trim(),
    estado: auto.estado,
  };
}

export function useAutos() {
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAutos = useCallback(async () => {
    setLoading(true);
    setError(supabaseConfigError);

    if (supabaseConfigError || !supabase) {
      setAutos([]);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('autos')
      .select('*')
      .order('precio', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setAutos([]);
      setLoading(false);
      return;
    }

    setAutos(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAutos();
  }, [fetchAutos]);

  const createAuto = useCallback(
    async ({ values, newFiles }) => {
      if (supabaseConfigError || !supabase) {
        throw new Error(supabaseConfigError || 'No se pudo inicializar Supabase.');
      }

      setSaving(true);
      setError('');

      let uploadedUrls = [];

      try {
        uploadedUrls = await uploadCarImages(newFiles);

        const payload = {
          ...normalizePayload(values),
          fotos: uploadedUrls,
        };

        const { error: insertError } = await supabase.from('autos').insert(payload);

        if (insertError) {
          throw insertError;
        }

        await fetchAutos();
      } catch (operationError) {
        if (uploadedUrls.length) {
          await removeCarImages(uploadedUrls).catch(() => undefined);
        }
        setError(operationError.message ?? 'No se pudo crear el vehículo.');
        throw operationError;
      } finally {
        setSaving(false);
      }
    },
    [fetchAutos],
  );

  const updateAuto = useCallback(
    async ({ id, values, existingPhotos, removedPhotos, newFiles }) => {
      if (supabaseConfigError || !supabase) {
        throw new Error(supabaseConfigError || 'No se pudo inicializar Supabase.');
      }

      setSaving(true);
      setError('');

      let uploadedUrls = [];

      try {
        uploadedUrls = await uploadCarImages(newFiles);
        const finalPhotos = [...existingPhotos, ...uploadedUrls];

        const payload = {
          ...normalizePayload(values),
          fotos: finalPhotos,
        };

        const { error: updateError } = await supabase
          .from('autos')
          .update(payload)
          .eq('id', id);

        if (updateError) {
          throw updateError;
        }

        if (removedPhotos.length) {
          await removeCarImages(removedPhotos).catch(() => undefined);
        }

        await fetchAutos();
      } catch (operationError) {
        if (uploadedUrls.length) {
          await removeCarImages(uploadedUrls).catch(() => undefined);
        }
        setError(operationError.message ?? 'No se pudo actualizar el vehículo.');
        throw operationError;
      } finally {
        setSaving(false);
      }
    },
    [fetchAutos],
  );

  const deleteAuto = useCallback(
    async (auto) => {
      if (supabaseConfigError || !supabase) {
        throw new Error(supabaseConfigError || 'No se pudo inicializar Supabase.');
      }

      setSaving(true);
      setError('');

      try {
        const { error: deleteError } = await supabase.from('autos').delete().eq('id', auto.id);

        if (deleteError) {
          throw deleteError;
        }

        if (auto.fotos?.length) {
          const removablePaths = auto.fotos.map(extractStoragePath).filter(Boolean);

          if (removablePaths.length) {
            const { error: removeError } = await supabase.storage
              .from(AUTOS_BUCKET)
              .remove(removablePaths);

            if (removeError) {
              setError(
                'El vehículo se eliminó de la base de datos, pero algunas imágenes no pudieron borrarse del bucket.',
              );
            }
          }
        }

        await fetchAutos();
      } catch (operationError) {
        setError(operationError.message ?? 'No se pudo eliminar el vehículo.');
        throw operationError;
      } finally {
        setSaving(false);
      }
    },
    [fetchAutos],
  );

  return {
    autos,
    loading,
    saving,
    error,
    refetch: fetchAutos,
    createAuto,
    updateAuto,
    deleteAuto,
  };
}
