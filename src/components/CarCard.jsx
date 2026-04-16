import { ChevronLeft, ChevronRight, ImageIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import PriceDisplay from './PriceDisplay.jsx';

export default function CarCard({ auto }) {
  const photos =
    auto.fotos?.length
      ? auto.fotos
      : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'];
  const detailPath = `/auto/${auto.id}`;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setCurrentImageIndex(0);
    setIsModalOpen(false);
  }, [auto.id]);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }

      if (event.key === 'ArrowLeft' && photos.length > 1) {
        setCurrentImageIndex((previous) => {
          const nextIndex = previous === 0 ? photos.length - 1 : previous - 1;
          setActiveIndex(nextIndex);
          return nextIndex;
        });
      }

      if (event.key === 'ArrowRight' && photos.length > 1) {
        setCurrentImageIndex((previous) => {
          const nextIndex = previous === photos.length - 1 ? 0 : previous + 1;
          setActiveIndex(nextIndex);
          return nextIndex;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, photos.length]);

  const hasMultiplePhotos = photos.length > 1;
  const activePhoto = photos[activeIndex] ?? photos[0];
  const currentPhoto = photos[currentImageIndex] ?? photos[0];

  const selectImage = (index) => {
    setActiveIndex(index);
    setCurrentImageIndex(index);
  };

  const openModal = (index = activeIndex) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    const nextIndex = activeIndex === 0 ? photos.length - 1 : activeIndex - 1;

    selectImage(nextIndex);
  };

  const goToNext = () => {
    const nextIndex = activeIndex === photos.length - 1 ? 0 : activeIndex + 1;

    selectImage(nextIndex);
  };

  const goToPreviousInModal = () => {
    const nextIndex = currentImageIndex === 0 ? photos.length - 1 : currentImageIndex - 1;

    selectImage(nextIndex);
  };

  const goToNextInModal = () => {
    const nextIndex = currentImageIndex === photos.length - 1 ? 0 : currentImageIndex + 1;

    selectImage(nextIndex);
  };

  return (
    <>
      <article className="glass-panel group overflow-hidden shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
        <div className="relative overflow-hidden">
          <button
            type="button"
            onClick={() => openModal(activeIndex)}
            aria-label={`Abrir galeria de ${auto.marca} ${auto.modelo}`}
            aria-haspopup="dialog"
            className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2"
          >
            <img
              src={activePhoto}
              alt={`${auto.marca} ${auto.modelo}`}
              className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-900 shadow">
              {auto.estado}
            </div>
            <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur">
              <ImageIcon className="h-3.5 w-3.5" />
              {activeIndex + 1}/{photos.length}
            </div>
          </button>

          {hasMultiplePhotos && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Ver foto anterior"
                className="gallery-control left-3"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Ver foto siguiente"
                className="gallery-control right-3"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {auto.marca}
              </p>
              <Link
                to={detailPath}
                className="mt-1 inline-flex text-2xl font-semibold text-slate-900 transition hover:text-brand-700"
              >
                {auto.modelo}
              </Link>
            </div>
            <div className="rounded-2xl bg-brand-50 px-3 py-2 text-center ring-1 ring-brand-100">
              <p className="text-xs font-medium text-slate-500">Año</p>
              <p className="text-lg font-semibold text-brand-900">{auto.anio}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <p
              className={`text-sm leading-6 text-slate-600 transition-all ${
                isDescriptionExpanded ? '' : 'line-clamp-3'
              }`}
            >
              {auto.descripcion}
            </p>
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 focus:outline-none focus:underline"
            >
              {isDescriptionExpanded ? 'Ocultar detalles' : 'Leer descripción completa...'}
            </button>
          </div>

          {hasMultiplePhotos && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {photos.map((photo, index) => (
                <button
                  key={`${auto.id}-photo-${index}`}
                  type="button"
                  aria-label={`Ver foto ${index + 1}`}
                  onClick={() => selectImage(index)}
                  className={`gallery-thumb ${
                    activeIndex === index
                      ? 'border-accent-500 ring-2 ring-accent-200'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`${auto.marca} ${auto.modelo} - Foto ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-slate-100 pt-4">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Precio</p>
              <PriceDisplay precioUSD={auto.precio} precioARS={auto.precio_ars} />

              <Link to={detailPath} className="btn-secondary w-full">
                Ver detalle
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* MODAL CON PORTAL PARA EVITAR CONFLICTOS DE Z-INDEX */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 px-4 py-6 backdrop-blur-sm sm:px-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Galeria de ${auto.marca} ${auto.modelo}`}
            onClick={closeModal}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Cerrar galeria"
              className="absolute right-4 top-4 z-50 rounded-full border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="relative flex w-full max-w-6xl items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              {hasMultiplePhotos && (
                <button
                  type="button"
                  onClick={goToPreviousInModal}
                  aria-label="Imagen anterior"
                  className="absolute left-0 z-10 rounded-full border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:left-4"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <img
                src={currentPhoto}
                alt={`${auto.marca} ${auto.modelo} - Foto ${currentImageIndex + 1}`}
                className="max-h-[85vh] w-full max-w-[min(92vw,1100px)] rounded-3xl object-contain shadow-2xl"
              />

              {hasMultiplePhotos && (
                <button
                  type="button"
                  onClick={goToNextInModal}
                  aria-label="Imagen siguiente"
                  className="absolute right-0 z-10 rounded-full border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-4"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
