'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    UserCheck,
    Search,
    Globe,
    CheckCircle2,
    Clock,
    X,
    ChevronLeft,
    ChevronRight,
    Eye,
    ExternalLink
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function CreatorManagementPage() {
    // Creators State
    const [creators, setCreators] = useState<any[]>([])
    const [meta, setMeta] = useState<any>(null)
    const [loadingCreators, setLoadingCreators] = useState(true)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [publishedFilter, setPublishedFilter] = useState('')
    const [page, setPage] = useState(1)

    // Selected Creator Slide-over Detail
    const [selectedCreator, setSelectedCreator] = useState<any | null>(null)
    const [creatorDetail, setCreatorDetail] = useState<any | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)

    // Action Modals
    const [publishModal, setPublishModal] = useState<{ creator: any; action: 'publish' | 'unpublish' } | null>(null)
    const [publishReason, setPublishReason] = useState('')
    const [submittingPublish, setSubmittingPublish] = useState(false)

    const fetchCreators = async () => {
        setLoadingCreators(true)
        try {
            const params = new URLSearchParams()
            if (search) params.append('search', search)
            if (categoryFilter) params.append('category', categoryFilter)
            if (publishedFilter) params.append('published', publishedFilter)
            params.append('page', page.toString())

            const res = await axios.get(`/api/v1/admin/creators?${params.toString()}`)
            setCreators(res.data.data || [])
            setMeta(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingCreators(false)
        }
    }

    useEffect(() => {
        fetchCreators()
    }, [page, categoryFilter, publishedFilter])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchCreators()
    }

    const openCreatorDetail = async (c: any) => {
        setSelectedCreator(c)
        setLoadingDetail(true)
        try {
            const res = await axios.get(`/api/v1/admin/creators/${c.id}`)
            setCreatorDetail(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingDetail(false)
        }
    }

    const handlePublishToggleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!publishModal) return

        setSubmittingPublish(true)
        try {
            await axios.patch(`/api/v1/admin/creators/${publishModal.creator.id}/publish`, {
                is_published: publishModal.action === 'publish',
                reason: publishReason,
            })
            setPublishModal(null)
            setPublishReason('')
            fetchCreators()
        } catch (e) {
            console.error(e)
            alert('Failed to update creator publish status')
        } finally {
            setSubmittingPublish(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary font-sans">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl">
                <AdminHeader
                    title="Creator Management"
                    subtitle="Manage creator profiles, features, module visibility, and platform accounts."
                />

                <div className="space-y-6">
                    {/* Search & Filter Bar */}
                    <div className="bg-surface rounded-2xl p-4 border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search by creator name, slug, or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background focus:ring-primary-500 focus:border-primary-500 text-text-primary"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex items-center gap-3">
                            <select
                                value={publishedFilter}
                                onChange={(e) => {
                                    setPublishedFilter(e.target.value)
                                    setPage(1)
                                }}
                                className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold cursor-pointer"
                            >
                                <option value="">All Statuses</option>
                                <option value="true">Published</option>
                                <option value="false">Unpublished</option>
                            </select>
                        </div>
                    </div>

                    {/* Creators Table */}
                    <div className="bg-surface rounded-2xl border border-border shadow-xs p-6 space-y-4">
                        {loadingCreators ? (
                            <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading creator profiles...</div>
                        ) : creators.length === 0 ? (
                            <div className="text-center py-12 text-xs text-text-muted">No creators match your criteria.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                            <th className="pb-3">Creator Profile</th>
                                            <th className="pb-3">Modules Enabled</th>
                                            <th className="pb-3">Lifetime Earned</th>
                                            <th className="pb-3">Status</th>
                                            <th className="pb-3">Joined</th>
                                            <th className="pb-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                        {creators.map((c) => (
                                            <tr key={c.id} className="hover:bg-background/50 transition-colors">
                                                <td className="py-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                                            {c.page_title?.substring(0, 2).toUpperCase() || 'CP'}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-text-primary block">{c.page_title || 'Untitled Creator'}</span>
                                                            <a
                                                                href={`/${c.slug}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-[11px] text-primary-600 hover:underline font-mono inline-flex items-center space-x-1"
                                                            >
                                                                <span>/{c.slug}</span>
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center space-x-1">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.accepts_tips ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>Tips</span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.memberships_enabled ? 'bg-violet-50 text-violet-700' : 'bg-gray-100 text-gray-400'}`}>Members</span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.shop_enabled ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>Shop</span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.services_enabled ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-400'}`}>Services</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 font-bold text-emerald-600 font-mono">
                                                    BDT {((c.lifetime_earned_cents || 0) / 100).toFixed(0)}
                                                </td>
                                                <td className="py-3">
                                                    {c.is_published ? (
                                                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            <span>Published</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                                                            <Clock className="h-3 w-3" />
                                                            <span>Unpublished</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 font-mono text-text-muted text-[11px]">
                                                    {new Date(c.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex items-center justify-end space-x-1">
                                                        <button
                                                            onClick={() => openCreatorDetail(c)}
                                                            className="p-1.5 hover:bg-background rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                                                            title="View Creator Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setPublishModal({
                                                                    creator: c,
                                                                    action: c.is_published ? 'unpublish' : 'publish',
                                                                })
                                                            }}
                                                            className={`p-1.5 hover:bg-background rounded-lg transition-colors cursor-pointer ${c.is_published ? 'text-rose-600 hover:text-rose-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                                                            title={c.is_published ? 'Unpublish Page' : 'Publish Page'}
                                                        >
                                                            <Globe className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination Bar */}
                        {meta && meta.last_page > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                                <span className="text-text-muted">
                                    Page {meta.current_page} of {meta.last_page} ({meta.total} total creators)
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                        className="p-2 border border-border rounded-xl hover:bg-background disabled:opacity-50 cursor-pointer"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        disabled={page === meta.last_page}
                                        onClick={() => setPage(page + 1)}
                                        className="p-2 border border-border rounded-xl hover:bg-background disabled:opacity-50 cursor-pointer"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Creator Detail Slide-over */}
                {selectedCreator && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
                        <div className="bg-surface w-full max-w-lg h-full border-l border-border shadow-2xl p-6 overflow-y-auto space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-border">
                                <div>
                                    <h3 className="text-base font-bold text-text-primary">Creator Profile</h3>
                                    <p className="text-xs text-text-muted">Detailed overview and metrics</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedCreator(null)
                                        setCreatorDetail(null)
                                    }}
                                    className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-background border border-border cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {loadingDetail ? (
                                <div className="py-12 text-center text-xs text-text-muted animate-pulse">Loading details...</div>
                            ) : (
                                <div className="space-y-6 text-xs">
                                    {/* Avatar & Main */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-black text-sm">
                                            {selectedCreator.page_title?.substring(0, 2).toUpperCase() || 'CP'}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-text-primary text-sm">{selectedCreator.page_title || 'Untitled'}</h4>
                                            <span className="text-text-muted font-mono block">/{selectedCreator.slug}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-2 pt-2">
                                        <button
                                            onClick={() => setPublishModal({
                                                creator: selectedCreator,
                                                action: selectedCreator.is_published ? 'unpublish' : 'publish'
                                            })}
                                            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs shadow-xs cursor-pointer ${
                                                selectedCreator.is_published
                                                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            }`}
                                        >
                                            {selectedCreator.is_published ? 'Unpublish Profile' : 'Force Publish Profile'}
                                        </button>
                                        <a
                                            href={`/${selectedCreator.slug}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="py-2 px-3 bg-background hover:bg-border text-text-primary font-bold rounded-xl border border-border flex items-center space-x-1"
                                        >
                                            <span>Visit Page</span>
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="p-3 bg-background rounded-xl border border-border text-center">
                                            <span className="text-[10px] text-text-muted font-semibold block uppercase">Earned</span>
                                            <span className="text-base font-extrabold text-emerald-600 mt-1 block font-mono">
                                                BDT {((selectedCreator.lifetime_earned_cents || 0) / 100).toFixed(0)}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-background rounded-xl border border-border text-center">
                                            <span className="text-[10px] text-text-muted font-semibold block uppercase">Supporters</span>
                                            <span className="text-base font-extrabold text-purple-600 mt-1 block">
                                                {selectedCreator.supporter_count || 0}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-background rounded-xl border border-border text-center">
                                            <span className="text-[10px] text-text-muted font-semibold block uppercase">Members</span>
                                            <span className="text-base font-extrabold text-violet-600 mt-1 block">
                                                {selectedCreator.active_member_count || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Overview */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-background rounded-xl border border-border text-center">
                                            <span className="text-[10px] text-text-muted font-semibold block uppercase">Products</span>
                                            <span className="text-base font-extrabold text-blue-600 mt-1 block">
                                                {creatorDetail?.counts?.products || 0}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-background rounded-xl border border-border text-center">
                                            <span className="text-[10px] text-text-muted font-semibold block uppercase">Posts</span>
                                            <span className="text-base font-extrabold text-emerald-600 mt-1 block">
                                                {creatorDetail?.counts?.posts || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Associated Payment Accounts */}
                                    <div className="space-y-2 border-t border-border pt-4">
                                        <span className="font-bold text-text-primary block">Payment Accounts</span>
                                        {selectedCreator.payment_accounts?.length === 0 ? (
                                            <p className="text-text-muted italic">No payment accounts configured.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {selectedCreator.payment_accounts?.map((pa: any) => (
                                                    <div key={pa.id} className="p-3 bg-background rounded-xl border border-border/80 flex items-center justify-between">
                                                        <div>
                                                            <span className="font-bold uppercase text-primary-600 block">{pa.payout_method}</span>
                                                            <span className="font-mono text-text-muted text-[11px] block">{pa.account_name}</span>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            pa.kyc_status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                            KYC: {pa.kyc_status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Publish Toggle Modal */}
                {publishModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">
                                {publishModal.action === 'publish' ? 'Force Publish Creator Profile' : 'Unpublish Creator Profile'}
                            </h3>

                            <form onSubmit={handlePublishToggleSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">Reason for Admin Action</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Enter reason..."
                                        value={publishReason}
                                        onChange={(e) => setPublishReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setPublishModal(null)}
                                        className="px-4 py-2 bg-background hover:bg-border text-text-secondary font-semibold rounded-xl cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingPublish}
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                                    >
                                        {submittingPublish ? 'Saving...' : 'Confirm Status Change'}
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
