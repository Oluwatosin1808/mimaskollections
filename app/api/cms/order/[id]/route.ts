import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabaseClient";

export async function PATCH(request: Request, context: any) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const params = "then" in context.params ? await context.params : context.params;
  const { id } = params;
  const body = await request.json();
  const { status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "Order ID and new status are required." }, { status: 400 });
  }

  const { error } = await supabase.from("orders").update({ status }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, context: any) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const params = "then" in context.params ? await context.params : context.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
  }

  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
