"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

type Order = {
  id: string;
  order_number: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  notes: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  items: Array<{ product: { name: string; price: number }; quantity: number }>;
  invoice_pdf_base64: string | null;
  created_at: string;
};

export default function CmsOrdersPage() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [orderFilter, setOrderFilter] = useState<"All" | "Pending" | "Out for delivery">("All");
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 10;
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;

    const loadSession = async () => {
      const client = supabase!;
      const { data } = await client.auth.getSession();
      setSession(data.session);
      setAuthLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      setSession(sessionData);
      setAuthLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");
      try {
        const response = await fetch("/api/cms/orders", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error ?? "Unable to fetch orders.");
        }
        setOrders(result.orders ?? []);
      } catch (fetchError) {
        setOrdersError(fetchError instanceof Error ? fetchError.message : "Unable to fetch orders.");
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [session]);

  const handleSignOut = async () => {
    if (!supabase) return;
    const client = supabase!;
    await client.auth.signOut();
    setSession(null);
    setMessage("Signed out successfully.");
  };

  const markOrderSent = async (orderId: string) => {
    setOrdersError("");
    try {
      const response = await fetch(`/api/cms/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Out for delivery" })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Unable to update order status.");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status: "Out for delivery" } : order
        )
      );
      setMessage("Order status updated to Out for delivery.");
    } catch (updateError) {
      setOrdersError(updateError instanceof Error ? updateError.message : "Unable to update order status.");
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrdersError("");
    try {
      const response = await fetch(`/api/cms/order/${orderId}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Unable to delete order.");
      }
      setOrders((current) => current.filter((o) => o.id !== orderId));
      setMessage("Order deleted.");
    } catch (err) {
      setOrdersError(err instanceof Error ? err.message : "Unable to delete order.");
    }
  };

  const filteredOrders = orders.filter((order) => orderFilter === "All" || order.status === orderFilter);
  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  const currentOrders = filteredOrders.slice((ordersPage - 1) * ordersPerPage, ordersPage * ordersPerPage);

  if (!supabase) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-10 text-stone-200">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Supabase not configured</p>
          <p className="mt-4">Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-10 text-stone-200">Loading authentication state...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-10 shadow-soft">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Sign in required</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">You must sign in to access orders.</h1>
          <p className="mt-4 text-stone-300">
            Use the login page before managing orders.
          </p>
          <Link href="/login" className="btn btn-primary mt-8 inline-block">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gold">CMS Orders</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Order dashboard</h1>
          <p className="mt-4 max-w-3xl text-stone-300">
            Review orders end-to-end, download invoices, and update fulfillment status from one dedicated page.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className="text-sm text-stone-300">Signed in as {session.user?.email}</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/cms" className="btn btn-secondary px-4 py-2">
              CMS Home
            </Link>
            <button type="button" onClick={handleSignOut} className="btn btn-primary px-4 py-2">
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gold">Orders</p>
            <p className="mt-2 text-sm text-stone-300">Incoming orders are listed below. Filter by status and page through the latest submissions.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Pending", "Out for delivery"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setOrderFilter(status)}
                className={`rounded-2xl px-4 py-2 text-sm transition ${orderFilter === status ? "bg-gold text-black" : "bg-white/5 text-stone-300 hover:bg-white/10"}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {ordersError ? <p className="text-sm text-red-300">{ordersError}</p> : null}
        {message ? <p className="text-sm text-emerald-200">{message}</p> : null}

        {ordersLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-stone-300">Loading recent orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/60 p-6 text-stone-300">No orders found yet.</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-stone-400">
                  <th className="border-b border-white/10 px-4 py-3">Order</th>
                  <th className="border-b border-white/10 px-4 py-3">Date</th>
                  <th className="border-b border-white/10 px-4 py-3">Customer</th>
                  <th className="border-b border-white/10 px-4 py-3">Items</th>
                  <th className="border-b border-white/10 px-4 py-3">Total</th>
                  <th className="border-b border-white/10 px-4 py-3">Status</th>
                  <th className="border-b border-white/10 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-white/5 align-top">
                    <td className="px-4 py-4 font-semibold text-white">{order.order_number}</td>
                    <td className="px-4 py-4 text-stone-300">{new Date(order.created_at).toLocaleString()}</td>
                    <td className="px-4 py-4 text-stone-300">
                      <div>{order.name}</div>
                      <div className="text-xs text-stone-500">{order.email}</div>
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-stone-400">
                            {it.quantity} × {it.product?.name ?? "Unknown"} — NGN {Number(it.product?.price ?? 0).toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-stone-300">NGN {Number(order.total).toLocaleString()}</td>
                    <td className="px-4 py-4 text-stone-300">{order.status}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        {order.invoice_pdf_base64 ? (
                          <a
                            href={`data:application/pdf;base64,${order.invoice_pdf_base64}`}
                            download={`invoice-${order.order_number}.pdf`}
                            className="btn btn-secondary w-full px-3 py-1 text-xs"
                          >
                            Download Invoice
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => markOrderSent(order.id)}
                          className="btn btn-primary w-full px-3 py-1 text-xs"
                        >
                          Mark Out for delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteOrder(order.id)}
                          className="btn btn-destructive w-full px-3 py-1 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!ordersLoading && filteredOrders.length > 0 ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-stone-400">
            <div className="flex gap-2">
              <button
                disabled={ordersPage <= 1}
                onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                className="btn btn-ghost px-3 py-1"
              >
                Prev
              </button>
              <button
                disabled={ordersPage >= totalOrderPages}
                onClick={() => setOrdersPage((p) => Math.min(totalOrderPages, p + 1))}
                className="btn btn-ghost px-3 py-1"
              >
                Next
              </button>
            </div>
            <div className="text-sm">Page {ordersPage} of {totalOrderPages}</div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: totalOrderPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setOrdersPage(i + 1)}
                  className={`rounded px-2 py-1 text-sm ${ordersPage === i + 1 ? "bg-gold text-black" : "bg-white/5 text-stone-300"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
