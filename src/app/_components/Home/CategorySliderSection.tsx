"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import Reveal from "@/components/custom/Reveal";
import { CategorySummary } from "@/types/api";

type CategorySliderSectionProps = {
  categories: CategorySummary[];
};

export default function CategorySliderSection({
  categories,
}: CategorySliderSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-type-max flex items-center gap-3 font-bold text-slate-900">
          <span
            className="h-10 w-1.5 rounded-full"
            style={{ backgroundColor: "#16A34A" }}
          />
          Shop By <span style={{ color: "#16A34A" }}>Category</span>
        </h2>
        <Link
          href="/categories"
          className="text-type-md-lg inline-flex items-center gap-2 self-end font-medium text-[#16A34A] md:self-auto"
        >
          View All Categories
          <ArrowRight className="size-5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
        {categories.map((category, index) => (
          <Reveal key={category._id} delay={index * 0.04}>
            <Link
              href={`/products?category=${encodeURIComponent(category._id)}`}
              className="block rounded-xl border border-[#E5E7EB] bg-white p-3 text-center shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#BBF7D0] hover:shadow-[0_6px_16px_rgba(22,163,74,0.10)]"
            >
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-[#ECFDF5]">
                <img
                  src={category.image || "/assets/images/slidebar_1.jpg"}
                  alt={category.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-type-md mt-3 font-medium text-slate-800">
                {category.name}
              </h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
