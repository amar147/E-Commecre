"use client";

import { Truck, RotateCcw, Shield, Headset } from "lucide-react";
import Reveal from "@/components/custom/Reveal";

export default function TrustBadgesHeader() {
  const badges = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over 500 EGP",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "14-day return policy",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: Headset,
      title: "24/7 Support",
      description: "Dedicated support team",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 md:px-18 py-6 md:py-4">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <Reveal key={idx} delay={idx * 0.06} className="h-full">
            <div className="flex flex-row items-center text-left gap-4 bg-white p-4 rounded-2xl shadow-sm">
              <div
                className={`flex shrink-0 items-center justify-center w-12 h-12 rounded-full ${badge.bgColor}`}
              >
                <Icon className={badge.iconColor} size={24} />
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
          </Reveal>
        );
      })}
    </div>
  );
}
