import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (event) => {
    if (location.pathname === '/') {
      event.preventDefault(); 
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      
      window.history.replaceState(null, '', '/');
    }
  };

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleSectionNavigation = (sectionId) => {
    if (location.pathname === '/') {
      scrollToSection(sectionId);
      return;
    }

    navigate(`/#${sectionId}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Reduje el padding top en mobile (pt-2) y lo mantuve en desktop (sm:pt-4) */}
      <div className="section-shell pt-2 sm:pt-4">
        {/* Ajusté paddings internos del glass-panel */}
        <div className="glass-panel flex items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
          
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3">
            {/* Ícono más chico en mobile, vuelve a su tamaño en sm */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-white shadow-soft sm:h-12 sm:w-12 sm:rounded-2xl">
              <span className="font-['Fraunces'] text-lg font-bold sm:text-xl">C</span>
            </div>
            <div className="flex flex-col justify-center">
              {/* Título un poco más chico en mobile */}
              <p className="font-['Fraunces'] text-lg font-semibold leading-none tracking-tight text-brand-900 sm:text-2xl sm:leading-normal">
                Centronea
              </p>
              {/* Subtítulo oculto en mobile, visible en pantallas medianas o más */}
              <p className="hidden text-xs uppercase tracking-[0.28em] text-slate-500 sm:block">
                Venta de Autos
              </p>
            </div>
          </Link>

          {/* Reduje el gap entre botones en mobile */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => handleSectionNavigation('catalogo')}
              // Botones con texto y padding más sutiles en mobile
              className="rounded-full bg-brand-900 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-brand-800 sm:px-4 sm:py-2 sm:text-sm"
            >
              Catálogo
            </button>
            <button
              type="button"
              onClick={() => handleSectionNavigation('contacto')}
              // Acorté un poco el padding lateral en mobile para que entre cómodo
              className="rounded-full px-2 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-white hover:text-brand-800 sm:px-4 sm:py-2 sm:text-sm"
            >
              Contacto
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}