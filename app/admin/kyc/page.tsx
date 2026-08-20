'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    ShieldCheck,
    CheckCircle2,
    Clock,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    Building2,
    Smartphone,
    User,
    Calendar,
    Search,
    Filter,
    ArrowRight
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function KycReviewQueuePage() {
    const [kycQueue, setKycQueue] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [methodFilter, setMethodFilter] = useState<string>('all')

    // KYC Decision Modal State
    const [kycModal, setKycModal] = useState<{
        account: any
        action: 'approved' | 'rejected'
    } | null>(null)
    const [kycRejectionReason, setKycRejectionReason] = useState('')
    const [submittingKyc, setSubmittingKyc] = useState(false)

    const fetchKycQueue = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/v1/admin/kyc-queue')
            setKycQueue(res.data.kyc_queue || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchKycQueue()
    }, [])

    const handleKycReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!kycModal) return

        setSubmittingKyc(true)
        try {
            await axios.post(`/api/v1/admin/kyc/${kycModal.account.id}/review`, {
                status: kycModal.action,
                rejection_reason: kycModal.action === 'rejected' ? kycRejectionReason : null,
            })
            setKycModal(null)
            setKycRejectionReason('')
            fetchKycQueue()
        } catch (e) {
            console.error(e)
            alert('Failed to update KYC status')
        } finally {
            setSubmittingKyc(false)
        }
    }

    const filteredQueue = kycQueue.filter((acc) => {
        const matchesMethod = methodFilter === 'all' ? true : acc.payout_method?.toLowerCase() === methodFilter.toLowerCase()
        const nameMatch = acc.account_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.creator_profile?.user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.creator_profile?.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.bank_name?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesMethod && (searchQuery ? nameMatch : true)
    })

    return (
        <div className="min-h-screen bg-background flex font-sans">
            <AdminSidebar />

            <main className="flex-1 p-8 space-y-8 overflow-y-auto w-full">
                <AdminHeader
                    title="KYC & Payout Verification Queue"
                    subtitle="Review submitted Mobile Financial Services (bKash/Nagad/Rocket) and Bank Account credentials to grant payout clearance."
                />

                {/* Queue Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface rounded-2xl p-5 border border-border flex items-center space-x-4">
                        <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs text-text-muted font-bold uppercase tracking-wider block">Pending Verifications</span>
                            <span className="text-2xl font-black text-text-primary mt-0.5 block">{kycQueue.length}</span>
                        </div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border flex items-center space-x-4">
                        <div className="p-3 bg-primary-600/10 text-primary-600 rounded-xl">
                            <Smartphone className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs text-text-muted font-bold uppercase tracking-wider block">MFS Accounts</span>
                            <span className="text-2xl font-black text-text-primary mt-0.5 block">
                                {kycQueue.filter((a) => ['bkash', 'nagad', 'rocket'].includes(a.payout_method?.toLowerCase())).length}
                            </span>
                        </div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs text-text-muted font-bold uppercase tracking-wider block">Bank Transfers</span>
                            <span className="text-2xl font-black text-text-primary mt-0.5 block">
                                {kycQueue.filter((a) => a.payout_method?.toLowerCase() === 'bank').length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-surface rounded-2xl p-4 border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search by creator name, slug, account name, bank..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background text-text-primary focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
                        {['all', 'bkash', 'nagad', 'rocket', 'bank'].map((method) => (
                            <button
                                key={method}
                                onClick={() => setMethodFilter(method)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                                    methodFilter === method
                                        ? 'bg-primary-600 text-white shadow-xs'
                                        : 'bg-background text-text-secondary hover:bg-border/60 border border-border'
                                }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Queue Table */}
                <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                    {loading ? (
                        <div className="text-center py-16 text-xs text-text-muted animate-pulse">Loading KYC queue items...</div>
                    ) : filteredQueue.length === 0 ? (
                        <div className="text-center py-16 text-xs text-text-muted flex flex-col items-center space-y-3">
                            <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h4 className="text-base font-bold text-text-primary">All Clear! No Pending Submissions</h4>
                            <p className="max-w-sm text-text-muted">
                                Every creator payout account has been verified or no new KYC applications have been submitted.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                        <th className="pb-3">Creator Profile</th>
                                        <th className="pb-3">Payout Method</th>
                                        <th className="pb-3">Account Details</th>
                                        <th className="pb-3">Submission Timestamp</th>
                                        <th className="pb-3 text-right">Verification Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                    {filteredQueue.map((acc) => {
                                        const isBank = acc.payout_method?.toLowerCase() === 'bank'

                                        return (
                                            <tr key={acc.id} className="hover:bg-background/40 transition-colors">
                                                <td className="py-3.5 font-bold text-text-primary">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-7 w-7 rounded-full bg-primary-600/10 text-primary-600 flex items-center justify-center font-bold text-xs">
                                                            {acc.creator_profile?.user?.display_name?.charAt(0) || 'C'}
                                                        </div>
                                                        <div>
                                                            <div>{acc.creator_profile?.user?.display_name || 'Creator'}</div>
                                                            <a
                                                                href={`/${acc.creator_profile?.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[11px] font-mono text-primary hover:underline font-normal flex items-center space-x-1"
                                                            >
                                                                <span>/{acc.creator_profile?.slug}</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5">
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                                        {acc.payout_method}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 space-y-0.5">
                                                    <div className="font-mono font-bold text-text-primary">{acc.account_name}</div>
                                                    {isBank ? (
                                                        <div className="font-mono text-[11px] text-text-muted">
                                                            {acc.bank_name} • Branch: {acc.branch_name || 'N/A'} • Routing: {acc.routing_number || 'N/A'}
                                                        </div>
                                                    ) : (
                                                        <div className="font-mono text-[11px] text-text-muted">
                                                            MFS Wallet: {acc.account_number || acc.account_name}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3.5 font-mono text-text-muted text-[11px]">
                                                    {acc.kyc_submitted_at ? new Date(acc.kyc_submitted_at).toLocaleString() : 'Recently'}
                                                </td>
                                                <td className="py-3.5 text-right space-x-2">
                                                    <button
                                                        onClick={() => setKycModal({ account: acc, action: 'approved' })}
                                                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5 cursor-pointer"
                                                    >
                                                        <ThumbsUp className="h-3.5 w-3.5" />
                                                        <span>Approve KYC</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setKycModal({ account: acc, action: 'rejected' })}
                                                        className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5 cursor-pointer"
                                                    >
                                                        <ThumbsDown className="h-3.5 w-3.5" />
                                                        <span>Reject</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* KYC Decision Modal */}
                {kycModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">
                                {kycModal.action === 'approved' ? 'Approve Creator KYC Verification' : 'Reject KYC Submission'}
                            </h3>
                            <p className="text-xs text-text-muted">
                                {kycModal.action === 'approved'
                                    ? `Are you sure you want to approve the ${kycModal.account.payout_method?.toUpperCase()} account for "${kycModal.account.creator_profile?.user?.display_name || 'this creator'}"? This enables them to receive automated or manual payouts.`
                                    : `Provide feedback explaining why the ${kycModal.account.payout_method?.toUpperCase()} account submission for "${kycModal.account.creator_profile?.user?.display_name || 'this creator'}" is being rejected.`}
                            </p>

                            <form onSubmit={handleKycReviewSubmit} className="space-y-4 text-xs">
                                {kycModal.action === 'rejected' && (
                                    <div>
                                        <label className="block font-semibold text-text-secondary mb-1">Rejection Reason</label>
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="Explain why the KYC details were rejected (e.g. Account name mismatch, invalid routing number)..."
                                            value={kycRejectionReason}
                                            onChange={(e) => setKycRejectionReason(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary focus:ring-primary-500"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setKycModal(null)}
                                        className="px-4 py-2 bg-background hover:bg-border text-text-secondary font-semibold rounded-xl cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingKyc}
                                        className={`px-4 py-2 text-white font-bold rounded-xl shadow-md disabled:opacity-50 cursor-pointer ${
                                            kycModal.action === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                        }`}
                                    >
                                        {submittingKyc ? 'Submitting...' : kycModal.action === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}
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
