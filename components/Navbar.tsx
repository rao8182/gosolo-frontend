"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Check if user is admin via API
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const res = await fetch("/api/admin/check");
        const data = await res.json();
        setIsAdmin(data.isAdmin === true);
      } catch {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  // Check if link is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const linkClass = (path: string) => 
    `hover:text-primary transition-colors ${isActive(path) ? "text-primary font-semibold" : "text-gray-300"}`;

  return (
    <nav className="fixed top-0 w-full z-50 pt-4 sm:pt-6 px-4 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display font-bold text-xl sm:text-2xl tracking-tighter uppercase italic text-white">
            GO SOLO
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:block">
          <div className="p-px rounded-full bg-linear-to-r from-primary/50 to-secondary/50">
            <div className="bg-[#1E1E1E] glass-panel rounded-full px-6 xl:px-8 py-3 flex items-center gap-4 xl:gap-6 text-sm font-medium">
              
              <Link href="/" className={linkClass("/")}>
                Home
              </Link>

              <Link href="/shop" className={linkClass("/shop")} data-testid="nav-shop-link">
                Shop
              </Link>

              <Link href="/about" className={linkClass("/about")}>
                About
              </Link>

              <SignedIn>
                <Link href="/orders" className={linkClass("/orders")} data-testid="nav-orders-link">
                  My Orders
                </Link>
              </SignedIn>

              {/* Admin Link - Only for admins */}
              {isAdmin && (
                <div className="relative group">
                  <button className={`flex items-center gap-1 ${isActive("/admin") ? "text-primary font-semibold" : "text-gray-300"} hover:text-primary transition-colors`}>
                    Admin
                    <span className="material-icons-round text-sm">expand_more</span>
                  </button>
                  <div className="absolute top-full left-0 mt-2 py-2 w-40 rounded-lg bg-[#1E1E1E] border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/admin/orders"
                      className="block px-4 py-2 hover:bg-white/10 transition-colors text-gray-300"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/admin/products"
                      className="block px-4 py-2 hover:bg-white/10 transition-colors text-gray-300"
                    >
                      Products
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="block px-4 py-2 hover:bg-white/10 transition-colors text-gray-300"
                    >
                      Settings
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Cart Button */}
          <Link 
            href="/cart"
            className={`relative px-2 sm:px-3 py-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1 sm:gap-2 ${isActive("/cart") ? "text-primary" : "text-white"}`}
            data-testid="nav-cart-button"
          >
            <span className="material-icons-round text-xl">shopping_cart</span>
            <span className="text-sm font-medium hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="bg-primary text-black text-xs font-bold rounded-full px-1.5 sm:px-2 py-0.5 min-w-[18px] sm:min-w-[20px] text-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Auth Buttons */}
          <SignedOut>
            <Link
              href="/sign-in"
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary text-black hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              <span className="material-icons-round text-sm">person</span>
              Sign In
            </Link>
          </SignedOut>
          
          <SignedIn>
            <button
              onClick={() => signOut()}
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
            >
              <span className="material-icons-round text-sm">logout</span>
              Sign Out
            </button>
          </SignedIn>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <span className="material-icons-round text-xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4">
          <div className="bg-[#1E1E1E] rounded-2xl p-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors ${isActive("/") ? "text-primary bg-white/5" : "text-gray-300"}`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors ${isActive("/shop") ? "text-primary bg-white/5" : "text-gray-300"}`}
            >
              Shop
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors ${isActive("/about") ? "text-primary bg-white/5" : "text-gray-300"}`}
            >
              About
            </Link>
            
            <SignedIn>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors ${isActive("/orders") ? "text-primary bg-white/5" : "text-gray-300"}`}
              >
                My Orders
              </Link>
            </SignedIn>

            {/* Auth Section */}
            <div className="border-t border-white/10 pt-2 mt-2">
              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
                >
                  <span className="material-icons-round text-sm mr-2 align-middle">person</span>
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                >
                  Create Account
                </Link>
              </SignedOut>
              
              <SignedIn>
                {user && (
                  <div className="py-2 px-4 text-sm text-gray-400">
                    {user.primaryEmailAddress?.emailAddress}
                  </div>
                )}
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
                >
                  <span className="material-icons-round text-sm mr-2 align-middle">logout</span>
                  Sign Out
                </button>
              </SignedIn>
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div className="border-t border-white/10 pt-2 mt-2">
                <p className="px-4 py-1 text-xs text-gray-500 uppercase">Admin</p>
                <Link
                  href="/admin/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors ${isActive("/admin/orders") ? "text-primary bg-white/5" : "text-gray-300"}`}
                >
                  Manage Orders
                </Link>
                <Link
                  href="/admin/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors ${isActive("/admin/products") ? "text-primary bg-white/5" : "text-gray-300"}`}
                >
                  Manage Products
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors ${isActive("/admin/settings") ? "text-primary bg-white/5" : "text-gray-300"}`}
                >
                  Admin Settings
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
