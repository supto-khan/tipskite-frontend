'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    Sliders,
    CheckCircle2,
    AlertCircle,
    Power,
    Sparkles,
    Shield,
    ShoppingBag,
    GraduationCap,
    Heart,
    Brush,
    Video,
    UserPlus,
    Wrench,
    Search,
    RefreshCw,
    Clock,
    User,
    Check,
    X,
    Loader2
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

interface FeatureFlag {
    id: string
    key: string
    name: string
    description: string | null
    category: string
    is_enabled: boolean
    updated_at: string
    updater?: {
        id: string
        display_name: string
        email: string
    } | null
}

export default function FeatureFlagsPage() {
    const [flags, setFlags] = useState<FeatureFlag[]>([])
    const [summary, setSummary] = useState<{ total: number; enabled: number; disabled: number } | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [togglingId, setTogglingId] = useState<string | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const fetchFlags = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/v1/admin/feature-flags')
            setFlags(res.data.flags || [])
            setSummary(res.data.summary || null)
        } catch (e) {
            console.error('Failed to load feature flags:', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFlags()
    }, [])

    const handleToggle = async (flag: FeatureFlag) => {
        setTogglingId(flag.id)
        const nextState = !flag.is_enabled

        try {
            const res = await axios.patch(`/api/v1/admin/feature-flags/${flag.id}`, {
                is_enabled: nextState,
                reason: `Toggled via Feature Flags panel to ${nextState ? 'enabled' : 'disabled'}`,
            })

            setToastMessage(res.data.message || `Flag ${flag.name} updated successfully.`)
            setTimeout(() => setToastMessage(null), 4000)

            // Update local state
            setFlags((prev) =>
                prev.map((f) => (f.id === flag.id ? res.data.flag : f))
            )
            setSummary((prev) => {
                if (!prev) return null
                return {
                    ...prev,
                    enabled: nextState ? prev.enabled + 1 : prev.enabled - 1,
                    disabled: nextState ? prev.disabled - 1 : prev.disabled + 1,
                }
            })
        } catch (e) {
            console.error('Failed to toggle feature flag:', e)
            alert('Failed to update feature flag status.')
        } finally {
            setTogglingId(null)
        }
    }

    const filteredFlags = flags.filter((f) => {
        const matchesQuery =
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesCat = categoryFilter === 'all' || f.category === categoryFilter
        return matchesQuery && matchesCat
    })

    const getFlagIcon = (key: string) => {
        switch (key) {
            case 'enable_digital_shop':
                return <ShoppingBag className="w-5 h-5" />
            case 'enable_online_courses':
                return <GraduationCap className="w-5 h-5" />
            case 'enable_memberships':
                return <Heart className="w-5 h-5" />
            case 'enable_custom_storefront_requests':
                return <Brush className="w-5 h-5" />
            case 'enable_stream_alerts':
                return <Video className="w-5 h-5" />
            case 'enable_creator_registration':
                return <UserPlus className="w-5 h-5" />
            case 'enable_maintenance_mode':
                return <Wrench className="w-5 h-5" />
            default:
                return <Sparkles className="w-5 h-5" />
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Feature Flags & Module Switches"
                    subtitle="Toggle platform monetization modules, creator capabilities, and system modes dynamically without redeploying code."
                    actions={
                        <button
                            onClick={fetchFlags}
                            className="px-3.5 py-1.5 bg-surface border border-border hover:bg-background rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    }
                />

                {toastMessage && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>{toastMessage}</span>
                        </div>
                        <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-1">
                        <span className="text-xs font-bold text-text-muted">Total System Flags</span>
                        <div className="text-2xl font-black text-text-primary">{summary?.total ?? flags.length}</div>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-1">
                        <span className="text-xs font-bold text-emerald-600">Active / Enabled Modules</span>
                        <div className="text-2xl font-black text-emerald-600">{summary?.enabled ?? flags.filter((f) => f.is_enabled).length}</div>
                    </div>

                    <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-1">
                        <span className="text-xs font-bold text-amber-600">Disabled / On-Hold</span>
                        <div className="text-2xl font-black text-amber-600">{summary?.disabled ?? flags.filter((f) => !f.is_enabled).length}</div>
                    </div>
                </div>

                {/* Search & Category Filter */}
                <div className="bg-surface rounded-2xl p-4 border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search flags by name, key, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        {['all', 'monetization', 'creator_tools', 'platform'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                                    categoryFilter === cat
                                        ? 'bg-primary-600 text-white shadow-xs'
                                        : 'bg-background text-text-muted hover:text-text-primary'
                                }`}
                            >
                                {cat.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Flags Grid */}
                {loading ? (
                    <div className="text-center py-16 text-xs text-text-muted animate-pulse">Loading system feature flags...</div>
                ) : filteredFlags.length === 0 ? (
                    <div className="text-center py-16 text-xs text-text-muted bg-surface rounded-3xl border border-border">
                        No feature flags matched your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredFlags.map((flag) => {
                            const isToggling = togglingId === flag.id

                            return (
                                <div
                                    key={flag.id}
                                    className={`bg-surface border rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                                        flag.is_enabled
                                            ? 'border-border'
                                            : 'border-border/60 bg-surface/50 opacity-90'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className={`p-2.5 rounded-2xl ${
                                                        flag.is_enabled
                                                            ? 'bg-primary-500/10 text-primary-600'
                                                            : 'bg-border/40 text-text-muted'
                                                    }`}
                                                >
                                                    {getFlagIcon(flag.key)}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
                                                        <span>{flag.name}</span>
                                                    </h3>
                                                    <span className="text-[10px] font-mono text-text-muted block">
                                                        {flag.key}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Toggle Switch */}
                                            <button
                                                type="button"
                                                disabled={isToggling}
                                                onClick={() => handleToggle(flag)}
                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                                                    flag.is_enabled ? 'bg-primary-600' : 'bg-border'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        flag.is_enabled ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        <p className="text-xs text-text-secondary leading-relaxed">
                                            {flag.description || 'No description provided.'}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[10px] text-text-muted">
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-0.5 rounded-md bg-background font-semibold uppercase tracking-wider border border-border">
                                                {flag.category.replace('_', ' ')}
                                            </span>
                                            <span
                                                className={`font-bold ${
                                                    flag.is_enabled ? 'text-emerald-600' : 'text-amber-600'
                                                }`}
                                            >
                                                {flag.is_enabled ? '● Active' : '○ Disabled'}
                                            </span>
                                        </div>

                                        <span className="font-mono">
                                            Updated {new Date(flag.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
