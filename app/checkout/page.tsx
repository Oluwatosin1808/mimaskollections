"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

const locationOptions = [
  { value: "Tanke", label: "Tanke (delivery NGN 800)", fee: 800 },
  { value: "Outside Tanke", label: "Outside Tanke (delivery NGN 1,500)", fee: 1500 },
  { value: "Lagos", label: "Lagos (delivery NGN 5,000)", fee: 5000 },
  { value: "Abuja", label: "Abuja (delivery NGN 5,000)", fee: 5000 },
  { value: "Other", label: "Other states (delivery NGN 4,000)", fee: 4000 }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, emptyCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("Tanke");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [completed, setCompleted] = useState(false);
  const [invoiceBase64, setInvoiceBase64] = useState<string | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  const deliveryFee = locationOptions.find((option) => option.value === location)?.fee ?? 0;
  const total = cartTotal + deliveryFee;
  const hasItems = items.length > 0;
  const canSubmit = hasItems && name.trim() && email.trim() && phone.trim() && address.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setMessage("Please complete all required fields before confirming payment.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const payload = {
      name,
      email,
      phone,
      address,
      location,
      notes,
      items,
      subtotal: cartTotal,
      deliveryFee,
      total
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to complete checkout.");
      }

      setOrderNumber(result.orderNumber ?? "N/A");
      setStatus("success");
      setCompleted(true);
      if (result.invoiceBase64) {
        setInvoiceBase64(result.invoiceBase64);
      }
      emptyCart();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Checkout failed. Please try again.");
    }
  }

  useEffect(() => {
    let objectUrl: string | null = null;

    if (!invoiceBase64) {
      if (invoiceUrl) {
        URL.revokeObjectURL(invoiceUrl);
        setInvoiceUrl(null);
      }
      return;
    }

    try {
      const byteCharacters = atob(invoiceBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      objectUrl = URL.createObjectURL(blob);
      setInvoiceUrl(objectUrl);
    } catch (err) {
      console.error("Failed to create invoice URL", err);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [invoiceBase64]);

  if (!hasItems && !completed) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/95 p-10 text-center text-stone-300 shadow-soft">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Checkout</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Your cart is empty.</h1>
          <p className="mt-4 text-stone-400">Add items to the cart before you continue to checkout.</p>
          <button onClick={() => router.push("/shop")} className="btn btn-primary mt-8">
            Browse products
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl border border-green-500/20 bg-emerald-950/10 p-8 text-white shadow-soft">
          <h2 className="text-2xl font-semibold">Payment confirmed</h2>
          <p className="mt-4 text-stone-300">Your order has been placed successfully.</p>
          <p className="mt-4 text-sm text-stone-400">Order number: <span className="font-semibold text-white">{orderNumber}</span></p>
          <p className="mt-4 text-sm text-stone-300">Your invoice is ready below. Download it for your records.</p>

          {invoiceUrl ? (
            <div className="mt-6">
              <div className="border border-white/10 bg-black/80 p-4">
                <iframe title="Invoice PDF" src={invoiceUrl} className="w-full h-[600px]" />
              </div>
              <div className="mt-4 flex gap-3">
                <a href={invoiceUrl} download={`invoice-${orderNumber}.pdf`} className="btn btn-primary">
                  Download invoice (PDF)
                </a>
                <button onClick={() => router.push("/shop")} className="btn btn-secondary">
                  Continue shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <button onClick={() => router.push("/shop")} className="btn btn-primary mt-6">
                Continue shopping
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="grid gap-10 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-white/10 bg-black/95 p-8 shadow-soft">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Delivery information</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Enter your details</h1>
            <p className="mt-2 text-stone-400">We will calculate your delivery fee automatically and add it to your total.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-stone-200">Full name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                  placeholder="Jane Doe"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-stone-200">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                  placeholder="jane@example.com"
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-stone-200">Phone number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                  placeholder="+234 801 234 5678"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-stone-200">Delivery location</span>
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                >
                  {locationOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-950 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-stone-200">Delivery address</span>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                placeholder="House number, street name, landmark"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-stone-200">Order notes (optional)</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                placeholder="Leave a message for delivery"
              />
            </label>

            {message ? (
              <p className={`text-sm ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || status === "submitting"}
              className={`btn w-full ${canSubmit ? "btn-primary" : "btn-disabled"}`}
            >
              {status === "submitting" ? "Confirming payment..." : "Confirm payment & generate invoice"}
            </button>
          </form>
        </section>

        <aside className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Order summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Final amount</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-stone-400">Items</p>
              <p className="mt-3 text-lg font-semibold text-white">NGN {cartTotal.toLocaleString()}</p>
            </div>

            <div className="rounded-3xl bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-stone-400">Delivery fee</p>
              <p className="mt-3 text-lg font-semibold text-white">NGN {deliveryFee.toLocaleString()}</p>
              <p className="mt-1 text-sm text-stone-400">Based on {location}</p>
            </div>

            <div className="rounded-3xl bg-gold/10 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-stone-600">Total bill</p>
              <p className="mt-3 text-3xl font-semibold text-white">NGN {total.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/70 p-5 text-stone-300">
            <p className="font-semibold text-white">What happens next</p>
            <ul className="mt-3 space-y-3 text-sm leading-6">
              <li>1. Your order details are validated immediately.</li>
              <li>2. Delivery fee is added automatically based on your chosen location.</li>
              <li>3. A downloadable invoice is generated with a unique order number.</li>
            </ul>
          </div>
        </aside>
      </div>

    </div>
  );
}
