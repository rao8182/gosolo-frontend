"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    console.log("Fetching products...");
    fetch("/api/products")
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        console.log("Products received:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shop Our Products</h1>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No products available.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                data-testid={`product-${product.id}`}
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-4"
                  />
                )}

                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <p className="text-primary font-bold text-xl mb-4">₹{product.price}</p>
                <p className="text-gray-500 text-xs mb-4">Stock: {product.stock} available</p>

                <button
                  onClick={() => {
                    console.log("Adding to cart:", product.name);
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      imageUrl: product.imageUrl,
                      quantity: 1,
                    });
                    alert(`${product.name} added to cart!`);
                  }}
                  className="w-full py-2 rounded bg-primary text-black font-semibold hover:bg-orange-600 transition-colors"
                  data-testid={`add-to-cart-${product.id}`}
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
