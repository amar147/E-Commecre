"use client";

import { Package2, ShieldCheck, Truck } from "lucide-react";

type CartItem = {
  _id: string;
  count: number;
  price: number;
  product?: {
    imageCover?: string;
    title?: string;
  };
};

type OrderSummarySidebarProps = {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
};

export default function OrderSummarySidebar({
  cartItems,
  subtotal,
  total,
}: OrderSummarySidebarProps) {
  return (
    <aside className="h-fit lg:sticky lg:top-6 lg:col-span-1">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-green-700 px-5 py-4 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Package2 className="size-4" />
            Order Summary
          </div>
          <p className="mt-1 text-xs text-green-100">
            {cartItems.length} items
          </p>
        </div>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img
                    src={
                      item.product?.imageCover ||
                      "/assets/images/slidebar_1.jpg"
                    }
                    alt={item.product?.title || "Product"}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {item.product?.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.count} x {item.price} EGP
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {(item.count * item.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-4 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString()} EGP</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-950">
              <span>Total</span>
              <span className="text-green-700">
                {total.toLocaleString()} EGP
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Secure
              </span>
              <span className="inline-flex items-center gap-1">
                <Truck className="size-3.5 text-blue-500" />
                Fast Delivery
              </span>
              <span className="inline-flex items-center gap-1">
                <Package2 className="size-3.5 text-orange-500" />
                Easy Returns
              </span>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
