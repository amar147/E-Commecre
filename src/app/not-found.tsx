"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Apple,
  ArrowLeft,
  Carrot,
  Citrus,
  Home,
  ShoppingCart,
  Sprout,
} from "lucide-react";

const destinations = [
  { label: "All Products", href: "/products", active: true },
  { label: "Categories", href: "/categories" },
  { label: "Today's Deals", href: "/products?sort=-sold" },
  { label: "Contact Us", href: "/account/settings" },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative isolate flex min-h-[84vh] items-center justify-center overflow-hidden bg-linear-to-br from-[#f3f7f4] via-[#f8faf8] to-[#eef5f2] px-3 py-8 sm:px-4 sm:py-12">
      <div className="pointer-events-none absolute inset-0">
        <Apple className="absolute left-4 top-4 size-9 text-emerald-200 md:left-10 md:top-8 md:size-11" />
        <Apple className="absolute bottom-30 left-10 size-8 text-emerald-100 md:left-28 md:size-10" />
        <Carrot className="absolute right-4 top-26 size-9 text-emerald-100 md:right-16 md:top-24 md:size-10" />
        <Carrot className="absolute bottom-32 right-4 size-8 text-emerald-100 md:right-14 md:size-9" />
        <Citrus className="absolute bottom-16 left-8 size-9 text-emerald-200 md:left-16 md:size-10" />
        <Sprout className="absolute right-18 bottom-24 hidden size-10 text-emerald-200 md:block" />
      </div>

      <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className="relative">
          <div className="h-30 w-62 rounded-3xl border border-white/70 bg-white/70 shadow-[0_28px_70px_rgba(16,185,129,0.14)] backdrop-blur-sm sm:h-34 sm:w-68">
            <ShoppingCart className="mx-auto mt-9 size-12 text-emerald-400 sm:mt-10 sm:size-14" />
          </div>
          <span className="absolute -right-4 -top-4 inline-flex h-20 w-20 items-center justify-center rounded-full border-6 border-[#eaf7ee] bg-emerald-500 text-3xl font-extrabold tracking-tight text-white shadow-[0_15px_30px_rgba(34,197,94,0.35)]">
            404
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 text-emerald-400">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="inline-flex h-5 w-8 rounded-b-full border-b-2 border-emerald-400" />
          <span className="size-2 rounded-full bg-emerald-400" />
        </div>

        <h1 className="mt-7 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Oops! Nothing Here
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
          Looks like this page went out of stock! Don&apos;t worry, there&apos;s
          plenty more fresh content to explore.
        </p>

        <div className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="inline-flex h-15 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(22,163,74,0.35)] transition hover:bg-emerald-700 sm:text-base"
          >
            <Home className="size-5" />
            Go to Homepage
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-15 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:text-base"
          >
            <ArrowLeft className="size-5" />
            Go Back
          </button>
        </div>

        <div className="mt-10 w-full max-w-3xl rounded-4xl border border-slate-200/80 bg-[#f2f4f3]/95 p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
            Popular Destinations
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {destinations.map((destination) => (
              <Link
                key={destination.label}
                href={destination.href}
                className={`rounded-2xl px-5 py-2.5 text-xs font-semibold transition sm:text-sm ${
                  destination.active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200/70 text-slate-600 hover:bg-slate-300/70"
                }`}
              >
                {destination.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
