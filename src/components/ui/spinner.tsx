import { cn } from "@/lib/utils";

type SpinnerProps = React.ComponentProps<"span"> & {
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "size-3.5 border-2",
  md: "size-5 border-2",
  lg: "size-7 border-[3px]",
};

function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
