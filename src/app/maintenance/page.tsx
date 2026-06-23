"use client";

import { RefreshCw, ShieldCheck, Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#F7FFF9] via-[#F4FBF7] to-[#ECFDF3]">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#16A34A]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#22C55E]/20 blur-3xl" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 md:px-6">
        <div className="w-full rounded-3xl border border-[#DCFCE7] bg-white/95 p-6 shadow-[0_30px_80px_rgba(22,163,74,0.18)] backdrop-blur md:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-[#ECFDF5] px-4 py-2 text-sm font-semibold text-[#15803D]">
              <ShieldCheck className="size-4" />
              FreshCart Service Status
            </div>

            <div className="mx-auto mt-6 inline-flex size-18 items-center justify-center rounded-2xl bg-linear-to-br from-[#16A34A] to-[#22C55E] text-white shadow-[0_12px_35px_rgba(22,163,74,0.35)]">
              <Wrench className="size-8" />
            </div>

            <h1 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight text-slate-900 md:text-5xl">
              We&apos;ll be back soon!
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Our servers are currently undergoing maintenance. Please try again
              later.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 font-semibold text-white shadow-[0_10px_25px_rgba(22,163,74,0.3)] transition hover:bg-[#15803D]"
              >
                <RefreshCw className="size-4" />
                Retry
              </button>
            </div>

            <p className="mt-8 text-sm text-slate-500">
              Thank you for your patience. FreshCart is working to restore full
              service as quickly as possible.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
