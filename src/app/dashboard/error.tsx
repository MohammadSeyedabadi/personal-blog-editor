'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center bg-white/50 ">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 bg-gray-50 hover:bg-rose-100 text-sm font-medium hover:text-rose-600 py-2 px-4 border border-rose-100 hover:border-transparent rounded-md cursor-pointer active:scale-95"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}