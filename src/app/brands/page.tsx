"use client";

import Link from "next/link";
import { Tag } from "lucide-react";

import { useGetBrandsQuery } from "@/store/apiSlice";

function BrandCardSkeleton() {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="flex h-full flex-col items-center justify-between rounded-2xl px-3 py-6">
        <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-slate-50/80">
          <div className="h-20 w-28 animate-pulse rounded-2xl bg-slate-100" />
        </div>
        <div className="mt-6 h-4 w-20 animate-pulse rounded-full bg-slate-100" />
        <div className="mt-3 h-4 w-28 animate-pulse rounded-full bg-slate-100/70" />
      </div>
    </div>
  );
}

export default function BrandsPage() {
  const { data, isLoading, isFetching, isError } = useGetBrandsQuery();

  const brands = data?.data ?? [];

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <section className="bg-linear-to-r from-[#8B5CF6] via-[#9B5CF6] to-[#A855F7] text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10 lg:py-12">
          <div className="text-sm text-white/80">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="px-2">/</span>
            <span className="font-semibold text-white">Brands</span>
          </div>

          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:size-16">
              <Tag className="size-7 text-white sm:size-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                Top Brands
              </h1>
              <p className="mt-1 text-sm text-white/90 sm:text-base">
                Shop from your favorite brands
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {isLoading || isFetching ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <BrandCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-2xl font-bold text-slate-900">
              Unable to load brands
            </h2>
            <p className="mt-2 text-slate-600">
              Please refresh the page and try again.
            </p>
          </div>
        ) : brands.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-2xl font-bold text-slate-900">
              No Brands Found
            </h2>
            <p className="mt-2 text-slate-600">
              There are no brands available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/products?brand=${encodeURIComponent(brand._id)}`}
                className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8B5CF6] hover:shadow-[0_18px_40px_rgba(139,92,246,0.14)]"
              >
                <article className="flex h-full flex-col items-center justify-between rounded-2xl px-3 py-5 text-center">
                  <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-slate-50/80 p-5 transition-colors duration-300 group-hover:bg-[#F5F3FF]">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="max-h-24 w-auto max-w-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-6 flex min-h-18 flex-col items-center justify-start gap-2">
                    <h2 className="text-base font-semibold text-slate-800 transition-colors duration-300 group-hover:text-[#7C3AED]">
                      {brand.name}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C3AED] opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      View Products
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
