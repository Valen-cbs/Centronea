export default function EmptyState({ title, description }) {
  return (
    <div className="glass-panel px-6 py-14 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-100 text-brand-700">
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[1.8]">
          <path d="M3 7.5h18M6 7.5 7.5 5h9L18 7.5m-12 0v9A2.5 2.5 0 0 0 8.5 19h7A2.5 2.5 0 0 0 18 16.5v-9m-7 4.5h2" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}
