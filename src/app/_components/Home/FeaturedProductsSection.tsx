"use client";

import ProductCard from "@/components/custom/ProductCard";
import Reveal from "@/components/custom/Reveal";
import { Product } from "@/types/api";

type FeaturedProductsSectionProps = {
  products: Product[];
};

export default function FeaturedProductsSection({
  products,
}: FeaturedProductsSectionProps) {
  return (
    <section className="space-y-5">
      <h2 className="text-type-max flex items-center gap-3 font-bold text-slate-900">
        <span
          className="h-10 w-1.5 rounded-full"
          style={{ backgroundColor: "#16A34A" }}
        />
        Featured <span style={{ color: "#16A34A" }}>Products</span>
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products.map((product, index) => (
          <Reveal key={product._id} delay={index * 0.03}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
