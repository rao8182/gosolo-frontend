"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";

type Product = {
  id: string;
  name: string;
  description: string;
  indications: string;
  benefits: string;
  price: number;
  discountPercent: number;
  imageUrl: string;
  images: string[];
  stock: number;
  createdAt: string;
};

interface ProductClientProps {
  product: Product;
  relatedProducts: Omit<Product, 'images' | 'indications' | 'benefits'>[];
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getDiscountedPrice = (price: number, discountPercent: number) => {
    return Math.round(price * (1 - discountPercent / 100));
  };

  const hasDiscount = product.discountPercent > 0;
  const finalPrice = hasDiscount 
    ? getDiscountedPrice(product.price, product.discountPercent)
    : product.price;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      imageUrl: product.imageUrl,
      quantity: quantity,
    });
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const isOutOfStock = product.stock === 0;
  const images = product.images.length > 0 ? product.images : [product.imageUrl];
  const currentImage = images[selectedImageIndex] || product.imageUrl;

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
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center p-4">
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-4 py-2 rounded-full bg-green-500 text-black text-lg font-bold">
                    {product.discountPercent}% OFF
                  </span>
                </div>
              )}
              <img
                src={currentImage}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                  >
                    <span className="material-icons-round">chevron_left</span>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                  >
                    <span className="material-icons-round">chevron_right</span>
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-white/5 p-1 ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
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
              {hasDiscount ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-gray-500 line-through">₹{product.price}</span>
                    <span className="text-4xl font-bold text-primary">₹{finalPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                      Save ₹{product.price - finalPrice}
                    </span>
                    <span className="text-gray-400 text-sm">per bottle</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                  <span className="text-gray-400">per bottle</span>
                </div>
              )}
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

        {/* Indications & Benefits Section */}
        {(product.indications || product.benefits) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Indications For Use */}
            {product.indications && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-icons-round text-primary">medical_information</span>
                  </span>
                  <h3 className="text-xl font-bold">Indications For Use</h3>
                </div>
                <ul className="space-y-3">
                  {product.indications.split('\n').filter(line => line.trim()).map((indication, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="material-icons-round text-primary text-sm mt-1">check_circle</span>
                      <span className="text-gray-300">{indication.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="material-icons-round text-green-500">stars</span>
                  </span>
                  <h3 className="text-xl font-bold">Benefits</h3>
                </div>
                <ul className="space-y-3">
                  {product.benefits.split('\n').filter(line => line.trim()).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="material-icons-round text-green-500 text-sm mt-1">verified</span>
                      <span className="text-gray-300">{benefit.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedHasDiscount = relatedProduct.discountPercent > 0;
                const relatedFinalPrice = relatedHasDiscount
                  ? getDiscountedPrice(relatedProduct.price, relatedProduct.discountPercent)
                  : relatedProduct.price;

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.id}`}
                    className="relative p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group"
                  >
                    {relatedHasDiscount && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-2 py-1 rounded-full bg-green-500 text-black text-xs font-bold">
                          {relatedProduct.discountPercent}% OFF
                        </span>
                      </div>
                    )}
                    {relatedProduct.imageUrl && (
                      <img
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-contain mb-4 group-hover:scale-105 transition-transform"
                      />
                    )}
                    <h3 className="text-lg font-semibold mb-2">{relatedProduct.name}</h3>
                    {relatedHasDiscount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 line-through">₹{relatedProduct.price}</span>
                        <span className="text-primary font-bold text-xl">₹{relatedFinalPrice}</span>
                      </div>
                    ) : (
                      <p className="text-primary font-bold text-xl">₹{relatedProduct.price}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
