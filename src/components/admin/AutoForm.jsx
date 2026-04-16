import { useEffect, useMemo, useState } from 'react';
import Dropzone from './Dropzone.jsx';

const initialValues = {
  marca: '',
  modelo: '',
  anio: '',
  precio: '',
  precio_ars: '',
  descripcion: '',
  estado: 'Usado',
};

export default function AutoForm({ currentAuto, onCancel, onSubmit, saving }) {
  const [values, setValues] = useState(initialValues);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setFormError('');

    if (!currentAuto) {
      setValues(initialValues);
      setExistingPhotos([]);
      setRemovedPhotos([]);
      setNewFiles([]);
      return;
    }

    setValues({
      marca: currentAuto.marca ?? '',
      modelo: currentAuto.modelo ?? '',
      anio: currentAuto.anio ?? '',
      precio: currentAuto.precio ?? '',
      precio_ars: currentAuto.precio_ars ?? '',
      descripcion: currentAuto.descripcion ?? '',
      estado: currentAuto.estado ?? 'Usado',
    });
    setExistingPhotos(currentAuto.fotos ?? []);
    setRemovedPhotos([]);
    setNewFiles([]);
  }, [currentAuto]);

  useEffect(
    () => () => {
      newFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [newFiles],
  );

  const title = useMemo(
    () => (currentAuto ? 'Editar vehículo' : 'Publicar nuevo vehículo'),
    [currentAuto],
  );

  const handleFieldChange = (field, nextValue) => {
    setValues((previous) => ({ ...previous, [field]: nextValue }));
  };

  const handleFilesSelected = (files) => {
    const preparedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setNewFiles((previous) => [...previous, ...preparedFiles]);
  };

  const handleRemoveNewFile = (preview) => {
    setNewFiles((previous) => {
      const fileToRemove = previous.find((file) => file.preview === preview);

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      return previous.filter((file) => file.preview !== preview);
    });
  };

  const handleRemoveExistingPhoto = (photo) => {
    setExistingPhotos((previous) => previous.filter((item) => item !== photo));
    setRemovedPhotos((previous) => [...previous, photo]);
  };

  const resetForm = () => {
    newFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    setValues(initialValues);
    setExistingPhotos([]);
    setRemovedPhotos([]);
    setNewFiles([]);
    setFormError('');
  };

  const parseOptionalNumber = (value) => {
    if (
      value === '' ||
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return null;
    }

    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? parsedValue : null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!values.marca || !values.modelo || !values.anio) {
      setFormError('Completa todos los campos obligatorios antes de guardar.');
      return;
    }

    const precioUSD = parseOptionalNumber(values.precio);
    const precioARS = parseOptionalNumber(values.precio_ars);

    if (precioUSD === null && precioARS === null) {
      setFormError('Debes completar al menos un precio en USD o ARS antes de guardar.');
      return;
    }

    if (existingPhotos.length === 0 && newFiles.length === 0) {
      setFormError('Debes cargar al menos una foto del vehículo.');
      return;
    }

    try {
      await onSubmit({
        id: currentAuto?.id,
        values: {
          ...values,
          precio: precioUSD,
          precio_ars: precioARS,
        },
        existingPhotos,
        removedPhotos,
        newFiles,
      });

      resetForm();
    } catch (error) {
      setFormError(error.message ?? 'No se pudo guardar el vehículo.');
    }
  };

  return (
    <section className="glass-panel p-6">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Completa la información, arrastra las fotos y publícalo en el catálogo.
          </p>
        </div>

        {currentAuto && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar edición
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Marca</label>
            <input
              type="text"
              value={values.marca}
              onChange={(event) => handleFieldChange('marca', event.target.value)}
              className="field-base"
              placeholder="Ej.: Toyota"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Modelo</label>
            <input
              type="text"
              value={values.modelo}
              onChange={(event) => handleFieldChange('modelo', event.target.value)}
              className="field-base"
              placeholder="Ej.: Corolla Cross"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Año</label>
            <input
              type="number"
              min="1900"
              max="2099"
              value={values.anio}
              onChange={(event) => handleFieldChange('anio', event.target.value)}
              className="field-base"
              placeholder="2024"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Precio (USD) <span className="font-normal text-slate-500">- Opcional si cargas ARS</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.precio}
              onChange={(event) => handleFieldChange('precio', event.target.value)}
              className="field-base"
              placeholder="32500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Precio (ARS) <span className="font-normal text-slate-500">- Opcional si cargas USD</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={values.precio_ars}
              onChange={(event) => handleFieldChange('precio_ars', event.target.value)}
              className="field-base"
              placeholder="35000000"
            />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_220px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Descripción</label>
            <textarea
              rows="5"
              value={values.descripcion}
              onChange={(event) => handleFieldChange('descripcion', event.target.value)}
              className="field-base min-h-36 resize-y"
              placeholder="Describe el estado, equipamiento y diferenciales del vehículo."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Estado</label>
            <select
              value={values.estado}
              onChange={(event) => handleFieldChange('estado', event.target.value)}
              className="field-base"
            >
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>
        </div>

        <Dropzone
          newFiles={newFiles}
          onFilesSelected={handleFilesSelected}
          onRemoveNewFile={handleRemoveNewFile}
          existingPhotos={existingPhotos}
          onRemoveExistingPhoto={handleRemoveExistingPhoto}
        />

        {formError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Guardando...' : currentAuto ? 'Guardar cambios' : 'Publicar vehículo'}
          </button>
          <button
            type="button"
            onClick={() => {
              onCancel();
              resetForm();
            }}
            className="btn-secondary"
          >
            Limpiar formulario
          </button>
        </div>
      </form>
    </section>
  );
}
