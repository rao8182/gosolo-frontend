"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-6 rounded-xl bg-white/5 border border-white/10"
          >
            {product.imageUrl && (
             <img
               src={product.imageUrl}
               alt={product.name}
               className="w-full h-48 object-contain mb-4"
             />
            )}

            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-400 mb-4">₹{product.price}</p>

            <button
              onClick={() =>
                addItem({
                  id: product.id, // ✅ REAL DB ID
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  quantity: 1,
                })
              }
              className="w-full py-2 rounded bg-primary text-black font-semibold"
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
