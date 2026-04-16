import { Search, X } from 'lucide-react';
import { useRef } from 'react';

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    // 1. Actualizamos el texto de la búsqueda
    onChange(event.target.value);

    // 2. Apenas escribe, mandamos la pantalla arriba de todo (al header)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleKeyDown = (event) => {
    // Si aprieta Enter, lo llevamos suavemente al catálogo
    if (event.key === 'Enter') {
      event.preventDefault(); 
      const catalogoSection = document.getElementById('catalogo');
      if (catalogoSection) {
        catalogoSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  const handleClear = () => {
    onChange(''); 
    inputRef.current?.focus(); 
  };

  return (
    <div className="group relative mx-auto block w-full max-w-2xl">
      <label htmlFor="search-input" className="sr-only">
        Buscar vehículos
      </label>
      
      <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-600" />

      <input
        ref={inputRef}
        id="search-input"
        type="text" 
        value={value}
        onChange={handleChange} /* Acá usamos la nueva función */
        onKeyDown={handleKeyDown}
        placeholder="Buscar por marca, modelo o año..."
        autoComplete="off"
        className="h-14 w-full rounded-full border border-slate-200 bg-white/90 pl-14 pr-12 text-base text-slate-800 shadow-md shadow-slate-900/5 backdrop-blur transition-all hover:border-slate-300 hover:shadow-lg focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Borrar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-200 duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}