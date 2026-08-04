"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/app/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

function CustomSelect({
  options,
  value,
  onChange,
  label,
  error,
  hint,
  placeholder = "Select an option",
  disabled = false,
  className,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    onChange?.(optValue);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl border text-sm transition-all duration-200 text-left bg-surface shadow-xs",
          isOpen ? "border-primary-500 ring-2 ring-primary-500/20" : "border-border hover:border-text-muted/40",
          error ? "border-error-500 focus:ring-error-500/20" : "",
          disabled ? "opacity-50 cursor-not-allowed bg-background" : "cursor-pointer",
          className
        )}
      >
        <span className={cn("truncate font-medium", selectedOption ? "text-text-primary" : "text-text-muted")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-200 flex-shrink-0",
            isOpen ? "rotate-180 text-primary-500" : ""
          )}
        />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-xl animate-fade-in">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={opt.disabled}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left",
                  isSelected
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950/40"
                    : "text-text-secondary hover:bg-background hover:text-text-primary",
                  opt.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="h-4 w-4 text-primary-500 flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs font-medium text-error-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

export { CustomSelect as Select };
