"use client";

import { useMemo } from "react";
import CategorySliderSection from "@/app/_components/Home/CategorySliderSection";
import FeatureBannersSection from "@/app/_components/Home/FeatureBannersSection";
import FeaturedProductsSection from "@/app/_components/Home/FeaturedProductsSection";
import MainHeroCarousel from "@/app/_components/Home/MainHeroCarousel";
import NewsletterAndAppSection from "@/app/_components/Home/NewsletterAndAppSection";
import TrustBadgesHeader from "@/components/custom/TrustBadgesHeader";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/store/apiSlice";

const categoryOrder = [
  "Music",
  "Men's Fashion",
  "Women's Fashion",
  "SuperMarket",
  "Baby & Toys",
  "Home",
  "Books",
  "Beauty & Health",
  "Mobiles",
  "Electronics",
];

export default function Home() {
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: productsData } = useGetProductsQuery();

  const filteredCategories = useMemo(() => {
    if (!categoriesData?.data) {
      return [];
    }

    const lookup = new Map(
      categoriesData.data.map((category) => [
        category.name.toLowerCase(),
        category,
      ]),
    );

    return categoryOrder
      .map((name) => lookup.get(name.toLowerCase()))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [categoriesData]);

  const featuredProducts = useMemo(() => {
    return productsData?.data?.slice(0, 12) ?? [];
  }, [productsData]);

  return (
    <main className="bg-[#F9FAFB] pb-12">
      <MainHeroCarousel />

      <TrustBadgesHeader />
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-4 md:px-6 md:pt-6 lg:space-y-10">
        <CategorySliderSection categories={filteredCategories} />
        <FeatureBannersSection />
        <FeaturedProductsSection products={featuredProducts} />
        <NewsletterAndAppSection />
      </div>
    </main>
  );
}
