"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  createdAt: string;
};

interface ShopClientProps {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shop Our Products</h1>

        {initialProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No products available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialProducts.map((product) => (
              <div
                key={product.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group"
                data-testid={`product-${product.id}`}
              >
                <Link href={`/product/${product.id}`} className="block mb-4">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                    />
                  )}
                </Link>

                <Link href={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <p className="text-primary font-bold text-xl mb-4">₹{product.price}</p>
                <p className="text-gray-500 text-xs mb-4">Stock: {product.stock} available</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        quantity: 1,
                      });
                      alert(`${product.name} added to cart!`);
                    }}
                    className="flex-1 py-2 rounded bg-primary text-black font-semibold hover:bg-orange-600 transition-colors"
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    Add to cart
                  </button>
                  <Link
                    href={`/product/${product.id}`}
                    className="px-4 py-2 rounded border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    <span className="material-icons-round text-sm">visibility</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
