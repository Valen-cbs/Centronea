export default function LoadingGrid({ items = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="glass-panel overflow-hidden">
          <div className="skeleton h-56 w-full" />
          <div className="space-y-4 p-5">
            <div className="skeleton h-4 w-28 rounded-full" />
            <div className="skeleton h-8 w-3/4 rounded-full" />
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton h-4 w-5/6 rounded-full" />
            <div className="skeleton h-12 w-full rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
