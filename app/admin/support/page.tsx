'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    LifeBuoy,
    MessageSquare,
    Eye,
    EyeOff,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Filter,
    Shield,
    Heart,
    Lock
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function SupportAndTicketsPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [meta, setMeta] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Filters
    const [flaggedFilter, setFlaggedFilter] = useState('')
    const [hiddenFilter, setHiddenFilter] = useState('')
    const [page, setPage] = useState(1)

    // Modal state for hiding message
    const [hideModal, setHideModal] = useState<{ msg: any; action: 'hide' | 'unhide' } | null>(null)
    const [reason, setReason] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (flaggedFilter) params.append('flagged', flaggedFilter)
            if (hiddenFilter) params.append('hidden', hiddenFilter)
            params.append('page', page.toString())

            const res = await axios.get(`/api/v1/admin/supporter-messages?${params.toString()}`)
            setMessages(res.data.data || [])
            setMeta(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [page, flaggedFilter, hiddenFilter])

    const handleHideSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!hideModal) return

        setSubmitting(true)
        try {
            await axios.patch(`/api/v1/admin/supporter-messages/${hideModal.msg.id}/hide`, {
                is_hidden: hideModal.action === 'hide',
                reason,
            })
            setHideModal(null)
            setReason('')
            fetchMessages()
        } catch (e) {
            console.error(e)
            alert('Failed to update message visibility')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Support & Community Messages"
                    subtitle="Platform customer support inbox, supporter tip messages moderation, and automated content filter oversight."
                />

                {/* Filter Bar */}
                <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Filter className="h-3.5 w-3.5 text-text-muted" />
                        <span className="text-xs font-semibold text-text-muted">Filters:</span>

                        <select
                            value={flaggedFilter}
                            onChange={(e) => { setFlaggedFilter(e.target.value); setPage(1); }}
                            className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                        >
                            <option value="">All Filter Flags</option>
                            <option value="true">Flagged by Automated Filter</option>
                            <option value="false">Clean / Not Flagged</option>
                        </select>

                        <select
                            value={hiddenFilter}
                            onChange={(e) => { setHiddenFilter(e.target.value); setPage(1); }}
                            className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                        >
                            <option value="">All Visibilities</option>
                            <option value="false">Visible</option>
                            <option value="true">Hidden by Admin/Creator</option>
                        </select>
                    </div>
                </div>

                {/* Messages Table */}
                <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                    <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-primary-600" />
                        <span>Supporter Tip Messages Log</span>
                    </h3>

                    {loading ? (
                        <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading supporter messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12 text-xs text-text-muted">No supporter messages found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                        <th className="pb-3">Supporter / Creator</th>
                                        <th className="pb-3">Message Body</th>
                                        <th className="pb-3">Flags & Visibility</th>
                                        <th className="pb-3">Date</th>
                                        <th className="pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                    {messages.map((m) => (
                                        <tr key={m.id} className="hover:bg-background/50 transition-colors">
                                            <td className="py-3">
                                                <div>
                                                    <span className="font-bold text-text-primary block">{m.display_name || 'Anonymous'}</span>
                                                    <span className="text-[11px] font-mono text-text-muted block">To: /{m.creator_profile?.slug}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 max-w-md">
                                                <p className="text-xs text-text-primary line-clamp-2">{m.body || '<No message text>'}</p>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center space-x-1">
                                                    {m.is_flagged_by_filter && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                            Filter Flagged
                                                        </span>
                                                    )}
                                                    {m.is_hidden ? (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                            Hidden
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            Visible
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 font-mono text-text-muted text-[11px]">
                                                {new Date(m.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => setHideModal({ msg: m, action: m.is_hidden ? 'unhide' : 'hide' })}
                                                    className={`p-1.5 hover:bg-background rounded-lg transition-colors ${
                                                        m.is_hidden ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}
                                                    title={m.is_hidden ? 'Unhide Message' : 'Hide Message'}
                                                >
                                                    {m.is_hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                            <span className="text-text-muted">Page {meta.current_page} of {meta.last_page}</span>
                            <div className="flex items-center space-x-2">
                                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 border border-border rounded-xl disabled:opacity-50">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button disabled={page === meta.last_page} onClick={() => setPage(page + 1)} className="p-2 border border-border rounded-xl disabled:opacity-50">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hide / Unhide Modal */}
                {hideModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">
                                {hideModal.action === 'hide' ? 'Hide Supporter Message' : 'Unhide Supporter Message'}
                            </h3>
                            <form onSubmit={handleHideSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">Reason for Action</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Enter moderation reason..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button type="button" onClick={() => setHideModal(null)} className="px-4 py-2 bg-background text-text-secondary font-semibold rounded-xl">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50">
                                        {submitting ? 'Processing...' : 'Confirm Action'}
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
