import { useEffect, useRef, useState } from 'react';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Upload } from 'lucide-react';

function formatFileSize(size) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function SortableExistingPhoto({ photo, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <figure
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition ${
        isDragging ? 'z-10 scale-[1.02] shadow-xl ring-2 ring-brand-300' : 'hover:-translate-y-0.5 hover:shadow-md'
      }`}
    >
      <img src={photo.url} alt="Foto existente" className="h-36 w-full object-cover" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/35 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm">
          Actual
        </span>
        <button
          type="button"
          aria-label="Reordenar foto"
          className="rounded-full border border-white/50 bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(photo)}
        className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-2xl bg-slate-950/90 px-3 py-2 text-xs font-semibold text-white opacity-0 transition hover:bg-rose-600 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Eliminar
      </button>
    </figure>
  );
}

export default function ImageManager({
  newFiles,
  onFilesSelected,
  onRemoveNewFile,
  existingPhotos,
  onRemoveExistingPhoto,
  onReorderExistingPhotos,
}) {
  const inputRef = useRef(null);
  const [orderedExistingPhotos, setOrderedExistingPhotos] = useState(existingPhotos);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    setOrderedExistingPhotos(existingPhotos);
  }, [existingPhotos]);

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((file) => file.type.startsWith('image/'));

    if (validFiles.length) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedExistingPhotos.findIndex((photo) => photo.id === active.id);
    const newIndex = orderedExistingPhotos.findIndex((photo) => photo.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const nuevoOrden = arrayMove(orderedExistingPhotos, oldIndex, newIndex);

    setOrderedExistingPhotos(nuevoOrden);
    onReorderExistingPhotos(nuevoOrden);
  };

  const handleRemoveExisting = (photo) => {
    setOrderedExistingPhotos((previous) => previous.filter((item) => item.id !== photo.id));
    onRemoveExistingPhoto(photo);
  };

  return (
    <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50/80 p-5 shadow-inner">
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
        className="rounded-[1.75rem] border border-dashed border-brand-300 bg-white p-8 text-center transition hover:border-accent-400 hover:bg-accent-50/60"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-700 shadow-sm">
          <Upload className="h-7 w-7" />
        </div>
        <p className="text-base font-semibold text-slate-900">
          Arrastra imágenes aquí o haz clic para seleccionarlas
        </p>
        <p className="mt-2 text-sm text-slate-500">
          JPG, PNG y WEBP recomendados. Puedes agregar varias fotos en una sola tanda.
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

      {newFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Archivos nuevos</p>
              <p className="text-xs text-slate-500">Se subirán cuando guardes el vehículo.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              {newFiles.length} pendientes
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {newFiles.map((file) => (
              <div
                key={file.preview}
                className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveNewFile(file.preview)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {orderedExistingPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Fotos existentes</p>
              <p className="text-xs text-slate-500">
                Arrastra para cambiar el orden visible en el catálogo.
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              {orderedExistingPhotos.length} cargadas
            </span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={orderedExistingPhotos.map((photo) => photo.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {orderedExistingPhotos.map((photo) => (
                  <SortableExistingPhoto
                    key={photo.id}
                    photo={photo}
                    onRemove={handleRemoveExisting}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </section>
  );
}
