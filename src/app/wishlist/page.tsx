"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  useAddToCartMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/apiSlice";
import { useAuthState } from "@/hooks/useAuthState";

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center text-slate-600">
        <Spinner size="lg" className="text-green-600" />
        <p className="text-sm font-medium">Loading wishlist...</p>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuthState();
  const [cartLoadingId, setCartLoadingId] = useState<string | null>(null);
  const [removeLoadingId, setRemoveLoadingId] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isAuthLoading || isLoggedIn) {
      return;
    }

    router.push("/login");
  }, [isAuthLoading, isLoggedIn, router]);

  const {
    data: wishlist,
    isLoading: isWishlistLoading,
    isError: isWishlistError,
  } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [addToCart] = useAddToCartMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const products = wishlist?.data ?? [];
  const itemsCount = wishlist?.count ?? products.length;

  const handleAddToCart = async (productId: string, title: string) => {
    try {
      setCartLoadingId(productId);
      await addToCart({ productId }).unwrap();
      toast.success(`${title} added to cart`);
    } catch {
      toast.error("Failed to add item to cart");
    } finally {
      setCartLoadingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      setRemoveLoadingId(productId);
      await removeFromWishlist(productId).unwrap();
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemoveLoadingId(null);
    }
  };

  if (isAuthLoading || !isLoggedIn || isWishlistLoading) {
    return <PageLoader />;
  }

  if (isWishlistError) {
    return (
      <main className="min-h-screen bg-[#f8f9fb] px-3 py-6 sm:px-4 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-xl font-semibold text-slate-900">
              Unable to load wishlist
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Please try again in a moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fb] px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700">Wishlist</span>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-rose-100">
            <Heart className="size-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              My Wishlist
            </h1>
            <p className="text-lg text-slate-500">{itemsCount} items saved</p>
          </div>
        </div>

        {!!products.length && (
          <>
            <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="grid grid-cols-[minmax(0,2.6fr)_0.8fr_0.8fr_0.9fr] border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-500">
                <span>Product</span>
                <span>Price</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
              </div>

              {products.map((product) => {
                const isAdding = cartLoadingId === product._id;
                const isRemoving = removeLoadingId === product._id;

                return (
                  <div
                    key={product._id}
                    className="grid grid-cols-[minmax(0,2.6fr)_0.8fr_0.8fr_0.9fr] items-center border-b border-slate-100 px-6 py-4 last:border-b-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative flex size-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                        {!loadedImages[product._id] ? (
                          <Skeleton className="absolute inset-2 rounded-lg" />
                        ) : null}
                        <Image
                          src={product.imageCover}
                          alt={product.title}
                          width={48}
                          height={48}
                          onLoadingComplete={() =>
                            setLoadedImages((prev) => ({
                              ...prev,
                              [product._id]: true,
                            }))
                          }
                          className={`h-12 w-12 object-contain transition-opacity duration-200 ${
                            loadedImages[product._id]
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xl font-medium text-slate-900">
                          {product.title}
                        </p>
                        <p className="text-md text-slate-400">
                          {product.category?.name || "General"}
                        </p>
                      </div>
                    </div>

                    <p className="text-xl font-semibold text-slate-900">
                      {product.price.toLocaleString()} EGP
                    </p>

                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        In Stock
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() =>
                          handleAddToCart(product._id, product.title)
                        }
                        disabled={isAdding}
                        className="h-10 min-w-32.5 rounded-lg bg-[#16A34A] px-4 text-sm font-medium text-white hover:bg-[#15803D]"
                      >
                        {isAdding ? (
                          <>
                            <Spinner size="sm" className="text-white" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="size-4" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemove(product._id)}
                        disabled={isRemoving}
                        className="h-10 w-10 rounded-lg border-slate-200 text-slate-400 hover:text-slate-600"
                      >
                        {isRemoving ? (
                          <Spinner size="sm" className="text-slate-500" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="space-y-3 md:hidden">
              {products.map((product) => {
                const isAdding = cartLoadingId === product._id;
                const isRemoving = removeLoadingId === product._id;

                return (
                  <article
                    key={product._id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className="relative flex size-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                        {!loadedImages[product._id] ? (
                          <Skeleton className="absolute inset-2 rounded-lg" />
                        ) : null}
                        <Image
                          src={product.imageCover}
                          alt={product.title}
                          width={48}
                          height={48}
                          onLoadingComplete={() =>
                            setLoadedImages((prev) => ({
                              ...prev,
                              [product._id]: true,
                            }))
                          }
                          className={`h-12 w-12 object-contain transition-opacity duration-200 ${
                            loadedImages[product._id]
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-xl font-medium text-slate-900">
                          {product.title}
                        </p>
                        <p className="text-lg text-slate-400">
                          {product.category?.name || "General"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xl">
                      <p className="text-slate-500">
                        Price:{" "}
                        <span className="font-semibold text-slate-900">
                          {product.price.toLocaleString()} EGP
                        </span>
                      </p>
                      <p className="flex items-center gap-2 text-slate-500">
                        Status:
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          In Stock
                        </span>
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        onClick={() =>
                          handleAddToCart(product._id, product.title)
                        }
                        disabled={isAdding}
                        className="h-10 flex-1 rounded-lg bg-[#16A34A] text-sm font-medium text-white hover:bg-[#15803D]"
                      >
                        {isAdding ? (
                          <>
                            <Spinner size="sm" className="text-white" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="size-4" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemove(product._id)}
                        disabled={isRemoving}
                        className="h-10 w-10 rounded-lg border-slate-200 text-slate-400 hover:text-slate-600"
                      >
                        {isRemoving ? (
                          <Spinner size="sm" className="text-slate-500" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}

        {!products.length && (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <Heart className="mx-auto mb-3 size-8 text-slate-300" />
            <h2 className="text-lg font-semibold text-slate-900">
              Your wishlist is empty
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Save your favorite products to find them quickly later.
            </p>
          </section>
        )}

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
