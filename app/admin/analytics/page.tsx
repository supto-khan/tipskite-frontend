'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    BarChart3,
    Trophy,
    Globe,
    Users,
    Layers,
    Eye,
    TrendingUp,
    Smartphone,
    Laptop,
    PieChart
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function AnalyticsAndBIPage() {
    const [overview, setOverview] = useState<any | null>(null)
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [traffic, setTraffic] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const [overviewRes, leaderRes, trafficRes] = await Promise.all([
                axios.get('/api/v1/admin/analytics/platform'),
                axios.get('/api/v1/admin/analytics/leaderboard'),
                axios.get('/api/v1/admin/analytics/traffic'),
            ])
            setOverview(overviewRes.data.overview)
            setLeaderboard(leaderRes.data.top_creators || [])
            setTraffic(trafficRes.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen bg-background">
                <AdminSidebar />
                <main className="flex-1 p-8 space-y-4">
                    <div className="p-6 text-text-muted text-sm font-semibold animate-pulse">Loading Business Intelligence analytics...</div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Analytics & Business Intelligence"
                    subtitle="Platform growth metrics, creator earnings leaderboard, subscription MRR health, and visitor traffic breakdowns."
                />

                {/* Macro Platform KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Monthly Recurring Revenue (MRR)</span>
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-600">
                            BDT {((overview?.mrr_cents || 0) / 100).toFixed(0)}
                        </div>
                        <div className="text-[11px] text-text-muted">{overview?.active_subscriptions || 0} active subscriptions</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Total Platform Users</span>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-text-primary">
                            {overview?.total_users || 0}
                        </div>
                        <div className="text-[11px] text-text-muted">{overview?.total_supporters || 0} supporters made a purchase</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Published Creators</span>
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                <Layers className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-purple-600">
                            {overview?.published_creators || 0}
                        </div>
                        <div className="text-[11px] text-text-muted">Out of {overview?.total_creators || 0} total creator profiles</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Total Page Views</span>
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                <Eye className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-text-primary">
                            {overview?.total_page_views || 0}
                        </div>
                        <div className="text-[11px] text-text-muted">Tracked creator page visits</div>
                    </div>
                </div>

                {/* Grid Section: Creator Leaderboard + Traffic Breakdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Top Creators Leaderboard */}
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                                <Trophy className="h-4 w-4 text-amber-500" />
                                <span>Top Creators Leaderboard</span>
                            </h3>
                            <span className="text-xs text-text-muted">Ranked by Lifetime Earnings</span>
                        </div>

                        {leaderboard.length === 0 ? (
                            <div className="text-center py-8 text-xs text-text-muted">No creator earnings recorded yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-border font-semibold text-text-muted pb-3">
                                            <th className="pb-3">Rank</th>
                                            <th className="pb-3">Creator Title</th>
                                            <th className="pb-3">Slug</th>
                                            <th className="pb-3">Lifetime Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40 text-text-secondary">
                                        {leaderboard.map((c, idx) => (
                                            <tr key={c.id}>
                                                <td className="py-3 font-bold font-mono">
                                                    {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                                                </td>
                                                <td className="py-3 font-bold text-text-primary">{c.page_title || 'Creator'}</td>
                                                <td className="py-3 font-mono text-text-muted">/{c.slug}</td>
                                                <td className="py-3 font-bold font-mono text-emerald-600">
                                                    BDT {((c.lifetime_earned_cents || 0) / 100).toFixed(0)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Traffic & Devices Breakdown */}
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-6 lg:col-span-1">
                        <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                            <PieChart className="h-4 w-4 text-primary-600" />
                            <span>Visitor Analytics</span>
                        </h3>

                        {/* Devices */}
                        <div className="space-y-3">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Device Breakdown</span>
                            {traffic?.devices?.length === 0 ? (
                                <p className="text-xs text-text-muted italic">No device data tracked.</p>
                            ) : (
                                <div className="space-y-2">
                                    {traffic?.devices?.map((d: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-background rounded-xl border border-border">
                                            <span className="font-semibold capitalize text-text-primary flex items-center space-x-2">
                                                {d.device === 'mobile' ? <Smartphone className="h-3.5 w-3.5 text-primary-600" /> : <Laptop className="h-3.5 w-3.5 text-blue-600" />}
                                                <span>{d.device || 'Desktop'}</span>
                                            </span>
                                            <span className="font-mono font-bold text-text-primary">{d.count} views</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Referrers */}
                        <div className="space-y-3 pt-2 border-t border-border">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Top Traffic Referrers</span>
                            {traffic?.referrers?.length === 0 ? (
                                <p className="text-xs text-text-muted italic">No referrer data tracked.</p>
                            ) : (
                                <div className="space-y-2">
                                    {traffic?.referrers?.map((ref: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-background rounded-xl border border-border">
                                            <span className="font-mono text-text-muted truncate max-w-[150px]">{ref.referrer || 'Direct / Organic'}</span>
                                            <span className="font-mono font-bold text-text-primary">{ref.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
