"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: string;
};

interface ShopClientProps {
  initialProducts: Product[];
}

const CATEGORIES = ["All", "Gummies", "Slim Shake", "Fat Burner"];

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getDiscountedPrice = (price: number, discountPercent: number) => {
    return Math.round(price * (1 - discountPercent / 100));
  };

  const filteredProducts = selectedCategory === "All"
    ? initialProducts
    : initialProducts.filter((p) => p.category === selectedCategory);

  // Get category counts
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === "All" 
      ? initialProducts.length 
      : initialProducts.filter((p) => p.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="min-h-screen pt-24 sm:pt-32 px-4 sm:px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Shop Our Products</h1>
          
          {/* Category Filter - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-black"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
                data-testid={`category-filter-${cat.toLowerCase().replace(" ", "-")}`}
              >
                {cat} ({categoryCounts[cat]})
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter - Mobile */}
        <div className="sm:hidden mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-black"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                {cat} ({categoryCounts[cat]})
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-icons-round text-6xl text-gray-600 mb-4 block">inventory_2</span>
            <p className="text-gray-400 mb-4">No products found in this category.</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="px-6 py-2 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const hasDiscount = product.discountPercent > 0;
              const finalPrice = hasDiscount 
                ? getDiscountedPrice(product.price, product.discountPercent)
                : product.price;

              return (
                <div
                  key={product.id}
                  className="relative rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group overflow-hidden"
                  data-testid={`product-${product.id}`}
                >
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                      <span className="px-2 sm:px-3 py-1 rounded-full bg-green-500 text-black text-xs sm:text-sm font-bold">
                        {product.discountPercent}% OFF
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <span className="px-2 py-1 rounded-full bg-black/50 text-gray-300 text-xs">
                      {product.category}
                    </span>
                  </div>

                  {/* Image Container - Fixed aspect ratio, no zoom */}
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="aspect-square bg-white/5 overflow-hidden flex items-center justify-center p-4">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                    
                    {/* Price Display */}
                    <div className="mb-4">
                      {hasDiscount ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-gray-500 line-through text-base sm:text-lg">₹{product.price}</span>
                          <span className="text-primary font-bold text-lg sm:text-xl">₹{finalPrice}</span>
                          <span className="text-green-400 text-xs sm:text-sm">Save ₹{product.price - finalPrice}</span>
                        </div>
                      ) : (
                        <p className="text-primary font-bold text-lg sm:text-xl">₹{product.price}</p>
                      )}
                    </div>
                    
                    <p className="text-gray-500 text-xs mb-4">
                      {product.stock > 10 
                        ? `In Stock` 
                        : product.stock > 0 
                          ? `Only ${product.stock} left!` 
                          : "Out of Stock"}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: finalPrice,
                            imageUrl: product.imageUrl,
                            quantity: 1,
                          });
                          alert(`${product.name} added to cart!`);
                        }}
                        disabled={product.stock === 0}
                        className="flex-1 py-2 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        data-testid={`add-to-cart-${product.id}`}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to cart"}
                      </button>
                      <Link
                        href={`/product/${product.id}`}
                        className="px-3 sm:px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center"
                      >
                        <span className="material-icons-round text-sm">visibility</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
