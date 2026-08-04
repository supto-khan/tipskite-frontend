'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Clock,
    X,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    ThumbsUp,
    ThumbsDown,
    Activity,
    Lock,
    Zap,
    FileText
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function TrustAndSafetyPage() {
    const [activeTab, setActiveTab] = useState<'flags' | 'fraud'>('flags')

    // Content Flags State
    const [flags, setFlags] = useState<any[]>([])
    const [flagMeta, setFlagMeta] = useState<any>(null)
    const [loadingFlags, setLoadingFlags] = useState(true)
    const [statusFilter, setStatusFilter] = useState('')
    const [reasonFilter, setReasonFilter] = useState('')
    const [flagPage, setFlagPage] = useState(1)

    // Fraud Signals State
    const [suspiciousIps, setSuspiciousIps] = useState<any[]>([])
    const [failedTxs, setFailedTxs] = useState<any[]>([])
    const [loadingFraud, setLoadingFraud] = useState(false)

    // Modal State for Flag Resolution
    const [resolveModal, setResolveModal] = useState<{ flag: any; action: 'resolved' | 'dismissed' } | null>(null)
    const [resolutionNote, setResolutionNote] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const fetchFlags = async () => {
        setLoadingFlags(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter) params.append('status', statusFilter)
            if (reasonFilter) params.append('reason', reasonFilter)
            params.append('page', flagPage.toString())

            const res = await axios.get(`/api/v1/admin/content-flags?${params.toString()}`)
            setFlags(res.data.data || [])
            setFlagMeta(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingFlags(false)
        }
    }

    const fetchFraudSignals = async () => {
        setLoadingFraud(true)
        try {
            const res = await axios.get('/api/v1/admin/fraud-signals')
            setSuspiciousIps(res.data.suspicious_ips || [])
            setFailedTxs(res.data.failed_transactions || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingFraud(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'flags') fetchFlags()
        else if (activeTab === 'fraud') fetchFraudSignals()
    }, [activeTab, flagPage, statusFilter, reasonFilter])

    const handleResolveSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!resolveModal) return

        setSubmitting(true)
        try {
            await axios.post(`/api/v1/admin/content-flags/${resolveModal.flag.id}/resolve`, {
                status: resolveModal.action,
                resolution_note: resolutionNote,
            })
            setResolveModal(null)
            setResolutionNote('')
            fetchFlags()
        } catch (e) {
            console.error(e)
            alert('Failed to resolve content flag')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Trust & Safety Center"
                    subtitle="Platform content moderation queue, abuse report resolution, and fraud risk detection."
                />

                {/* Sub-navigation Tabs */}
                <div className="flex items-center space-x-2 border-b border-border mb-6">
                    <button
                        onClick={() => setActiveTab('flags')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-1 flex items-center space-x-2 ${
                            activeTab === 'flags' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <ShieldAlert className="h-4 w-4" />
                        <span>Content Moderation Queue</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('fraud')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-1 flex items-center space-x-2 ${
                            activeTab === 'fraud' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <Zap className="h-4 w-4" />
                        <span>Fraud & IP Risk Signals</span>
                    </button>
                </div>

                {/* TAB 1: CONTENT MODERATION QUEUE */}
                {activeTab === 'flags' && (
                    <div className="space-y-6">
                        {/* Filter Bar */}
                        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Filter className="h-3.5 w-3.5 text-text-muted" />
                                <span className="text-xs font-semibold text-text-muted">Filters:</span>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setFlagPage(1); }}
                                    className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="open">Open / Pending</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="dismissed">Dismissed</option>
                                </select>

                                <select
                                    value={reasonFilter}
                                    onChange={(e) => { setReasonFilter(e.target.value); setFlagPage(1); }}
                                    className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                                >
                                    <option value="">All Reasons</option>
                                    <option value="spam">Spam</option>
                                    <option value="harassment">Harassment</option>
                                    <option value="hate_speech">Hate Speech</option>
                                    <option value="adult_content">Adult Content</option>
                                    <option value="copyright">Copyright Violation</option>
                                    <option value="scam_fraud">Scam / Fraud</option>
                                </select>
                            </div>
                        </div>

                        {/* Content Flags Table */}
                        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                            {loadingFlags ? (
                                <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading content moderation flags...</div>
                            ) : flags.length === 0 ? (
                                <div className="text-center py-12 text-xs text-text-muted">No reported content flags matched your criteria.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                                <th className="pb-3">Target Entity</th>
                                                <th className="pb-3">Reason</th>
                                                <th className="pb-3">Reporter</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3">Reported At</th>
                                                <th className="pb-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                            {flags.map((f) => (
                                                <tr key={f.id}>
                                                    <td className="py-3">
                                                        <span className="font-bold text-text-primary uppercase text-[11px] block">{f.target_type}</span>
                                                        <span className="font-mono text-[10px] text-text-muted block">ID: {f.target_id?.substring(0, 12)}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700">
                                                            {f.reason}
                                                        </span>
                                                        {f.details && <p className="text-[11px] text-text-muted mt-1 max-w-xs truncate">{f.details}</p>}
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="font-mono text-text-muted text-[11px]">{f.reporter_email || f.reporter?.email || 'Anonymous'}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                                            f.status === 'resolved'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : f.status === 'dismissed'
                                                                ? 'bg-gray-50 text-gray-600 border border-gray-200'
                                                                : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                                                        }`}>
                                                            <span className="capitalize">{f.status}</span>
                                                        </span>
                                                    </td>
                                                    <td className="py-3 font-mono text-text-muted text-[11px]">
                                                        {new Date(f.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3">
                                                        {f.status === 'open' ? (
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => setResolveModal({ flag: f, action: 'resolved' })}
                                                                    className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm flex items-center space-x-1"
                                                                >
                                                                    <ThumbsUp className="h-3 w-3" />
                                                                    <span>Resolve</span>
                                                                </button>

                                                                <button
                                                                    onClick={() => setResolveModal({ flag: f, action: 'dismissed' })}
                                                                    className="py-1 px-2.5 bg-gray-600 hover:bg-gray-700 text-white font-bold text-[11px] rounded-lg shadow-sm flex items-center space-x-1"
                                                                >
                                                                    <ThumbsDown className="h-3 w-3" />
                                                                    <span>Dismiss</span>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[11px] text-text-muted italic">Resolved ({f.resolution_note})</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {flagMeta && flagMeta.last_page > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                                    <span className="text-text-muted">Page {flagMeta.current_page} of {flagMeta.last_page}</span>
                                    <div className="flex items-center space-x-2">
                                        <button disabled={flagPage === 1} onClick={() => setFlagPage(flagPage - 1)} className="p-2 border border-border rounded-xl disabled:opacity-50">
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button disabled={flagPage === flagMeta.last_page} onClick={() => setFlagPage(flagPage + 1)} className="p-2 border border-border rounded-xl disabled:opacity-50">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: FRAUD & IP RISK SIGNALS */}
                {activeTab === 'fraud' && (
                    <div className="space-y-6">
                        {loadingFraud ? (
                            <div className="py-12 text-center text-xs text-text-muted animate-pulse">Analyzing platform risk signals...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Suspicious Checkout IP Clusters */}
                                <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                        <h3 className="font-bold text-text-primary text-base">High Frequency Checkout IPs</h3>
                                    </div>
                                    <p className="text-xs text-text-muted">IP addresses with 3+ transactions (potential card testing or multi-account abuse).</p>

                                    {suspiciousIps.length === 0 ? (
                                        <div className="text-center py-8 text-xs text-text-muted">No high-risk IP clusters detected.</div>
                                    ) : (
                                        <div className="divide-y divide-border/40 text-xs">
                                            {suspiciousIps.map((ip, idx) => (
                                                <div key={idx} className="py-3 flex items-center justify-between">
                                                    <div>
                                                        <span className="font-mono font-bold text-text-primary block">{ip.checkout_ip}</span>
                                                        <span className="text-[11px] text-text-muted font-mono">Total Volume: BDT {((ip.total_cents || 0) / 100).toFixed(0)}</span>
                                                    </div>
                                                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-xs font-mono">
                                                        {ip.tx_count} Transactions
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Failed Transaction Feed */}
                                <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Lock className="h-4 w-4 text-rose-600" />
                                        <h3 className="font-bold text-text-primary text-base">Recent Failed Transactions</h3>
                                    </div>
                                    <p className="text-xs text-text-muted">SSLCommerz payment failure logs for fraud inspection.</p>

                                    {failedTxs.length === 0 ? (
                                        <div className="text-center py-8 text-xs text-text-muted">No failed transactions logged.</div>
                                    ) : (
                                        <div className="divide-y divide-border/40 text-xs">
                                            {failedTxs.map((ftx) => (
                                                <div key={ftx.id} className="py-3 flex items-center justify-between">
                                                    <div>
                                                        <span className="font-mono text-text-primary font-bold block">{ftx.sslcommerz_tran_id || ftx.id.substring(0, 12)}</span>
                                                        <span className="text-[11px] text-text-muted block">/{ftx.creator_profile?.slug || 'creator'}</span>
                                                    </div>
                                                    <span className="font-mono text-rose-600 font-bold">
                                                        BDT {((ftx.amount_cents || 0) / 100).toFixed(0)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Flag Resolution Modal */}
                {resolveModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">
                                {resolveModal.action === 'resolved' ? 'Mark Content Flag as Resolved' : 'Dismiss Content Flag'}
                            </h3>
                            <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">Resolution Note / Moderation Log</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Enter moderation decision note..."
                                        value={resolutionNote}
                                        onChange={(e) => setResolutionNote(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button type="button" onClick={() => setResolveModal(null)} className="px-4 py-2 bg-background text-text-secondary font-semibold rounded-xl">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50">
                                        {submitting ? 'Processing...' : 'Confirm Decision'}
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
