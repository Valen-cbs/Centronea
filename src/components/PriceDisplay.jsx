function hasNumericValue(value) {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return false;
  }

  return Number.isFinite(Number(value));
}

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function PriceDisplay({
  precioUSD,
  precioARS,
  className = '',
  primaryClassName = 'text-2xl font-bold text-accent-600',
  secondaryClassName = 'text-sm font-medium text-slate-500',
  emptyClassName = 'text-sm font-medium text-slate-500',
}) {
  const hasUSD = hasNumericValue(precioUSD);
  const hasARS = hasNumericValue(precioARS);

  if (!hasUSD && !hasARS) {
    return <p className={`${emptyClassName} ${className}`.trim()}>Consultar</p>;
  }

  if (hasUSD && hasARS) {
    return (
      <div className={`space-y-1 ${className}`.trim()}>
        <p className={primaryClassName}>US$ {formatPrice(precioUSD)}</p>
        <p className={secondaryClassName}>$ {formatPrice(precioARS)} ARS</p>
      </div>
    );
  }

  if (hasUSD) {
    return <p className={`${primaryClassName} ${className}`.trim()}>US$ {formatPrice(precioUSD)}</p>;
  }

  return <p className={`${primaryClassName} ${className}`.trim()}>$ {formatPrice(precioARS)} ARS</p>;
}
