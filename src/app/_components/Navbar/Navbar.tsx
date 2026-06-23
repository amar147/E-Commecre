"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  CircleUserRound,
  Headphones,
  Headset,
  Heart,
  Home,
  Layers,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Package,
  Phone,
  Search,
  Store,
  ShoppingCart,
  Settings,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetCategoriesQuery,
  useGetLoggedUserCartQuery,
  useGetWishlistQuery,
} from "@/store/apiSlice";
import { useAuthState } from "@/hooks/useAuthState";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const DRAWER_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/products" },
  { label: "Brands", href: "/brands" },
];

const CATEGORY_MENU_LABELS = [
  "Electronics",
  "Women's Fashion",
  "Men's Fashion",
  "Beauty & Health",
];

const MOBILE_LINK_CLASS =
  "flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-[14px] text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600";

function getMobileNavIcon(label: string) {
  switch (label) {
    case "Home":
      return <Home size={18} />;
    case "Shop":
      return <Store size={18} />;
    case "Brands":
      return <Package size={18} />;
    default:
      return null;
  }
}

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { isLoggedIn, profile, isLoading: isAuthLoading } = useAuthState();
  const { data: cartData } = useGetLoggedUserCartQuery(undefined, {
    skip: !isLoggedIn || isSigningOut,
  });
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn || isSigningOut,
  });
  const { data: categoriesData } = useGetCategoriesQuery();

  const categoriesForMenu = useMemo(() => {
    const all = categoriesData?.data ?? [];
    return CATEGORY_MENU_LABELS.map((label) => {
      const match = all.find(
        (item) => item.name.trim().toLowerCase() === label.trim().toLowerCase(),
      );

      return {
        label,
        href: match
          ? `/products?category=${encodeURIComponent(match._id)}`
          : "/products",
      };
    });
  }, [categoriesData?.data]);

  async function handleSignOut() {
    setIsSigningOut(true);
    dispatch(logout());

    try {
      await signOut({ redirect: false });
      toast.success("Signed out successfully.");
      router.push("/login");
    } catch {
      setIsSigningOut(false);
      toast.error("Unable to sign out. Please try again.");
    }
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const keyword = search.trim();
    const targetUrl = keyword
      ? `/products?keyword=${encodeURIComponent(keyword)}`
      : "/products";

    router.push(targetUrl);
    setSearch("");
  }

  const displayName = profile?.name?.trim() ?? "";
  const displayEmail = profile?.email?.trim() ?? "";
  const isProfileLoading = isLoggedIn && isAuthLoading && !displayName;
  const guestAuthLinks = (
    <>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 font-medium text-slate-700 transition hover:text-[#16A34A]"
      >
        <User className="size-4" />
        Sign In
      </Link>
      <Link
        href="/register"
        className="inline-flex items-center gap-1.5 font-medium text-slate-700 transition hover:text-[#16A34A]"
      >
        <UserPlus className="size-4" />
        Sign Up
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white">
      <div className="hidden border-b border-[#E5E7EB] bg-[#F8F9FA] lg:block">
        <div className="text-type-sm mx-auto flex h-11 w-full max-w-7xl items-center justify-between px-4 text-slate-600 md:px-6">
          <div className="flex items-center gap-8">
            <p className="inline-flex items-center gap-2">
              <ShoppingCart className="size-4 text-[#16A34A]" />
              Free Shipping on Orders{" "}
              <span className="font-semibold text-[#16A34A]">500 EGP</span>
            </p>
            <p className="inline-flex items-center gap-2">
              <Heart className="size-4 text-[#16A34A]" />
              New Arrivals Daily
            </p>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="tel:+18001234567"
              className="inline-flex cursor-pointer items-center gap-2 transition hover:text-green-600"
            >
              <Phone className="size-4" />
              +1 (800) 123-4567
            </a>
            <a
              href="mailto:support@freshcart.com"
              className="inline-flex cursor-pointer items-center gap-2 border-x border-[#D7DCE2] px-5 transition hover:text-green-600"
            >
              <Mail className="size-4" />
              support@freshcart.com
            </a>

            {isLoggedIn ? (
              <>
                {isProfileLoading ? (
                  <span
                    className="inline-flex items-center gap-2"
                    aria-live="polite"
                  >
                    <User className="size-4" />
                    <span className="h-4 w-24 animate-pulse rounded-full bg-slate-300" />
                  </span>
                ) : displayName ? (
                  <span className="inline-flex items-center gap-2">
                    <User className="size-4" />
                    {displayName}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 font-medium text-slate-700 transition hover:text-red-600"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </>
            ) : (
              guestAuthLinks
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-type-lg flex items-center gap-2 font-bold text-slate-800"
          >
            <span className="text-[#16A34A]">🛒</span>
            FreshCart
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="hidden flex-1 lg:block">
          <div className="relative">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="text-type-base h-13 rounded-full border-[#D5DBE3] pr-16"
              placeholder="Search for products, brands and more..."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#16A34A] text-white"
            >
              <Search className="size-5" />
            </button>
          </div>
        </form>

        <div className="ml-auto hidden items-center gap-5 lg:flex">
          <nav className="text-type-base flex items-center gap-8 font-medium text-slate-800">
            <Link href="/" className="transition hover:text-[#16A34A]">
              Home
            </Link>
            <Link href="/products" className="transition hover:text-[#16A34A]">
              Shop
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 transition hover:text-[#16A34A]"
              >
                Categories
                <ChevronDown className="size-4" />
              </button>

              <div className="absolute left-0 top-full h-3 w-full bg-transparent" />

              {isCategoriesOpen ? (
                <div className="absolute left-0 top-full z-50 w-62.5 pt-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-[0_20px_50px_rgba(2,6,23,0.15)]">
                    <Link
                      href="/products"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="text-type-md-lg block rounded-xl px-3 py-2.5 font-medium transition hover:bg-slate-50"
                    >
                      All Categories
                    </Link>

                    {categoriesForMenu.map((category) => (
                      <Link
                        key={category.label}
                        href={category.href}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="text-type-md-lg block rounded-xl px-3 py-2.5 font-medium transition hover:bg-slate-50"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <Link href="/brands" className="transition hover:text-[#16A34A]">
              Brands
            </Link>
          </nav>

          <div className="flex items-center gap-4 border-l border-[#D7DCE2] pl-4 text-slate-500">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-emerald-50"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#ECFDF5] text-[#16A34A]">
                <Headset className="size-5" />
              </span>
              <p className="leading-tight">
                <span className="text-type-sm text-slate-400">Support</span>
                <br />
                <span className="text-type-base font-semibold text-slate-700">
                  24/7 Help
                </span>
              </p>
            </Link>
            <Link
              href="/wishlist"
              className="relative p-1 transition hover:text-[#16A34A]"
            >
              <Heart className="size-7" />
              {!isSigningOut && wishlistData?.count ? (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {wishlistData.count}
                </span>
              ) : null}
            </Link>
            <Link
              href="/cart"
              className="relative p-1 transition hover:text-[#16A34A]"
            >
              <ShoppingCart className="size-7" />
              {!isSigningOut && cartData?.numOfCartItems ? (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartData.numOfCartItems}
                </span>
              ) : null}
            </Link>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-slate-700 transition hover:bg-slate-100 hover:text-[#16A34A] cursor-pointer"
                    aria-label="Open account menu"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      <CircleUserRound className="size-4" />
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-72.5 bg-white p-2"
                >
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                        <CircleUserRound className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-type-md-lg truncate font-semibold text-slate-900">
                          {isProfileLoading
                            ? "Loading..."
                            : displayName || "My Account"}
                        </p>
                        {displayEmail ? (
                          <p className="text-type-base truncate text-slate-500">
                            {displayEmail}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="w-full">
                      <User className="size-4 text-slate-400" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/allorders" className="w-full">
                      <ShoppingCart className="size-4 text-slate-400" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="w-full">
                      <Heart className="size-4 text-slate-400" />
                      My Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/addresses" className="w-full">
                      <MapPin className="size-4 text-slate-400" />
                      Addresses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings" className="w-full">
                      <Settings className="size-4 text-slate-400" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      handleSignOut();
                    }}
                    className="text-red-500 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="size-4 text-red-500" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="text-type-sm inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-5 py-2 font-semibold text-white transition hover:bg-[#15803D]"
              >
                <User className="size-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link
            href="/wishlist"
            className="relative rounded-full p-2 text-slate-600"
          >
            <Heart className="size-5" />
            {!isSigningOut && wishlistData?.count ? (
              <span className="text-type-min absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 font-bold text-white">
                {wishlistData.count}
              </span>
            ) : null}
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-slate-600"
          >
            <ShoppingCart className="size-5" />
            {!isSigningOut && cartData?.numOfCartItems ? (
              <span className="text-type-min absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 font-bold text-white">
                {cartData.numOfCartItems}
              </span>
            ) : null}
          </Link>

          <Sheet modal={true}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full bg-[#16A34A] text-white"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88vw] max-w-90 overflow-hidden p-0 [&>button]:right-4 [&>button]:top-4 [&>button]:inline-flex [&>button]:size-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-slate-100 [&>button]:text-slate-500 [&>button]:hover:bg-slate-200"
            >
              <SheetHeader className="border-b border-[#E5E7EB] px-4 py-4 pr-16">
                <SheetTitle className="text-type-max flex items-center gap-2 font-bold text-slate-800">
                  <span className="text-[#16A34A]">🛒</span>
                  FreshCart
                </SheetTitle>
              </SheetHeader>

              <div className="flex max-h-screen flex-col overflow-y-auto px-3 pb-3">
                <form onSubmit={handleSearchSubmit} className="relative mt-3">
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-10 rounded-xl border-[#D5DBE3] bg-white pr-12 text-sm"
                    placeholder="Search products..."
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#16A34A] text-white shadow-sm"
                  >
                    <Search className="size-4" />
                  </button>
                </form>

                <nav className="mt-3 space-y-0.5 py-0.5">
                  {DRAWER_ITEMS.filter(
                    (item) => item.label !== "Categories",
                  ).map((item) => (
                    <SheetClose asChild key={item.label}>
                      <Link href={item.href} className={MOBILE_LINK_CLASS}>
                        {getMobileNavIcon(item.label)}
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}

                  <div className="rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        setIsMobileCategoriesOpen((previous) => !previous)
                      }
                      className={`${MOBILE_LINK_CLASS} w-full justify-between`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Layers size={18} />
                        Categories
                      </span>
                      <ChevronDown
                        className={`size-4 text-slate-500 transition-transform ${
                          isMobileCategoriesOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {isMobileCategoriesOpen ? (
                      <div className="mt-1 ml-4 space-y-0.5 border-l border-slate-200 pl-3">
                        {categoriesForMenu.map((category) => (
                          <SheetClose asChild key={`drawer-${category.label}`}>
                            <Link
                              href={category.href}
                              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-500 transition-colors hover:bg-green-50 hover:text-green-600"
                            >
                              {category.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </nav>

                <div className="mt-2 space-y-1.5 border-y border-[#E5E7EB] py-2">
                  <SheetClose asChild>
                    <Link href="/contact" className={MOBILE_LINK_CLASS}>
                      <Headphones size={18} />
                      Contact Us
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link href="/allorders" className={MOBILE_LINK_CLASS}>
                      <Package size={18} />
                      My Orders
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="/wishlist"
                      className={`${MOBILE_LINK_CLASS} justify-between`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Heart size={18} />
                        Wishlist
                      </span>
                      {!isSigningOut && wishlistData?.count ? (
                        <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                          {wishlistData.count}
                        </span>
                      ) : null}
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="/cart"
                      className={`${MOBILE_LINK_CLASS} justify-between`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <ShoppingCart size={18} />
                        Cart
                      </span>
                      {!isSigningOut && cartData?.numOfCartItems ? (
                        <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[11px] font-bold text-white">
                          {cartData.numOfCartItems}
                        </span>
                      ) : null}
                    </Link>
                  </SheetClose>
                </div>

                <div className="mt-2 pt-2">
                  {isLoggedIn ? (
                    <div className="space-y-1.5">
                      <SheetClose asChild>
                        <Link href="/account" className={MOBILE_LINK_CLASS}>
                          <CircleUserRound size={18} />
                          {isProfileLoading
                            ? "Loading..."
                            : displayName || "My Account"}
                        </Link>
                      </SheetClose>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-[14px] text-red-500 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <SheetClose asChild>
                        <Link
                          href="/login"
                          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#16A34A] px-4 text-[14px] font-semibold text-white"
                        >
                          Sign In
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/register"
                          className="inline-flex h-10 items-center justify-center rounded-xl border-2 border-[#16A34A] px-4 text-[14px] font-semibold text-[#16A34A]"
                        >
                          Sign Up
                        </Link>
                      </SheetClose>
                    </div>
                  )}

                  <SheetClose asChild>
                    <Link
                      href="/contact"
                      className="mt-2 flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-[14px] font-medium text-slate-700 transition-colors hover:bg-green-50 hover:text-green-600"
                    >
                      <Headset size={18} />
                      Need Help? Contact Support
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
