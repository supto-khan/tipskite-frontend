import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "block w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text-primary",
            "placeholder:text-text-muted",
            "transition-colors duration-150",
            "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-secondary",
            "min-h-[80px] resize-y",
            error
              ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
              : "border-border-default",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-error-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-text-muted">{hint}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
