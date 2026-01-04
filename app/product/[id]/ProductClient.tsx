"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  createdAt: string;
};

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity,
    });
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="flex items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4" data-testid="product-name">
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-white/10">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                <span className="text-gray-400">per bottle</span>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-red-500">
                  <span className="material-icons-round">error</span>
                  <span className="font-semibold">Out of Stock</span>
                </div>
              ) : product.stock < 10 ? (
                <div className="flex items-center gap-2 text-yellow-500">
                  <span className="material-icons-round">warning</span>
                  <span className="font-semibold">Only {product.stock} left in stock!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-500">
                  <span className="material-icons-round">check_circle</span>
                  <span className="font-semibold">In Stock ({product.stock} available)</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                    disabled={quantity <= 1}
                  >
                    <span className="material-icons-round">remove</span>
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                    disabled={quantity >= product.stock}
                  >
                    <span className="material-icons-round">add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-4 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="add-to-cart-button"
              >
                <span className="material-icons-round">shopping_cart</span>
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <Link
                href="/cart"
                className="px-6 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <span className="material-icons-round">shopping_bag</span>
              </Link>
            </div>

            {/* Features */}
            <div className="pt-6 space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-primary text-sm">local_shipping</span>
                <span>Free shipping on orders above ₹999</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-primary text-sm">verified</span>
                <span>100% Natural Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-primary text-sm">refresh</span>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group"
                >
                  {relatedProduct.imageUrl && (
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-contain mb-4 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{relatedProduct.name}</h3>
                  <p className="text-primary font-bold text-xl">₹{relatedProduct.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
