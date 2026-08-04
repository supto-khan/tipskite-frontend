import { cn } from "@/app/lib/utils";

const avatarSizes = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
} as const;

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: keyof typeof avatarSizes;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
  const initials = name ? getInitials(name) : "?";

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || "Avatar"}
        className={cn(
          "inline-block rounded-full object-cover ring-2 ring-surface ring-offset-0",
          avatarSizes[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700",
        avatarSizes[size],
        className,
      )}
      aria-label={alt || name}
    >
      {initials}
    </span>
  );
}

export { Avatar };
