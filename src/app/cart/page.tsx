"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useGetLoggedUserCartQuery,
  useClearCartMutation,
  useRemoveCartItemMutation,
  useRemoveFromWishlistMutation,
  useUpdateCartProductQuantityMutation,
} from "@/store/apiSlice";
import { useAuthState } from "@/hooks/useAuthState";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="text-green-600" />
        <p className="mt-4 text-gray-600">Loading cart...</p>
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuthState();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [quantityLoading, setQuantityLoading] = useState<{
    id: string;
    direction: "increase" | "decrease";
  } | null>(null);
  const [removeLoadingId, setRemoveLoadingId] = useState<string | null>(null);
  const [wishlistLoadingId, setWishlistLoadingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isAuthLoading || isLoggedIn) {
      return;
    }

    router.push("/login");
  }, [isAuthLoading, isLoggedIn, router]);

  const { data: cart, isLoading } = useGetLoggedUserCartQuery(undefined, {
    skip: !isLoggedIn,
  });
  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [updateQuantity, { isLoading: isUpdatingQuantity }] =
    useUpdateCartProductQuantityMutation();
  const [removeItem, { isLoading: isRemovingItem }] =
    useRemoveCartItemMutation();
  const [clearCart, { isLoading: isClearingCart }] = useClearCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();

  const wishlistIds = useMemo(() => {
    return new Set((wishlist?.data ?? []).map((item) => item._id));
  }, [wishlist?.data]);

  const handleWishlistToggle = async (productId: string) => {
    if (!productId || wishlistLoadingId === productId) {
      return;
    }

    const isInWishlist = wishlistIds.has(productId);

    try {
      setWishlistLoadingId(productId);

      if (isInWishlist) {
        await removeFromWishlist(productId).unwrap();
        toast.success("Removed from Wishlist");
        return;
      }

      await addToWishlist({ productId }).unwrap();
      toast.success("Added to Wishlist");
    } catch {
      toast.error("Wishlist action failed");
    } finally {
      setWishlistLoadingId(null);
    }
  };

  if (isAuthLoading || !isLoggedIn) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const cartItems = cart?.data?.products ?? [];
  const numOfCartItems = cart?.numOfCartItems ?? 0;
  const totalCartPrice = cart?.data?.totalCartPrice ?? 0;

  // Empty state
  if (numOfCartItems === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-medium">Shopping Cart</span>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="w-24 h-24 text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              Looks like you haven&apos;t added anything to your cart yet. Start
              exploring our products!
            </p>

            {/* Popular Categories */}
            <div className="mb-8 w-full max-w-2xl">
              <h3 className="text-gray-500 text-center mb-6 font-medium">
                Popular Categories
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  "Electronics",
                  "Fashion",
                  "Home",
                  "Beauty",
                  "Sports",
                  "Books",
                ].map((category) => (
                  <button
                    key={category}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-green-600 hover:text-green-600 transition"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold">
                Start Shopping →
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Cart with items
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-green-600">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Shopping Cart</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              {numOfCartItems} item{numOfCartItems !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-gray-600">
            You have {numOfCartItems} item{numOfCartItems !== 1 ? "s" : ""} in
            your cart
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((cartItem) => {
              const productId = cartItem.product._id;
              const isInWishlist = wishlistIds.has(productId);
              const isWishlistMutating =
                wishlistLoadingId === productId &&
                (isAddingToWishlist || isRemovingFromWishlist);

              return (
                <div
                  key={cartItem._id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  {/* Product Image */}
                  <div className="relative shrink-0">
                    {!loadedImages[cartItem.product._id] ? (
                      <Skeleton className="absolute inset-0 h-24 w-24 rounded-lg" />
                    ) : null}
                    <Image
                      src={cartItem.product?.imageCover || "/placeholder.jpg"}
                      alt={cartItem.product?.title || "Product"}
                      width={96}
                      height={96}
                      onLoadingComplete={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [cartItem.product._id]: true,
                        }))
                      }
                      className={`w-24 h-24 object-cover rounded-lg transition-opacity duration-200 ${
                        loadedImages[cartItem.product._id]
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                      {cartItem.product?.title}
                    </h3>

                    <div className="flex flex-col gap-2 mb-3 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Category:</span>{" "}
                        {cartItem.product?.category?.name || "General"}
                      </p>
                      <p className="font-semibold text-green-600">
                        {cartItem.price} EGP per unit
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (cartItem.count > 1) {
                            setQuantityLoading({
                              id: cartItem.product._id,
                              direction: "decrease",
                            });
                            updateQuantity({
                              productId: cartItem.product._id,
                              body: { count: cartItem.count - 1 },
                            })
                              .unwrap()
                              .then(() => {
                                toast.success("Quantity updated");
                              })
                              .catch(() => {
                                toast.error("Failed to update quantity");
                              })
                              .finally(() => {
                                setQuantityLoading(null);
                              });
                          }
                        }}
                        disabled={isUpdatingQuantity || cartItem.count <= 1}
                        className="h-8 w-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                      >
                        {quantityLoading?.id === cartItem.product._id &&
                        quantityLoading.direction === "decrease" ? (
                          <Spinner size="sm" className="text-gray-600" />
                        ) : (
                          "−"
                        )}
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {cartItem.count}
                      </span>
                      <button
                        onClick={() => {
                          setQuantityLoading({
                            id: cartItem.product._id,
                            direction: "increase",
                          });
                          updateQuantity({
                            productId: cartItem.product._id,
                            body: { count: cartItem.count + 1 },
                          })
                            .unwrap()
                            .then(() => {
                              toast.success("Quantity updated");
                            })
                            .catch(() => {
                              toast.error("Failed to update quantity");
                            })
                            .finally(() => {
                              setQuantityLoading(null);
                            });
                        }}
                        disabled={isUpdatingQuantity}
                        className="h-8 w-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                      >
                        {quantityLoading?.id === cartItem.product._id &&
                        quantityLoading.direction === "increase" ? (
                          <Spinner size="sm" className="text-gray-600" />
                        ) : (
                          "+"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Item Total & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <p className="text-xl font-bold text-green-600">
                        {(cartItem.price * cartItem.count).toFixed(2)} EGP
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleWishlistToggle(productId)}
                        disabled={isWishlistMutating}
                        className="p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                      >
                        {isWishlistMutating ? (
                          <Spinner size="sm" className="text-gray-500" />
                        ) : (
                          <Heart
                            size={18}
                            className={
                              isInWishlist
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }
                          />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setRemoveLoadingId(cartItem.product._id);
                          removeItem(cartItem.product._id)
                            .unwrap()
                            .then(() => {
                              toast.success("Item removed from cart");
                            })
                            .catch(() => {
                              toast.error("Failed to remove item");
                            })
                            .finally(() => {
                              setRemoveLoadingId(null);
                            });
                        }}
                        disabled={
                          isRemovingItem ||
                          removeLoadingId === cartItem.product._id
                        }
                        className="p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                      >
                        {removeLoadingId === cartItem.product._id ? (
                          <Spinner size="sm" className="text-gray-500" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping Link */}
            <Link
              href="/"
              className="flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition mt-6"
            >
              <ChevronLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 sticky top-24">
              {/* Summary Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="text-2xl">🛒</div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order Summary
                </h2>
              </div>

              {/* Free Shipping Badge */}
              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-3 flex items-start gap-3">
                <div className="text-2xl">🚚</div>
                <div>
                  <p className="font-bold text-green-700">Free Shipping!</p>
                  <p className="text-xs text-green-600">
                    You qualify for free delivery
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {totalCartPrice.toFixed(2)} EGP
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  {totalCartPrice.toFixed(2)} EGP
                </span>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold mb-3 flex items-center justify-center gap-2">
                  <span>🔒</span>
                  Secure Checkout
                </Button>
              </Link>

              {/* Clear Cart Button */}
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to clear your cart?")
                  ) {
                    clearCart()
                      .unwrap()
                      .then(() => {
                        toast.success("Cart cleared");
                      })
                      .catch(() => {
                        toast.error("Failed to clear cart");
                      });
                  }
                }}
                disabled={isClearingCart}
                className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition disabled:opacity-50"
              >
                {isClearingCart ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" className="text-gray-600" />
                    Clearing...
                  </span>
                ) : (
                  "Clear Cart"
                )}
              </button>

              {/* Payment Info */}
              <div className="mt-6 space-y-2 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Secure Payment with encrypted data</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Fast Delivery in 1-2 business days</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Easy Returns & Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
