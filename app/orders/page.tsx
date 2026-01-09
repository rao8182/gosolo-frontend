"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  payment?: {
    status: string;
  };
  _count?: {
    items: number;
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      fetchOrders();
    }
  }, [isLoaded]);

  const fetchOrders = async () => {
    try {
      setError(null);
      const res = await fetch("/api/orders/list");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (res.status === 401) {
        setError("Please sign in to view your orders");
      } else {
        setError("Failed to load orders. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "COMPLETED":
      case "SUCCESS":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "SHIPPED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "DELIVERED":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "CANCELLED":
      case "FAILED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
      case "COMPLETED":
      case "SUCCESS":
        return "check_circle";
      case "PENDING":
        return "schedule";
      case "SHIPPED":
        return "local_shipping";
      case "DELIVERED":
        return "inventory_2";
      case "CANCELLED":
      case "FAILED":
        return "cancel";
      default:
        return "help";
    }
  };

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
    <main className="min-h-screen pt-24 sm:pt-32 px-4 sm:px-6 bg-black text-white" data-testid="orders-page">
      <div className="max-w-6xl mx-auto">
        
        {/* Not signed in */}
        <SignedOut>
          <div className="text-center py-12">
            <span className="material-icons-round text-6xl text-primary mb-4 block">lock</span>
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-400 mb-6">Please sign in to view your orders.</p>
            <SignInButton mode="modal">
              <button className="px-8 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        {/* Signed in */}
        <SignedIn>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">My Orders</h1>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 transition-colors w-fit text-sm"
            >
              Continue Shopping
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <span className="material-icons-round text-4xl text-red-400 mb-4 block">error_outline</span>
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={fetchOrders} className="px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors">
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-icons-round text-6xl text-gray-600 mb-4 block">receipt_long</span>
              <p className="text-gray-400 mb-2 text-lg">No orders yet</p>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
              <Link href="/shop" className="inline-block px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/[0.07] transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="space-y-2 sm:space-y-3 flex-1">
                      {/* Order ID */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-500">Order</span>
                        <span className="font-mono text-xs sm:text-sm bg-white/10 px-2 py-0.5 rounded">
                          #{order.id.substring(0, 8)}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          <span className="material-icons-round text-xs sm:text-sm">{getStatusIcon(order.status)}</span>
                          {order.status}
                        </span>
                        {order.payment && (
                          <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.payment.status)}`}>
                            Payment: {order.payment.status}
                          </span>
                        )}
                      </div>

                      {/* Items & Date */}
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400">
                        {order._count && order._count.items > 0 && (
                          <span>{order._count.items} item{order._count.items > 1 ? "s" : ""}</span>
                        )}
                        <span>
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Amount and Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                      <p className="text-xl sm:text-2xl font-bold text-primary">₹{order.totalAmount.toLocaleString()}</p>
                      <span className="text-xs sm:text-sm text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1">
                        View Details
                        <span className="material-icons-round text-xs sm:text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SignedIn>
      </div>
    </main>
  );
}
