import { useEffect, useState } from 'react';
import { supabase, supabaseConfigError } from '../lib/supabaseClient.js';

export function useAutoDetail(id) {
  const [auto, setAuto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchAuto = async () => {
      setLoading(true);
      setError(supabaseConfigError);

      if (supabaseConfigError || !supabase) {
        if (!isMounted) return;
        setAuto(null);
        setLoading(false);
        return;
      }

      const normalizedId = Number.isNaN(Number(id)) ? id : Number(id);

      const { data, error: fetchError } = await supabase
        .from('autos')
        .select('*')
        .eq('id', normalizedId)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (fetchError) {
        setError(fetchError.message);
        setAuto(null);
        setLoading(false);
        return;
      }

      setAuto(data ?? null);
      setLoading(false);
    };

    fetchAuto();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return {
    auto,
    loading,
    error,
  };
}
