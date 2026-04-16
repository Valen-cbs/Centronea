import PriceDisplay from '../PriceDisplay.jsx';

export default function AdminTable({ autos, onEdit, onDelete, saving }) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-xl font-semibold text-slate-900">Autos publicados</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona el inventario visible en el catálogo principal.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Vehículo</th>
              <th className="px-6 py-4 font-medium">Año</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Precio</th>
              <th className="px-6 py-4 font-medium">Fotos</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {autos.map((auto) => {
              return (
                <tr key={auto.id} className="align-top">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        auto.fotos?.[0] ||
                        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={`${auto.marca} ${auto.modelo}`}
                      className="h-14 w-20 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {auto.marca} {auto.modelo}
                      </p>
                      <p className="mt-1 max-w-sm text-xs text-slate-500">{auto.descripcion}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-medium text-slate-700">{auto.anio}</td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
                    {auto.estado}
                  </span>
                </td>
                
                {/* --- CELDA DE PRECIO ACTUALIZADA --- */}
                <td className="px-6 py-5">
                  <PriceDisplay
                    precioUSD={auto.precio}
                    precioARS={auto.precio_ars}
                    primaryClassName="text-base font-bold text-accent-600"
                    secondaryClassName="mt-1 text-xs font-medium text-slate-500"
                  />
                </td>
                {/* ----------------------------------- */}

                <td className="px-6 py-5 text-slate-600">{auto.fotos?.length ?? 0}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        onEdit(auto);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => onDelete(auto)}
                      className="rounded-2xl border border-rose-200 px-4 py-2 font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
