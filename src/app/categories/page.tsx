"use client";

import Link from "next/link";
import { Layers, Loader2 } from "lucide-react";

import { useGetCategoriesQuery } from "@/store/apiSlice";

function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
      <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
      <div className="mt-4 h-5 w-2/3 animate-pulse rounded-md bg-slate-100" />
    </div>
  );
}

export default function CategoriesPage() {
  const { data, isLoading, isFetching, isError } = useGetCategoriesQuery();

  const categories = data?.data ?? [];

  return (
    <main className="min-h-screen bg-[#F3F4F6] pb-12">
      <section className="bg-linear-to-r from-[#16A34A] to-[#2CCB65] py-8 text-white sm:py-9">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="text-type-base mb-6 flex items-center gap-2 text-white/90">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">Categories</span>
          </div>

          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/20 shadow-[0_10px_26px_rgba(15,23,42,0.20)] backdrop-blur-sm">
              <Layers className="size-7 text-white" />
            </div>

            <div>
              <h1 className="text-type-max font-bold tracking-tight text-white">
                All Categories
              </h1>
              <p className="text-type-md mt-1 text-green-50">
                Browse our wide range of product categories
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        {isLoading || isFetching ? (
          <>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-type-sm text-slate-600 shadow-sm">
              <Loader2 className="size-4 animate-spin text-[#16A34A]" />
              Loading categories...
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <CategoryCardSkeleton key={index} />
              ))}
            </div>
          </>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-type-md-lg font-semibold text-slate-900">
              Could not load categories
            </h2>
            <p className="text-type-base mt-2 text-slate-600">
              Please refresh the page and try again.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products?category=${encodeURIComponent(category._id)}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#BBF7D0] hover:shadow-[0_12px_28px_rgba(22,163,74,0.10)]"
              >
                <div className="overflow-hidden rounded-xl bg-slate-50">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-type-md mt-4 font-semibold text-slate-900">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
