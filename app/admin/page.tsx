'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    DollarSign,
    Users,
    RefreshCw,
    Send,
    CheckCircle2,
    Clock,
    Wallet,
    TrendingUp,
    ShieldAlert,
    UserCheck,
    ArrowUpRight,
    Activity,
    PieChart,
    AlertCircle,
    FileText,
    Heart,
    Package,
    Layers,
    Wrench
} from 'lucide-react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'

export default function ExecutiveDashboard() {
    const [stats, setStats] = useState<any | null>(null)
    const [chartData, setChartData] = useState<any[]>([])
    const [recentActions, setRecentActions] = useState<any[]>([])
    const [recentTransactions, setRecentTransactions] = useState<any[]>([])
    const [batches, setBatches] = useState<any[]>([])
    const [activeChartTab, setActiveChartTab] = useState<'earnings' | 'transactions' | 'visitors'>('earnings')
    const [loading, setLoading] = useState(true)

    // Modal state for disbursing payout
    const [disbursingBatch, setDisbursingBatch] = useState<any | null>(null)
    const [externalRef, setExternalRef] = useState('')
    const [disbursing, setDisbursing] = useState(false)
    const [generating, setGenerating] = useState(false)

    const fetchData = async () => {
        try {
            const [statsRes, payoutsRes] = await Promise.all([
                axios.get('/api/v1/admin/stats'),
                axios.get('/api/v1/admin/payouts'),
            ])
            setStats(statsRes.data.stats)
            setChartData(statsRes.data.chart_data || [])
            setRecentActions(statsRes.data.recent_actions || [])
            setRecentTransactions(statsRes.data.recent_transactions || [])
            setBatches(payoutsRes.data.payout_batches || [])
        } catch (e) {
            console.error('Failed to load executive dashboard data:', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleGenerateBatches = async () => {
        setGenerating(true)
        try {
            const res = await axios.post('/api/v1/admin/payouts/generate')
            alert(res.data.message)
            fetchData()
        } catch (e) {
            console.error(e)
        } finally {
            setGenerating(false)
        }
    }

    const handleDisburseSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!disbursingBatch) return

        setDisbursing(true)
        try {
            await axios.post(`/api/v1/admin/payouts/${disbursingBatch.id}/mark-paid`, {
                external_reference: externalRef,
            })
            setDisbursingBatch(null)
            setExternalRef('')
            fetchData()
        } catch (e) {
            console.error(e)
            alert('Failed to mark batch as paid.')
        } finally {
            setDisbursing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-background">
                <AdminSidebar />
                <main className="flex-1 p-8 space-y-4">
                    <div className="p-6 text-text-muted text-sm font-semibold animate-pulse">Loading Executive Dashboard...</div>
                </main>
            </div>
        )
    }

    const revenueByType = stats?.revenue_by_type || { tip: 0, membership: 0, product: 0, service: 0 }
    const totalRevCents = (revenueByType.tip + revenueByType.membership + revenueByType.product + revenueByType.service) || 1

    // Chart Max Values
    const maxEarnings = Math.max(...chartData.map(d => d.gross_cents / 100), 100)
    const maxTxCount = Math.max(...chartData.map(d => d.tx_count), 10)
    const maxVisitors = Math.max(...chartData.map(d => d.page_views || d.unique_visitors), 10)

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            {/* Sidebar Navigation */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Executive Dashboard"
                    subtitle="Platform performance KPIs, revenue distribution, payout controls & system audit logs."
                    actions={
                        <button
                            onClick={handleGenerateBatches}
                            disabled={generating}
                            className="py-2 px-3.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 disabled:opacity-50 transition-all cursor-pointer"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${generating ? 'animate-spin' : ''}`} />
                            <span>{generating ? 'Generating...' : 'Calculate Payouts'}</span>
                        </button>
                    }
                />

                {/* System Alerts / Urgent Queues Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-500/20 text-amber-600 rounded-xl">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-text-primary block">Pending Payouts</span>
                                <span className="text-[11px] text-text-muted">{stats?.pending_payout_count || 0} batches ready</span>
                            </div>
                        </div>
                        <span className="font-extrabold text-xs text-amber-600">৳{((stats?.pending_payout_total_cents || 0) / 100).toFixed(0)}</span>
                    </div>

                    <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/20 text-blue-600 rounded-xl">
                                <Package className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-text-primary block">Pending Products</span>
                                <span className="text-[11px] text-text-muted">Awaiting review</span>
                            </div>
                        </div>
                        <span className="font-extrabold text-xs text-blue-600">{stats?.pending_products_count || 0} Items</span>
                    </div>

                    <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500/20 text-purple-600 rounded-xl">
                                <Wrench className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-text-primary block">Pending Services</span>
                                <span className="text-[11px] text-text-muted">Awaiting review</span>
                            </div>
                        </div>
                        <span className="font-extrabold text-xs text-purple-600">{stats?.pending_services_count || 0} Items</span>
                    </div>

                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-500/20 text-emerald-600 rounded-xl">
                                <UserCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-text-primary block">KYC Queue</span>
                                <span className="text-[11px] text-text-muted">Identity verification</span>
                            </div>
                        </div>
                        <span className="font-extrabold text-xs text-emerald-600">{stats?.pending_kyc_count || 0} Accounts</span>
                    </div>
                </div>

                {/* Primary Metric KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Platform Gross (GMV)</span>
                            <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-text-primary">
                            ৳{((stats?.platform_gross_cents || 0) / 100).toLocaleString('en-US')}
                        </div>
                        <div className="text-[11px] text-text-muted flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            <span>{stats?.paid_transaction_count || 0} completed transactions</span>
                        </div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Platform Net Earnings</span>
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Wallet className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-600">
                            ৳{((stats?.platform_fee_cents || 0) / 100).toLocaleString('en-US')}
                        </div>
                        <div className="text-[11px] text-text-muted">5% Platform charge share</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Active Creators</span>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-text-primary">
                            {stats?.creator_count || 0}
                        </div>
                        <div className="text-[11px] text-text-muted">{stats?.user_count || 0} total registered users</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Unique Supporters</span>
                            <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                                <Heart className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-violet-600">
                            {stats?.supporter_count || 0}
                        </div>
                        <div className="text-[11px] text-text-muted">Total distinct fan supporters</div>
                    </div>
                </div>

                {/* 30-Day Platform Analytics Interactive Charts */}
                <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                        <div>
                            <h3 className="font-extrabold text-text-primary text-base flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-primary-600" />
                                <span>30-Day Platform Performance & Trends</span>
                            </h3>
                            <p className="text-xs text-text-muted mt-0.5">Visualize platform earnings, transaction velocity, and visitor traffic.</p>
                        </div>

                        {/* Chart Switcher Buttons */}
                        <div className="flex items-center bg-background border border-border p-1 rounded-xl">
                            <button
                                onClick={() => setActiveChartTab('earnings')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeChartTab === 'earnings' ? 'bg-primary-600 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                Earnings (BDT)
                            </button>
                            <button
                                onClick={() => setActiveChartTab('transactions')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeChartTab === 'transactions' ? 'bg-primary-600 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                Transactions
                            </button>
                            <button
                                onClick={() => setActiveChartTab('visitors')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeChartTab === 'visitors' ? 'bg-primary-600 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                Visitors & Traffic
                            </button>
                        </div>
                    </div>

                    {/* Chart Visual Bars / Sparkline */}
                    <div className="pt-4">
                        {chartData.length === 0 ? (
                            <div className="text-center py-12 text-xs text-text-muted">No historical data recorded yet.</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="h-48 flex items-end gap-1.5 sm:gap-2 px-2 pt-6 pb-2 border-b border-border">
                                    {chartData.map((d, i) => {
                                        let heightPct = 4
                                        let barColor = 'bg-primary-500'
                                        let tooltipText = ''

                                        if (activeChartTab === 'earnings') {
                                            const gross = d.gross_cents / 100
                                            heightPct = Math.max(4, Math.round((gross / maxEarnings) * 100))
                                            barColor = gross > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-border'
                                            tooltipText = `${d.label}: ৳${gross.toLocaleString('en-US')} gross (৳${(d.platform_fee_cents / 100).toFixed(0)} fee)`
                                        } else if (activeChartTab === 'transactions') {
                                            heightPct = Math.max(4, Math.round((d.tx_count / maxTxCount) * 100))
                                            barColor = d.tx_count > 0 ? 'bg-primary-500 hover:bg-primary-600' : 'bg-border'
                                            tooltipText = `${d.label}: ${d.tx_count} transactions`
                                        } else {
                                            const visits = d.page_views || 0
                                            heightPct = Math.max(4, Math.round((visits / maxVisitors) * 100))
                                            barColor = visits > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-border'
                                            tooltipText = `${d.label}: ${visits} views (${d.unique_visitors || 0} unique)`
                                        }

                                        return (
                                            <div
                                                key={i}
                                                className="flex-1 flex flex-col items-center group relative h-full justify-end"
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-md">
                                                    {tooltipText}
                                                </div>
                                                <div
                                                    style={{ height: `${heightPct}%` }}
                                                    className={`w-full rounded-t-md transition-all duration-300 ${barColor}`}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="flex justify-between text-[11px] text-text-muted font-mono font-semibold px-2">
                                    <span>{chartData[0]?.label}</span>
                                    <span>{chartData[Math.floor(chartData.length / 2)]?.label}</span>
                                    <span>{chartData[chartData.length - 1]?.label}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid Section: Revenue Breakdown + Recent Audit Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Distribution Breakdown */}
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-text-primary text-sm flex items-center space-x-2">
                                <PieChart className="h-4 w-4 text-primary-600" />
                                <span>Revenue Distribution</span>
                            </h3>
                        </div>

                        <div className="space-y-3 pt-2">
                            {/* Tips */}
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="flex items-center space-x-1.5 text-text-secondary">
                                        <Heart className="h-3.5 w-3.5 text-rose-500" />
                                        <span>Tips & Support</span>
                                    </span>
                                    <span className="font-mono text-text-primary">
                                        BDT {(revenueByType.tip / 100).toFixed(0)} ({Math.round((revenueByType.tip / totalRevCents) * 100)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(revenueByType.tip / totalRevCents) * 100}%` }} />
                                </div>
                            </div>

                            {/* Memberships (hidden while on hold unless past revenue exists) */}
                            {revenueByType.membership > 0 && (
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="flex items-center space-x-1.5 text-text-secondary">
                                            <Layers className="h-3.5 w-3.5 text-violet-500" />
                                            <span>Memberships</span>
                                        </span>
                                        <span className="font-mono text-text-primary">
                                            BDT {(revenueByType.membership / 100).toFixed(0)} ({Math.round((revenueByType.membership / totalRevCents) * 100)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                                        <div className="bg-violet-500 h-full rounded-full" style={{ width: `${(revenueByType.membership / totalRevCents) * 100}%` }} />
                                    </div>
                                </div>
                            )}

                            {/* Shop Products */}
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="flex items-center space-x-1.5 text-text-secondary">
                                        <Package className="h-3.5 w-3.5 text-blue-500" />
                                        <span>Digital Shop</span>
                                    </span>
                                    <span className="font-mono text-text-primary">
                                        BDT {(revenueByType.product / 100).toFixed(0)} ({Math.round((revenueByType.product / totalRevCents) * 100)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(revenueByType.product / totalRevCents) * 100}%` }} />
                                </div>
                            </div>

                            {/* Services */}
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="flex items-center space-x-1.5 text-text-secondary">
                                        <Wrench className="h-3.5 w-3.5 text-amber-500" />
                                        <span>Services & Commissions</span>
                                    </span>
                                    <span className="font-mono text-text-primary">
                                        BDT {(revenueByType.service / 100).toFixed(0)} ({Math.round((revenueByType.service / totalRevCents) * 100)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(revenueByType.service / totalRevCents) * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Audit Trail Feed */}
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-text-primary text-sm flex items-center space-x-2">
                                <Activity className="h-4 w-4 text-emerald-600" />
                                <span>Recent Admin Audit Log</span>
                            </h3>
                            <span className="text-[11px] font-semibold text-text-muted">Last 10 Staff Actions</span>
                        </div>

                        {recentActions.length === 0 ? (
                            <div className="text-center py-8 text-xs text-text-muted">No admin actions recorded yet.</div>
                        ) : (
                            <div className="divide-y divide-border/50 text-xs">
                                {recentActions.map((act) => (
                                    <div key={act.id} className="py-2.5 flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-text-primary">{act.admin_user?.display_name || 'Admin Staff'}</span>
                                                <span className="px-1.5 py-0.2 bg-primary-50 text-primary-700 rounded text-[10px] font-mono font-semibold">
                                                    {act.action}
                                                </span>
                                            </div>
                                            <p className="text-text-muted text-[11px]">{act.reason}</p>
                                        </div>
                                        <span className="font-mono text-[10px] text-text-muted">
                                            {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Creator Payout Batches Management */}
                <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-text-primary text-base">Creator Payout Batches</h3>
                            <p className="text-xs text-text-muted">Manual disbursements via bKash, Nagad, or Bank Transfer</p>
                        </div>
                    </div>

                    {batches.length === 0 ? (
                        <div className="text-center py-8 text-xs text-text-muted">No payout batches generated yet. Click "Calculate Payouts" above.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                        <th className="pb-3">Reference</th>
                                        <th className="pb-3">Creator</th>
                                        <th className="pb-3">Amount (BDT)</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Action / Ref</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                    {batches.map((batch) => (
                                        <tr key={batch.id}>
                                            <td className="py-3 font-mono text-text-muted">{batch.reference}</td>
                                            <td className="py-3 font-bold text-text-primary">
                                                {batch.creator_profile?.display_name || 'Creator'}
                                            </td>
                                            <td className="py-3 font-bold text-primary-600">
                                                BDT {(batch.total_cents / 100).toFixed(2)}
                                            </td>
                                            <td className="py-3">
                                                {batch.status === 'disbursed' ? (
                                                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span>Disbursed</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <Clock className="h-3 w-3" />
                                                        <span>Pending</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                {batch.status === 'disbursed' ? (
                                                    <span className="font-mono text-text-muted text-[11px]">
                                                        {batch.external_reference}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => setDisbursingBatch(batch)}
                                                        className="py-1 px-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[11px] rounded-lg shadow-sm inline-flex items-center space-x-1 transition-all"
                                                    >
                                                        <Send className="h-3 w-3" />
                                                        <span>Mark Paid</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Disburse Modal */}
                {disbursingBatch && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">
                                Disburse Batch {disbursingBatch.reference}
                            </h3>

                            <div className="p-3 bg-primary-50 text-primary-700 text-xs rounded-xl flex justify-between">
                                <span>Disbursement Amount</span>
                                <span className="font-bold">BDT {(disbursingBatch.total_cents / 100).toFixed(2)}</span>
                            </div>

                            <form onSubmit={handleDisburseSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary">bKash / Nagad / Bank Transaction Reference</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. BKASH_TRX_987654"
                                        value={externalRef}
                                        onChange={(e) => setExternalRef(e.target.value)}
                                        className="mt-1 w-full px-3 py-2 border border-border rounded-xl text-sm font-mono focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary"
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setDisbursingBatch(null)}
                                        className="px-4 py-2 bg-background hover:bg-border text-text-secondary text-xs font-semibold rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={disbursing}
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-md disabled:opacity-50"
                                    >
                                        {disbursing ? 'Disbursing...' : 'Confirm Disbursement'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
