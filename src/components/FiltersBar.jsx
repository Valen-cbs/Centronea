const ORDER_OPTIONS = [
  { value: 'price_desc', label: 'Más caro a más barato' },
  { value: 'price_asc', label: 'Más barato a más caro' },
  { value: 'year_desc', label: 'Año más nuevo' },
  { value: 'year_asc', label: 'Año más antiguo' },
];

export default function FiltersBar({ filters, onEstadoChange, onSortChange, total }) {
  return (
    <div className="glass-panel flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">Resultados disponibles</p>
        <p className="text-sm text-slate-500">
          {total} vehículo{total === 1 ? '' : 's'} encontrados
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={filters.estado}
          onChange={(event) => onEstadoChange(event.target.value)}
          className="field-base min-w-44"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Nuevo">Nuevo</option>
          <option value="Usado">Usado</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="field-base min-w-60"
        >
          {ORDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
