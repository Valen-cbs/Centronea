import { ArrowLeft, CalendarDays, ImageIcon, MessageCircle, Tag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import PriceDisplay from '../components/PriceDisplay.jsx';
import { useAutoDetail } from '../hooks/useAutoDetail.js';

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80';

function buildWhatsappHref(auto, currentUrl) {
  const message = `Hola Centronea, me interesa consultar por el estado y disponibilidad de este auto: ${auto.marca} ${auto.modelo} ${auto.anio}. URL: ${currentUrl}`;
  return `https://wa.me/543624966677?text=${encodeURIComponent(message)}`;
}

function DetailSkeleton() {
  return (
    <div className="section-shell space-y-8">
      <div className="h-6 w-40 rounded-full bg-slate-200 skeleton" />

      <section className="glass-panel overflow-hidden p-4 shadow-md sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-[2rem] bg-slate-200 skeleton" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-[4/3] rounded-2xl bg-slate-200 skeleton" />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="h-5 w-24 rounded-full bg-slate-200 skeleton" />
            <div className="h-10 w-4/5 rounded-2xl bg-slate-200 skeleton" />
            <div className="h-24 rounded-[2rem] bg-slate-200 skeleton" />
            <div className="h-14 rounded-2xl bg-slate-200 skeleton" />
            <div className="h-40 rounded-[2rem] bg-slate-200 skeleton" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CarDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { auto, loading, error } = useAutoDetail(id);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [auto?.id]);

  const photos = auto?.fotos?.length ? auto.fotos : [FALLBACK_PHOTO];
  const activePhoto = photos[selectedImage] ?? photos[0];
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://centronea.com${location.pathname}`;

  const whatsappHref = useMemo(() => {
    if (!auto) return '#';
    return buildWhatsappHref(auto, currentUrl);
  }, [auto, currentUrl]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <div className="section-shell space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!auto) {
    return (
      <div className="section-shell space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <EmptyState
          title="No encontramos este vehículo"
          description="Puede que haya sido removido o que el enlace ya no este disponible."
        />
      </div>
    );
  }

  return (
    <div className="section-shell space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/#catalogo"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 shadow-sm backdrop-blur">
          <ImageIcon className="h-3.5 w-3.5 text-brand-600" />
          Detalle del vehiculo
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-50 shadow-panel">
        <div className="absolute left-[-4rem] top-[-3rem] h-64 w-64 rounded-full bg-brand-200/35 blur-3xl" />
        <div className="absolute bottom-[-4rem] right-[-3rem] h-64 w-64 rounded-full bg-accent-200/30 blur-3xl" />

        <div className="relative grid gap-8 p-4 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-md">
              <img
                src={activePhoto}
                alt={`${auto.marca} ${auto.modelo}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((photo, index) => (
                <button
                  key={`${auto.id}-detail-photo-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    index === selectedImage
                      ? 'border-brand-400 ring-4 ring-brand-200/50'
                      : 'border-slate-200'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`${auto.marca} ${auto.modelo} foto ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="glass-panel space-y-5 rounded-[2rem] p-6 shadow-md">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
                  {auto.estado}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Año {auto.anio}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {auto.marca}
                </p>
                <h1 className="font-['Fraunces'] text-4xl font-semibold leading-tight text-slate-950">
                  {auto.modelo}
                </h1>
              </div>

              <div className="rounded-[2rem] border border-accent-100 bg-accent-50/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-700">
                  Precio publicado
                </p>
                <PriceDisplay
                  precioUSD={auto.precio}
                  precioARS={auto.precio_ars}
                  className="mt-2"
                  primaryClassName="text-4xl font-bold text-accent-700"
                  secondaryClassName="text-base font-medium text-slate-500"
                  emptyClassName="text-base font-medium text-slate-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Marca
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{auto.marca}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Modelo
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{auto.modelo}</p>
                </div>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-4 py-4 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                <MessageCircle className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </div>

            <div className="glass-panel rounded-[2rem] p-6 shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brand-100 p-3 text-brand-700">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Consulta directa</p>
                  <p className="text-sm text-slate-500">
                    El mensaje incluye el vehículo y la URL actual para agilizar la atención.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-6 shadow-md sm:p-8">
        <div className="max-w-4xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Descripción
          </p>
          <h2 className="font-['Fraunces'] text-3xl font-semibold text-slate-950">
            Todo lo que necesitas saber sobre esta unidad
          </h2>
          <p className="text-base leading-8 text-slate-600">
            {auto.descripcion?.trim() || 'Este vehículo no tiene una descripción cargada por el momento.'}
          </p>
        </div>
      </section>
    </div>
  );
}
