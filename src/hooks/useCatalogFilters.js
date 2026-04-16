import { useDeferredValue, useMemo } from 'react';
import { matchesAutoQuery } from '../lib/fuzzySearch.js';

function getSortablePrice(value, emptyFallback) {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return emptyFallback;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : emptyFallback;
}

function sortAutos(list, sortBy) {
  const sortable = [...list];

  switch (sortBy) {
    case 'price_asc':
      return sortable.sort(
        (a, b) =>
          getSortablePrice(a.precio, Number.POSITIVE_INFINITY) -
          getSortablePrice(b.precio, Number.POSITIVE_INFINITY),
      );
    case 'year_desc':
      return sortable.sort((a, b) => Number(b.anio) - Number(a.anio));
    case 'year_asc':
      return sortable.sort((a, b) => Number(a.anio) - Number(b.anio));
    case 'price_desc':
    default:
      return sortable.sort(
        (a, b) =>
          getSortablePrice(b.precio, Number.NEGATIVE_INFINITY) -
          getSortablePrice(a.precio, Number.NEGATIVE_INFINITY),
      );
  }
}

export function useCatalogFilters(autos, filters) {
  const deferredQuery = useDeferredValue(filters.query);

  const filteredAutos = useMemo(() => {
    const ranked = autos
      .map((auto) => {
        const result = matchesAutoQuery(auto, deferredQuery);
        return {
          auto,
          matched: result.matched,
          score: result.score,
        };
      })
      .filter(({ auto, matched }) => {
        if (!matched) {
          return false;
        }

        if (filters.estado === 'Todos') {
          return true;
        }

        return auto.estado === filters.estado;
      })
      .sort((a, b) => b.score - a.score)
      .map(({ auto }) => auto);

    return sortAutos(ranked, filters.sortBy);
  }, [autos, deferredQuery, filters.estado, filters.sortBy]);

  return {
    filteredAutos,
    deferredQuery,
  };
}
