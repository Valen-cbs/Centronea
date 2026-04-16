import { ExternalLink, MapPin } from 'lucide-react';

// Link para el botón "Abrir en Maps" (Abre en una pestaña nueva directo en tu agencia)
const AGENCY_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Centronea+Automotores,+Resistencia,+Chaco&query_place_id=ChIJuV0v94gMRZQRB6HlVHLkTuY';

// Link especial para el iframe que clava el pin rojo exactamente sobre Centronea
const EMBED_MAP_URL = 'https://maps.google.com/maps?q=Centronea+Automotores,+Av.+Alvear+537,+Resistencia,+Chaco&t=&z=16&ie=UTF8&iwloc=&output=embed';

export default function LocationSidebar() {
  return (
    <aside className="order-2 xl:order-1">
      <div className="xl:sticky xl:top-32">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-panel backdrop-blur-xl sm:p-6">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-accent-200/40 blur-3xl" />

          <div className="relative space-y-5">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-700 shadow-sm">
                Ubicacion
              </span>
            </div>

            <div className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 shadow-md">
              <iframe
                title="Mapa de nuestra agencia Centronea en Resistencia, Chaco"
                src={EMBED_MAP_URL}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0 grayscale transition duration-500 ease-out group-hover:grayscale-0"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <h2 className="font-['Fraunces'] text-2xl font-semibold tracking-tight text-slate-950">
                  Nuestra Agencia
                </h2>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Av. Alvear 599
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                      Resistencia, Chaco
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={AGENCY_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-between rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-200"
              >
                <span>Abrir en Maps</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}