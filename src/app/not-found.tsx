import Link from "next/link";
import { Scissors } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
        <Scissors size={28} />
      </span>
      <p className="mt-6 text-6xl font-black text-rose-600">404</p>
      <h1 className="mt-2 text-2xl font-bold">This page took a wrong turn</h1>
      <p className="mt-2 text-sm muted-text">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
