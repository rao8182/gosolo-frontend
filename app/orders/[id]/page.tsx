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
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "SHIPPED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "DELIVERED":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "SUCCESS":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "FAILED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
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

  // Calculate order timeline steps
  const orderSteps = [
    { status: "PENDING", label: "Order Placed", icon: "receipt_long" },
    { status: "PAID", label: "Payment Confirmed", icon: "payments" },
    { status: "SHIPPED", label: "Shipped", icon: "local_shipping" },
    { status: "DELIVERED", label: "Delivered", icon: "check_circle" },
  ];

  const statusOrder = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];
  const currentStatusIndex = statusOrder.indexOf(order.status);

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white" data-testid="order-detail-page">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          data-testid="back-to-orders-btn"
        >
          <span className="material-icons-round text-sm">arrow_back</span>
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold" data-testid="order-detail-title">Order Details</h1>
            <p className="text-gray-500 mt-1 font-mono text-sm" data-testid="order-detail-id">#{order.id}</p>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`} data-testid="order-detail-status">
            <span className="material-icons-round text-lg">{getStatusIcon(order.status)}</span>
            {order.status}
          </span>
        </div>

        <div className="space-y-6">
          {/* Order Progress (only show if not cancelled) */}
          {order.status !== "CANCELLED" && (
            <div className="p-6 rounded-xl bg-white/5 border border-white/10" data-testid="order-progress">
              <h2 className="text-lg font-semibold mb-6">Order Progress</h2>
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.max(0, (currentStatusIndex / (orderSteps.length - 1)) * 100)}%` }}
                  />
                </div>
                
                {orderSteps.map((step, index) => {
                  const isCompleted = statusOrder.indexOf(order.status) >= index;
                  const isCurrent = statusOrder.indexOf(order.status) === index;
                  
                  return (
                    <div key={step.status} className="relative flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-primary text-black' 
                          : 'bg-white/10 text-gray-500'
                      } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-black' : ''}`}>
                        <span className="material-icons-round text-sm">{step.icon}</span>
                      </div>
                      <span className={`text-xs mt-2 ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10" data-testid="order-info">
            <h2 className="text-lg font-semibold mb-4">Order Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Order ID</span>
                <p className="font-mono text-sm">{order.id}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Order Date</span>
                <p>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Order Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Payment Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(order.payment?.status || "PENDING")}`}>
                  {order.payment?.status || "PENDING"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10" data-testid="order-items">
            <h2 className="text-lg font-semibold mb-4">Items ({order.items.length})</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5"
                  data-testid={`order-item-${item.id}`}
                >
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded bg-white/5"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.product.name}</h3>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-500">₹{item.price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-primary" data-testid="order-total">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.payment && (
            <div className="p-6 rounded-xl bg-white/5 border border-white/10" data-testid="payment-info">
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-500 text-sm">Payment Provider</span>
                  <span className="font-medium">{order.payment.provider}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-500 text-sm">Razorpay Order ID</span>
                  <span className="font-mono text-sm break-all">{order.payment.razorpayOrderId}</span>
                </div>
                {order.payment.razorpayPaymentId && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-500 text-sm">Payment ID</span>
                    <span className="font-mono text-sm break-all">{order.payment.razorpayPaymentId}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-500 text-sm">Amount</span>
                  <span className="font-medium">₹{order.payment.amount.toLocaleString()} {order.payment.currency}</span>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="p-6 rounded-xl bg-primary/10 border border-primary/30" data-testid="help-section">
            <div className="flex items-start gap-4">
              <span className="material-icons-round text-primary text-2xl">help_outline</span>
              <div>
                <h3 className="font-semibold text-primary mb-1">Need Help?</h3>
                <p className="text-sm text-gray-400">
                  If you have any questions about your order, please contact our support team.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-1 text-primary text-sm mt-2 hover:underline"
                  data-testid="contact-support-btn"
                >
                  Contact Support
                  <span className="material-icons-round text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
