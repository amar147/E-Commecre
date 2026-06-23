"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onValueChange: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

function RadioGroup({
  className,
  name,
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<"div"> & {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const generatedName = React.useId();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const controlledValue = value ?? internalValue;

  return (
    <RadioGroupContext.Provider
      value={{
        name: name ?? generatedName,
        value: controlledValue,
        onValueChange: (nextValue) => {
          if (value === undefined) {
            setInternalValue(nextValue);
          }
          onValueChange?.(nextValue);
        },
      }}
    >
      <div
        data-slot="radio-group"
        className={cn("grid gap-3", className)}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({
  className,
  value,
  ...props
}: React.ComponentProps<"input"> & { value: string }) {
  const context = React.useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem must be used within RadioGroup");
  }

  const checked = context.value === value;

  return (
    <input
      data-slot="radio-group-item"
      type="radio"
      name={context.name}
      value={value}
      checked={checked}
      onChange={() => context.onValueChange(value)}
      className={cn(
        "mt-1 size-4 shrink-0 appearance-none rounded-full border border-slate-300 bg-white transition checked:border-green-600 checked:bg-green-600 checked:shadow-[inset_0_0_0_3px_white] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupItem };
