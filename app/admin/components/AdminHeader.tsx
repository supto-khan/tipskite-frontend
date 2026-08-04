'use client'

import { ThemeToggle } from '@/app/components/ui/theme-toggle'
import { Bell, ShieldCheck, Search, Sparkles } from 'lucide-react'

interface AdminHeaderProps {
    title: string
    subtitle?: string
    actions?: React.ReactNode
}

export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
            <div>
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-50 text-primary-600 border border-primary-100">
                        Admin Portal
                    </span>
                </div>
                <h1 className="text-2xl font-black text-text-primary mt-1">{title}</h1>
                {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative hidden sm:block">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Quick search (⌘K)..."
                        className="pl-8 pr-4 py-1.5 bg-surface border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 w-48 lg:w-64"
                    />
                </div>

                {actions}

                <ThemeToggle />
            </div>
        </header>
    )
}
