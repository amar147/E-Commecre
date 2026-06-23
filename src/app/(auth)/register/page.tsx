"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CircleUserRound,
  Share2,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignupMutation } from "@/store/apiSlice";
import { RegisterSchema, type RegisterFormValues } from "@/types/schemas";

const BRAND_GREEN = "#16A34A";
const LIGHT_GREEN = "#DCFCE7";

function getPasswordStrength(password: string) {
  const checks = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;

  if (!password) {
    return { label: "Weak", score: 0, color: "#DC2626", checks };
  }

  if (passed <= 1) {
    return { label: "Weak", score: 1, color: "#DC2626", checks };
  }

  if (passed === 2) {
    return { label: "Medium", score: 2, color: "#F59E0B", checks };
  }

  return { label: "Strong", score: 3, color: BRAND_GREEN, checks };
}

function getApiErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  const maybeData = (error as { data?: { message?: string } }).data;
  if (maybeData?.message) {
    return maybeData.message;
  }

  const maybeError = (error as { error?: string }).error;
  if (maybeError) {
    return maybeError;
  }

  return "Something went wrong. Please try again.";
}

export default function RegisterPage() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    mode: "onBlur",
  });

  const password = useWatch({ control: form.control, name: "password" });

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    const toastId = "password-strength";
    if (!password) {
      toast.dismiss(toastId);
      return;
    }

    toast(
      <div className="space-y-1">
        <p className="font-semibold">Password Strength: {strength.label}</p>
        <p className="text-xs text-slate-700">
          Use at least 8 chars, one number, and one symbol.
        </p>
      </div>,
      {
        id: toastId,
        style: {
          borderColor: strength.color,
          borderWidth: "1px",
        },
        duration: 1200,
      },
    );
  }, [password, strength.color, strength.label]);

  async function onSubmit(values: RegisterFormValues) {
    try {
      await signup(values).unwrap();
      toast.success("Account created successfully. You can login now.");
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <section className="grid min-h-[calc(100vh-11rem)] grid-cols-1 gap-6 md:grid-cols-2">
        <aside className="order-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 md:order-1 md:p-7">
          <h1 className="text-type-max leading-tight font-bold text-slate-700">
            Welcome to <span style={{ color: BRAND_GREEN }}>FreshCart</span>
          </h1>
          <p className="text-type-md-lg mt-3 max-w-md leading-9 font-semibold text-slate-600">
            Join thousands of happy customers who enjoy fresh groceries
            delivered right to their doorstep.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-3">
              <span
                className="mt-1 inline-flex size-8 items-center justify-center rounded-full"
                style={{ backgroundColor: LIGHT_GREEN, color: BRAND_GREEN }}
              >
                <Star className="size-4" />
              </span>
              <div>
                <h2 className="text-type-md-lg font-bold text-slate-700">
                  Premium Quality
                </h2>
                <p className="text-type-base text-slate-500">
                  Premium quality products sourced from trusted suppliers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span
                className="mt-1 inline-flex size-8 items-center justify-center rounded-full"
                style={{ backgroundColor: LIGHT_GREEN, color: BRAND_GREEN }}
              >
                <Truck className="size-4" />
              </span>
              <div>
                <h2 className="text-type-md-lg font-bold text-slate-700">
                  Fast Delivery
                </h2>
                <p className="text-type-base text-slate-500">
                  Same-day delivery available in most areas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span
                className="mt-1 inline-flex size-8 items-center justify-center rounded-full"
                style={{ backgroundColor: LIGHT_GREEN, color: BRAND_GREEN }}
              >
                <ShieldCheck className="size-4" />
              </span>
              <div>
                <h2 className="text-type-md-lg font-bold text-slate-700">
                  Secure Shopping
                </h2>
                <p className="text-type-base text-slate-500">
                  Your data and payments are completely secure
                </p>
              </div>
            </div>
          </div>

          <article className="mt-8 rounded-lg border border-[#E2E8F0] bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#BBF7D0] text-[#166534]">
                <CircleUserRound className="size-5" />
              </span>
              <div>
                <p className="text-type-md font-semibold text-slate-700">
                  Sarah Johnson
                </p>
                <div className="flex items-center gap-1 text-[#EAB308]">
                  <Star className="size-4 fill-current" />
                  <Star className="size-4 fill-current" />
                  <Star className="size-4 fill-current" />
                  <Star className="size-4 fill-current" />
                  <Star className="size-4 fill-current" />
                </div>
              </div>
            </div>
            <p className="text-type-base mt-3 text-slate-500 italic">
              &ldquo;FreshCart has transformed my shopping experience. The
              quality of the products is outstanding, and the delivery is always
              on time. Highly recommend!&rdquo;
            </p>
          </article>
        </aside>

        <section className="order-1 rounded-xl border border-[#E2E8F0] bg-white p-6 md:order-2 md:p-7">
          <h2 className="text-type-max text-center font-bold text-slate-700">
            Create Your Account
          </h2>
          <p className="text-type-base mt-2 text-center text-slate-500">
            Start your fresh journey with us today
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 text-slate-700"
            >
              <span className="text-[#EA4335]">G</span>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 text-slate-700"
            >
              <Share2 className="size-4 text-[#1877F2]" />
              Facebook
            </Button>
          </div>

          <div className="text-type-sm my-5 flex items-center gap-3 text-slate-400">
            <div className="h-px flex-1 bg-[#E2E8F0]" />
            <span>or</span>
            <div className="h-px flex-1 bg-[#E2E8F0]" />
          </div>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-type-base font-medium text-slate-700">
                      Name*
                    </FormLabel>
                    <FormControl>
                      <Input className="h-11" placeholder="Amar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-type-base font-medium text-slate-700">
                      Email*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        placeholder="amar@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-type-base font-medium text-slate-700">
                      Password*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        placeholder="create a strong password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(strength.score / 3) * 100}%`,
                            backgroundColor: strength.color,
                          }}
                        />
                      </div>
                      <span
                        className="text-type-min font-semibold"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <FormDescription>
                      Must be at least 8 characters with numbers and symbols
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-type-base font-medium text-slate-700">
                      Confirm Password*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        placeholder="confirm your password"
                        type="password"
                        {...field}
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
                    <FormLabel className="text-type-base font-medium text-slate-700">
                      Phone Number*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        placeholder="+20 11 4833 2517"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <label className="text-type-sm flex items-center gap-3 text-slate-600">
                <input
                  className="size-4 rounded border border-[#CBD5E1]"
                  type="checkbox"
                />
                I agree to the{" "}
                <span style={{ color: BRAND_GREEN }}>Terms of Service</span> and
                <span style={{ color: BRAND_GREEN }}>Privacy Policy</span> *
              </label>

              <Button
                className="text-type-base h-11 w-full font-semibold text-white"
                disabled={isLoading}
                style={{ backgroundColor: BRAND_GREEN }}
                type="submit"
              >
                <Check className="size-4" />
                {isLoading ? "Creating account..." : "Create My Account"}
              </Button>
            </form>
          </Form>

          <p className="text-type-sm mt-8 text-center text-slate-600">
            Already have an account?{" "}
            <Link
              className="font-semibold"
              href="/login"
              style={{ color: BRAND_GREEN }}
            >
              Sign In
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
