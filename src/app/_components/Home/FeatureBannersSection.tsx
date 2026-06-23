"use client";

import { ArrowRight } from "lucide-react";

import Reveal from "@/components/custom/Reveal";
import { Button } from "@/components/ui/button";

export default function FeatureBannersSection() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Reveal>
        <article className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#059669] to-[#16A34A] p-6 text-white md:p-8">
          <span className="text-type-sm inline-flex rounded-full bg-white/20 px-3 py-1">
            Deal of the Day
          </span>
          <h3 className="text-type-lg mt-3 font-bold">Fresh Organic Fruits</h3>
          <p className="text-type-md mt-2 text-white/90">
            Get up to 40% off on selected organic fruits
          </p>
          <p className="text-type-max mt-4 font-black">40% OFF</p>
          <p className="text-type-sm mt-1">Use code: ORGANIC40</p>
          <Button className="mt-5 rounded-full bg-white px-5 font-semibold text-[#16A34A] hover:bg-white/90">
            Shop Now
            <ArrowRight className="size-4" />
          </Button>
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
        </article>
      </Reveal>

      <Reveal delay={0.08}>
        <article className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#F97316] via-[#FB7185] to-[#F43F5E] p-6 text-white md:p-8">
          <span className="text-type-sm inline-flex rounded-full bg-white/20 px-3 py-1">
            New Arrivals
          </span>
          <h3 className="text-type-lg mt-3 font-bold">Exotic Vegetables</h3>
          <p className="text-type-md mt-2 text-white/90">
            Discover our latest collection of premium vegetables
          </p>
          <p className="text-type-max mt-4 font-black">25% OFF</p>
          <p className="text-type-sm mt-1">Use code: FRESH25</p>
          <Button className="mt-5 rounded-full bg-white px-5 font-semibold text-[#F97316] hover:bg-white/90">
            Explore Now
            <ArrowRight className="size-4" />
          </Button>
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
        </article>
      </Reveal>
    </section>
  );
}
