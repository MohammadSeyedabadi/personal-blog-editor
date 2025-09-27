import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
 
export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 bg-white/50">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested invoice.</p>
      <Link
        href="/dashboard"
        className="mt-4 bg-gray-50 hover:bg-rose-100 text-sm font-medium hover:text-rose-600 py-2 px-4 border border-rose-100 hover:border-transparent rounded-md cursor-pointer active:scale-95"
      >
        Go Back
      </Link>
    </main>
  );
}
