"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "./container";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { cn } from "@/app/lib/utils";

function TipsKiteLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-lg">
        T
      </div>
      <span className="text-xl font-bold text-text-primary">
        Tips<span className="text-primary-500">Kite</span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border-default bg-surface/80 backdrop-blur-lg">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <TipsKiteLogo />

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/explore"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              FAQ
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Start my page</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-surface-secondary md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="border-t border-border-default pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-2">
              <Link href="/explore" className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary">
                Explore
              </Link>
              <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary">
                About
              </Link>
              <Link href="/faq" className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary">
                FAQ
              </Link>
              <hr className="my-2 border-border-default" />
              <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-text-secondary">
                <span>Theme Mode</span>
                <ThemeToggle />
              </div>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary">
                Log in
              </Link>
              <Button size="sm" fullWidth className="mt-1">
                <Link href="/register">Start my page</Link>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}

export { Navbar, TipsKiteLogo };
