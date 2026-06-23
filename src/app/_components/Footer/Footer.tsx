import TrustBadgesFooter from "@/components/custom/TrustBadgesFooter";
import {
  Globe,
  Mail,
  MessageCircle,
  MapPin,
  Play,
  Phone,
  Camera,
  CreditCard,

} from "lucide-react";
import Link from "next/link";

const SHOP_LINKS = [
  "All Products",
  "Categories",
  "Brands",
  "Electronics",
  "Men's Fashion",
  "Women's Fashion",
];
const ACCOUNT_LINKS = [
  "My Account",
  "Order History",
  "Wishlist",
  "Shopping Cart",
  "Sign In",
  "Create Account",
];
const SUPPORT_LINKS = [
  "Contact Us",
  "Help Center",
  "Shipping Info",
  "Returns & Refunds",
  "Track Order",
];

const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

export default function Footer() {
  return (
    <footer className="mt-10">
      <TrustBadgesFooter />

      <div className="inner-footer  bg-linear-to-r from-[#0B1227] to-[#0F172A] text-slate-300">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-6">
            <section className="space-y-4 xl:col-span-2">
              <div className="text-type-lg inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-slate-800">
                <span className="text-[#16A34A]">🛒</span>
                FreshCart
              </div>

              <p className="text-type-base max-w-md leading-8 text-slate-400">
                FreshCart is your one-stop destination for quality products.
                From fashion to electronics, we bring you the best brands at
                competitive prices with a seamless shopping experience.
              </p>

              <div className="text-type-base space-y-3">
                <p className="inline-flex items-center gap-3">
                  <Phone className="size-5 text-[#22C55E]" />
                  +1 (800) 123-4567
                </p>
                <p className="inline-flex items-center gap-3">
                  <Mail className="size-5 text-[#22C55E]" />
                  support@freshcart.com
                </p>
                <p className="inline-flex items-center gap-3">
                  <MapPin className="size-5 text-[#22C55E]" />
                  123 Commerce Street, New York, NY 10001
                </p>
              </div>

              <div className="flex items-center gap-3">
                {[Globe, MessageCircle, Camera, Play].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-type-lg font-semibold text-white">Shop</h3>
              <ul className="text-type-base mt-4 space-y-3 text-slate-400">
                {SHOP_LINKS.map((item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-type-lg font-semibold text-white">Account</h3>
              <ul className="text-type-base mt-4 space-y-3 text-slate-400">
                {ACCOUNT_LINKS.map((item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-type-lg font-semibold text-white">Support</h3>
              <ul className="text-type-base mt-4 space-y-3 text-slate-400">
                {SUPPORT_LINKS.map((item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-type-lg font-semibold text-white">Legal</h3>
              <ul className="text-type-base mt-4 space-y-3 text-slate-400">
                {LEGAL_LINKS.map((item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="text-type-sm mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-slate-400 md:flex-row md:px-6">
            <p>© 2026 FreshCart. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {["Visa", "Mastercard", "PayPal"].map((payment) => (
                <span key={payment} className="inline-flex items-center gap-2">
                  <CreditCard className="size-5" />
                  {payment}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
