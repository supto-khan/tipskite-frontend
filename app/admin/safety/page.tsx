'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    ShieldAlert,
    AlertTriangle,
    Lock,
    Zap,
    RefreshCw,
    Activity,
    CreditCard,
    Users,
    Repeat,
    TrendingUp,
    CheckCircle2,
    Shield,
    ExternalLink,
    Ban,
    UserX,
    AlertOctagon
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function FraudAndRiskSignalsPage() {
    const [suspiciousIps, setSuspiciousIps] = useState<any[]>([])
    const [failedTxs, setFailedTxs] = useState<any[]>([])
    const [duplicateAccounts, setDuplicateAccounts] = useState<any[]>([])
    const [selfTransactions, setSelfTransactions] = useState<any[]>([])
    const [velocitySpikes, setVelocitySpikes] = useState<any[]>([])
    const [microBursts, setMicroBursts] = useState<any[]>([])
    const [atoWithdrawals, setAtoWithdrawals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Action Modal State for Freezing / Restricting User
    const [freezeModal, setFreezeModal] = useState<{ user: any; actionName: string } | null>(null)
    const [freezeReason, setFreezeReason] = useState('')
    const [submittingFreeze, setSubmittingFreeze] = useState(false)

    const fetchFraudSignals = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/v1/admin/fraud-signals')
            setSuspiciousIps(res.data.suspicious_ips || [])
            setFailedTxs(res.data.failed_transactions || [])
            setDuplicateAccounts(res.data.duplicate_payout_accounts || [])
            setSelfTransactions(res.data.self_transactions || [])
            setVelocitySpikes(res.data.velocity_spikes || [])
            setMicroBursts(res.data.micro_transaction_bursts || [])
            setAtoWithdrawals(res.data.ato_withdrawals || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFraudSignals()
    }, [])

    const handleFreezeSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!freezeModal) return

        setSubmittingFreeze(true)
        try {
            await axios.patch(`/api/v1/admin/users/${freezeModal.user.id}/status`, {
                account_status: 'restricted',
                reason: freezeReason || 'Flagged by Fraud & Risk Engine heuristics',
            })
            alert(`User ${freezeModal.user.display_name || freezeModal.user.email} has been restricted and payouts frozen.`)
            setFreezeModal(null)
            setFreezeReason('')
            fetchFraudSignals()
        } catch (e) {
            console.error(e)
            alert('Failed to restrict user')
        } finally {
            setSubmittingFreeze(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary font-sans">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4 border-b border-border mb-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-text-primary">Fraud & Risk Signals Intelligence</h1>
                        <p className="text-xs text-text-muted mt-1">
                            Real-time surveillance across 7 critical attack vectors: Mule Accounts, ATO Withdrawals, Self-Tipping, Velocity Spikes & Card Testing.
                        </p>
                    </div>

                    <button
                        onClick={fetchFraudSignals}
                        disabled={loading}
                        className="px-4 py-2 bg-surface hover:bg-background text-text-primary border border-border font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 cursor-pointer transition-all self-start md:self-auto"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh Intelligence</span>
                    </button>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-xs text-text-muted animate-pulse flex flex-col items-center justify-center space-y-3">
                        <Activity className="h-8 w-8 text-primary-500 animate-spin" />
                        <span>Scanning transactions, IP telemetry, ATO risk, and payout accounts for anomalies...</span>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* 5 Threat Intelligence Metric Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-4 flex items-center space-x-3">
                                <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Mule Rings</span>
                                    <span className="text-xl font-black text-rose-600">{duplicateAccounts.length}</span>
                                </div>
                            </div>

                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-4 flex items-center space-x-3">
                                <div className="p-2.5 bg-red-500/10 text-red-600 rounded-xl">
                                    <AlertOctagon className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">ATO Withdrawals</span>
                                    <span className="text-xl font-black text-red-600">{atoWithdrawals.length}</span>
                                </div>
                            </div>

                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-4 flex items-center space-x-3">
                                <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
                                    <Repeat className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Self-Tipping</span>
                                    <span className="text-xl font-black text-amber-600">{selfTransactions.length}</span>
                                </div>
                            </div>

                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-4 flex items-center space-x-3">
                                <div className="p-2.5 bg-purple-500/10 text-purple-600 rounded-xl">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Velocity Spikes</span>
                                    <span className="text-xl font-black text-purple-600">{velocitySpikes.length}</span>
                                </div>
                            </div>

                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-4 flex items-center space-x-3">
                                <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Card Testing</span>
                                    <span className="text-xl font-black text-blue-600">{microBursts.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 1: CRITICAL THREATS (ATO WITHDRAWALS & MULE ACCOUNTS) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* ATO Risk Withdrawals */}
                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <AlertOctagon className="h-4 w-4 text-red-600" />
                                    <h3 className="font-bold text-text-primary text-base">Account Takeover (ATO) Fast-Cashout Risk</h3>
                                </div>
                                <p className="text-xs text-text-muted">
                                    Pending withdrawal requests created within 48 hours of adding or modifying a payout destination.
                                </p>

                                {atoWithdrawals.length === 0 ? (
                                    <div className="text-center py-8 text-xs text-text-muted bg-background/50 rounded-xl border border-dashed border-border flex items-center justify-center space-x-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <span>No fast-cashout ATO signals detected.</span>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/40 text-xs">
                                        {atoWithdrawals.map((batch) => (
                                            <div key={batch.id} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-text-primary block">
                                                        {batch.creator_profile?.user?.display_name || 'Creator'} ({batch.reference})
                                                    </span>
                                                    <span className="text-[11px] text-text-muted font-mono block">
                                                        Method: {batch.destination_snapshot?.method} •••• {batch.payment_account?.account_last_four}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="font-mono text-red-600 font-bold">
                                                        BDT {((batch.total_cents || 0) / 100).toFixed(0)}
                                                    </span>
                                                    {batch.creator_profile?.user && (
                                                        <button
                                                            onClick={() => setFreezeModal({ user: batch.creator_profile.user, actionName: 'Restrict & Freeze Account' })}
                                                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer"
                                                        >
                                                            <Ban className="h-3 w-3" />
                                                            <span>Freeze</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mule Accounts (Duplicate Payout Numbers) */}
                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                                    <h3 className="font-bold text-text-primary text-base">Duplicate Payout Accounts (Mule Ring Risk)</h3>
                                </div>
                                <p className="text-xs text-text-muted">
                                    Identifies the same bKash/Nagad/Bank credentials used across multiple creator accounts.
                                </p>

                                {duplicateAccounts.length === 0 ? (
                                    <div className="text-center py-8 text-xs text-text-muted bg-background/50 rounded-xl border border-dashed border-border flex items-center justify-center space-x-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <span>No shared or duplicate payout accounts detected.</span>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/40 text-xs">
                                        {duplicateAccounts.map((dup, idx) => (
                                            <div key={idx} className="py-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono font-bold text-text-primary uppercase">
                                                        {dup.payout_method} ({dup.bank_name || 'MFS'}) •••• {dup.account_last_four}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-bold rounded-lg text-[11px]">
                                                        {dup.creator_count} Shared Creators
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    {dup.accounts?.map((acc: any) => (
                                                        <div key={acc.id} className="flex items-center space-x-1.5 px-2 py-1 bg-background rounded-lg border border-border text-[11px] font-mono text-text-secondary">
                                                            <span>/{acc.creator_profile?.slug || 'creator'}</span>
                                                            {acc.creator_profile?.user && (
                                                                <button
                                                                    onClick={() => setFreezeModal({ user: acc.creator_profile.user, actionName: 'Restrict & Freeze Creator' })}
                                                                    className="text-red-500 hover:text-red-700 ml-1 cursor-pointer"
                                                                    title="Freeze User"
                                                                >
                                                                    <Ban className="h-3 w-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SECTION 2: SELF-TIPPING & ABNORMAL VELOCITY */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Self-Tipping / Circular Fraud */}
                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Repeat className="h-4 w-4 text-amber-600" />
                                    <h3 className="font-bold text-text-primary text-base">Self-Tipping & Circular Transactions</h3>
                                </div>
                                <p className="text-xs text-text-muted">
                                    Transactions where the supporter email or checkout IP matches the creator&apos;s own registered account or login IP.
                                </p>

                                {selfTransactions.length === 0 ? (
                                    <div className="text-center py-8 text-xs text-text-muted bg-background/50 rounded-xl border border-dashed border-border flex items-center justify-center space-x-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <span>No self-tipping circular patterns detected.</span>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/40 text-xs">
                                        {selfTransactions.map((tx: any) => (
                                            <div key={tx.id} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-text-primary block">
                                                        Supporter: {tx.supporter_email}
                                                    </span>
                                                    <span className="text-[11px] text-text-muted font-mono block">
                                                        Creator: /{tx.creator_profile?.slug} ({tx.creator_profile?.user?.email})
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="font-mono text-amber-600 font-bold">
                                                        BDT {((tx.amount_cents || 0) / 100).toFixed(0)}
                                                    </span>
                                                    {tx.creator_profile?.user && (
                                                        <button
                                                            onClick={() => setFreezeModal({ user: tx.creator_profile.user, actionName: 'Restrict Creator' })}
                                                            className="p-1 text-amber-600 hover:text-amber-700 rounded cursor-pointer"
                                                            title="Restrict Creator"
                                                        >
                                                            <Ban className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 24h Velocity Spikes */}
                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="h-4 w-4 text-purple-600" />
                                    <h3 className="font-bold text-text-primary text-base">24h Abnormal Volume Spikes (&gt; 20,000 BDT)</h3>
                                </div>
                                <p className="text-xs text-text-muted">
                                    Creators receiving sudden high earnings in a short timeframe.
                                </p>

                                {velocitySpikes.length === 0 ? (
                                    <div className="text-center py-8 text-xs text-text-muted bg-background/50 rounded-xl border border-dashed border-border flex items-center justify-center space-x-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <span>No abnormal volume surges in the last 24 hours.</span>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/40 text-xs">
                                        {velocitySpikes.map((v, idx) => (
                                            <div key={idx} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-text-primary block">
                                                        {v.creator_profile?.user?.display_name || 'Creator'}
                                                    </span>
                                                    <span className="text-[11px] text-text-muted font-mono">
                                                        /{v.creator_profile?.slug} • {v.tx_count} transactions
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="font-mono text-purple-600 font-bold text-sm">
                                                        BDT {((v.total_volume_cents || 0) / 100).toFixed(0)}
                                                    </span>
                                                    {v.creator_profile?.user && (
                                                        <button
                                                            onClick={() => setFreezeModal({ user: v.creator_profile.user, actionName: 'Restrict & Audit Creator' })}
                                                            className="p-1 text-purple-600 hover:text-purple-700 rounded cursor-pointer"
                                                            title="Restrict Creator"
                                                        >
                                                            <Ban className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SECTION 3: GATEWAY TELEMETRY & HIGH-FREQUENCY IPs */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Card / Micro-Transaction Bursts */}
                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Zap className="h-4 w-4 text-blue-600" />
                                    <h3 className="font-bold text-text-primary text-base">Rapid Micro-Transaction Bursts (&le; 50 BDT)</h3>
                                </div>
                                <p className="text-xs text-text-muted">
                                    Detects automated bot sweeps or card testing bursts originating from single IP clusters.
                                </p>

                                {microBursts.length === 0 ? (
                                    <div className="text-center py-8 text-xs text-text-muted bg-background/50 rounded-xl border border-dashed border-border flex items-center justify-center space-x-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <span>No micro-transaction automated bursts detected.</span>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/40 text-xs">
                                        {microBursts.map((mb, idx) => (
                                            <div key={idx} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <span className="font-mono font-bold text-text-primary block">
                                                        IP: {mb.checkout_ip}
                                                    </span>
                                                    <span className="text-[11px] text-text-muted">
                                                        Total Micro-Volume: BDT {((mb.total_cents || 0) / 100).toFixed(0)}
                                                    </span>
                                                </div>
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-bold rounded-lg text-xs font-mono">
                                                    {mb.micro_count} Micro-Txs
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Failed Gateway Transactions */}
                            <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Lock className="h-4 w-4 text-rose-600" />
                                    <h3 className="font-bold text-text-primary text-base">Recent Failed Transactions (SSLCommerz)</h3>
                                </div>
                                <p className="text-xs text-text-muted">Payment decline logs and transaction error telemetry.</p>

                                {failedTxs.length === 0 ? (
                                    <div className="text-center py-8 text-xs text-text-muted bg-background/50 rounded-xl border border-dashed border-border">
                                        No recent failed transactions logged.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/40 text-xs">
                                        {failedTxs.map((ftx) => (
                                            <div key={ftx.id} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <span className="font-mono text-text-primary font-bold block">
                                                        {ftx.sslcommerz_tran_id || ftx.id.substring(0, 12)}
                                                    </span>
                                                    <span className="text-[11px] text-text-muted block">
                                                        Creator: /{ftx.creator_profile?.slug || 'unknown'}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-mono text-rose-600 font-bold block">
                                                        BDT {((ftx.amount_cents || 0) / 100).toFixed(0)}
                                                    </span>
                                                    <span suppressHydrationWarning className="text-[10px] text-text-muted font-mono">
                                                        {ftx.created_at ? new Date(ftx.created_at).toLocaleTimeString() : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Freeze / Restrict User Modal */}
                {freezeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">
                                Freeze Payouts & Restrict Account
                            </h3>
                            <p className="text-xs text-text-muted">
                                You are about to restrict <span className="font-bold text-text-primary">{freezeModal.user.display_name || freezeModal.user.email}</span>. This will immediately disable their payouts and revoke active sessions.
                            </p>

                            <form onSubmit={handleFreezeSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">Reason for Admin Action</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Reason (e.g. Mule ring risk / Suspicious fast cashout)..."
                                        value={freezeReason}
                                        onChange={(e) => setFreezeReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setFreezeModal(null)}
                                        className="px-4 py-2 bg-background hover:bg-border text-text-secondary font-semibold rounded-xl cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingFreeze}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                                    >
                                        {submittingFreeze ? 'Freezing...' : 'Confirm Freeze & Restrict'}
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
