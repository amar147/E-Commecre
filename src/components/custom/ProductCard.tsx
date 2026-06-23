"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, RefreshCw, Star, Heart } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/apiSlice";
import type { Product } from "@/types/api";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const rating = product.ratingsAverage ?? 0;
  const ratingCount = product.ratingsQuantity ?? 0;
  const [addToCart, { isLoading: isAddToCartLoading }] = useAddToCartMutation();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAddToWishlistLoading }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoveFromWishlistLoading }] =
    useRemoveFromWishlistMutation();

  const isWishlistPending =
    isAddToWishlistLoading || isRemoveFromWishlistLoading;

  const isInWishlist = useMemo(() => {
    return Boolean(
      wishlistData?.data?.some((item) => item._id === product._id),
    );
  }, [product._id, wishlistData?.data]);

  const handleWishlistToggle = async () => {
    if (isWishlistPending) {
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id).unwrap();
        toast.success("Removed from wishlist");
        return;
      }

      await addToWishlist({ productId: product._id }).unwrap();
      toast.success("Added to wishlist");
    } catch {
      toast.error("Wishlist action failed. Please try again.");
    }
  };

  return (
    <Link href={`/products/${product._id}`}>
      <article className="group rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-[0_3px_10px_rgba(15,23,42,0.03)] transition hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)] cursor-pointer h-full">
        <div className="relative overflow-hidden rounded-lg bg-[#F8FAFC]">
          {isImageLoading ? (
            <Skeleton className="absolute inset-0 rounded-lg" />
          ) : null}
          <Image
            src={product.imageCover}
            alt={product.title}
            width={400}
            height={176}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onLoad={() => setIsImageLoading(false)}
            className={`h-44 w-full object-cover transition duration-300 group-hover:scale-105 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
          />
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlistToggle();
              }}
              disabled={isWishlistPending}
              className="rounded-full bg-white/90 p-1.5 text-slate-500 hover:text-[#16A34A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isWishlistPending ? (
                <Spinner size="sm" className="text-slate-500" />
              ) : (
                <Heart
                  className={`size-3.5 ${
                    isInWishlist
                      ? "fill-red-500 text-red-500"
                      : "text-slate-500"
                  }`}
                />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast("Compare feature coming soon!");
              }}
              className="rounded-full bg-white/90 p-1.5 text-slate-500 hover:text-[#16A34A]"
            >
              <RefreshCw className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="rounded-full bg-white/90 p-1.5 text-slate-500 hover:text-[#16A34A]"
            >
              <Eye className="size-3.5" />
            </button>
          </div>
        </div>

        <p className="text-type-min mt-3 text-slate-500">
          {product.category?.name ?? "General"}
        </p>
        <h3 className="text-type-md mt-1 line-clamp-2 min-h-10 font-semibold text-slate-800">
          {product.title}
        </h3>

        <div className="text-type-min mt-2 flex items-center gap-1 text-slate-500">
          <Star className="size-3.5 fill-[#FACC15] text-[#FACC15]" />
          <span className="font-medium text-slate-700">
            {rating.toFixed(1)}
          </span>
          <span>({ratingCount})</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-type-md-lg font-bold text-slate-900">
            {product.price} EGP
          </p>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart({ productId: product._id })
                .unwrap()
                .then(() => {
                  toast.success("Added to Cart!");
                })
                .catch(() => {
                  toast.error("Failed to add to cart. Please try again.");
                });
            }}
            disabled={isAddToCartLoading}
            className="h-8 w-8 rounded-full p-0 text-lg font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "#16A34A" }}
          >
            {isAddToCartLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              "+"
            )}
          </Button>
        </div>
      </article>
    </Link>
  );
}
