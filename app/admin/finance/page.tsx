'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    CreditCard,
    Search,
    DollarSign,
    RefreshCw,
    Send,
    CheckCircle2,
    Clock,
    RotateCcw,
    Eye,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Wallet,
    X,
    ShieldAlert,
    AlertCircle,
    FileText,
    Heart,
    Layers,
    Package,
    Wrench,
    ArrowUpRight
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function FinanceManagementPage() {
    const [activeTab, setActiveTab] = useState<'transactions' | 'payouts' | 'reports'>('transactions')

    // Transactions State
    const [transactions, setTransactions] = useState<any[]>([])
    const [txMeta, setTxMeta] = useState<any>(null)
    const [loadingTx, setLoadingTx] = useState(true)
    const [txSearch, setTxSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [txPage, setTxPage] = useState(1)

    // Payouts State
    const [batches, setBatches] = useState<any[]>([])
    const [loadingBatches, setLoadingBatches] = useState(false)
    const [generating, setGenerating] = useState(false)

    // Modal state for disbursing payout
    const [disbursingBatch, setDisbursingBatch] = useState<any | null>(null)
    const [externalRef, setExternalRef] = useState('')
    const [disbursing, setDisbursing] = useState(false)

    // Refund Modal State
    const [refundTx, setRefundTx] = useState<any | null>(null)
    const [refundRef, setRefundRef] = useState('')
    const [refundReason, setRefundReason] = useState('')
    const [submittingRefund, setSubmittingRefund] = useState(false)

    // Revenue Report State
    const [reportData, setReportData] = useState<any | null>(null)
    const [loadingReport, setLoadingReport] = useState(false)

    // Transaction Slide-Over Detail
    const [selectedTx, setSelectedTx] = useState<any | null>(null)

    const fetchTransactions = async () => {
        setLoadingTx(true)
        try {
            const params = new URLSearchParams()
            if (txSearch) params.append('search', txSearch)
            if (typeFilter) params.append('type', typeFilter)
            if (statusFilter) params.append('status', statusFilter)
            params.append('page', txPage.toString())

            const res = await axios.get(`/api/v1/admin/transactions?${params.toString()}`)
            setTransactions(res.data.data || [])
            setTxMeta(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingTx(false)
        }
    }

    const fetchPayouts = async () => {
        setLoadingBatches(true)
        try {
            const res = await axios.get('/api/v1/admin/payouts')
            setBatches(res.data.payout_batches || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingBatches(false)
        }
    }

    const fetchReport = async () => {
        setLoadingReport(true)
        try {
            const res = await axios.get('/api/v1/admin/reports/revenue')
            setReportData(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingReport(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'transactions') {
            fetchTransactions()
        } else if (activeTab === 'payouts') {
            fetchPayouts()
        } else if (activeTab === 'reports') {
            fetchReport()
        }
    }, [activeTab, txPage, typeFilter, statusFilter])

    const handleGenerateBatches = async () => {
        setGenerating(true)
        try {
            const res = await axios.post('/api/v1/admin/payouts/generate')
            alert(res.data.message)
            fetchPayouts()
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
            fetchPayouts()
        } catch (e) {
            console.error(e)
        } finally {
            setDisbursing(false)
        }
    }

    const handleRefundSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!refundTx) return

        setSubmittingRefund(true)
        try {
            await axios.post(`/api/v1/admin/transactions/${refundTx.id}/refund`, {
                refund_reference: refundRef,
                reason: refundReason,
            })
            setRefundTx(null)
            setRefundRef('')
            setRefundReason('')
            fetchTransactions()
        } catch (e) {
            console.error(e)
            alert('Failed to issue refund')
        } finally {
            setSubmittingRefund(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Finance & Payout Management"
                    subtitle="Platform ledger, payment transaction history, refund processing, payout disbursement, and revenue reports."
                />

                {/* Sub-navigation Tabs */}
                <div className="flex items-center space-x-2 border-b border-border mb-6">
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-1 flex items-center space-x-2 ${
                            activeTab === 'transactions'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <CreditCard className="h-4 w-4" />
                        <span>Transactions Ledger</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('payouts')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-1 flex items-center space-x-2 ${
                            activeTab === 'payouts'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <Wallet className="h-4 w-4" />
                        <span>Payout Batches</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-1 flex items-center space-x-2 ${
                            activeTab === 'reports'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span>Revenue Reports</span>
                    </button>
                </div>

                {/* TAB 1: TRANSACTIONS LEDGER */}
                {activeTab === 'transactions' && (
                    <div className="space-y-6">
                        {/* Search & Filters */}
                        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <form onSubmit={(e) => { e.preventDefault(); setTxPage(1); fetchTransactions(); }} className="flex items-center gap-2 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search by TxID, supporter email, or name..."
                                        value={txSearch}
                                        onChange={(e) => setTxSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background focus:ring-primary-500 focus:border-primary-500 text-text-primary"
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-xl">
                                    Search
                                </button>
                            </form>

                            <div className="flex items-center gap-3">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => { setTypeFilter(e.target.value); setTxPage(1); }}
                                    className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                                >
                                    <option value="">All Types</option>
                                    <option value="tip">Tips / Support</option>
                                    <option value="membership">Membership</option>
                                    <option value="product">Shop Product</option>
                                    <option value="service">Service Order</option>
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setTxPage(1); }}
                                    className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>

                        {/* Transactions Table */}
                        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                            {loadingTx ? (
                                <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading transaction records...</div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-12 text-xs text-text-muted">No transactions found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                                <th className="pb-3">Gateway TxID / Supporter</th>
                                                <th className="pb-3">Type</th>
                                                <th className="pb-3">Gross Amount</th>
                                                <th className="pb-3">Platform Fee</th>
                                                <th className="pb-3">Creator Share</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3">Date</th>
                                                <th className="pb-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                            {transactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-background/50 transition-colors">
                                                    <td className="py-3">
                                                        <div>
                                                            <span className="font-mono text-text-primary font-bold block">
                                                                {tx.sslcommerz_tran_id || tx.id.substring(0, 13)}
                                                            </span>
                                                            <span className="text-[11px] text-text-muted block">
                                                                {tx.supporter_name || 'Anonymous'} ({tx.supporter_email})
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700">
                                                            {tx.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 font-bold font-mono text-text-primary">
                                                        BDT {((tx.amount_cents || 0) / 100).toFixed(2)}
                                                    </td>
                                                    <td className="py-3 font-mono text-emerald-600">
                                                        BDT {((tx.platform_fee_cents || 0) / 100).toFixed(2)}
                                                    </td>
                                                    <td className="py-3 font-mono text-text-muted">
                                                        BDT {((tx.creator_share_cents || 0) / 100).toFixed(2)}
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                                            tx.status === 'paid'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : tx.status === 'refunded'
                                                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            <span className="capitalize">{tx.status}</span>
                                                        </span>
                                                    </td>
                                                    <td className="py-3 font-mono text-text-muted text-[11px]">
                                                        {new Date(tx.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => setSelectedTx(tx)}
                                                                className="p-1.5 hover:bg-background rounded-lg text-text-muted hover:text-text-primary"
                                                                title="View Details"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>

                                                            {tx.status === 'paid' && (
                                                                <button
                                                                    onClick={() => setRefundTx(tx)}
                                                                    className="p-1.5 hover:bg-background rounded-lg text-rose-600 hover:text-rose-700"
                                                                    title="Issue Refund"
                                                                >
                                                                    <RotateCcw className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {txMeta && txMeta.last_page > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                                    <span className="text-text-muted">
                                        Page {txMeta.current_page} of {txMeta.last_page} ({txMeta.total} total transactions)
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            disabled={txPage === 1}
                                            onClick={() => setTxPage(txPage - 1)}
                                            className="p-2 border border-border rounded-xl hover:bg-background disabled:opacity-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            disabled={txPage === txMeta.last_page}
                                            onClick={() => setTxPage(txPage + 1)}
                                            className="p-2 border border-border rounded-xl hover:bg-background disabled:opacity-50"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: PAYOUT BATCHES */}
                {activeTab === 'payouts' && (
                    <div className="space-y-6">
                        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-text-primary text-base">Creator Payout Batches</h3>
                                    <p className="text-xs text-text-muted">Generate batch disbursements for unsettled creator earnings.</p>
                                </div>

                                <button
                                    onClick={handleGenerateBatches}
                                    disabled={generating}
                                    className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-2 disabled:opacity-50"
                                >
                                    <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                                    <span>{generating ? 'Calculating...' : 'Generate New Batches'}</span>
                                </button>
                            </div>

                            {loadingBatches ? (
                                <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading payout batches...</div>
                            ) : batches.length === 0 ? (
                                <div className="text-center py-12 text-xs text-text-muted">No payout batches generated.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                                <th className="pb-3">Reference</th>
                                                <th className="pb-3">Creator</th>
                                                <th className="pb-3">Net Amount (BDT)</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3">External Ref / Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                            {batches.map((batch) => (
                                                <tr key={batch.id}>
                                                    <td className="py-3 font-mono text-text-muted">{batch.reference}</td>
                                                    <td className="py-3 font-bold text-text-primary">
                                                        {batch.creator_profile?.display_name || 'Creator Profile'}
                                                    </td>
                                                    <td className="py-3 font-bold font-mono text-primary-600">
                                                        BDT {(batch.total_cents / 100).toFixed(2)}
                                                    </td>
                                                    <td className="py-3">
                                                        {batch.status === 'disbursed' ? (
                                                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                <span>Disbursed</span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
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
                                                                className="py-1 px-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[11px] rounded-lg shadow-sm inline-flex items-center space-x-1"
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
                    </div>
                )}

                {/* TAB 3: REVENUE REPORTS */}
                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        {loadingReport ? (
                            <div className="py-12 text-center text-xs text-text-muted animate-pulse">Generating financial summary report...</div>
                        ) : reportData ? (
                            <div className="space-y-6">
                                {/* Summary Metric Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                                        <span className="text-xs text-text-muted font-semibold block">Gross Revenue Volume</span>
                                        <span className="text-2xl font-extrabold text-text-primary block">
                                            BDT {((reportData.summary?.gross_volume_cents || 0) / 100).toFixed(0)}
                                        </span>
                                        <span className="text-[11px] text-text-muted">{reportData.summary?.paid_count || 0} paid transactions</span>
                                    </div>

                                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                                        <span className="text-xs text-text-muted font-semibold block">Platform Net Fee Revenue</span>
                                        <span className="text-2xl font-extrabold text-emerald-600 block">
                                            BDT {((reportData.summary?.platform_fee_cents || 0) / 100).toFixed(0)}
                                        </span>
                                        <span className="text-[11px] text-text-muted">5% platform fee cut</span>
                                    </div>

                                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                                        <span className="text-xs text-text-muted font-semibold block">Total Refunded Amount</span>
                                        <span className="text-2xl font-extrabold text-purple-600 block">
                                            BDT {((reportData.summary?.refunded_cents || 0) / 100).toFixed(0)}
                                        </span>
                                        <span className="text-[11px] text-text-muted">{reportData.summary?.refunded_count || 0} processed refunds</span>
                                    </div>
                                </div>

                                {/* Daily Revenue Rollup Table */}
                                <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                                    <h3 className="font-bold text-text-primary text-base">Daily Revenue Audit Rollups</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                                    <th className="pb-3">Date</th>
                                                    <th className="pb-3">Gross (BDT)</th>
                                                    <th className="pb-3">Platform Fee</th>
                                                    <th className="pb-3">Net Creator (BDT)</th>
                                                    <th className="pb-3">Transactions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                                {reportData.daily_rollups?.map((r: any) => (
                                                    <tr key={r.id}>
                                                        <td className="py-3 font-mono font-bold text-text-primary">{r.date}</td>
                                                        <td className="py-3 font-mono">BDT {(r.gross_cents / 100).toFixed(2)}</td>
                                                        <td className="py-3 font-mono text-emerald-600">BDT {(r.platform_fee_cents / 100).toFixed(2)}</td>
                                                        <td className="py-3 font-mono text-text-muted">BDT {(r.net_cents / 100).toFixed(2)}</td>
                                                        <td className="py-3 font-mono">{r.transaction_count}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Transaction Slide-Over Detail */}
                {selectedTx && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
                        <div className="bg-surface w-full max-w-md h-full border-l border-border shadow-2xl p-6 overflow-y-auto space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-border">
                                <h3 className="font-bold text-base text-text-primary">Transaction Details</h3>
                                <button onClick={() => setSelectedTx(null)} className="p-1 hover:bg-background rounded-lg text-text-muted">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4 text-xs">
                                <div className="p-3 bg-background rounded-xl border border-border space-y-1">
                                    <span className="text-[11px] text-text-muted font-semibold block">SSLCommerz Transaction Reference</span>
                                    <span className="font-mono font-bold text-sm text-text-primary block">{selectedTx.sslcommerz_tran_id || selectedTx.id}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-background rounded-xl border border-border">
                                        <span className="text-[11px] text-text-muted font-semibold block">Gross Amount</span>
                                        <span className="text-base font-extrabold text-text-primary mt-1 block">
                                            BDT {((selectedTx.amount_cents || 0) / 100).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-background rounded-xl border border-border">
                                        <span className="text-[11px] text-text-muted font-semibold block">Platform Fee (5%)</span>
                                        <span className="text-base font-extrabold text-emerald-600 mt-1 block">
                                            BDT {((selectedTx.platform_fee_cents || 0) / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-border pt-3">
                                    <span className="font-bold text-text-primary block">Supporter Info</span>
                                    <p className="font-semibold text-text-primary">{selectedTx.supporter_name || 'Anonymous Supporter'}</p>
                                    <p className="font-mono text-text-muted">{selectedTx.supporter_email}</p>
                                </div>

                                <div className="space-y-2 border-t border-border pt-3">
                                    <span className="font-bold text-text-primary block">Creator Info</span>
                                    <p className="font-semibold text-text-primary">{selectedTx.creator_profile?.display_name || 'Creator'}</p>
                                    <p className="font-mono text-text-muted">/{selectedTx.creator_profile?.slug}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Disburse Modal */}
                {disbursingBatch && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">Disburse Batch {disbursingBatch.reference}</h3>
                            <div className="p-3 bg-primary-50 text-primary-700 text-xs rounded-xl flex justify-between">
                                <span>Disbursement Amount</span>
                                <span className="font-bold">BDT {(disbursingBatch.total_cents / 100).toFixed(2)}</span>
                            </div>
                            <form onSubmit={handleDisburseSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">bKash / Nagad / Bank Reference</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. BKASH_TRX_987654"
                                        value={externalRef}
                                        onChange={(e) => setExternalRef(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl font-mono bg-background text-text-primary"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setDisbursingBatch(null)}
                                        className="px-4 py-2 bg-background hover:bg-border text-text-secondary font-semibold rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={disbursing}
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                                    >
                                        {disbursing ? 'Disbursing...' : 'Confirm Disbursement'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Refund Modal */}
                {refundTx && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">Issue Transaction Refund</h3>
                            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex justify-between">
                                <span>Refund Amount</span>
                                <span className="font-bold">BDT {((refundTx.amount_cents || 0) / 100).toFixed(2)}</span>
                            </div>
                            <form onSubmit={handleRefundSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">Refund Reference ID</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. REF_SSL_998877"
                                        value={refundRef}
                                        onChange={(e) => setRefundRef(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl font-mono bg-background text-text-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">Refund Justification / Reason</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Enter reason..."
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setRefundTx(null)}
                                        className="px-4 py-2 bg-background hover:bg-border text-text-secondary font-semibold rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingRefund}
                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                                    >
                                        {submittingRefund ? 'Processing...' : 'Confirm Refund'}
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
