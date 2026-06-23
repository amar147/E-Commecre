"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound, Loader2, Lock, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import PasswordResetShell from "@/app/(auth)/_components/PasswordResetShell";
import {
  getApiErrorMessage,
  persistResetEmail,
  readPersistedResetEmail,
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
import {
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
} from "@/store/apiSlice";
import {
  VerifyResetCodeSchema,
  type VerifyResetCodeFormValues,
} from "@/types/schemas";

function VerifyCodePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState("");

  const [verifyResetCode, { isLoading }] = useVerifyResetCodeMutation();
  const [forgotPassword, { isLoading: isResending }] =
    useForgotPasswordMutation();

  const queryEmail = useMemo(
    () => searchParams.get("email")?.trim() ?? "",
    [searchParams],
  );
  const email = useMemo(
    () => queryEmail || (readPersistedResetEmail() ?? ""),
    [queryEmail],
  );

  useEffect(() => {
    if (!email) {
      toast("Please enter your email first.");
      router.replace("/forgot-password");
      return;
    }

    persistResetEmail(email);
  }, [email, router]);

  const form = useForm<VerifyResetCodeFormValues>({
    resolver: zodResolver(VerifyResetCodeSchema),
    defaultValues: {
      resetCode: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: VerifyResetCodeFormValues) {
    setApiError("");

    try {
      await verifyResetCode({ resetCode: values.resetCode }).unwrap();
      toast.success("Code verified successfully.");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setApiError(message);
      toast.error(message);
    }
  }

  async function handleResendCode() {
    if (!email) {
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      toast.success("A new verification code has been sent.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <PasswordResetShell
      title="Check Your Email"
      subtitle={
        email
          ? `Enter the 6-digit code sent to ${email}`
          : "Enter the 6-digit code sent to your email"
      }
      steps={[
        { icon: Mail, state: "done" },
        { icon: KeyRound, state: "active" },
        { icon: Lock, state: "inactive" },
      ]}
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="resetCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-type-lg font-semibold text-[#0F2A4D]">
                  Verification Code
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Shield className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#94A3B8]" />
                    <Input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      className="text-type-max h-16 rounded-[13px] border-[#16A34A] bg-[#F8FAFC] pl-12 text-center tracking-[0.35em] text-[#0F2A4D] placeholder:tracking-normal placeholder:text-type-lg placeholder:text-[#94A3B8] focus-visible:ring-[#16A34A]"
                      {...field}
                      onChange={(event) => {
                        const digitsOnly = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        field.onChange(digitsOnly);
                      }}
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

          <p className="text-type-lg pt-1 text-center text-[#64748B]">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              disabled={isResending}
              onClick={handleResendCode}
              className="font-semibold text-[#16A34A] transition hover:underline disabled:opacity-60"
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          </p>

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="text-type-max h-16 w-full rounded-[13px] bg-[#16A34A] font-bold text-white shadow-[0_10px_20px_rgba(22,163,74,0.26)] hover:bg-[#15803D]"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" /> Verifying...
              </span>
            ) : (
              "Verify Code"
            )}
          </Button>

          <div className="pt-1 text-center">
            <Link
              href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="text-type-lg inline-flex items-center gap-2 text-[#64748B] hover:text-[#0F2A4D]"
            >
              <ArrowLeft className="size-4" />
              Change email address
            </Link>
          </div>
        </form>
      </Form>
    </PasswordResetShell>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F4F6]" />}>
      <VerifyCodePageContent />
    </Suspense>
  );
}
