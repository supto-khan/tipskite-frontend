import { type HTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

const cardVariants = {
  default: "bg-surface border border-border-default shadow-sm",
  elevated: "bg-surface border border-border-subtle shadow-md",
  ghost: "bg-transparent",
  primary: "bg-primary-50 border border-primary-200",
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardVariants;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingSizes = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

function Card({
  className,
  variant = "default",
  padding = "md",
  hover = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        cardVariants[variant],
        paddingSizes[padding],
        hover && "hover:shadow-md hover:border-border-strong cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-text-primary", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-text-secondary mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}

function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center gap-3 border-t border-border-default pt-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardFooter };
