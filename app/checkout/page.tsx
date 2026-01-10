"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = "RAZORPAY" | "COD";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("RAZORPAY");
  const { user, isLoaded } = useUser();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Check if email is verified
  const isEmailVerified = user?.primaryEmailAddress?.verification?.status === "verified";
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-32 px-6 bg-black text-white">
        <div className="max-w-xl mx-auto text-center">
          <span className="material-icons-round text-6xl text-gray-600 mb-4 block">shopping_cart</span>
          <p className="text-gray-400 mb-4">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const placeOrder = async () => {
    // Double-check auth on the client side
    if (!user) {
      router.push("/sign-in?redirect_url=/checkout");
      return;
    }

    if (!isEmailVerified) {
      alert("Please verify your email address before placing an order.");
      return;
    }

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
          paymentMethod,
        }),
      });

      const responseText = await res.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse API response:", responseText);
        throw new Error(`Server error: ${responseText.substring(0, 200)}`);
      }

      // Handle COD orders
      if (paymentMethod === "COD") {
        if (!res.ok || !data?.orderId) {
          const errorMsg = data?.error || "Order creation failed";
          const errorDetails = data?.details || "";
          throw new Error(`${errorMsg}${errorDetails ? ": " + errorDetails : ""}`);
        }
        clearCart();
        router.push(`/order-success?orderId=${data.orderId}`);
        return;
      }

      // Handle Razorpay orders
      if (!res.ok || !data?.orderId || !data?.razorpayOrderId) {
        const errorMsg = data?.error || "Order creation failed";
        const errorDetails = data?.details || "";
        console.error("Order creation failed:", { errorMsg, errorDetails, fullResponse: data });
        throw new Error(`${errorMsg}${errorDetails ? ": " + errorDetails : ""}`);
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: data.currency,
        name: "GoSolo",
        description: "Gummies Purchase",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
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
              clearCart();
              router.push(`/order-success?orderId=${data.orderId}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (verifyError) {
            router.push("/order-failure");
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: userEmail || "",
          contact: user?.primaryPhoneNumber?.phoneNumber || "",
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

  // Loading state
  if (!isLoaded) {
    return (
      <main className="min-h-screen pt-32 px-6 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Not signed in - Show sign in prompt */}
        <SignedOut>
          <div className="max-w-xl mx-auto text-center py-12">
            <span className="material-icons-round text-6xl text-primary mb-4 block">lock</span>
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-400 mb-6">
              Please sign in to complete your purchase.
            </p>
            <SignInButton mode="modal">
              <button className="px-8 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors">
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        {/* Signed in - Show checkout */}
        <SignedIn>
          {/* Email verification warning */}
          {!isEmailVerified && (
            <div className="max-w-xl mx-auto mb-8 p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
              <div className="flex items-start gap-3">
                <span className="material-icons-round">warning</span>
                <div>
                  <p className="font-semibold">Email Verification Required</p>
                  <p className="text-sm mt-1">
                    Please verify your email address ({userEmail}) before placing an order.
                    Check your inbox for a verification link from Clerk.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* LEFT: Delivery Details */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>

              {/* User Info Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-icons-round text-primary">account_circle</span>
                  <div>
                    <p className="font-semibold">{user?.fullName || "Guest"}</p>
                    <p className="text-sm text-gray-400">{userEmail}</p>
                  </div>
                  {isEmailVerified && (
                    <span className="ml-auto px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-medium">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold">Delivery Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Full Name"
                    defaultValue={user?.fullName || ""}
                    className="bg-black border border-white/20 rounded px-4 py-3 text-white w-full"
                  />
                  <input
                    placeholder="Phone Number"
                    defaultValue={user?.primaryPhoneNumber?.phoneNumber || ""}
                    className="bg-black border border-white/20 rounded px-4 py-3 text-white w-full"
                  />
                </div>

                <input
                  placeholder="Email Address"
                  defaultValue={userEmail || ""}
                  className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white"
                  readOnly
                />

                <textarea
                  placeholder="Full Address"
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white"
                />
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold">Payment Method</h2>
                
                <div className="space-y-3">
                  {/* Razorpay Option */}
                  <label 
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === "RAZORPAY" 
                        ? "border-primary bg-primary/10" 
                        : "border-white/20 hover:border-white/40"
                    }`}
                    data-testid="payment-method-razorpay"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={paymentMethod === "RAZORPAY"}
                      onChange={() => setPaymentMethod("RAZORPAY")}
                      className="w-5 h-5 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="material-icons-round text-primary">credit_card</span>
                        <span className="font-semibold">Pay Online</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Credit/Debit Card, UPI, Net Banking, Wallets
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-medium">
                      Recommended
                    </span>
                  </label>

                  {/* COD Option */}
                  <label 
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === "COD" 
                        ? "border-primary bg-primary/10" 
                        : "border-white/20 hover:border-white/40"
                    }`}
                    data-testid="payment-method-cod"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="w-5 h-5 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="material-icons-round text-yellow-500">payments</span>
                        <span className="font-semibold">Cash on Delivery</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Pay when your order arrives
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 h-fit">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-gray-300"
                  >
                    <span className="truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="flex-shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 mt-4 sm:mt-6 pt-4 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading || !isEmailVerified}
                className="w-full mt-4 sm:mt-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="place-order-btn"
              >
                {loading ? "Processing..." : !isEmailVerified ? "Verify Email First" : paymentMethod === "COD" ? "Place COD Order" : "Pay Now"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                {paymentMethod === "COD" 
                  ? "Pay cash when your order arrives at your doorstep."
                  : "Secured by Razorpay. Your payment info is safe."
                }
              </p>
            </div>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
