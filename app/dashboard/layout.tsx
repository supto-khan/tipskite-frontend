'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    Coffee,
    Settings,
    FileText,
    ShoppingBag,
    CreditCard,
    TrendingUp,
    Briefcase,
    Mail,
    Radio,
    GraduationCap,
    LogOut
} from 'lucide-react'
import { ThemeToggle } from '@/app/components/ui/theme-toggle'
import { useAuth } from '@/lib/useAuth'

import { useState, useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { logout } = useAuth()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home, exact: true },
        { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp, exact: true },
        { name: 'Posts', href: '/dashboard/posts', icon: FileText, exact: false },
        { name: 'Courses', href: '/dashboard/courses', icon: GraduationCap, exact: false },
        { name: 'Shop', href: '/dashboard/shop', icon: ShoppingBag, exact: false },
        { name: 'Services', href: '/dashboard/services', icon: Briefcase, exact: false },
        { name: 'Campaigns', href: '/dashboard/campaigns', icon: Mail, exact: false },
        { name: 'OBS Alerts', href: '/dashboard/widgets', icon: Radio, exact: false },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings, exact: false },
    ]

    if (!mounted) {
        return (
            <div suppressHydrationWarning className="min-h-screen bg-background flex">
                <div suppressHydrationWarning className="w-64 bg-surface border-r border-border hidden md:flex sticky top-0 h-screen flex-shrink-0" />
                <div suppressHydrationWarning className="flex-1 flex flex-col">
                    <header className="sticky top-0 z-40 bg-surface border-b border-border h-16 px-4 sm:px-8 flex items-center justify-end">
                        <ThemeToggle />
                    </header>
                    <main suppressHydrationWarning className="flex-1 p-8">{children}</main>
                </div>
            </div>
        )
    }

    return (
        <div suppressHydrationWarning className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside suppressHydrationWarning className="w-64 bg-surface border-r border-border hidden md:flex md:flex-col sticky top-0 h-screen flex-shrink-0">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <Coffee className="h-8 w-8 text-primary-600" />
                        <span className="ml-2.5 text-xl font-bold text-text-primary tracking-tight">TipsKite</span>
                    </div>
                    <nav className="mt-8 flex-1 px-3 bg-surface space-y-1">
                        {navItems.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href)
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                                        isActive
                                            ? 'bg-primary-50 text-primary-600 font-semibold shadow-xs'
                                            : 'text-text-secondary hover:bg-background hover:text-text-primary'
                                    }`}
                                >
                                    <Icon
                                        className={`mr-3 flex-shrink-0 h-5 w-5 transition-all ${
                                            isActive ? 'text-primary-600' : 'text-text-muted group-hover:text-text-primary'
                                        }`}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                    >
                        <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-rose-600" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-40 bg-surface border-b border-border h-16 px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:hidden">
                        <Coffee className="h-6 w-6 text-primary-600" />
                        <span className="font-bold text-text-primary">TipsKite</span>
                    </div>
                    <div className="hidden md:block"></div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto bg-background focus:outline-none flex flex-col justify-between">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 w-full">
                        {children}
                    </div>
                    <footer suppressHydrationWarning className="border-t border-border bg-surface/50 py-4 px-4 sm:px-8 text-xs text-text-muted mb-16 md:mb-0">
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                            <div>
                                © {new Date().getFullYear()} TipsKite. All rights reserved.
                            </div>
                            <div>
                                A product of{' '}
                                <a
                                    href="https://prosolverhq.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-text-primary hover:text-primary transition-colors underline decoration-border underline-offset-2"
                                >
                                    ProsolverHQ
                                </a>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>

            {/* Mobile Bottom Bar for Small Screens */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-t border-border px-4 py-2 flex items-center justify-around">
                <Link href="/dashboard" className={`flex flex-col items-center p-1 text-[10px] font-bold ${pathname === '/dashboard' ? 'text-primary' : 'text-text-muted'}`}>
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                </Link>
                <Link href="/dashboard/analytics" className={`flex flex-col items-center p-1 text-[10px] font-bold ${pathname === '/dashboard/analytics' ? 'text-primary' : 'text-text-muted'}`}>
                    <TrendingUp className="h-5 w-5" />
                    <span>Analytics</span>
                </Link>
                <Link href="/dashboard/shop" className={`flex flex-col items-center p-1 text-[10px] font-bold ${pathname === '/dashboard/shop' ? 'text-primary' : 'text-text-muted'}`}>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Shop</span>
                </Link>
                <Link href="/dashboard/settings" className={`flex flex-col items-center p-1 text-[10px] font-bold ${pathname.startsWith('/dashboard/settings') ? 'text-primary' : 'text-text-muted'}`}>
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </Link>
                <button
                    onClick={() => logout()}
                    className="flex flex-col items-center p-1 text-[10px] font-bold text-rose-600 cursor-pointer"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}
