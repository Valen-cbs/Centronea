import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTable from '../components/admin/AdminTable.jsx';
import AutoForm from '../components/admin/AutoForm.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingGrid from '../components/LoadingGrid.jsx';
import { useAdminAuth } from '../hooks/useAdminAuth.js';
import { useAutos } from '../hooks/useAutos.js';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { session, logout } = useAdminAuth();
  const { autos, loading, saving, error, createAuto, updateAuto, deleteAuto } = useAutos();
  const [editingAuto, setEditingAuto] = useState(null);

  const welcomeName = useMemo(() => session?.username ?? 'Administrador', [session]);

  const handleSubmit = async ({ id, values, existingPhotos, removedPhotos, newFiles }) => {
    if (id) {
      await updateAuto({
        id,
        values,
        existingPhotos,
        removedPhotos,
        newFiles,
      });
      setEditingAuto(null);
      return;
    }

    await createAuto({
      values,
      newFiles,
    });
  };

  const handleDelete = async (auto) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar ${auto.marca} ${auto.modelo} del catálogo?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteAuto(auto);

    if (editingAuto?.id === auto.id) {
      setEditingAuto(null);
    }
  };

  return (
    <main className="section-shell space-y-8 py-10">
      <section className="glass-panel flex flex-col gap-5 px-6 py-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-brand-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-800">
            Gestión privada
          </span>
          <h1 className="mt-4 font-['Fraunces'] text-4xl font-semibold text-slate-950">
            Bienvenido, {welcomeName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Desde aquí puedes crear, editar y eliminar vehículos, además de gestionar sus
            fotografías en Supabase Storage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/', { replace: true });
          }}
          className="btn-secondary"
        >
          Cerrar sesión
        </button>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <AutoForm
        currentAuto={editingAuto}
        onCancel={() => setEditingAuto(null)}
        onSubmit={handleSubmit}
        saving={saving}
      />

      {loading ? (
        <LoadingGrid items={3} />
      ) : autos.length ? (
        <AdminTable autos={autos} onEdit={setEditingAuto} onDelete={handleDelete} saving={saving} />
      ) : (
        <EmptyState
          title="Aún no hay autos publicados"
          description="Crea el primer vehículo desde el formulario superior para que aparezca en el catálogo público."
        />
      )}
    </main>
  );
}
