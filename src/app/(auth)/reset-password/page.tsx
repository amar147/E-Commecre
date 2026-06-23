"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2, Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import PasswordResetShell from "@/app/(auth)/_components/PasswordResetShell";
import {
  clearPersistedResetEmail,
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
import { useResetPasswordMutation } from "@/store/apiSlice";
import {
  ResetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/types/schemas";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

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
      toast("Please verify your email first.");
      router.replace("/forgot-password");
      return;
    }

    persistResetEmail(email);
  }, [email, router]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setApiError("");

    try {
      await resetPassword({
        email,
        newPassword: values.newPassword,
      }).unwrap();

      clearPersistedResetEmail();
      toast.success(
        "Password updated successfully. Please sign in with your new credentials.",
      );
      router.push("/login");
    } catch (error) {
      const message = getApiErrorMessage(error);
      setApiError(message);
      toast.error(message);
    }
  }

  return (
    <PasswordResetShell
      title="Create New Password"
      subtitle="Your new password must be different from previous passwords"
      steps={[
        { icon: Mail, state: "done" },
        { icon: KeyRound, state: "done" },
        { icon: Lock, state: "active" },
      ]}
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-type-lg font-semibold text-[#0F2A4D]">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#9CA3AF]" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="text-type-lg h-16 rounded-[13px] border-[#CBD5E1] bg-[#F9FAFB] pl-12 pr-12 text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#16A34A]"
                      {...field}
                    />
                    <button
                      type="button"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#64748B]"
                      onClick={() => setShowNewPassword((current) => !current)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-type-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-type-lg font-semibold text-[#0F2A4D]">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#9CA3AF]" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="text-type-lg h-16 rounded-[13px] border-[#CBD5E1] bg-[#F9FAFB] pl-12 pr-12 text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#16A34A]"
                      {...field}
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#64748B]"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
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
            disabled={isLoading || !email}
            className="text-type-max h-16 w-full rounded-[13px] bg-[#16A34A] font-bold text-white shadow-[0_10px_20px_rgba(22,163,74,0.26)] hover:bg-[#15803D]"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" /> Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </PasswordResetShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F4F6]" />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
