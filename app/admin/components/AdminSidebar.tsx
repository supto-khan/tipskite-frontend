'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import {
    Coffee,
    LayoutDashboard,
    Users,
    UserCheck,
    CreditCard,
    ShoppingBag,
    ShieldAlert,
    MessageSquare,
    BarChart3,
    Sliders,
    Palette,
    Shield,
    ShieldCheck,
    Activity,
    LifeBuoy,
    Bell,
    LogOut,
    ExternalLink
} from 'lucide-react'

interface NavItem {
    label: string
    href: string
    icon: any
    badge?: string | null
}

const navItems: NavItem[] = [
    { label: 'Executive Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'KYC Review Queue', href: '/admin/kyc', icon: ShieldCheck, badge: null },
    { label: 'User Management', href: '/admin/users', icon: Users, badge: null },
    { label: 'Creator Management', href: '/admin/creators', icon: UserCheck },
    { label: 'Finance & Payouts', href: '/admin/finance', icon: CreditCard },
    { label: 'Commerce Suite', href: '/admin/commerce', icon: ShoppingBag },
    { label: 'Fraud & Risk Signals', href: '/admin/safety', icon: ShieldAlert },
    { label: 'Support & Tickets', href: '/admin/support', icon: LifeBuoy },
    { label: 'Analytics & BI', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Feature Flags', href: '/admin/feature-flags', icon: Sliders },
    { label: 'System Configuration', href: '/admin/config', icon: Activity },
    { label: 'Security & Audit', href: '/admin/security', icon: Shield },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <aside className="w-64 bg-surface border-r border-border sticky top-0 h-screen p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-6">
                {/* Brand / Logo */}
                <div className="px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                        <Coffee className="h-8 w-8 text-primary-600 shrink-0" />
                        <div>
                            <span className="font-extrabold text-base text-text-primary block leading-tight">TipsKite</span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-primary-600">Super Admin</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    isActive
                                        ? 'bg-primary-600 text-white shadow-sm font-bold'
                                        : 'text-text-secondary hover:bg-background hover:text-text-primary'
                                }`}
                            >
                                <div className="flex items-center space-x-2.5">
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                                    <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-primary-100 text-primary-800">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Footer / User Controls */}
            <div className="space-y-2 pt-4">
                <Link
                    href="/dashboard"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-background hover:text-text-primary transition-all border border-border"
                >
                    <div className="flex items-center space-x-2">
                        <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
                        <span>Creator Dashboard</span>
                    </div>
                </Link>

                <button
                    onClick={() => logout()}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                >
                    <div className="flex items-center space-x-2">
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                    </div>
                </button>
            </div>
        </aside>
    )
}
