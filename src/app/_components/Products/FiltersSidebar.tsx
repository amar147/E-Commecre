"use client";

import { Button } from "@/components/ui/button";

const QUICK_MAX_PRICE_OPTIONS = [
  { label: "Under 500", value: 500 },
  { label: "Under 1K", value: 1000 },
  { label: "Under 5K", value: 5000 },
  { label: "Under 10K", value: 10000 },
];

type FiltersSidebarProps = {
  categories: Array<{ _id: string; name: string }>;
  brands: Array<{ _id: string; name: string }>;
  selectedCategoryId?: string;
  selectedBrandId?: string;
  minPriceParam?: string;
  maxPriceParam?: string;
  setCategory: (value?: string) => void;
  setBrand: (value?: string) => void;
  setMinPrice: (value?: string) => void;
  setMaxPrice: (value?: string) => void;
  clearAllFilters: () => void;
};

export default function FiltersSidebar({
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  minPriceParam,
  maxPriceParam,
  setCategory,
  setBrand,
  setMinPrice,
  setMaxPrice,
  clearAllFilters,
}: FiltersSidebarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Categories</h3>
        <div className="mt-4 max-h-55 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar]:w-1">
          {categories.map((category) => (
            <label
              key={category._id}
              className="flex cursor-pointer items-center gap-3 text-lg text-slate-600"
            >
              <input
                type="checkbox"
                checked={selectedCategoryId === category._id}
                onChange={() =>
                  setCategory(
                    selectedCategoryId === category._id
                      ? undefined
                      : category._id,
                  )
                }
                className="size-5 rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="my-5 border-t border-slate-200" />

      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Price Range</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500">Min (EGP)</label>
            <input
              value={minPriceParam ?? ""}
              onChange={(event) => {
                const value = event.target.value.replace(/[^\d]/g, "");
                setMinPrice(value || undefined);
              }}
              placeholder="0"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-[#16A34A]"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">Max (EGP)</label>
            <input
              value={maxPriceParam ?? ""}
              onChange={(event) => {
                const value = event.target.value.replace(/[^\d]/g, "");
                setMaxPrice(value || undefined);
              }}
              placeholder="No limit"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-[#16A34A]"
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {QUICK_MAX_PRICE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMaxPrice(String(option.value))}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="my-5 border-t border-slate-200" />

      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Brands</h3>
        <div className="mt-4 max-h-55 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar]:w-1">
          {brands.map((brand) => (
            <label
              key={brand._id}
              className="flex cursor-pointer items-center gap-3 text-lg text-slate-600"
            >
              <input
                type="checkbox"
                checked={selectedBrandId === brand._id}
                onChange={() =>
                  setBrand(
                    selectedBrandId === brand._id ? undefined : brand._id,
                  )
                }
                className="size-5 rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]"
              />
              <span>{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={clearAllFilters}
        className="mt-6 h-11 w-full rounded-xl border-slate-200 text-base font-semibold text-slate-700"
      >
        Clear All
      </Button>
    </div>
  );
}
