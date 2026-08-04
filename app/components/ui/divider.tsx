import { type HTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  label?: string;
}

function Divider({
  orientation = "horizontal",
  label,
  className,
  ...props
}: DividerProps) {
  if (label) {
    return (
      <div className={cn("relative my-4", className)} {...props}>
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-default" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 text-text-muted">{label}</span>
        </div>
      </div>
    );
  }

  if (orientation === "vertical") {
    return (
      <div
        className={cn("mx-2 h-auto w-px self-stretch bg-border-default", className)}
        {...props}
      />
    );
  }

  return (
    <hr
      className={cn("my-4 border-t border-border-default", className)}
      {...props}
    />
  );
}

export { Divider };
