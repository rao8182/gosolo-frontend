"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 w-full z-50 pt-6 px-4 bg-black/80 backdrop-blur-sm">
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
                className="hover:text-primary transition-colors text-gray-300"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="hover:text-primary transition-colors text-gray-300"
                data-testid="nav-shop-link"
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
                href="/orders"
                className="hover:text-primary transition-colors text-gray-300"
                data-testid="nav-orders-link"
              >
                My Orders
              </Link>

              {/* Admin Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  onBlur={() => setTimeout(() => setAdminMenuOpen(false), 150)}
                  className="hover:text-primary transition-colors text-gray-300 flex items-center gap-1"
                  data-testid="nav-admin-btn"
                >
                  Admin
                  <span className="material-icons-round text-sm">
                    {adminMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {adminMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 py-2 w-40 rounded-lg bg-[#1E1E1E] border border-white/10 shadow-xl">
                    <Link
                      href="/admin/orders"
                      className="block px-4 py-2 hover:bg-white/10 transition-colors text-gray-300"
                      data-testid="nav-admin-orders"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/admin/products"
                      className="block px-4 py-2 hover:bg-white/10 transition-colors text-gray-300"
                      data-testid="nav-admin-products"
                    >
                      Products
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <span className="material-icons-round text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Cart Button - Visible on all screens */}
          <Link 
            href="/cart"
            className="relative px-3 py-2 rounded-full hover:bg-white/10 transition-colors text-white flex items-center gap-2"
            data-testid="nav-cart-button"
            title="View Cart"
          >
            {/* Material Icons with fallback */}
            <span className="material-icons-round text-xl" style={{ fontFamily: "'Material Icons Round', sans-serif" }}>
              shopping_cart
            </span>
            {/* Text fallback - visible if icon doesn't load */}
            <span className="text-sm font-medium hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="bg-primary text-black text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Desktop Shop Button */}
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors group text-white cursor-pointer"
            data-testid="nav-shop-button"
          >
            <span className="text-sm font-medium">Shop Now</span>
            <span className="material-icons-round text-sm text-primary group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <div className="bg-[#1E1E1E] rounded-2xl p-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
              data-testid="mobile-shop-link"
            >
              Shop
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
            >
              About
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
              data-testid="mobile-orders-link"
            >
              My Orders
            </Link>
            <div className="border-t border-white/10 pt-2 mt-2">
              <p className="px-4 py-1 text-xs text-gray-500 uppercase">Admin</p>
              <Link
                href="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
              >
                Manage Orders
              </Link>
              <Link
                href="/admin/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
              >
                Manage Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
