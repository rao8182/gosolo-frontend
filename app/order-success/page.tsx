interface OrderSuccessPageProps {
    searchParams: Promise<{
      orderId?: string;
    }>;
  }
  
  export default async function OrderSuccessPage({
    searchParams,
  }: OrderSuccessPageProps) {
    const { orderId } = await searchParams; // ✅ THIS is the key fix
  
    return (
      <main className="min-h-screen pt-32 px-6 bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-green-400">
            🎉 Order Placed Successfully
          </h1>
  
          {orderId ? (
            <p className="text-gray-400">
              Order ID: <span className="text-white">{orderId}</span>
            </p>
          ) : (
            <p className="text-red-400">
              Order ID missing
            </p>
          )}
  
          <a
            href="/shop"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-primary text-black font-semibold"
          >
            Continue Shopping
          </a>
        </div>
      </main>
    );
  }
  