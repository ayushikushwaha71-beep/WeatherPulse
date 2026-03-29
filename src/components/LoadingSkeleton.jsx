export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="skeleton-pulse h-8 w-48 rounded-lg" />
          <div className="skeleton-pulse mt-2 h-4 w-32 rounded-md" />
        </div>
        <div className="skeleton-pulse h-10 w-64 rounded-xl" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="skeleton-pulse h-3 w-20 rounded" />
            <div className="skeleton-pulse mt-3 h-8 w-24 rounded-lg" />
            <div className="skeleton-pulse mt-2 h-3 w-16 rounded" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="skeleton-pulse h-4 w-32 rounded" />
            <div className="skeleton-pulse mt-4 h-48 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
