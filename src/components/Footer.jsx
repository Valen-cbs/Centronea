import { ExternalLink, MapPin } from 'lucide-react';

const AGENCY_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Centronea+Automotores,+Resistencia,+Chaco&query_place_id=ChIJuV0v94gMRZQRB6HlVHLkTuY';
const EMBED_MAP_URL = 'https://maps.google.com/maps?q=Centronea+Automotores,+Av.+Alvear+537,+Resistencia,+Chaco&t=&z=16&ie=UTF8&iwloc=&output=embed';

function SocialIcon({ children, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-accent-300 hover:bg-accent-50 hover:text-accent-600"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="relative z-10 mt-16 border-t border-slate-200 bg-white text-slate-900"
    >
      <div className="section-shell grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr_22rem]">
        
        {/* COLUMNA 1: Información Institucional */}
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-accent-600">
            Centronea
          </p>
          <h2 className="font-['Fraunces'] text-3xl font-semibold leading-tight text-slate-950">
            Compromiso con la Calidad y el Respaldo Institucional.
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-700">
            Nuestra gestión se basa en rigurosos estándares de inspección y una política 
            de transparencia absoluta. Proveemos soluciones automotrices confiables 
            mediante un asesoramiento integral.
          </p>
        </div>

        {/* COLUMNA 2: Tarjeta de contacto y Redes */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-800 shadow-sm self-start">
          <h3 className="mb-4 text-lg font-semibold text-slate-950">Contáctenos</h3>
          <div className="space-y-3">
            <p>Av. Alvear 599, Resistencia, Chaco</p>
            <p>+54 362 496-6677</p>
            <p>miguel.cabas@yahoo.com.ar</p>
            <p>Lunes a viernes: 8:00-12:00 | 16:00-20:00</p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <SocialIcon href="https://www.instagram.com/centronea.rcia/" label="Instagram">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm9.45 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z"/></svg>
            </SocialIcon>
            <SocialIcon href="https://facebook.com/centronea.automotores" label="Facebook">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M13.5 22v-8h2.8l.4-3h-3.2V9.2c0-.9.3-1.6 1.7-1.6H17V5a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.4V11H7.5v3h2.8v8h3.2Z"/></svg>
            </SocialIcon>
            <SocialIcon href="https://wa.me/543624966677" label="WhatsApp">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.2 4.3 4.5-1.2A10 10 0 1 0 12 2Zm0 18.1a8 8 0 0 1-4.1-1.1l-.3-.2-2.7.7.7-2.6-.2-.3A8.2 8.2 0 1 1 12 20.1Zm4.4-6.1c-.2-.1-1.5-.8-1.7-.9-.2-.1-.4-.1-.6.1l-.8.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.6-.7c.1-.2.2-.4.1-.6l-.8-1.9c-.1-.3-.3-.3-.5-.3H8.4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7a11 11 0 0 0 4.2 3.7c2.4.9 2.4.6 2.9.5.4 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>
            </SocialIcon>
          </div>
        </div>

        {/* COLUMNA 3: Mapa Integrado */}
        <div className="space-y-4">
          <div className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 shadow-sm">
            <iframe
              title="Mapa de nuestra agencia Centronea en Resistencia, Chaco"
              src={EMBED_MAP_URL}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-48 w-full border-0 grayscale transition duration-500 ease-out group-hover:grayscale-0"
            />
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Av. Alvear 599</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">Resistencia, Chaco</p>
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
    </footer>
  );
}