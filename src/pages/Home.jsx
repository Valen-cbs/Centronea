import { startTransition, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CarCard from '../components/CarCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FiltersBar from '../components/FiltersBar.jsx';
import LoadingGrid from '../components/LoadingGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useAutos } from '../hooks/useAutos.js';
import { useCatalogFilters } from '../hooks/useCatalogFilters.js';
import heroImage from '../assets/hero-car.png';

export default function Home() {
  const location = useLocation();
  const { autos, loading, error } = useAutos();
  const [filters, setFilters] = useState({
    query: '',
    estado: 'Todos',
    sortBy: 'price_desc',
  });

  const { filteredAutos, deferredQuery } = useCatalogFilters(autos, filters);

  const headlineText = useMemo(
    () => (deferredQuery ? `Resultados para "${deferredQuery}"` : 'Vehículos destacados'),
    [deferredQuery],
  );

  useEffect(() => {
    if (!location.hash) return;
    const sectionId = location.hash.replace('#', '');
    const timeoutId = window.setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
    return () => window.clearTimeout(timeoutId);
  }, [location.hash, loading]);

  return (
    <div className="section-shell space-y-12">
      
      {/* SECCIÓN HERO */}
      <section>
        <div className="glass-panel relative overflow-hidden px-6 py-10 shadow-md sm:px-8 lg:px-12">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-brand-200/40 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="space-y-6">
              <h1 className="max-w-3xl font-['Fraunces'] text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                CATÁLOGO DE AUTOS
              </h1>
              <SearchBar
                value={filters.query}
                onChange={(value) =>
                  startTransition(() => {
                    setFilters((prev) => ({ ...prev, query: value }));
                  })
                }
              />
            </div>

            <div className="relative mx-auto flex max-w-md justify-center">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-900 to-slate-900 blur-2xl opacity-15" />
              <div className="relative animate-float rounded-[2.5rem] border border-white/60 bg-white/70 p-4 shadow-panel backdrop-blur flex items-center justify-center">
                <img
                  src={heroImage}
                  alt="Logo Centronea"
                  className="h-auto w-full max-h-[200px] rounded-[2rem] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CATÁLOGO */}
      <section id="catalogo" className="scroll-mt-32 space-y-6">
        <FiltersBar
          filters={filters}
          onEstadoChange={(estado) => setFilters((prev) => ({ ...prev, estado }))}
          onSortChange={(sortBy) => setFilters((prev) => ({ ...prev, sortBy }))}
          total={filteredAutos.length}
        />

        <h2 className="text-2xl font-semibold text-slate-950">{headlineText}</h2>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingGrid />
        ) : filteredAutos.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAutos.map((auto) => (
              <CarCard key={auto.id} auto={auto} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No encontramos vehículos"
            description="Probá ajustando los filtros para obtener más resultados."
          />
        )}
      </section>
      
    </div>
  );
}