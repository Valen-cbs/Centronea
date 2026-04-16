import { useRef } from 'react';

function formatFileSize(size) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

export default function Dropzone({
  newFiles,
  onFilesSelected,
  onRemoveNewFile,
  existingPhotos,
  onRemoveExistingPhoto,
}) {
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((file) => file.type.startsWith('image/'));

    if (validFiles.length) {
      onFilesSelected(validFiles);
    }
  };

  return (
    <div className="space-y-5">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className="rounded-3xl border border-dashed border-brand-300 bg-brand-50/80 p-6 text-center transition hover:border-accent-400 hover:bg-accent-50"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-brand-800 shadow-soft">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-[1.8]">
            <path d="M12 16V5m0 0-3.5 3.5M12 5l3.5 3.5M5 15.5v2A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5v-2" />
          </svg>
        </div>
        <p className="text-base font-semibold text-slate-900">
          Arrastra las imágenes aquí o haz clic para seleccionarlas
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Formatos recomendados: JPG, PNG o WEBP. Puedes subir varias fotos.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = '';
          }}
          className="hidden"
        />
      </div>

      {existingPhotos.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900">Fotos actuales</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {existingPhotos.map((photo) => (
              <figure key={photo} className="group relative overflow-hidden rounded-3xl">
                <img src={photo} alt="Foto actual" className="h-32 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveExistingPhoto(photo)}
                  className="absolute inset-x-3 bottom-3 rounded-2xl bg-slate-950/90 px-3 py-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                >
                  Quitar
                </button>
              </figure>
            ))}
          </div>
        </div>
      )}

      {newFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900">Nuevas fotos por subir</p>
          <div className="grid gap-3">
            {newFiles.map((file) => (
              <div
                key={file.preview}
                className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-3"
              >
                <img src={file.preview} alt={file.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveNewFile(file.preview)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
