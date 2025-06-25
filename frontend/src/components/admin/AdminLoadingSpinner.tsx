interface AdminLoadingSpinnerProps {
  message?: string;
}

export default function AdminLoadingSpinner({ message = "Loading..." }: AdminLoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neutral-900 dark:border-neutral-100"></div>
        <p className="text-neutral-600 dark:text-neutral-400">{message}</p>
      </div>
    </div>
  );
}
