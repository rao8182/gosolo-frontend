"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Declare Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  // 🔹 RAZORPAY PAYMENT HANDLER
  const placeOrder = async () => {
    try {
      setLoading(true);

      // Step 1: Create order in backend (DB + Razorpay)
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

      const responseText = await res.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Server returned invalid response");
      }

      if (!res.ok || !data?.orderId || !data?.razorpayOrderId) {
        throw new Error(data?.error || "Order creation failed");
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay Key ID from env
        amount: data.amount * 100, // Amount in paise
        currency: data.currency,
        name: "GoSolo",
        description: "Gummies Purchase",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Clear cart
              clearCart();

              // Redirect to success page
              router.push(`/order-success?orderId=${data.orderId}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (verifyError) {
            router.push("/order-failure");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#FF6B35",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            router.push("/order-failure");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      alert(`Failed to place order: ${error.message || "Please try again"}`);
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
