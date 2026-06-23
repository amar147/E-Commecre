"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  Package,
  Package2,
  Phone,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetUserOrdersQuery } from "@/store/apiSlice";
import type { Order, OrderItem } from "@/types/api";

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center text-slate-600">
        <Loader2 className="size-7 animate-spin text-green-600" />
        <p className="text-sm font-medium">Loading your orders...</p>
      </div>
    </div>
  );
}

function getOrderStatus(order: Order) {
  if (order.isDelivered) {
    return {
      label: "Delivered",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (order.isPaid) {
    return {
      label: "On the way",
      className: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  return {
    label: "Processing",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  };
}

function formatOrderDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getItemTitle(item?: OrderItem) {
  if (!item) {
    return "Ordered Product";
  }

  if (typeof item.product === "object" && item.product?.title) {
    return item.product.title;
  }

  return "Ordered Product";
}

function getItemImage(item?: OrderItem) {
  if (!item) {
    return "";
  }

  if (typeof item.product === "object") {
    return item.product.imageCover ?? item.product.image ?? "";
  }

  return "";
}

function decodeUserIdFromAccessToken(accessToken?: string): string {
  if (!accessToken) {
    return "";
  }

  const parts = accessToken.split(".");
  if (parts.length < 2) {
    return "";
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded)) as { id?: string; sub?: string };

    return decoded.id ?? decoded.sub ?? "";
  } catch {
    return "";
  }
}

export default function AllOrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {},
  );

  const isAuthLoading = status === "loading";
  const isLoggedIn = status === "authenticated";
  const userId = isLoggedIn
    ? (session?.user?.id ??
      decodeUserIdFromAccessToken(session?.accessToken) ??
      "")
    : "";
  const isValidMongoId = /^[a-f\d]{24}$/i.test(userId);
  const shouldFetchOrders = isLoggedIn && isValidMongoId;

  useEffect(() => {
    if (isAuthLoading || isLoggedIn) {
      return;
    }

    router.push("/login");
  }, [isAuthLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!shouldFetchOrders) {
      return;
    }

    console.log("FINAL CHECK - Requesting orders for ID:", userId);
  }, [shouldFetchOrders, userId]);

  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetUserOrdersQuery(userId, {
    skip: !shouldFetchOrders,
  });

  if (isAuthLoading || (shouldFetchOrders && isLoading)) {
    return <PageLoader />;
  }

  if (isLoggedIn && !isValidMongoId) {
    return (
      <main className="min-h-screen bg-[#f7f8f3] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-amber-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Unable to Resolve Account ID
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Session user ID is missing or invalid. Please sign out and sign in
              again.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return <PageLoader />;
  }

  if (isError || !ordersResponse) {
    return (
      <main className="min-h-screen bg-[#f7f8f3] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="size-4" />
            Back to Shopping
          </Link>

          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <Package2 className="size-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Unable to Load Orders
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              We encountered an error loading your orders. Please try again
              later.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const orders = Array.isArray(ordersResponse)
    ? ordersResponse
    : (ordersResponse?.data ?? []);

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f8f3] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="size-4" />
            Back to Shopping
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <ShoppingBag className="mx-auto mb-4 size-12 text-slate-300" />
            <h2 className="text-2xl font-semibold text-slate-900">
              No Orders Yet
            </h2>
            <p className="mt-3 text-slate-600">
              You have not placed any orders yet. Start shopping to create your
              first order.
            </p>
            <Button
              asChild
              className="mt-6 bg-green-600 text-white hover:bg-green-700"
            >
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f3] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Track and manage your {orders.length} orders
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="size-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = getOrderStatus(order);
            const isExpanded = expandedOrders[order._id] ?? index === 0;
            const firstItem = order.cartItems?.[0];

            return (
              <article
                key={order._id}
                className="rounded-2xl border border-emerald-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="flex size-15 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                        {getItemImage(firstItem) ? (
                          <img
                            src={getItemImage(firstItem)}
                            alt={getItemTitle(firstItem)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="size-6 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                          <p className="font-mono text-lg font-semibold text-slate-900">
                            # {order._id.slice(-5)}
                          </p>
                        </div>

                        <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {formatOrderDate(order.createdAt)}
                          </span>
                          <span>{order.cartItems.length} item(s)</span>
                          <span>
                            {order.shippingAddress?.city || "City N/A"}
                          </span>
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                          {order.totalOrderPrice.toLocaleString()}
                          <span className="ml-1 text-sm font-semibold text-slate-500">
                            EGP
                          </span>
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 sm:w-auto"
                      onClick={() =>
                        setExpandedOrders((previous) => ({
                          ...previous,
                          [order._id]: !isExpanded,
                        }))
                      }
                    >
                      {isExpanded ? "Hide" : "Details"}
                      {isExpanded ? (
                        <ChevronUp className="ml-2 size-4" />
                      ) : (
                        <ChevronDown className="ml-2 size-4" />
                      )}
                    </Button>
                  </div>

                  {isExpanded ? (
                    <div className="space-y-4 border-t border-slate-100 pt-4">
                      <section>
                        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Package className="size-4 text-emerald-600" />
                          Order Items
                        </p>

                        <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-2">
                          {order.cartItems.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center justify-between gap-3 rounded-lg bg-white p-3"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
                                  {getItemImage(item) ? (
                                    <img
                                      src={getItemImage(item)}
                                      alt={getItemTitle(item)}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Package className="size-4 text-slate-400" />
                                  )}
                                </div>
                                <p className="truncate text-sm font-medium text-slate-800">
                                  {getItemTitle(item)}
                                </p>
                              </div>

                              <p className="text-sm text-slate-600">
                                {item.count} x {item.price.toLocaleString()} EGP
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <div className="grid gap-4 lg:grid-cols-2">
                        <section className="rounded-xl border border-slate-100 bg-white p-4">
                          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <MapPin className="size-4 text-blue-500" />
                            Delivery Address
                          </p>

                          <div className="space-y-1 text-sm text-slate-600">
                            <p className="font-medium text-slate-800">
                              {order.shippingAddress?.city || "City N/A"}
                            </p>
                            <p>
                              {order.shippingAddress?.details || "Address N/A"}
                            </p>
                            <p className="inline-flex items-center gap-1">
                              <Phone className="size-3.5" />
                              {order.shippingAddress?.phone || "Phone N/A"}
                            </p>
                          </div>
                        </section>

                        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <p className="mb-3 text-sm font-semibold text-amber-900">
                            Order Summary
                          </p>

                          <div className="space-y-2 text-sm text-slate-700">
                            <div className="flex items-center justify-between">
                              <span>Subtotal</span>
                              <span>
                                {order.totalOrderPrice.toLocaleString()} EGP
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Shipping</span>
                              <span>Free</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-amber-200 pt-2 font-semibold text-slate-900">
                              <span>Total</span>
                              <span>
                                {order.totalOrderPrice.toLocaleString()} EGP
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-white px-2.5 py-1 text-slate-700">
                              Payment: {order.isPaid ? "Paid" : "Pending"}
                            </span>
                            <span className="rounded-full bg-white px-2.5 py-1 text-slate-700">
                              Delivery:{" "}
                              {order.isDelivered ? "Delivered" : "In Progress"}
                            </span>
                          </div>
                        </section>
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4">
          <p className="text-sm text-emerald-700">
            Thank you for your business. If you have any questions about your
            orders, contact our support team.
          </p>
        </div>
      </div>
    </main>
  );
}
