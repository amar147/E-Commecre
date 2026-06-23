"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

function Sheet({ ...props }: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof Dialog.Portal>) {
  return <Dialog.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-all duration-300 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Content> & {
  side?: "left" | "right";
}) {
  const sideClasses =
    side === "left"
      ? "left-0 border-r data-[state=closed]:-translate-x-full"
      : "right-0 border-l data-[state=closed]:translate-x-full";

  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        data-slot="sheet-content"
        className={cn(
          "fixed inset-y-0 z-50 w-[90vw] max-w-sm border-[#E5E7EB] bg-white p-4 shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=open]:translate-x-0",
          sideClasses,
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-3 top-3 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      data-slot="sheet-description"
      className={cn("text-sm text-slate-500", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
};
