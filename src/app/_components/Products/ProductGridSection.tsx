"use client";

import { FolderOpen } from "lucide-react";

import ProductCard from "@/components/custom/ProductCard";
import Reveal from "@/components/custom/Reveal";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/api";

type ViewMode = "grid" | "list";

type ProductGridSectionProps = {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  products: Product[];
  viewMode: ViewMode;
  selectedSubCategoryId?: string;
  subCategoryName?: string;
  onViewAllProducts: () => void;
};

function ProductCardSkeleton() {
  return (
    <div className="h-85 animate-pulse rounded-xl border border-slate-200 bg-white p-3">
      <div className="h-44 rounded-lg bg-slate-100" />
      <div className="mt-3 h-3 w-20 rounded bg-slate-100" />
      <div className="mt-2 h-5 w-3/4 rounded bg-slate-100" />
      <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-6 w-20 rounded bg-slate-100" />
        <div className="h-8 w-8 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export default function ProductGridSection({
  isLoading,
  isFetching,
  isError,
  products,
  viewMode,
  selectedSubCategoryId,
  subCategoryName,
  onViewAllProducts,
}: ProductGridSectionProps) {
  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Unable to load products
        </h2>
        <p className="mt-2 text-base text-slate-600">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[52vh] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-5 flex size-24 items-center justify-center rounded-full bg-[#ECFDF5] text-[#16A34A]">
            <FolderOpen className="size-11" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900">
            No Products Found
          </h2>
          <p className="mt-3 text-xl text-slate-500">
            {selectedSubCategoryId
              ? `No products are available in ${subCategoryName ?? "this subcategory"} right now.`
              : "Try adjusting your search or filters to find what you're looking for."}
          </p>
          <Button
            type="button"
            onClick={onViewAllProducts}
            className="mt-6 h-12 rounded-xl bg-[#16A34A] px-8 text-base font-semibold text-white hover:bg-[#15803D]"
          >
            View All Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 ${
        viewMode === "grid"
          ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {products.map((product, index) => (
        <Reveal
          key={product._id}
          delay={viewMode === "grid" ? index * 0.02 : 0}
        >
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
