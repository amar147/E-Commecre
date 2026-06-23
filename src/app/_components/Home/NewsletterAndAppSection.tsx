"use client";

import {
  Apple,
  ArrowRight,
  BadgeCheck,
  Mail,
  Play,
  Tag,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterAndAppSection() {
  return (
    <section className="grid grid-cols-1 gap-6 rounded-3xl border border-[#D1FAE5] bg-linear-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#ECFEFF] p-5 md:p-8 xl:grid-cols-[1.45fr_1fr]">
      <article>
        <div className="inline-flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[#14B8A6] text-white">
            <Mail className="size-5" />
          </span>
          <div>
            <p className="text-type-sm font-semibold tracking-wide text-[#16A34A] uppercase">
              Newsletter
            </p>
            <p className="text-type-md-lg text-slate-500">
              50,000+ subscribers
            </p>
          </div>
        </div>

        <h3 className="text-type-max mt-5 font-bold text-slate-900">
          Get the Freshest Updates{" "}
          <span style={{ color: "#16A34A" }}>Delivered Free</span>
        </h3>
        <p className="text-type-md-lg mt-3 text-slate-500">
          Weekly recipes, seasonal offers & exclusive member perks.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="text-type-md inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-4 py-2 text-slate-700">
            <BadgeCheck className="size-4 text-[#16A34A]" />
            Fresh Picks Weekly
          </span>
          <span className="text-type-md inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-4 py-2 text-slate-700">
            <Truck className="size-4 text-[#16A34A]" />
            Free Delivery Codes
          </span>
          <span className="text-type-md inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-4 py-2 text-slate-700">
            <Tag className="size-4 text-[#16A34A]" />
            Members-Only Deals
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <Input
            className="text-type-base h-14 flex-1 rounded-2xl border-[#D1D5DB] bg-white px-5"
            placeholder="you@example.com"
          />
          <Button
            className="text-type-md-lg h-14 rounded-2xl px-8 font-semibold text-white"
            style={{ backgroundColor: "#16A34A" }}
          >
            Subscribe
            <ArrowRight className="size-5" />
          </Button>
        </div>
        <p className="text-type-sm mt-3 text-slate-500">
          Unsubscribe anytime. No spam, ever.
        </p>
      </article>

      <article className="rounded-3xl bg-linear-to-br from-[#0F172A] via-[#112A4B] to-[#1E293B] p-6 text-white">
        <span className="text-type-sm inline-flex rounded-full border border-[#14B8A6]/40 bg-[#0F766E]/35 px-3 py-1 font-semibold text-[#2DD4BF] uppercase">
          Mobile App
        </span>
        <h3 className="text-type-max mt-4 font-bold">Shop Faster on Our App</h3>
        <p className="text-type-md-lg mt-3 text-slate-300">
          Get app-exclusive deals & 15% off your first order.
        </p>

        <button
          type="button"
          className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left shadow-sm transition-all duration-200 hover:border-white/20 hover:bg-white/15 hover:shadow-md"
        >
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/6 text-white">
            <Apple size={28} strokeWidth={2.2} />
          </span>
          <span className="flex min-w-0 flex-col justify-center">
            <p className="text-type-min tracking-wide text-slate-300 uppercase">
              Download on
            </p>
            <p className="text-type-lg font-semibold">App Store</p>
          </span>
        </button>
        <button
          type="button"
          className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left shadow-sm transition-all duration-200 hover:border-white/20 hover:bg-white/15 hover:shadow-md"
        >
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/6 text-white">
            <Play size={28} fill="currentColor" strokeWidth={1.8} />
          </span>
          <span className="flex min-w-0 flex-col justify-center">
            <p className="text-type-min tracking-wide text-slate-300 uppercase">
              Get it on
            </p>
            <p className="text-type-lg font-semibold">Google Play</p>
          </span>
        </button>

        <p className="text-type-md-lg mt-5 text-slate-300">
          4.9 rating with 100K+ downloads
        </p>
      </article>
    </section>
  );
}
