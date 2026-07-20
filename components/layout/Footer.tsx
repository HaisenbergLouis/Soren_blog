"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/messages")) return null;

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 text-center text-sm text-neutral-500">
        <p>&copy; {new Date().getFullYear()} FS Blog. Built with Next.js.</p>
      </div>
    </footer>
  );
}
