import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

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
      <div className="max-w-4xl mx-auto">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <span className="material-icons-round text-sm">arrow_back</span>
          Back to Orders
        </Link>

        <h1 className="text-4xl font-bold mb-8">Order Details</h1>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span className="font-mono">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Status:</span>
                <span className={`font-semibold ${getStatusColor(order.payment?.status || "PENDING")}`}>
                  {order.payment?.status || "PENDING"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Amount:</span>
                <span className="text-xl font-bold text-primary">₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order Date:</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5"
                >
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-20 object-contain rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.price}</p>
                    <p className="text-sm text-gray-400">
                      Total: ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          {order.payment && (
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Razorpay Order ID:</span>
                  <span className="font-mono text-sm">{order.payment.razorpayOrderId}</span>
                </div>
                {order.payment.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Razorpay Payment ID:</span>
                    <span className="font-mono text-sm">
                      {order.payment.razorpayPaymentId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Provider:</span>
                  <span>{order.payment.provider}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
