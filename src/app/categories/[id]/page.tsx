"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FolderOpen } from "lucide-react";

import {
  useGetSpecificCategoryQuery,
  useGetSubCategoriesOnCategoryQuery,
} from "@/store/apiSlice";

export default function CategorySubCategoriesPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { data: categoryResponse } = useGetSpecificCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const {
    data: subCategoriesResponse,
    isLoading,
    isError,
  } = useGetSubCategoriesOnCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const categoryName = categoryResponse?.data?.name ?? "Category";
  const categoryImage = categoryResponse?.data?.image;
  const subCategories = subCategoriesResponse?.data ?? [];

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <section className="bg-linear-to-r from-[#16A34A] to-[#2CCB65] py-6 text-white sm:py-7">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="mb-5 flex items-center gap-2 text-base text-green-100/95">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-white">
              Categories
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">{categoryName}</span>
          </div>

          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.14)] backdrop-blur-sm">
              {categoryImage ? (
                <img
                  src={categoryImage}
                  alt={categoryName}
                  className="h-11 w-11 rounded-lg object-cover"
                />
              ) : (
                <FolderOpen className="size-7 text-white" />
              )}
            </div>

            <div>
              <h1 className="text-5xl font-bold tracking-tight text-white">
                {categoryName}
              </h1>
              <p className="mt-1 text-3xl text-green-100">
                Choose a subcategory to browse products
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <section>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-3xl font-medium text-slate-600 hover:text-[#16A34A]"
          >
            <ArrowLeft className="size-5" />
            Back to Categories
          </Link>

          <h2 className="mt-5 text-5xl font-bold tracking-tight text-slate-900">
            {subCategories.length} Subcategories in {categoryName}
          </h2>
        </section>

        <section className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-46 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.05)]"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-white p-6 text-center text-slate-600">
              Unable to load subcategories. Please try again.
            </div>
          ) : subCategories.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <FolderOpen className="mx-auto size-10 text-slate-300" />
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                No Subcategories Found
              </h2>
              <p className="mt-2 text-slate-500">
                This category does not have any subcategories yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {subCategories.map((subCategory) => (
                <Link
                  key={subCategory._id}
                  href={`/products?subcategory=${encodeURIComponent(subCategory._id)}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-[#A7E7BE] hover:shadow-[0_12px_30px_rgba(22,163,74,0.10)]"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#16A34A]">
                    <FolderOpen className="size-6" />
                  </div>
                  <h3 className="text-4xl font-semibold text-slate-900 transition-colors group-hover:text-[#16A34A]">
                    {subCategory.name}
                  </h3>
                  <p className="mt-3 text-lg font-medium text-[#16A34A] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Browse Products -&gt;
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
