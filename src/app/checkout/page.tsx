"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Package2,
  ShieldCheck,
  Truck,
  WalletCards,
  CheckCircle2,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import AddressSelectionCard from "@/app/_components/Checkout/AddressSelectionCard";
import OrderSummarySidebar from "@/app/_components/Checkout/OrderSummarySidebar";
import {
  useAddAddressMutation,
  useCreateCashOrderMutation,
  useCreateOnlineOrderMutation,
  useGetAddressesQuery,
  useGetLoggedUserCartQuery,
} from "@/store/apiSlice";
import { useAuthState } from "@/hooks/useAuthState";

const checkoutSchema = z.object({
  details: z.string().min(1, "Street Address is required"),
  city: z.string().min(1, "Town / City is required"),
  phone: z.string().min(1, "Phone is required"),
  paymentMethod: z.enum(["cash", "online"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center text-slate-600">
        <Loader2 className="size-7 animate-spin text-green-600" />
        <p className="text-sm font-medium">Loading checkout...</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuthState();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressName, setNewAddressName] = useState("");

  useEffect(() => {
    if (isAuthLoading || isLoggedIn) {
      return;
    }

    router.push("/login");
  }, [isAuthLoading, isLoggedIn, router]);

  const {
    data: cart,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useGetLoggedUserCartQuery(undefined, {
    skip: !isLoggedIn,
  });
  const {
    data: addressesResponse,
    isLoading: isAddressesLoading,
    isError: isAddressesError,
  } = useGetAddressesQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [createCashOrder, { isLoading: isCreatingCashOrder }] =
    useCreateCashOrderMutation();
  const [createOnlineOrder, { isLoading: isCreatingOnlineOrder }] =
    useCreateOnlineOrderMutation();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      details: "",
      city: "",
      phone: "",
      paymentMethod: "cash",
    },
  });

  const isSubmitting = isCreatingCashOrder || isCreatingOnlineOrder;
  const paymentMethod = useWatch({
    control: form.control,
    name: "paymentMethod",
  });
  const isFormValid = form.formState.isValid;
  const addresses = useMemo(
    () => addressesResponse?.data ?? [],
    [addressesResponse?.data],
  );

  const cartItems = cart?.data?.products ?? [];
  const subtotal = cart?.data?.totalCartPrice ?? 0;
  const total = subtotal;
  const cartId = cart?.data?._id;

  useEffect(() => {
    if (!addresses.length || selectedAddressId) {
      return;
    }

    const firstAddress = addresses[0];

    const timeoutId = window.setTimeout(() => {
      setSelectedAddressId(firstAddress._id);
      form.setValue("city", firstAddress.city, { shouldValidate: true });
      form.setValue("details", firstAddress.details, { shouldValidate: true });
      form.setValue("phone", firstAddress.phone, { shouldValidate: true });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [addresses, selectedAddressId, form]);

  const handleSelectAddress = (addressId: string) => {
    const address = addresses.find((item) => item._id === addressId);
    if (!address) {
      return;
    }

    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
    form.setValue("city", address.city, { shouldValidate: true });
    form.setValue("details", address.details, { shouldValidate: true });
    form.setValue("phone", address.phone, { shouldValidate: true });
  };

  const handleUseManualAddress = () => {
    setSelectedAddressId(null);
    setShowNewAddressForm(true);
  };

  const handleSaveAddress = async () => {
    const values = form.getValues();
    const name = newAddressName.trim();

    if (
      !name ||
      !values.city.trim() ||
      !values.details.trim() ||
      !values.phone.trim()
    ) {
      toast.error("Please complete all address fields before saving");
      return;
    }

    try {
      const response = await addAddress({
        name,
        city: values.city,
        details: values.details,
        phone: values.phone,
      }).unwrap();

      const savedAddress = response.data.find(
        (item) =>
          item.name === name &&
          item.city === values.city &&
          item.details === values.details &&
          item.phone === values.phone,
      );

      if (savedAddress) {
        setSelectedAddressId(savedAddress._id);
      }

      setShowNewAddressForm(false);
      setNewAddressName("");
      toast.success("Address saved successfully");
    } catch {
      toast.error("Failed to save address");
    }
  };

  async function onSubmit(values: CheckoutFormValues) {
    if (!cartId) {
      toast.error("Cart is not available right now");
      return;
    }

    const selectedAddress = selectedAddressId
      ? addresses.find((item) => item._id === selectedAddressId)
      : null;

    const shippingAddress = {
      details: selectedAddress?.details ?? values.details,
      phone: selectedAddress?.phone ?? values.phone,
      city: selectedAddress?.city ?? values.city,
    };

    try {
      if (values.paymentMethod === "cash") {
        await createCashOrder({ cartId, shippingAddress }).unwrap();
        toast.success("Cash order placed successfully");
        form.reset();
        router.push("/allorders");
        return;
      }

      const result = await createOnlineOrder({
        cartId,
        shippingAddress,
      }).unwrap();
      toast.success("Redirecting to payment gateway");
      form.reset();
      if (result?.session?.url) {
        window.location.assign(result.session.url);
      }
    } catch {
      toast.error("Failed to place order");
    }
  }

  if (isAuthLoading || !isLoggedIn || isCartLoading) {
    return <PageLoader />;
  }

  if (isCartError) {
    return (
      <main className="min-h-screen bg-[#f7f8f3] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
            >
              <ChevronLeft className="size-4" />
              Back to Cart
            </Link>
          </div>
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">
              We could not load your cart.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Please try again in a moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!cartItems.length) {
    return (
      <main className="min-h-screen bg-[#f7f8f3] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Complete Your Order
              </h1>
              <p className="text-sm text-slate-600">
                Review your items and complete your purchase
              </p>
            </div>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
            >
              <ChevronLeft className="size-4" />
              Back to Cart
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Package2 className="mx-auto mb-4 size-10 text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Add products before starting checkout.
            </p>
            <Button
              asChild
              className="mt-6 bg-green-600 text-white hover:bg-green-700"
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f8f3] px-4 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Complete Your Order
            </h1>
            <p className="text-sm text-slate-600">
              Review your items and complete your purchase
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
          >
            <ChevronLeft className="size-4" />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-green-700 px-5 py-4 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="size-4" />
                  Shipping Address
                </div>
                <p className="mt-1 text-xs text-green-100">
                  Where should we deliver your order?
                </p>
              </div>

              <div className="space-y-5 px-5 py-5">
                <AddressSelectionCard
                  isAddressesLoading={isAddressesLoading}
                  isAddressesError={isAddressesError}
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={handleSelectAddress}
                  onUseManualAddress={handleUseManualAddress}
                />

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <Truck className="size-4" />
                    Delivery Information
                  </div>
                  <p className="mt-1 text-xs text-emerald-700/80">
                    Please ensure your address is accurate for smooth delivery
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    {showNewAddressForm || addresses.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Address Name
                        </FormLabel>
                        <Input
                          value={newAddressName}
                          onChange={(event) =>
                            setNewAddressName(event.target.value)
                          }
                          placeholder="e.g. Home, Office"
                          className="mt-2 h-11 rounded-xl bg-white px-4 text-sm"
                        />
                        <div className="mt-3 flex justify-end">
                          <Button
                            type="button"
                            onClick={handleSaveAddress}
                            disabled={isAddingAddress}
                            className="bg-slate-900 text-white hover:bg-slate-800"
                          >
                            {isAddingAddress ? (
                              <span className="inline-flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin" />
                                Saving...
                              </span>
                            ) : (
                              "Save Address"
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">
                            Town / City
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. Cairo, Alexandria, Giza"
                              className="h-11 rounded-xl bg-white px-4 text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">
                            Street Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="House number and street name"
                              className="min-h-28 rounded-xl bg-white px-4 py-3 text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="01xxxxxxxxx"
                              className="h-11 rounded-xl bg-white px-4 text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="bg-green-700 px-5 py-4 text-white">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <WalletCards className="size-4" />
                          Payment Method
                        </div>
                        <p className="mt-1 text-xs text-green-100">
                          Choose how you would like to pay
                        </p>
                      </div>

                      <div className="space-y-4 px-5 py-5">
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="gap-3"
                                >
                                  <label
                                    htmlFor="cash"
                                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                                      paymentMethod === "cash"
                                        ? "border-green-600 bg-green-50 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                  >
                                    <RadioGroupItem
                                      id="cash"
                                      value="cash"
                                      className="mt-1 border-green-600 text-green-600"
                                    />
                                    <div className="flex-1">
                                      <p className="font-semibold text-slate-900">
                                        Cash on Delivery
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        Pay when your order arrives at your
                                        doorstep
                                      </p>
                                    </div>
                                    {paymentMethod === "cash" && (
                                      <CheckCircle2 className="mt-1 size-5 shrink-0 text-green-600" />
                                    )}
                                  </label>

                                  <label
                                    htmlFor="online"
                                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                                      paymentMethod === "online"
                                        ? "border-green-600 bg-green-50 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                  >
                                    <RadioGroupItem
                                      id="online"
                                      value="online"
                                      className="mt-1 border-slate-400 text-green-600"
                                    />
                                    <div className="flex-1">
                                      <p className="font-semibold text-slate-900">
                                        Pay Online
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        Credit/Debit Card via Stripe
                                      </p>
                                      {paymentMethod === "online" && (
                                        <div className="mt-3 flex items-center gap-2">
                                          <svg
                                            className="h-6 w-10 rounded"
                                            viewBox="0 0 48 32"
                                            fill="#1434CB"
                                          >
                                            <path d="M0 6a2 2 0 0 1 2-2h44a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6z" />
                                            <text
                                              x="24"
                                              y="22"
                                              fontSize="10"
                                              fill="white"
                                              textAnchor="middle"
                                              fontWeight="bold"
                                            >
                                              VISA
                                            </text>
                                          </svg>
                                          <svg
                                            className="h-6 w-10 rounded"
                                            viewBox="0 0 48 32"
                                            fill="#FF5F00"
                                          >
                                            <circle cx="18" cy="16" r="10" />
                                            <circle
                                              cx="30"
                                              cy="16"
                                              r="10"
                                              fill="#EB001B"
                                            />
                                          </svg>
                                          <svg
                                            className="h-6 w-10 rounded"
                                            viewBox="0 0 48 32"
                                            fill="#0066B2"
                                          >
                                            <rect
                                              width="48"
                                              height="32"
                                              rx="3"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    {paymentMethod === "online" && (
                                      <CheckCircle2 className="mt-1 size-5 shrink-0 text-green-600" />
                                    )}
                                  </label>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                            <ShieldCheck className="size-4" />
                            Secure & Encrypted
                          </div>
                          <p className="mt-1 text-xs text-emerald-700/80">
                            Your payment info is protected with 256-bit SSL
                            encryption
                          </p>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting || !isFormValid}
                          className="h-12 w-full rounded-xl bg-[#16A34A] text-base font-semibold text-white hover:bg-[#15803D] disabled:bg-green-600/70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="size-4 animate-spin" />
                              Placing Order...
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2">
                              <Package2 className="size-4" />
                              Place Order
                            </span>
                          )}
                        </Button>
                      </div>
                    </section>
                  </form>
                </Form>
              </div>
            </section>
          </div>

          <OrderSummarySidebar
            cartItems={cartItems}
            subtotal={subtotal}
            total={total}
          />
        </div>
      </div>
    </main>
  );
}
