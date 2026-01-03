"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  payment?: {
    status: string;
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/list");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-500";
      case "PENDING":
        return "text-yellow-500";
      case "SHIPPED":
        return "text-blue-500";
      case "DELIVERED":
        return "text-purple-500";
      case "CANCELLED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No orders yet.</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                data-testid={`order-${order.id}`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">Order ID:</span>
                      <span className="font-mono text-sm">{order.id}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">Status:</span>
                      <span className={`font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">Payment:</span>
                      <span className={`font-semibold ${getStatusColor(order.payment?.status || "PENDING")}`}>
                        {order.payment?.status || "PENDING"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">Date:</span>
                      <span className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
