import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/calendly-link
 * Body: { orderId: string, orderName: string, email?: string }
 *
 * Creates a single-use Calendly scheduling link for the Visor drop-off event.
 * Called client-side after Shopify checkout completes.
 *
 * Returns: { bookingUrl: string }
 */
export async function POST(req: NextRequest) {
  const apiToken = process.env.CALENDLY_API_TOKEN?.trim();
  const eventUri = process.env.CALENDLY_DROPOFF_EVENT_URI?.trim();

  if (!apiToken || !eventUri) {
    return NextResponse.json(
      { error: "Calendly not configured" },
      { status: 503 }
    );
  }

  let body: { orderId?: string; orderName?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { orderId, orderName, email } = body;
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  try {
    const payload: Record<string, unknown> = {
      max_event_count: 1,
      owner: eventUri,
      owner_type: "EventType",
    };

    const res = await fetch("https://api.calendly.com/scheduling_links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[calendly-link] Calendly error", res.status, text);
      return NextResponse.json(
        { error: "Calendly API error", status: res.status },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { resource: { booking_url: string } };
    const bookingUrl = data.resource.booking_url;

    // Append order info as query params so Calendly prefills the "notes" field
    const url = new URL(bookingUrl);
    url.searchParams.set("a1", orderName ?? orderId);
    if (email) url.searchParams.set("email", email);

    return NextResponse.json({ bookingUrl: url.toString() });
  } catch (err) {
    console.error("[calendly-link] unexpected error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
