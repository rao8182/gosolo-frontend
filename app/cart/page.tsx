"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const router = useRouter();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-32 px-6 bg-black text-white">
        <p className="text-center text-gray-400">
          Your cart is empty.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">
                  ₹{item.price}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity - 1)
                }
                className="px-3 py-1 border rounded"
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
                className="px-3 py-1 border rounded"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 ml-4"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-6 border-t border-white/10">
          <p className="text-xl font-semibold">
            Total: ₹{total}
          </p>

          <button
            onClick={() => router.push("/checkout")}
            className="px-6 py-3 rounded-full bg-primary text-black font-medium hover:opacity-90 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  );
}
