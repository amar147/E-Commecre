import type { LucideIcon } from "lucide-react";
import { Check, Lock, Mail, Shield } from "lucide-react";

import { cn } from "@/lib/utils";

type StepState = "inactive" | "active" | "done";

interface StepConfig {
  icon: LucideIcon;
  state: StepState;
}

interface PasswordResetShellProps {
  title: string;
  subtitle: string;
  steps: [StepConfig, StepConfig, StepConfig];
  children: React.ReactNode;
}

function StepCircle({ icon: Icon, state }: StepConfig) {
  if (state === "done") {
    return (
      <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#16A34A] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
        <Check className="size-5" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full text-white",
        state === "active"
          ? "bg-[#16A34A] ring-4 ring-[#BBF7D0]"
          : "bg-[#E5E7EB] text-[#9CA3AF]",
      )}
    >
      <Icon className="size-4.5" />
    </span>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "h-0.5 w-16 rounded-full sm:w-18",
        active ? "bg-[#16A34A]" : "bg-[#D1D5DB]",
      )}
    />
  );
}

export default function PasswordResetShell({
  title,
  subtitle,
  steps,
  children,
}: PasswordResetShellProps) {
  const [step1, step2, step3] = steps;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full items-center justify-center bg-[#F3F4F6] px-4 py-8 md:px-6">
      <section className="grid w-full max-w-7xl grid-cols-1 items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <aside className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-4">
          <div className="w-full rounded-[20px] border border-[#D1E8DB] bg-[#EAF5EE] p-10 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="relative flex h-85 items-center justify-center overflow-hidden rounded-[16px] bg-[#E3F1E8]">
              <span className="absolute left-8 top-8 size-16 rounded-full bg-[#C9E5D5]" />
              <span className="absolute bottom-10 right-10 size-28 rounded-full bg-[#CFE9D8]" />
              <span className="absolute right-16 top-10 size-12 rounded-full bg-[#C9E5D5]" />

              <div className="relative z-10 flex items-center gap-5">
                <span className="-rotate-12 rounded-2xl bg-white p-4 text-[#22C55E] shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                  <Mail className="size-7" />
                </span>
                <span className="rounded-[28px] border-8 border-[#F1F5F9] bg-[#D5EEDC] p-8 text-[#16A34A] shadow-[0_14px_28px_rgba(15,23,42,0.14)]">
                  <Lock className="size-12" />
                </span>
                <span className="rotate-12 rounded-2xl bg-white p-4 text-[#22C55E] shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                  <Shield className="size-7" />
                </span>
              </div>

              <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-3">
                <span className="size-3 rounded-full bg-[#70CF98]" />
                <span className="size-3 rounded-full bg-[#70CF98]" />
                <span className="size-3 rounded-full bg-[#70CF98]" />
              </div>
            </div>
          </div>

          <div className="mt-7 text-center">
            <h2 className="text-type-max font-bold text-[#0F2A4D]">
              Reset Your Password
            </h2>
            <p className="text-type-lg mx-auto mt-4 max-w-2xl leading-snug text-[#334155]">
              Don&apos;t worry, it happens to the best of us. We&apos;ll help
              you get back into your account in no time.
            </p>
            <div className="text-type-md-lg mt-6 flex items-center justify-center gap-8 text-[#475569]">
              <span className="inline-flex items-center gap-2">
                <Mail className="size-4 text-[#16A34A]" /> Email Verification
              </span>
              <span className="inline-flex items-center gap-2">
                <Shield className="size-4 text-[#16A34A]" /> Secure Reset
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock className="size-4 text-[#16A34A]" /> Encrypted
              </span>
            </div>
          </div>
        </aside>

        <section className="w-full rounded-[18px] border border-[#E5E7EB] bg-white px-6 py-8 shadow-[0_6px_20px_rgba(15,23,42,0.10)] sm:px-8 lg:px-10">
          <div className="text-center">
            <h1 className="text-type-max leading-none font-bold tracking-tight">
              <span className="text-[#16A34A]">Fresh</span>
              <span className="text-[#0F2A4D]">Cart</span>
            </h1>
            <h2 className="text-type-max mt-4 font-bold leading-tight text-[#0F2A4D]">
              {title}
            </h2>
            <p className="text-type-lg mx-auto mt-3 max-w-3xl leading-normal text-[#475569]">
              {subtitle}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <StepCircle icon={step1.icon} state={step1.state} />
            <Connector active={step1.state === "done"} />
            <StepCircle icon={step2.icon} state={step2.state} />
            <Connector active={step2.state === "done"} />
            <StepCircle icon={step3.icon} state={step3.state} />
          </div>

          <div className="mt-8">{children}</div>
        </section>
      </section>
    </main>
  );
}
