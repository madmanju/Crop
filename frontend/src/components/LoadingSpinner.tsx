interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClasses[size]} border-4 border-emerald-900 border-t-emerald-400 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-emerald-400 text-sm font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
}
