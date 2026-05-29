import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { supabase } from "../../../lib/supabaseClient";

const deliveryRates: Record<string, number> = {
  Tanke: 800,
  "Outside Tanke": 1500,
  Lagos: 5000,
  Abuja: 5000,
  Other: 4000
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

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px">
          <div>
            <p style="margin:0 0 6px;font-size:14px;color:#888">Invoice</p>
            <p style="margin:0;font-size:16px;font-weight:600;color:#111">${orderNumber}</p>
          </div>
          <div>
            <p style="margin:0 0 6px;font-size:14px;color:#888">Date</p>
            <p style="margin:0;font-size:16px;font-weight:600;color:#111">${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px">
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, location, notes, items, subtotal, deliveryFee, total } = body;

    if (!name || !email || !phone || !address || !location || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required order data." }, { status: 400 });
    }

    const normalizedLocation = typeof location === "string" ? location : String(location);
    const computedDeliveryFee = deliveryRates[normalizedLocation] ?? deliveryRates.Other;
    const orderNumber = generateOrderNumber();

    const invoiceHtml = buildInvoiceHtml({ name, email, phone, address, location: normalizedLocation, notes: notes ?? "", orderNumber, subtotal: Number(subtotal ?? 0), deliveryFee: Number(deliveryFee ?? computedDeliveryFee), total: Number(total ?? subtotal + computedDeliveryFee), items });

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
      subtotal: Number(subtotal ?? 0),
      delivery_fee: Number(deliveryFee ?? computedDeliveryFee),
      total: Number(total ?? subtotal + computedDeliveryFee),
      status: "Pending",
      items,
      invoice_pdf_base64: pdfBuffer ? pdfBuffer.toString("base64") : null
    };

    if (!supabase) {
      return NextResponse.json({ error: "Supabase client is not configured." }, { status: 500 });
    }

    const { error: insertError } = await supabase.from("orders").insert([orderData]);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const invoiceBase64 = pdfBuffer ? pdfBuffer.toString("base64") : null;

    return NextResponse.json({ success: true, orderNumber, invoiceBase64 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to process order." }, { status: 500 });
  }
}
