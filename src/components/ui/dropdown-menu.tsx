"use client";

import * as React from "react";
import { DropdownMenu } from "radix-ui";

import { cn } from "@/lib/utils";

function DropdownMenuRoot({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Root>) {
  return <DropdownMenu.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Trigger>) {
  return <DropdownMenu.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Portal>) {
  return <DropdownMenu.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 10,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenuPortal>
      <DropdownMenu.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-60 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.14)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </DropdownMenuPortal>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Label> & { inset?: boolean }) {
  return (
    <DropdownMenu.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium text-slate-900 data-inset:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Separator>) {
  return (
    <DropdownMenu.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-2 my-2 h-px bg-slate-200", className)}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Item> & { inset?: boolean }) {
  return (
    <DropdownMenu.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-3 rounded-2xl px-3 py-3 text-base text-slate-600 outline-none transition-colors focus:bg-[#ECFDF5] focus:text-[#16A34A] data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-10 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-slate-400",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuShortcut,
};
