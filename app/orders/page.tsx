"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  payment?: {
    status: string;
  };
  items?: OrderItem[];
  _count?: {
    items: number;
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setError(null);
      const res = await fetch("/api/orders/list");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
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
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "SHIPPED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "DELIVERED":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return "check_circle";
      case "PENDING":
        return "schedule";
      case "SHIPPED":
        return "local_shipping";
      case "DELIVERED":
        return "inventory_2";
      case "CANCELLED":
        return "cancel";
      default:
        return "help";
    }
  };

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white" data-testid="orders-page">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" data-testid="orders-title">My Orders</h1>
          <Link
            href="/shop"
            className="px-4 py-2 rounded-full bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 transition-colors"
            data-testid="continue-shopping-btn"
          >
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12" data-testid="orders-loading">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12" data-testid="orders-error">
            <span className="material-icons-round text-4xl text-red-400 mb-4 block">error_outline</span>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors"
              data-testid="retry-btn"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12" data-testid="orders-empty">
            <span className="material-icons-round text-6xl text-gray-600 mb-4 block">receipt_long</span>
            <p className="text-gray-400 mb-2 text-lg">No orders yet</p>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors"
              data-testid="start-shopping-btn"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4" data-testid="orders-list">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/[0.07] transition-all group"
                data-testid={`order-card-${order.id}`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="space-y-3 flex-1">
                    {/* Order ID */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Order</span>
                      <span className="font-mono text-sm bg-white/10 px-2 py-0.5 rounded" data-testid={`order-id-${order.id}`}>
                        #{order.id.substring(0, 8)}
                      </span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        <span className="material-icons-round text-sm">{getStatusIcon(order.status)}</span>
                        {order.status}
                      </span>
                      {order.payment && (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.payment.status)}`}>
                          Payment: {order.payment.status}
                        </span>
                      )}
                    </div>

                    {/* Items preview */}
                    {order._count && order._count.items > 0 && (
                      <p className="text-sm text-gray-400">
                        {order._count.items} item{order._count.items > 1 ? 's' : ''}
                      </p>
                    )}

                    {/* Date */}
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Amount and Action */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                    <p className="text-2xl font-bold text-primary" data-testid={`order-amount-${order.id}`}>
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                    <span className="text-sm text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1">
                      View Details
                      <span className="material-icons-round text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </span>
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
