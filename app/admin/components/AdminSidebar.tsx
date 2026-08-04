'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    UserCheck,
    CreditCard,
    ShoppingBag,
    FileText,
    ShieldAlert,
    MessageSquare,
    BarChart3,
    Sliders,
    Palette,
    Shield,
    Activity,
    LifeBuoy,
    Bell
} from 'lucide-react'

interface NavItem {
    label: string
    href: string
    icon: any
    badge?: string | null
}

const navItems: NavItem[] = [
    { label: 'Executive Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'User Management', href: '/admin/users', icon: Users, badge: null },
    { label: 'Creator Management', href: '/admin/creators', icon: UserCheck },
    { label: 'Finance & Payouts', href: '/admin/finance', icon: CreditCard },
    { label: 'Commerce Suite', href: '/admin/commerce', icon: ShoppingBag },
    { label: 'Content Management', href: '/admin/content', icon: FileText },
    { label: 'Trust & Safety', href: '/admin/safety', icon: ShieldAlert },
    { label: 'Support & Tickets', href: '/admin/support', icon: LifeBuoy },
    { label: 'Analytics & BI', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Feature Flags', href: '/admin/feature-flags', icon: Sliders },
    { label: 'System Configuration', href: '/admin/config', icon: Activity },
    { label: 'Security & Audit', href: '/admin/security', icon: Shield },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-surface border-r border-border min-h-screen p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
                {/* Brand / Logo */}
                <div className="px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                            T
                        </div>
                        <div>
                            <span className="font-extrabold text-base text-text-primary block leading-tight">TipSkite</span>
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

            {/* Footer / System Status */}
            <div className="p-3 bg-background rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted font-medium">Environment</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success-50 text-success-700 border border-success-200">
                        Local / Dev
                    </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted font-medium">Engine</span>
                    <span className="font-mono text-[10px] text-text-secondary">MySQL/MariaDB</span>
                </div>
            </div>
        </aside>
    )
}
