"use client";

import { Truck, RotateCcw, Shield, Headset } from "lucide-react";

export default function TrustBadgesFooter() {
  const badges = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over 500 EGP",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "14-day return policy",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure checkout",
    },
    {
      icon: Headset,
      title: "24/7 Support",
      description: "Contact us anytime",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-3 ps-4 py-6 md:py-4 border-t border-b border-slate-200">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div
            key={idx}
            className="flex flex-row items-start text-left gap-4 md:flex-col md:items-center md:text-center"
          >
            <div className="flex shrink-0 items-center justify-center w-14 h-14 rounded-lg bg-[#E8F7EE] md:mb-2">
              <Icon className="text-[#16A34A]" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-type-sm font-semibold text-slate-900">
                {badge.title}
              </h4>
              <p className="text-type-sm text-slate-500 mt-0.5">
                {badge.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
