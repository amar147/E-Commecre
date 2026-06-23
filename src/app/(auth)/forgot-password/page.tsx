"use client";

import { Suspense, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock, Mail, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import PasswordResetShell from "@/app/(auth)/_components/PasswordResetShell";
import {
  getApiErrorMessage,
  persistResetEmail,
} from "@/app/(auth)/_components/passwordResetUtils";
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
import { useForgotPasswordMutation } from "@/store/apiSlice";
import {
  ForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/types/schemas";

function ForgotPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState<string>("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const initialEmail = useMemo(
    () => searchParams.get("email") ?? "",
    [searchParams],
  );

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: initialEmail,
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setApiError("");

    try {
      await forgotPassword({ email: values.email }).unwrap();
      persistResetEmail(values.email);
      toast.success("Reset code sent to your email.");
      router.push(`/verify-code?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setApiError(message);
      toast.error(message);
    }
  }

  return (
    <PasswordResetShell
      title="Forgot Password?"
      subtitle="No worries, we'll send you a reset code"
      steps={[
        { icon: Mail, state: "active" },
        { icon: KeyRound, state: "inactive" },
        { icon: Lock, state: "inactive" },
      ]}
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-type-lg font-semibold text-[#0F2A4D]">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#9CA3AF]" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="text-type-lg h-16 rounded-[13px] border-[#CBD5E1] bg-[#E2E8F0] pl-12 text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#16A34A]"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-type-base" />
              </FormItem>
            )}
          />

          {apiError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {apiError}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isLoading}
            className="text-type-max h-16 w-full rounded-[13px] bg-[#16A34A] font-bold text-white shadow-[0_10px_20px_rgba(22,163,74,0.26)] hover:bg-[#15803D]"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" /> Sending...
              </span>
            ) : (
              "Send Reset Code"
            )}
          </Button>

          <div className="pt-1 text-center">
            <Link
              href="/login"
              className="text-type-max inline-flex items-center gap-2 font-medium text-[#16A34A] hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to Sign In
            </Link>
          </div>

          <div className="border-t border-[#E2E8F0] pt-6 text-center">
            <p className="text-type-lg text-[#64748B]">
              Need Help?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#0F2A4D] hover:underline"
              >
                Contact Support
              </Link>
            </p>
            <p className="text-type-lg mt-3 text-[#475569]">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#16A34A] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </PasswordResetShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F4F6]" />}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}
