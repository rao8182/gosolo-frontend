"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  // 🔹 TASK 14: PLACE ORDER (DB ONLY, NO PAYMENT YET)
  const placeOrder = async () => {
    try {
      setLoading(true);
  
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          totalAmount: total,
        }),
      });
  
      // Get response text first to see what we're getting
      const responseText = await res.text();
      console.log("Response status:", res.status);
      console.log("Response text:", responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        console.error("Response was:", responseText);
        throw new Error("Server returned invalid response. Please check the console.");
      }
  
      // ❌ API failed OR orderId missing → stop
      if (!res.ok || !data?.orderId) {
        throw new Error(data?.error || "Order creation failed");
      }
  
      // ✅ Order safely created → clear cart
      clearCart();
  
      // ✅ Redirect with REAL orderId
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch (error) {
      console.error("PLACE ORDER ERROR:", error);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT: Address + Contact */}
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-3xl font-bold">Checkout</h1>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Delivery Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Full Name"
                className="bg-black border border-white/20 rounded px-4 py-3 text-white"
              />
              <input
                placeholder="Phone Number"
                className="bg-black border border-white/20 rounded px-4 py-3 text-white"
              />
            </div>

            <input
              placeholder="Email Address"
              className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white"
            />

            <textarea
              placeholder="Full Address"
              rows={4}
              className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white"
            />
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-gray-300"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-6 pt-4 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-full bg-primary text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Payment will be processed securely.
          </p>
        </div>

      </div>
    </main>
  );
}
