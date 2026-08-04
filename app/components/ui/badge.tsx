import { cn } from "@/app/lib/utils";

const badgeVariants = {
  default: "bg-surface-tertiary text-text-secondary",
  primary: "bg-primary-100 text-primary-700",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  error: "bg-error-100 text-error-700",
  info: "bg-info-100 text-info-700",
} as const;

const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1 text-sm",
} as const;

export interface BadgeProps {
  variant?: keyof typeof badgeVariants;
  size?: keyof typeof badgeSizes;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        badgeVariants[variant],
        badgeSizes[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-text-muted": variant === "default",
            "bg-primary-500": variant === "primary",
            "bg-success-500": variant === "success",
            "bg-warning-500": variant === "warning",
            "bg-error-500": variant === "error",
            "bg-info-500": variant === "info",
          })}
        />
      )}
      {children}
    </span>
  );
}

export { Badge };
