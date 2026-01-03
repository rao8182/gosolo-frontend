"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 pt-6 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo / Home */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10">
            {/* Logo image can go here later */}
          </div>
          <span className="font-display font-bold text-2xl tracking-tighter uppercase italic text-white">
            GO SOLO
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <div className="p-px rounded-full bg-linear-to-r from-primary/50 to-secondary/50">
            <div className="bg-[#1E1E1E] glass-panel rounded-full px-8 py-3 flex items-center gap-8 text-sm font-medium">
              
              <Link
                href="/"
                className="text-primary hover:text-primary transition-colors"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="hover:text-primary transition-colors text-gray-300"
              >
                Shop
              </Link>

              <Link
                href="/about"
                className="hover:text-primary transition-colors text-gray-300"
              >
                About
              </Link>

              <Link
                href="/blog"
                className="hover:text-primary transition-colors text-gray-300"
              >
                Blog
              </Link>

              <Link
                href="/contact"
                className="hover:text-primary transition-colors text-gray-300"
              >
                Contact
              </Link>

            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
            <span className="material-icons-round text-xl">person</span>
          </button>

          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
            <span className="material-icons-round text-xl">search</span>
          </button>

          <button className="hidden sm:flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full hover:border-primary transition-colors group text-white">
            <span className="text-sm font-medium">Sign in</span>
            <span className="material-icons-round text-sm text-primary group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

      </div>
    </nav>
  );
}
