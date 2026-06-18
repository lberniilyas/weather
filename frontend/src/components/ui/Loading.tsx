import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-5 w-5 text-blue-500', className)}
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
      role="status"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl bg-gray-200 animate-pulse', className)} aria-hidden="true">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12 text-slate-400"
      role="status"
      aria-live="polite"
    >
      <Spinner className="h-8 w-8 text-blue-400" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
