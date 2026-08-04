'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { DollarSign, TrendingUp, Star, Eye, Coffee, ShoppingBag, Video, Calendar, Activity } from 'lucide-react'

export default function CreatorAnalytics() {
    const [summary, setSummary] = useState<any | null>(null)
    const [chartData, setChartData] = useState<any[]>([])
    const [range, setRange] = useState('30d')
    const [loading, setLoading] = useState(true)
    const [hoveredPoint, setHoveredPoint] = useState<any | null>(null)

    const fetchAnalytics = async (selectedRange: string) => {
        try {
            const [sumRes, chartRes] = await Promise.all([
                axios.get(`/api/v1/creator/analytics/summary?range=${selectedRange}`),
                axios.get(`/api/v1/creator/analytics/chart?range=${selectedRange}`),
            ])
            setSummary(sumRes.data.summary)
            setChartData(chartRes.data.chart || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics(range)
    }, [range])

    if (loading) {
        return (
            <div suppressHydrationWarning className="max-w-5xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-8 w-36 bg-border/40 rounded-xl" />
                        <div className="h-4 w-64 bg-border/40 rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-surface border border-border rounded-3xl p-6 space-y-3 shadow-xs">
                            <div className="h-4 w-20 bg-border/40 rounded-lg" />
                            <div className="h-8 w-28 bg-border/40 rounded-xl" />
                        </div>
                    ))}
                </div>
                <div className="bg-surface border border-border rounded-3xl p-6 h-64 bg-border/20" />
            </div>
        )
    }

    const totalGross = summary?.gross_cents ? summary.gross_cents / 100 : 0
    const tipsAmount = summary?.breakdown?.tips_cents ? summary.breakdown.tips_cents / 100 : 0
    const membershipAmount = summary?.breakdown?.membership_cents ? summary.breakdown.membership_cents / 100 : 0
    const shopAmount = summary?.breakdown?.shop_cents ? summary.breakdown.shop_cents / 100 : 0
    const serviceAmount = summary?.breakdown?.service_cents ? summary.breakdown.service_cents / 100 : 0

    const tipsPct = totalGross > 0 ? (tipsAmount / totalGross) * 100 : 0
    const membershipPct = totalGross > 0 ? (membershipAmount / totalGross) * 100 : 0
    const shopPct = totalGross > 0 ? (shopAmount / totalGross) * 100 : 0
    const servicePct = totalGross > 0 ? (serviceAmount / totalGross) * 100 : 0

    const maxChartValue = Math.max(...chartData.map((d) => (d.gross_cents || 0) / 100), 1)

    const getRangeLabel = (r: string) => {
        switch (r) {
            case '7d': return 'Past 7 Days'
            case '30d': return 'Past 30 Days'
            case '90d': return 'Past 90 Days'
            case '1y': return 'Past 1 Year'
            case 'all': return 'All Time'
            default: return 'Past 30 Days'
        }
    }

    // Calculate SVG Area Line Chart Coordinates
    const svgWidth = 800
    const svgHeight = 220
    const paddingX = 20
    const paddingY = 30
    const usableWidth = svgWidth - paddingX * 2
    const usableHeight = svgHeight - paddingY * 2

    const chartPoints = chartData.map((d, i) => {
        const val = (d.gross_cents || 0) / 100
        const x = paddingX + (chartData.length > 1 ? (i / (chartData.length - 1)) * usableWidth : usableWidth / 2)
        const y = svgHeight - paddingY - (val / maxChartValue) * usableHeight
        return {
            x,
            y,
            val,
            date: d.formatted_date || d.date,
            tips: (d.tips_cents || 0) / 100,
            memberships: (d.membership_cents || 0) / 100,
            shop: (d.shop_cents || 0) / 100,
            services: (d.service_cents || 0) / 100,
            views: d.views_count || 0,
        }
    })

    const linePath = chartPoints.length > 0
        ? chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
        : ''

    const areaPath = chartPoints.length > 0
        ? `${linePath} L ${chartPoints[chartPoints.length - 1].x.toFixed(1)},${svgHeight - paddingY} L ${chartPoints[0].x.toFixed(1)},${svgHeight - paddingY} Z`
        : ''

    return (
        <div suppressHydrationWarning className="max-w-5xl mx-auto py-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Analytics & Revenue</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Track your earnings, supporter growth, and page visits across your account.
                    </p>
                </div>

                {/* Range Selector */}
                <div className="flex bg-surface p-1 rounded-xl border border-border shadow-2xs w-fit">
                    {['7d', '30d', '90d', '1y', 'all'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                range === r ? 'bg-primary text-white shadow-2xs' : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                        <span>Revenue ({range.toUpperCase()})</span>
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-text-primary">
                        BDT {(summary?.gross_cents / 100 || 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-text-muted">
                        Net: BDT {(summary?.net_cents / 100 || 0).toLocaleString()}
                    </div>
                </div>

                <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                        <span>This Month</span>
                        <div className="p-2 bg-success-50 text-success-600 rounded-xl">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-text-primary">
                        BDT {(summary?.this_month_gross_cents / 100 || 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-text-muted">Current calendar month</div>
                </div>

                <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                        <span>Active Members</span>
                        <div className="p-2 bg-info-50 text-info-600 rounded-xl">
                            <Star className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-text-primary">
                        {summary?.active_member_count || 0}
                    </div>
                    <div className="text-[11px] text-text-muted">Recurring subscribers</div>
                </div>

                <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                        <span>Page Views ({range.toUpperCase()})</span>
                        <div className="p-2 bg-warning-50 text-warning-600 rounded-xl">
                            <Eye className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-text-primary">
                        {(summary?.page_views_count || 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-text-muted">Profile visits</div>
                </div>
            </div>

            {/* Gradient Area Line Chart Visualizer */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-primary" />
                            <h3 className="font-bold text-text-primary text-base">Revenue & Growth Trend</h3>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">Smooth area curve visualization for {getRangeLabel(range).toLowerCase()}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {getRangeLabel(range)}
                    </span>
                </div>

                {chartData.length === 0 || chartData.every(d => d.gross_cents === 0) ? (
                    <div className="h-60 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-border bg-background/50 rounded-2xl p-6">
                        <TrendingUp className="w-10 h-10 text-text-muted opacity-30" />
                        <p className="text-xs font-bold text-text-muted">No revenue activity recorded in {getRangeLabel(range).toLowerCase()}.</p>
                    </div>
                ) : (
                    <div className="relative space-y-2">
                        {/* Interactive Tooltip Card */}
                        {hoveredPoint && (
                            <div className="p-3 bg-secondary text-white rounded-2xl shadow-xl border border-white/10 text-xs space-y-1.5 mb-2 flex items-center justify-between transition-all animate-fadeIn">
                                <div>
                                    <span className="text-text-muted text-[11px] font-semibold">{hoveredPoint.date}</span>
                                    <div className="text-lg font-black text-primary-300">BDT {hoveredPoint.val.toLocaleString()}</div>
                                </div>
                                <div className="flex items-center space-x-4 text-[11px] text-text-muted border-l border-white/20 pl-4">
                                    <div>Tips: <span className="font-bold text-white">BDT {hoveredPoint.tips}</span></div>
                                    <div>Shop: <span className="font-bold text-white">BDT {hoveredPoint.shop}</span></div>
                                    <div>Memberships: <span className="font-bold text-white">BDT {hoveredPoint.memberships}</span></div>
                                    <div>Views: <span className="font-bold text-white">{hoveredPoint.views}</span></div>
                                </div>
                            </div>
                        )}

                        <div className="w-full h-60 relative overflow-hidden rounded-2xl bg-background/40 p-2 border border-border/40">
                            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--primary, #6366f1)" stopOpacity="0.35" />
                                        <stop offset="100%" stopColor="var(--primary, #6366f1)" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                {/* Horizontal Grid Lines */}
                                {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                                    const y = svgHeight - paddingY - ratio * usableHeight
                                    return (
                                        <line
                                            key={idx}
                                            x1={paddingX}
                                            y1={y}
                                            x2={svgWidth - paddingX}
                                            y2={y}
                                            stroke="currentColor"
                                            strokeDasharray="4 4"
                                            className="text-border/40"
                                            strokeWidth="1"
                                        />
                                    )
                                })}

                                {/* Area Fill */}
                                {areaPath && (
                                    <path d={areaPath} fill="url(#areaGradient)" />
                                )}

                                {/* Line Curve */}
                                {linePath && (
                                    <path
                                        d={linePath}
                                        fill="none"
                                        stroke="var(--primary, #6366f1)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )}

                                {/* Interactive Point Circles */}
                                {chartPoints.map((pt, i) => (
                                    <g key={i}>
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={hoveredPoint?.date === pt.date ? '7' : '4'}
                                            className="fill-primary stroke-surface stroke-2 transition-all cursor-pointer hover:r-8"
                                            onMouseEnter={() => setHoveredPoint(pt)}
                                        />
                                    </g>
                                ))}
                            </svg>
                        </div>

                        {/* Date axis labels */}
                        <div className="flex justify-between text-[10px] font-semibold text-text-muted px-2 pt-1">
                            <span>{chartPoints[0]?.date}</span>
                            {chartPoints.length > 2 && <span>{chartPoints[Math.floor(chartPoints.length / 2)]?.date}</span>}
                            <span>{chartPoints[chartPoints.length - 1]?.date}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Category Breakdown Bars */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-text-primary text-base">Revenue Distribution by Stream</h3>
                        <p className="text-xs text-text-muted mt-0.5">Filter: {getRangeLabel(range)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Tips */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="flex items-center space-x-1.5 text-text-secondary">
                                <Coffee className="h-4 w-4 text-warning-600" />
                                <span>Support / Coffee Tips</span>
                            </span>
                            <span className="text-text-primary font-bold">BDT {tipsAmount.toLocaleString()} ({tipsPct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border/50">
                            <div className="h-full bg-warning-500 rounded-full transition-all" style={{ width: `${tipsPct}%` }} />
                        </div>
                    </div>

                    {/* Memberships */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="flex items-center space-x-1.5 text-text-secondary">
                                <Star className="h-4 w-4 text-primary" />
                                <span>Tier Memberships</span>
                            </span>
                            <span className="text-text-primary font-bold">BDT {membershipAmount.toLocaleString()} ({membershipPct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border/50">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${membershipPct}%` }} />
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="flex items-center space-x-1.5 text-text-secondary">
                                <ShoppingBag className="h-4 w-4 text-success-600" />
                                <span>Digital Product Sales</span>
                            </span>
                            <span className="text-text-primary font-bold">BDT {shopAmount.toLocaleString()} ({shopPct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border/50">
                            <div className="h-full bg-success-500 rounded-full transition-all" style={{ width: `${shopPct}%` }} />
                        </div>
                    </div>

                    {/* Services */}
                    {serviceAmount > 0 && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="flex items-center space-x-1.5 text-text-secondary">
                                    <Video className="h-4 w-4 text-info-600" />
                                    <span>Video & 1-on-1 Services</span>
                                </span>
                                <span className="text-text-primary font-bold">BDT {serviceAmount.toLocaleString()} ({servicePct.toFixed(0)}%)</span>
                            </div>
                            <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border/50">
                                <div className="h-full bg-info-500 rounded-full transition-all" style={{ width: `${servicePct}%` }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
