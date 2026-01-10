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
  clerkUserId?: string;
  userEmail?: string;
  payment?: {
    status: string;
    razorpayPaymentId?: string;
  };
  items?: OrderItem[];
  _count?: {
    items: number;
  };
};

const validTransitions: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        setError("Failed to load orders");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(`Order status updated to ${newStatus}`);
        fetchOrders();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.error || "Failed to update order status");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "SUCCESS":
      case "COMPLETED":
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

  const getAvailableStatuses = (currentStatus: string) => {
    return validTransitions[currentStatus] || [];
  };

  const filteredOrders = statusFilter === "ALL" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="min-h-screen pt-24 sm:pt-32 px-4 sm:px-6 bg-black text-white" data-testid="admin-orders-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Order Management</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage and track all customer orders</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors w-fit text-sm"
            >
              <span className="material-icons-round text-sm">inventory_2</span>
              Products
            </Link>
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors w-fit text-sm"
            >
              <span className="material-icons-round text-sm">settings</span>
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-2 text-sm">
            <span className="material-icons-round">check_circle</span>
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-2 text-sm">
            <span className="material-icons-round">error</span>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="hover:text-white">
              <span className="material-icons-round text-sm">close</span>
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 mb-6 sm:mb-8" data-testid="status-stats">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`p-2 sm:p-4 rounded-xl border transition-all ${
              statusFilter === "ALL" ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10 hover:border-white/30"
            }`}
          >
            <p className="text-lg sm:text-2xl font-bold">{orders.length}</p>
            <p className="text-xs sm:text-sm text-gray-400">All</p>
          </button>
          {["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-2 sm:p-4 rounded-xl border transition-all ${
                statusFilter === status ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10 hover:border-white/30"
              }`}
            >
              <p className="text-lg sm:text-2xl font-bold">{statusCounts[status] || 0}</p>
              <p className="text-xs sm:text-sm text-gray-400 truncate">{status}</p>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-icons-round text-6xl text-gray-600 mb-4 block">inbox</span>
            <p className="text-gray-400">{statusFilter === "ALL" ? "No orders yet" : `No ${statusFilter} orders`}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto rounded-xl border border-white/10" data-testid="orders-table">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Order ID</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Customer</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Amount</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Payment</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const availableStatuses = getAvailableStatuses(order.status);
                    const canUpdate = availableStatuses.length > 0;

                    return (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <Link href={`/orders/${order.id}`} className="font-mono text-sm hover:text-primary transition-colors">
                            #{order.id.substring(0, 8)}...
                          </Link>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm">{order.userEmail || "Guest"}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.payment?.status || "PENDING")}`}>
                            {order.payment?.status || "PENDING"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="py-4 px-4">
                          {canUpdate ? (
                            <select
                              value=""
                              onChange={(e) => { if (e.target.value) updateOrderStatus(order.id, e.target.value); }}
                              disabled={updating === order.id}
                              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary disabled:opacity-50 cursor-pointer min-w-[140px]"
                            >
                              <option value="">Update Status</option>
                              {availableStatuses.map((status) => (
                                <option key={status} value={status}>→ {status}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-sm text-gray-500 italic">{order.status === "DELIVERED" ? "Completed" : "No actions"}</span>
                          )}
                          {updating === order.id && <span className="ml-2 inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredOrders.map((order) => {
                const availableStatuses = getAvailableStatuses(order.status);
                const canUpdate = availableStatuses.length > 0;

                return (
                  <div key={order.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <Link href={`/orders/${order.id}`} className="font-mono text-sm hover:text-primary">
                          #{order.id.substring(0, 8)}...
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">{order.userEmail || "Guest"}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-lg">₹{order.totalAmount.toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.payment?.status || "PENDING")}`}>
                        {order.payment?.status || "PENDING"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {canUpdate ? (
                        <select
                          value=""
                          onChange={(e) => { if (e.target.value) updateOrderStatus(order.id, e.target.value); }}
                          disabled={updating === order.id}
                          className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs focus:outline-none disabled:opacity-50"
                        >
                          <option value="">Update</option>
                          {availableStatuses.map((status) => (
                            <option key={status} value={status}>→ {status}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-gray-500 italic">{order.status === "DELIVERED" ? "Done" : "-"}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-3 text-sm sm:text-base">Status Flow</h3>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">PENDING</span>
            <span className="text-gray-500">→</span>
            <span className="px-2 py-1 rounded bg-green-500/20 text-green-400">PAID</span>
            <span className="text-gray-500">→</span>
            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">SHIPPED</span>
            <span className="text-gray-500">→</span>
            <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400">DELIVERED</span>
          </div>
        </div>
      </div>
    </main>
  );
}
