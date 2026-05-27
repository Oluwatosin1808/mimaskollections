"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { categoryLabels, normalizeProduct } from "../../lib/catalog";
import type { Product } from "../../lib/types";

const categoryOptions = [
  { value: "appliances", label: "Home Appliances" },
  { value: "household", label: "Household Essentials" },
  { value: "souvenirs", label: "Souvenirs" },
  { value: "gifts", label: "Gift Items" }
] as const;

const fallbackImage =
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CmsPage() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(1);
  const [category, setCategory] = useState<Product["category"]>("appliances");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    const loadSession = async () => {
      const client = supabase;
      if (!client) return;
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
    if (!supabase || !session) return;

    const loadProducts = async () => {
      const client = supabase;
      if (!client) return;
      const { data, error: fetchError } = await client.from("products").select("*");
      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      setItems((data ?? []).map((product) => normalizeProduct(product as any)));
    };

    loadProducts();
  }, [session]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await readFileAsDataUrl(file);
    setImage(dataUrl);
  };

  const addItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    if (!session) {
      setError("Please sign in to add products.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    const availableStock = Math.max(0, Math.floor(stock || 0));

    const client = supabase;
    if (!client) return;
    const { data, error: insertError } = await client.from("products").insert([
      {
        name: name.trim(),
        description: description.trim(),
        price: Number(price || 0),
        category,
        image: image.trim() || fallbackImage,
        stock: availableStock,
        in_stock: availableStock > 0
      }
    ]);

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setItems((current) => [
      ...(data ?? []).map((item) => normalizeProduct(item as any)),
      ...current
    ]);
    setName("");
    setPrice(0);
    setStock(1);
    setDescription("");
    setImage("");
    setMessage("Product added successfully and will appear on the shop.");
    setSubmitting(false);
  };

  const deleteItem = async (itemId: string) => {
    if (!supabase) return;
    const client = supabase;
    if (!client) return;
    const { error: deleteError } = await client.from("products").delete().eq("id", itemId);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setItems((current) => current.filter((item) => item.id !== itemId));
    setMessage("Product removed from the database.");
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    const client = supabase;
    if (!client) return;
    await client.auth.signOut();
    setSession(null);
    setMessage("Signed out successfully.");
  };

  if (!supabase) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-10 text-stone-200">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Supabase not configured</p>
          <p className="mt-4">Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-10 text-stone-200">Loading authentication state...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-10 shadow-soft">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Sign in required</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">You must sign in to access the CMS.</h1>
          <p className="mt-4 text-stone-300">
            Use the login page below to authenticate before creating products in the database.
          </p>
          <Link href="/login" className="btn btn-primary mt-8 inline-block">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-black/55 p-10 shadow-soft-glow backdrop-blur-xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">CMS</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Product Management Studio
            </h1>
            <p className="mt-4 max-w-3xl text-stone-300">
              Add products directly into Supabase for immediate reflection on the shop frontend.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-sm text-stone-300">Signed in as {session.user?.email}</p>
            <button type="button" onClick={handleSignOut} className="btn btn-secondary">
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <form className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6" onSubmit={addItem}>
            <div className="space-y-3">
              <label className="block text-sm uppercase tracking-[0.25em] text-stone-400">Item Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none focus:border-gold"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-3">
                <label className="block text-sm uppercase tracking-[0.25em] text-stone-400">Price</label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none focus:border-gold"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm uppercase tracking-[0.25em] text-stone-400">Stock</label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(event) => setStock(Number(event.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none focus:border-gold"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm uppercase tracking-[0.25em] text-stone-400">Category</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as Product["category"])}
                  className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none focus:border-gold"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-black text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm uppercase tracking-[0.25em] text-stone-400">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-stone-200 outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black focus:border-gold"
              />
              <input
                type="url"
                placeholder="Or paste an image URL"
                value={image.startsWith("data:") ? "" : image}
                onChange={(event) => setImage(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none focus:border-gold"
              />
              {image ? (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                  <img src={image} alt="Product preview" className="h-52 w-full object-cover" />
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <label className="block text-sm uppercase tracking-[0.25em] text-stone-400">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none focus:border-gold"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? "Saving…" : "Add product to database"}
            </button>
            {message ? <p className="text-emerald-200">{message}</p> : null}
            {error ? <p className="text-red-300">{error}</p> : null}
          </form>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Saved items</p>
              <p className="mt-3 text-sm text-stone-300">
                Products added here are inserted into Supabase and reflected on the shop frontend.
              </p>
            </div>
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/60 p-6 text-stone-300">
                  No products found yet.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="grid gap-4 rounded-3xl border border-white/10 bg-black/60 p-5 sm:grid-cols-[120px_1fr]">
                    <img src={item.image} alt={item.name} className="h-28 w-full rounded-2xl object-cover sm:w-28" />
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                          <p className="mt-1 text-sm text-stone-300">{categoryLabels[item.category]}</p>
                        </div>
                        <button type="button" onClick={() => deleteItem(item.id)} className="btn btn-secondary px-4 py-2 text-xs">
                          Delete
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-stone-300">
                        <span>NGN {item.price.toLocaleString()}</span>
                        <span>{item.stock > 0 ? `${item.stock} in stock` : "Sold out"}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-stone-300">{item.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
