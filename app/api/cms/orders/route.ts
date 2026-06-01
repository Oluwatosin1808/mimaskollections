import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    return NextResponse.json({ error: "Supabase admin client is not configured." }, { status: 500 });
  }

  const { data, error } = await adminClient
    .from("orders")
    .select("id, order_number, name, email, phone, address, location, notes, subtotal, delivery_fee, total, status, items, invoice_pdf_base64, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
