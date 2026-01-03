"use client";

import Link from "next/link";

export default function OrderFailurePage() {
  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white flex items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
          <span className="material-icons-round text-5xl text-red-500">
            error_outline
          </span>
        </div>

        <h1 className="text-4xl font-bold">Payment Failed</h1>
        
        <p className="text-gray-400 text-lg">
          Your payment could not be processed. This could be due to:
        </p>

        <ul className="text-gray-400 text-left max-w-md mx-auto space-y-2">
          <li>• Payment was cancelled</li>
          <li>• Insufficient funds</li>
          <li>• Network issues</li>
          <li>• Card verification failed</li>
        </ul>

        <p className="text-gray-400">
          Don't worry, your order was not placed and no charges were made.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/cart"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            Back to Cart
          </Link>
          
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-primary hover:bg-orange-600 text-black font-semibold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
