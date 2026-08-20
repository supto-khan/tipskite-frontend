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
    Lock,
    Brush,
    Search,
    Phone,
    Mail,
    ExternalLink,
    Edit3,
    Check,
    X,
    Sparkles,
    Send,
    Loader2
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function SupportAndTicketsPage() {
    const [activeTab, setActiveTab] = useState<'storefronts' | 'messages'>('storefronts')

    // Supporter Messages state
    const [messages, setMessages] = useState<any[]>([])
    const [messagesMeta, setMessagesMeta] = useState<any>(null)
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [flaggedFilter, setFlaggedFilter] = useState('')
    const [hiddenFilter, setHiddenFilter] = useState('')
    const [messagesPage, setMessagesPage] = useState(1)
    const [hideModal, setHideModal] = useState<{ msg: any; action: 'hide' | 'unhide' } | null>(null)
    const [reason, setReason] = useState('')
    const [submittingHide, setSubmittingHide] = useState(false)

    // Custom Storefront Requests state
    const [requests, setRequests] = useState<any[]>([])
    const [requestsMeta, setRequestsMeta] = useState<any>(null)
    const [loadingRequests, setLoadingRequests] = useState(true)
    const [statusFilter, setStatusFilter] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [requestsPage, setRequestsPage] = useState(1)
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
    const [newStatus, setNewStatus] = useState('in_review')
    const [adminNotes, setAdminNotes] = useState('')
    const [updatingStatus, setUpdatingStatus] = useState(false)

    const fetchMessages = async () => {
        setLoadingMessages(true)
        try {
            const params = new URLSearchParams()
            if (flaggedFilter) params.append('flagged', flaggedFilter)
            if (hiddenFilter) params.append('hidden', hiddenFilter)
            params.append('page', messagesPage.toString())

            const res = await axios.get(`/api/v1/admin/supporter-messages?${params.toString()}`)
            setMessages(res.data.data || [])
            setMessagesMeta(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingMessages(false)
        }
    }

    const fetchStorefrontRequests = async () => {
        setLoadingRequests(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter) params.append('status', statusFilter)
            if (searchQuery) params.append('search', searchQuery)
            params.append('page', requestsPage.toString())

            const res = await axios.get(`/api/v1/admin/custom-storefront-requests?${params.toString()}`)
            setRequests(res.data.data || [])
            setRequestsMeta(res.data)
        } catch (e) {
            console.error('Failed to fetch custom storefront requests:', e)
        } finally {
            setLoadingRequests(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'messages') {
            fetchMessages()
        } else {
            fetchStorefrontRequests()
        }
    }, [activeTab, messagesPage, flaggedFilter, hiddenFilter, requestsPage, statusFilter])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setRequestsPage(1)
        fetchStorefrontRequests()
    }

    const handleHideSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!hideModal) return

        setSubmittingHide(true)
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
            setSubmittingHide(false)
        }
    }

    const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedRequest) return

        setUpdatingStatus(true)
        try {
            await axios.patch(`/api/v1/admin/custom-storefront-requests/${selectedRequest.id}/status`, {
                status: newStatus,
                admin_notes: adminNotes,
            })
            setSelectedRequest(null)
            fetchStorefrontRequests()
        } catch (e) {
            console.error('Failed to update request status:', e)
            alert('Failed to update custom storefront request status.')
        } finally {
            setUpdatingStatus(false)
        }
    }

    const openReviewModal = (req: any) => {
        setSelectedRequest(req)
        setNewStatus(req.status || 'in_review')
        setAdminNotes(req.admin_notes || '')
    }

    const statusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /><span>Pending</span></span>
            case 'in_review':
                return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200"><Eye className="w-3 h-3" /><span>In Review</span></span>
            case 'approved':
                return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /><span>Approved</span></span>
            case 'completed':
                return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200"><Sparkles className="w-3 h-3" /><span>Completed</span></span>
            case 'rejected':
                return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"><AlertCircle className="w-3 h-3" /><span>Declined</span></span>
            default:
                return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-700 border border-gray-200">{status}</span>
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Support & Bespoke Requests"
                    subtitle="Manage custom storefront/profile design inquiries, creator assistance, and supporter message moderation."
                />

                {/* Tab Switcher */}
                <div className="flex items-center space-x-2 border-b border-border mb-6">
                    <button
                        onClick={() => setActiveTab('storefronts')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-3 flex items-center space-x-2 cursor-pointer ${
                            activeTab === 'storefronts' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <Brush className="h-4 w-4" />
                        <span>Custom Storefront Requests</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-3 flex items-center space-x-2 cursor-pointer ${
                            activeTab === 'messages' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>Supporter Tip Messages</span>
                    </button>
                </div>

                {/* ── TAB 1: CUSTOM STOREFRONT REQUESTS ── */}
                {activeTab === 'storefronts' && (
                    <div className="space-y-6">
                        {/* Filter & Search Bar */}
                        <div className="bg-surface rounded-2xl p-4 border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 w-full max-w-md">
                                <div className="relative flex-1">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search by brand, email, whatsapp, or creator..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-xl cursor-pointer">
                                    Search
                                </button>
                            </form>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Filter className="h-3.5 w-3.5 text-text-muted" />
                                <span className="text-xs font-semibold text-text-muted">Status:</span>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setRequestsPage(1); }}
                                    className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending Review</option>
                                    <option value="in_review">In Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Declined</option>
                                </select>
                            </div>
                        </div>

                        {/* Requests Table */}
                        <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                            <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                                <Brush className="h-4 w-4 text-primary-600" />
                                <span>Bespoke Storefront & Profile Design Requests</span>
                            </h3>

                            {loadingRequests ? (
                                <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading requests...</div>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-12 text-xs text-text-muted">No custom storefront requests found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                                <th className="pb-3">Brand & Creator</th>
                                                <th className="pb-3">Contact Details</th>
                                                <th className="pb-3">Requirements Overview</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3">Date</th>
                                                <th className="pb-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                            {requests.map((req) => {
                                                const cleanPhone = (req.whatsapp_number || req.contact_phone || '').replace(/[^0-9]/g, '')
                                                const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null

                                                return (
                                                    <tr key={req.id} className="hover:bg-background/50 transition-colors">
                                                        <td className="py-3">
                                                            <div>
                                                                <span className="font-bold text-text-primary block text-sm">{req.brand_name}</span>
                                                                {req.creator_profile && (
                                                                    <a
                                                                        href={`/${req.creator_profile.slug}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-[11px] font-mono text-primary-600 hover:underline inline-flex items-center space-x-1"
                                                                    >
                                                                        <span>/{req.creator_profile.slug}</span>
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td className="py-3">
                                                            <div className="space-y-1">
                                                                <a
                                                                    href={`mailto:${req.contact_email}`}
                                                                    className="inline-flex items-center space-x-1.5 text-text-primary hover:text-primary-600 font-semibold"
                                                                >
                                                                    <Mail className="w-3.5 h-3.5 text-text-muted" />
                                                                    <span>{req.contact_email}</span>
                                                                </a>

                                                                {waLink && (
                                                                    <div>
                                                                        <a
                                                                            href={waLink}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] hover:bg-emerald-500/20"
                                                                        >
                                                                            <Phone className="w-3 h-3" />
                                                                            <span>WhatsApp: {req.whatsapp_number || req.contact_phone}</span>
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td className="py-3 max-w-xs">
                                                            <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                                                                {req.design_requirements}
                                                            </p>
                                                            {req.reference_links && (
                                                                <span className="text-[10px] text-text-muted block truncate mt-0.5">
                                                                    Ref: {req.reference_links}
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="py-3">
                                                            {statusBadge(req.status)}
                                                        </td>

                                                        <td className="py-3 font-mono text-text-muted text-[11px]">
                                                            {new Date(req.created_at).toLocaleDateString()}
                                                        </td>

                                                        <td className="py-3 text-right">
                                                            <button
                                                                onClick={() => openReviewModal(req)}
                                                                className="px-3 py-1.5 bg-primary-600/10 hover:bg-primary-600 hover:text-white text-primary-600 font-bold rounded-xl transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                                <span>Review</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {requestsMeta && requestsMeta.last_page > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                                    <span className="text-text-muted">Page {requestsMeta.current_page} of {requestsMeta.last_page}</span>
                                    <div className="flex items-center space-x-2">
                                        <button disabled={requestsPage === 1} onClick={() => setRequestsPage(requestsPage - 1)} className="p-2 border border-border rounded-xl disabled:opacity-50 cursor-pointer">
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button disabled={requestsPage === requestsMeta.last_page} onClick={() => setRequestsPage(requestsPage + 1)} className="p-2 border border-border rounded-xl disabled:opacity-50 cursor-pointer">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── TAB 2: SUPPORTER MESSAGES ── */}
                {activeTab === 'messages' && (
                    <div className="space-y-6">
                        {/* Filter Bar */}
                        <div className="bg-surface rounded-2xl p-4 border border-border shadow-xs flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Filter className="h-3.5 w-3.5 text-text-muted" />
                                <span className="text-xs font-semibold text-text-muted">Filters:</span>

                                <select
                                    value={flaggedFilter}
                                    onChange={(e) => { setFlaggedFilter(e.target.value); setMessagesPage(1); }}
                                    className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                                >
                                    <option value="">All Filter Flags</option>
                                    <option value="true">Flagged by Automated Filter</option>
                                    <option value="false">Clean / Not Flagged</option>
                                </select>

                                <select
                                    value={hiddenFilter}
                                    onChange={(e) => { setHiddenFilter(e.target.value); setMessagesPage(1); }}
                                    className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                                >
                                    <option value="">All Visibilities</option>
                                    <option value="false">Visible</option>
                                    <option value="true">Hidden by Admin/Creator</option>
                                </select>
                            </div>
                        </div>

                        {/* Messages Table */}
                        <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                            <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-primary-600" />
                                <span>Supporter Tip Messages Log</span>
                            </h3>

                            {loadingMessages ? (
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
                                                            className={`p-1.5 hover:bg-background rounded-lg transition-colors cursor-pointer ${
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

                            {messagesMeta && messagesMeta.last_page > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                                    <span className="text-text-muted">Page {messagesMeta.current_page} of {messagesMeta.last_page}</span>
                                    <div className="flex items-center space-x-2">
                                        <button disabled={messagesPage === 1} onClick={() => setMessagesPage(messagesPage - 1)} className="p-2 border border-border rounded-xl disabled:opacity-50 cursor-pointer">
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button disabled={messagesPage === messagesMeta.last_page} onClick={() => setMessagesPage(messagesPage + 1)} className="p-2 border border-border rounded-xl disabled:opacity-50 cursor-pointer">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Review Custom Storefront Modal ── */}
                {selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                        <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 border border-border relative my-8">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                                <div>
                                    <h3 className="text-lg font-black text-text-primary">
                                        Review Bespoke Request
                                    </h3>
                                    <p className="text-xs text-text-muted">{selectedRequest.brand_name}</p>
                                </div>

                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-2 text-text-muted hover:text-text-primary rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 bg-background p-4 rounded-2xl border border-border text-xs">
                                <div className="flex justify-between">
                                    <span className="text-text-muted font-semibold">Creator:</span>
                                    <span className="font-bold text-text-primary">{selectedRequest.creator_profile?.display_name || 'N/A'} (/{selectedRequest.creator_profile?.slug})</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted font-semibold">Email:</span>
                                    <a href={`mailto:${selectedRequest.contact_email}`} className="font-bold text-primary-600 hover:underline">{selectedRequest.contact_email}</a>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted font-semibold">WhatsApp:</span>
                                    <span className="font-bold text-text-primary">{selectedRequest.whatsapp_number || selectedRequest.contact_phone || 'None provided'}</span>
                                </div>
                                {selectedRequest.reference_links && (
                                    <div className="pt-2 border-t border-border/50">
                                        <span className="text-text-muted font-semibold block mb-1">Inspiration Links:</span>
                                        <a href={selectedRequest.reference_links} target="_blank" rel="noreferrer" className="text-primary-600 underline break-all">
                                            {selectedRequest.reference_links}
                                        </a>
                                    </div>
                                )}
                                <div className="pt-2 border-t border-border/50">
                                    <span className="text-text-muted font-semibold block mb-1">Design Requirements:</span>
                                    <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">{selectedRequest.design_requirements}</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 text-xs">
                                <div className="space-y-1.5">
                                    <label className="block font-bold text-text-secondary">Update Status</label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-text-primary font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="pending">Pending Review</option>
                                        <option value="in_review">In Review (Contacting Creator)</option>
                                        <option value="approved">Approved (In Development)</option>
                                        <option value="completed">Completed & Deployed</option>
                                        <option value="rejected">Declined</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block font-bold text-text-secondary">Design Team Notes / Creator Feedback</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Notes visible to creator or internal status updates..."
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-text-primary leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRequest(null)}
                                        className="px-4 py-2.5 bg-background text-text-secondary font-bold rounded-xl hover:bg-border/40 transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updatingStatus}
                                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                                    >
                                        {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        <span>{updatingStatus ? 'Updating...' : 'Save Status'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Hide / Unhide Modal ── */}
                {hideModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
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
                                    <button type="submit" disabled={submittingHide} className="px-4 py-2 bg-primary-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50">
                                        {submittingHide ? 'Processing...' : 'Confirm Action'}
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
