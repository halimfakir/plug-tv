import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full glass py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Plug TV" width={36} height={36} />
          <span className="font-semibold text-lg">Plug TV</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-3 py-2 rounded-md bg-white/5 hover:bg-white/8">Sign in</button>
        </div>
      </div>
    </nav>
  );
}
