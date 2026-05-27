"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!supabase) {
      setError("Supabase is not configured. Add your environment variables.");
      setLoading(false);
      return;
    }

    // always perform sign in (signup removed)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      // redirect to CMS after successful sign in
      router.push("/cms");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-black/55 p-10 shadow-soft-glow backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-gold">Login</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Access the Mimaskollections CMS
        </h1>
        <p className="mt-4 max-w-3xl text-stone-300">
          Sign in with your Supabase credentials to add products and manage the catalog.
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label htmlFor="email" className="block text-sm uppercase tracking-[0.25em] text-stone-400">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none focus:border-gold"
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="block text-sm uppercase tracking-[0.25em] text-stone-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none focus:border-gold"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Working..." : "Sign in"}
          </button>
        </form>
        <div className="mt-6 text-sm text-stone-300">
          <Link href="/cms" className="text-stone-300 hover:text-white">
            Back to CMS
          </Link>
        </div>

        {message ? <p className="mt-6 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</p> : null}
        {error ? <p className="mt-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">{error}</p> : null}
      </section>
    </div>
  );
}
