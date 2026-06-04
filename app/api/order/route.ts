import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

const deliveryRates: Record<string, number> = {
  Tanke: 800,
  "Outside Tanke": 1500,
  Lagos: 5000,
  Abuja: 5000,
  Other: 4000,
};

function generateOrderNumber() {
  return `MIMA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
}

function buildInvoiceHtml({ name, email, phone, address, location, notes, orderNumber, subtotal, deliveryFee, total, items }: any) {
  const rows = items
    .map((item: any) => `
      <tr>
        <td style="padding:10px;border:1px solid #ddd">${item.product.name}</td>
        <td style="padding:10px;border:1px solid #ddd;text-align:center">${item.quantity}</td>
        <td style="padding:10px;border:1px solid #ddd;text-align:right">NGN ${item.product.price.toLocaleString()}</td>
      </tr>
    `)
    .join("");

  return `
  <html>
    <body style="font-family:Arial,Helvetica,sans-serif;color:#111;background:#f8f8f8;padding:24px">
      <div style="max-width:720px;margin:0 auto;background:#fff;padding:32px;border-radius:24px;box-shadow:0 20px 80px rgba(15,23,42,0.12)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:32px">
          <div>
            <h1 style="margin:0;font-size:28px;color:#111">Mimaskollections</h1>
            <p style="margin:6px 0 0;color:#555">Order Invoice</p>
          </div>
          <div style="width:92px;height:92px;border-radius:28px;background:#111;display:flex;align-items:center;justify-content:center">
            <span style="color:#fff;font-weight:700;font-size:24px">M</span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1pt 1pt;gap:24px;margin-bottom:32px">
          <div>
            <p style="margin:0 0 6px;font-size:14px;color:#888">Invoice</p>
            <p style="margin:0;font-size:16px;font-weight:600;color:#111">${orderNumber}</p>
          </div>
          <div>
            <p style="margin:0 0 6px;font-size:14px;color:#888">Date</p>
            <p style="margin:0;font-size:16px;font-weight:600;color:#111">${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1pt 1pt;gap:24px;margin-bottom:32px">
          <div>
            <p style="margin:0 0 8px;font-size:14px;color:#888">Customer</p>
            <p style="margin:0;font-size:16px;color:#111">${name}</p>
            <p style="margin:6px 0 0;font-size:14px;color:#555">${email}</p>
            <p style="margin:6px 0 0;font-size:14px;color:#555">${phone}</p>
          </div>
          <div>
            <p style="margin:0 0 8px;font-size:14px;color:#888">Delivery</p>
            <p style="margin:0;font-size:16px;color:#111">${location}</p>
            <p style="margin:6px 0 0;font-size:14px;color:#555">${address}</p>
          </div>
        </div>

        <div style="margin-bottom:32px">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr>
                <th style="text-align:left;padding:12px;border:1px solid #ddd;background:#f3f3f3">Item</th>
                <th style="text-align:center;padding:12px;border:1px solid #ddd;background:#f3f3f3">Qty</th>
                <th style="text-align:right;padding:12px;border:1px solid #ddd;background:#f3f3f3">Price</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>

        <div style="display:flex;justify-content:flex-end">
          <div style="width:320px">
            <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid #eee">
              <span style="color:#555">Subtotal</span>
              <strong style="color:#111">NGN ${subtotal.toLocaleString()}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid #eee">
              <span style="color:#555">Delivery</span>
              <strong style="color:#111">NGN ${deliveryFee.toLocaleString()}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #111;font-size:18px;font-weight:700">
              <span>Total</span>
              <span>NGN ${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        ${notes ? `<div style="margin-top:32px;padding:20px;background:#f7f7f7;border-radius:18px"><p style="margin:0;font-size:14px;color:#666">Notes</p><p style="margin:8px 0 0;font-size:15px;color:#111">${notes}</p></div>` : ""}
      </div>
    </body>
  </html>
  `;
}

export async function OPTIONS(request: Request) {
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL || "*";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin') || '';
    const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL || "*";
    if (allowedOrigin !== "*" && origin !== allowedOrigin) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, address, location, notes, items, total } = body;

    if (!name || !email || !phone || !address || !location || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required order data." }, { status: 400 });
    }

    const normalizedLocation = typeof location === "string" ? location : String(location);
    const computedDeliveryFee = deliveryRates[normalizedLocation] ?? deliveryRates.Other;
    const orderNumber = generateOrderNumber();

    // ----- Server‑side price verification -----
    const adminClient = getSupabaseAdmin();
    if (!adminClient) {
      return NextResponse.json({ error: "Supabase admin client is not configured." }, { status: 500 });
    }
    const productIds = items.map((it: any) => it.product.id);
    const { data: productRows, error: prodError } = await adminClient
      .from("products")
      .select("id,price,stock,in_stock")
      .in("id", productIds);
    if (prodError) {
      return NextResponse.json({ error: prodError.message }, { status: 500 });
    }
    const productMap = new Map(productRows.map((p: any) => [p.id, p]));
    let serverSubtotal = 0;
    for (const it of items) {
      const prod = productMap.get(it.product.id);
      if (!prod) {
        return NextResponse.json({ error: `Product ${it.product.id} not found.` }, { status: 400 });
      }
      if (!prod.in_stock || prod.stock < it.quantity) {
        return NextResponse.json({ error: `Insufficient stock for product ${it.product.id}.` }, { status: 400 });
      }
      const price = Number(prod.price);
      serverSubtotal += price * it.quantity;
      it.product.price = price;
    }
    const serverTotal = serverSubtotal + computedDeliveryFee;

    // Validate client‑provided total
    if (Number(total) !== serverTotal) {
      return NextResponse.json({ error: "Order total mismatch" }, { status: 400 });
    }

    const invoiceHtml = buildInvoiceHtml({
      name,
      email,
      phone,
      address,
      location: normalizedLocation,
      notes: notes ?? "",
      orderNumber,
      subtotal: serverSubtotal,
      deliveryFee: computedDeliveryFee,
      total: serverTotal,
      items,
    });

    let pdfBuffer: Buffer | null = null;
    try {
      const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
      const page = await browser.newPage();
      await page.setContent(invoiceHtml, { waitUntil: "networkidle0" });
      pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      await browser.close();
    } catch (err) {
      pdfBuffer = null;
    }

    const orderData = {
      order_number: orderNumber,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      location: normalizedLocation,
      notes: notes?.trim() ?? "",
      subtotal: serverSubtotal,
      delivery_fee: computedDeliveryFee,
      total: serverTotal,
      status: "Pending",
      items,
      invoice_pdf_base64: pdfBuffer ? pdfBuffer.toString("base64") : null,
    };

    const { error: insertError } = await adminClient.from("orders").insert([orderData]);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const invoiceBase64 = pdfBuffer ? pdfBuffer.toString("base64") : null;

    return NextResponse.json({ success: true, orderNumber, invoiceBase64 }, {
      headers: { "Access-Control-Allow-Origin": allowedOrigin },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to process order." }, { status: 500 });
  }
}
