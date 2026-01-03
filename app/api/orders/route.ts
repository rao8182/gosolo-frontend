export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      console.log("ORDER BODY RECEIVED:", body);
  
      const { items, totalAmount } = body;
  
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200 }
      );
    } catch (err) {
      console.error("ORDER API CRASH:", err);
      return new Response("error", { status: 500 });
    }
  }
  