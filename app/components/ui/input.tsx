"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/app/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";

    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const currentType = isPasswordType ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={currentType}
            className={cn(
              "block w-full rounded-2xl border bg-surface px-4 py-3 text-sm text-text-primary",
              "placeholder:text-text-muted",
              "transition-all duration-150",
              "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-secondary",
              error
                ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                : "border-border-default",
              leftIcon && "pl-11",
              (rightIcon || isPasswordType) && "pr-11",
              className,
            )}
            {...props}
          />
          {isPasswordType ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          ) : rightIcon ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-muted">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-error-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
