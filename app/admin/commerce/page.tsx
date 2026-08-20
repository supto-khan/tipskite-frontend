'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    ShoppingBag,
    Search,
    Layers,
    Wrench,
    BookOpen,
    CheckCircle2,
    Clock,
    Globe,
    ChevronLeft,
    ChevronRight,
    Tag,
    DollarSign,
    ExternalLink,
    Eye,
    X,
    FileText,
    Video,
    Package,
    Image,
    FileCode,
    AlertTriangle,
    ShieldCheck,
    User,
    Gift,
    Download
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function CommerceSuitePage() {
    const [activeTab, setActiveTab] = useState<'products' | 'tiers' | 'services' | 'courses'>('products')

    // Inspect Item Drawer State
    const [inspectItem, setInspectItem] = useState<{
        type: 'product' | 'service' | 'course'
        item: any
    } | null>(null)

    // Products State
    const [products, setProducts] = useState<any[]>([])
    const [prodMeta, setProdMeta] = useState<any>(null)
    const [loadingProd, setLoadingProd] = useState(true)
    const [prodSearch, setProdSearch] = useState('')
    const [prodPage, setProdPage] = useState(1)

    // Tiers State
    const [tiers, setTiers] = useState<any[]>([])
    const [loadingTiers, setLoadingTiers] = useState(false)

    // Services State
    const [services, setServices] = useState<any[]>([])
    const [loadingServices, setLoadingServices] = useState(false)

    // Courses State
    const [courses, setCourses] = useState<any[]>([])
    const [loadingCourses, setLoadingCourses] = useState(false)

    // Review / Moderation Modal State
    const [reviewModal, setReviewModal] = useState<{
        type: 'product' | 'service' | 'course'
        item: any
        action: 'approved' | 'rejected'
    } | null>(null)
    const [rejectionReason, setRejectionReason] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)

    const fetchProducts = async () => {
        setLoadingProd(true)
        try {
            const params = new URLSearchParams()
            if (prodSearch) params.append('search', prodSearch)
            params.append('page', prodPage.toString())

            const res = await axios.get(`/api/v1/admin/products?${params.toString()}`)
            setProducts(res.data.data || [])
            setProdMeta(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingProd(false)
        }
    }

    const fetchTiers = async () => {
        setLoadingTiers(true)
        try {
            const res = await axios.get('/api/v1/admin/membership-tiers')
            setTiers(res.data.data || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingTiers(false)
        }
    }

    const fetchServices = async () => {
        setLoadingServices(true)
        try {
            const res = await axios.get('/api/v1/admin/services')
            setServices(res.data.data || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingServices(false)
        }
    }

    const fetchCourses = async () => {
        setLoadingCourses(true)
        try {
            const res = await axios.get('/api/v1/admin/courses')
            setCourses(res.data.data || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingCourses(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'products') fetchProducts()
        else if (activeTab === 'tiers') fetchTiers()
        else if (activeTab === 'services') fetchServices()
        else if (activeTab === 'courses') fetchCourses()
    }, [activeTab, prodPage])

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!reviewModal) return

        setSubmittingReview(true)
        try {
            const endpoint = reviewModal.type === 'product'
                ? `/api/v1/admin/products/${reviewModal.item.id}/review`
                : reviewModal.type === 'service'
                    ? `/api/v1/admin/services/${reviewModal.item.id}/review`
                    : `/api/v1/admin/courses/${reviewModal.item.id}/review`

            await axios.post(endpoint, {
                status: reviewModal.action,
                rejection_reason: reviewModal.action === 'rejected' ? rejectionReason : null,
            })

            setReviewModal(null)
            setRejectionReason('')
            if (activeTab === 'products') fetchProducts()
            if (activeTab === 'services') fetchServices()
            if (activeTab === 'courses') fetchCourses()
        } catch (e) {
            console.error(e)
            alert('Failed to update approval status')
        } finally {
            setSubmittingReview(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Commerce Suite & Approvals"
                    subtitle="Review and moderate creator digital downloads, 1-on-1 services, and courses."
                />

                {/* Sub-navigation Tabs */}
                <div className="flex items-center space-x-2 border-b border-border mb-6">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-3 flex items-center space-x-2 ${
                            activeTab === 'products' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Digital Products</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('services')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-3 flex items-center space-x-2 ${
                            activeTab === 'services' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <Wrench className="h-4 w-4" />
                        <span>1-on-1 Services</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-3 flex items-center space-x-2 ${
                            activeTab === 'courses' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        <span>Courses</span>
                    </button>
                </div>

                {/* TAB 1: DIGITAL PRODUCTS */}
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm flex items-center justify-between">
                            <form onSubmit={(e) => { e.preventDefault(); setProdPage(1); fetchProducts(); }} className="flex items-center gap-2 flex-1 max-w-md">
                                <div className="relative flex-1">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search products by title..."
                                        value={prodSearch}
                                        onChange={(e) => setProdSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background focus:ring-primary-500 focus:border-primary-500 text-text-primary"
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-xl cursor-pointer">
                                    Search
                                </button>
                            </form>
                        </div>

                        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                            {loadingProd ? (
                                <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading digital products...</div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-12 text-xs text-text-muted">No products found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                                <th className="pb-3">Product Title</th>
                                                <th className="pb-3">Creator</th>
                                                <th className="pb-3">Price</th>
                                                <th className="pb-3">Approval Status</th>
                                                <th className="pb-3">Visibility</th>
                                                <th className="pb-3 text-right">Moderation Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                            {products.map((p) => (
                                                <tr key={p.id}>
                                                    <td className="py-3 font-bold text-text-primary">
                                                        <div>{p.title}</div>
                                                        <span className="text-[10px] text-text-muted uppercase font-mono">{p.type || 'digital'}</span>
                                                    </td>
                                                    <td className="py-3 font-mono text-text-muted">
                                                        {p.creator_profile?.display_name || 'Creator'} (/{p.creator_profile?.slug})
                                                    </td>
                                                    <td className="py-3 font-mono font-bold text-emerald-600">
                                                        {p.is_free ? 'FREE' : `BDT ${((p.price_cents || 0) / 100).toFixed(2)}`}
                                                    </td>
                                                    <td className="py-3">
                                                        {p.approval_status === 'approved' ? (
                                                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                <span>Approved</span>
                                                            </span>
                                                        ) : p.approval_status === 'rejected' ? (
                                                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/50">
                                                                <span>Rejected</span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                                                                <Clock className="h-3 w-3" />
                                                                <span>Pending Approval</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3">
                                                        {p.is_published && p.approval_status === 'approved' ? (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                                                                Live
                                                            </span>
                                                        ) : p.approval_status === 'pending' ? (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                                                                Hidden (Pending)
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200/50">
                                                                Hidden
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 text-right space-x-1.5">
                                                        <button
                                                            onClick={() => setInspectItem({ type: 'product', item: p })}
                                                            className="px-2.5 py-1 bg-background hover:bg-border text-text-primary border border-border rounded-lg text-[10px] font-bold shadow-xs cursor-pointer inline-flex items-center space-x-1"
                                                        >
                                                            <Eye className="h-3 w-3 text-primary-600" />
                                                            <span>Details</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setReviewModal({ type: 'product', item: p, action: 'approved' })}
                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => setReviewModal({ type: 'product', item: p, action: 'rejected' })}
                                                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                                                        >
                                                            Reject
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {prodMeta && prodMeta.last_page > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                                    <span className="text-text-muted">Page {prodMeta.current_page} of {prodMeta.last_page}</span>
                                    <div className="flex items-center space-x-2">
                                        <button disabled={prodPage === 1} onClick={() => setProdPage(prodPage - 1)} className="p-2 border border-border rounded-xl disabled:opacity-50">
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button disabled={prodPage === prodMeta.last_page} onClick={() => setProdPage(prodPage + 1)} className="p-2 border border-border rounded-xl disabled:opacity-50">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: SERVICES */}
                {activeTab === 'services' && (
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-text-primary text-base">1-on-1 Commission Services</h3>
                        {loadingServices ? (
                            <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading service listings...</div>
                        ) : services.length === 0 ? (
                            <div className="text-center py-12 text-xs text-text-muted">No service listings found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-border font-semibold text-text-muted pb-3">
                                            <th className="pb-3">Service Title</th>
                                            <th className="pb-3">Creator</th>
                                            <th className="pb-3">Price</th>
                                            <th className="pb-3">Delivery</th>
                                            <th className="pb-3">Approval Status</th>
                                            <th className="pb-3 text-right">Moderation Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40 text-text-secondary">
                                        {services.map((s) => (
                                            <tr key={s.id}>
                                                <td className="py-3 font-bold text-text-primary">{s.title}</td>
                                                <td className="py-3 font-mono text-text-muted">{s.creator_profile?.display_name || 'Creator'}</td>
                                                <td className="py-3 font-bold font-mono text-amber-600">BDT {((s.price_cents || 0) / 100).toFixed(2)}</td>
                                                <td className="py-3 font-mono">{s.delivery_days} days</td>
                                                <td className="py-3">
                                                    {s.approval_status === 'approved' ? (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                                                            Approved
                                                        </span>
                                                    ) : s.approval_status === 'rejected' ? (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/50">
                                                            Rejected
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                                                            Pending Approval
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-right space-x-1.5">
                                                    <button
                                                        onClick={() => setInspectItem({ type: 'service', item: s })}
                                                        className="px-2.5 py-1 bg-background hover:bg-border text-text-primary border border-border rounded-lg text-[10px] font-bold shadow-xs cursor-pointer inline-flex items-center space-x-1"
                                                    >
                                                        <Eye className="h-3 w-3 text-primary-600" />
                                                        <span>Details</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setReviewModal({ type: 'service', item: s, action: 'approved' })}
                                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setReviewModal({ type: 'service', item: s, action: 'rejected' })}
                                                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: COURSES */}
                {activeTab === 'courses' && (
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-text-primary text-base">Creator Published Courses</h3>
                        {loadingCourses ? (
                            <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading courses...</div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-12 text-xs text-text-muted">No courses found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-border font-semibold text-text-muted pb-3">
                                            <th className="pb-3">Course Title</th>
                                            <th className="pb-3">Creator</th>
                                            <th className="pb-3">Price</th>
                                            <th className="pb-3">Approval Status</th>
                                            <th className="pb-3 text-right">Moderation Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40 text-text-secondary">
                                        {courses.map((c) => (
                                            <tr key={c.id}>
                                                <td className="py-3 font-bold text-text-primary">{c.title}</td>
                                                <td className="py-3 font-mono text-text-muted">{c.creator_profile?.display_name || 'Creator'}</td>
                                                <td className="py-3 font-bold font-mono text-blue-600">
                                                    {c.is_free ? 'FREE' : `BDT ${c.regular_price}`}
                                                </td>
                                                <td className="py-3">
                                                    {c.approval_status === 'approved' ? (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                                                            Approved
                                                        </span>
                                                    ) : c.approval_status === 'rejected' ? (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/50">
                                                            Rejected
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                                                            Pending Approval
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-right space-x-1.5">
                                                    <button
                                                        onClick={() => setInspectItem({ type: 'course', item: c })}
                                                        className="px-2.5 py-1 bg-background hover:bg-border text-text-primary border border-border rounded-lg text-[10px] font-bold shadow-xs cursor-pointer inline-flex items-center space-x-1"
                                                    >
                                                        <Eye className="h-3 w-3 text-primary-600" />
                                                        <span>Details</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setReviewModal({ type: 'course', item: c, action: 'approved' })}
                                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setReviewModal({ type: 'course', item: c, action: 'rejected' })}
                                                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 4: MEMBERSHIP TIERS */}
                {activeTab === 'tiers' && (
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-text-primary text-base">Membership Tiers</h3>
                        {loadingTiers ? (
                            <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading membership tiers...</div>
                        ) : tiers.length === 0 ? (
                            <div className="text-center py-12 text-xs text-text-muted">No tiers found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-border font-semibold text-text-muted pb-3">
                                            <th className="pb-3">Tier Name</th>
                                            <th className="pb-3">Creator</th>
                                            <th className="pb-3">Monthly Price</th>
                                            <th className="pb-3">Active Members</th>
                                            <th className="pb-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40 text-text-secondary">
                                        {tiers.map((t) => (
                                            <tr key={t.id}>
                                                <td className="py-3 font-bold text-text-primary">{t.name}</td>
                                                <td className="py-3 font-mono text-text-muted">{t.creator_profile?.display_name || 'Creator'}</td>
                                                <td className="py-3 font-bold font-mono text-purple-600">BDT {((t.price_cents || 0) / 100).toFixed(2)}</td>
                                                <td className="py-3 font-mono">{t.member_count || 0}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {t.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Slide-over Item Details Drawer */}
                {inspectItem && (
                    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
                        <div className="w-full max-w-xl bg-surface border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary">
                                            {inspectItem.type}
                                        </span>
                                        {inspectItem.item.approval_status === 'approved' ? (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Approved
                                            </span>
                                        ) : inspectItem.item.approval_status === 'rejected' ? (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                Rejected
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                Pending Review
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-base font-bold text-text-primary">
                                        {inspectItem.item.title || 'Untitled Item'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setInspectItem(null)}
                                    className="p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-background border border-border"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Drawer Content Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-text-secondary">
                                {/* Cover Image / Gallery Preview */}
                                {inspectItem.item.cover_image_url && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase text-text-muted">Cover / Banner Asset</label>
                                        <div className="rounded-2xl overflow-hidden border border-border bg-background">
                                            <img
                                                src={inspectItem.item.cover_image_url}
                                                alt="Cover"
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Key Meta Highlights */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="p-3 bg-background rounded-xl border border-border">
                                        <span className="text-[10px] text-text-muted font-semibold block uppercase">Price</span>
                                        <span className="text-sm font-extrabold text-emerald-600 mt-1 block font-mono">
                                            {inspectItem.item.is_free
                                                ? 'FREE'
                                                : `BDT ${((inspectItem.item.price_cents || (inspectItem.item.regular_price ? inspectItem.item.regular_price * 100 : 0)) / 100).toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-background rounded-xl border border-border">
                                        <span className="text-[10px] text-text-muted font-semibold block uppercase">Category</span>
                                        <span className="text-sm font-extrabold text-text-primary mt-1 block truncate">
                                            {inspectItem.item.category || 'General'}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-background rounded-xl border border-border">
                                        <span className="text-[10px] text-text-muted font-semibold block uppercase">Creator</span>
                                        <span className="text-xs font-bold text-text-primary mt-1 block truncate">
                                            {inspectItem.item.creator_profile?.display_name || 'Creator'}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5 border-t border-border pt-4">
                                    <label className="text-[10px] font-extrabold uppercase text-text-muted">Description / Content Summary</label>
                                    <div className="p-3 bg-background rounded-xl border border-border text-text-primary leading-relaxed whitespace-pre-wrap">
                                        {inspectItem.item.description || 'No description provided.'}
                                    </div>
                                </div>

                                {/* Deliverable / Asset Verification */}
                                <div className="space-y-2 border-t border-border pt-4">
                                    <label className="text-[10px] font-extrabold uppercase text-text-muted">Fulfillment & Delivery Assets</label>
                                    <div className="space-y-2">
                                        {inspectItem.item.asset_type && (
                                            <div className="p-3 bg-background rounded-xl border border-border flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-text-primary block">Asset Delivery Type</span>
                                                    <span className="text-[11px] text-text-muted font-mono capitalize">{inspectItem.item.asset_type}</span>
                                                </div>
                                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                                                    {inspectItem.item.delivery_mode || 'Instant'}
                                                </span>
                                            </div>
                                        )}

                                        {inspectItem.item.drive_url && (
                                            <div className="p-3 bg-background rounded-xl border border-border space-y-1">
                                                <span className="font-bold text-text-primary block">Drive / Resource Link</span>
                                                <a
                                                    href={inspectItem.item.drive_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline font-mono text-[11px] break-all flex items-center space-x-1"
                                                >
                                                    <span>{inspectItem.item.drive_url}</span>
                                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                                </a>
                                            </div>
                                        )}

                                        {inspectItem.item.file && (
                                            <div className="p-3 bg-background rounded-xl border border-border flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <span className="font-bold text-text-primary block">Uploaded File</span>
                                                    <span className="text-[11px] font-mono text-text-muted">{inspectItem.item.file.original_name}</span>
                                                </div>
                                                {inspectItem.item.file.url && (
                                                    <a
                                                        href={inspectItem.item.file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold flex items-center space-x-1"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        <span>Download</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {inspectItem.item.success_message && (
                                            <div className="p-3 bg-background rounded-xl border border-border space-y-1">
                                                <span className="font-bold text-text-primary block">Success Note for Buyer</span>
                                                <p className="text-[11px] text-text-muted italic">{inspectItem.item.success_message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rejection Feedback if any */}
                                {inspectItem.item.rejection_reason && (
                                    <div className="space-y-1.5 border-t border-border pt-4">
                                        <label className="text-[10px] font-extrabold uppercase text-rose-600">Rejection History</label>
                                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-xs">
                                            {inspectItem.item.rejection_reason}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Drawer Action Footer */}
                            <div className="p-4 border-t border-border bg-background flex items-center justify-between gap-3">
                                <span className="text-[11px] text-text-muted">
                                    Take moderation action:
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            const item = inspectItem.item
                                            const type = inspectItem.type
                                            setInspectItem(null)
                                            setReviewModal({ type, item, action: 'rejected' })
                                        }}
                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                                    >
                                        Reject Item
                                    </button>
                                    <button
                                        onClick={() => {
                                            const item = inspectItem.item
                                            const type = inspectItem.type
                                            setInspectItem(null)
                                            setReviewModal({ type, item, action: 'approved' })
                                        }}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                                    >
                                        Approve Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Moderation Approval/Rejection Modal */}
                {reviewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">
                                {reviewModal.action === 'approved' ? 'Approve Item' : 'Reject Item'}
                            </h3>
                            <p className="text-xs text-text-muted">
                                {reviewModal.action === 'approved'
                                    ? `Are you sure you want to approve "${reviewModal.item.title}"? It will become visible on the creator's storefront immediately.`
                                    : `Provide feedback/reason for rejecting "${reviewModal.item.title}".`}
                            </p>
                            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                                {reviewModal.action === 'rejected' && (
                                    <div>
                                        <label className="block font-semibold text-text-secondary mb-1">Rejection Reason</label>
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="Explain why this item was not approved..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                        />
                                    </div>
                                )}
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button type="button" onClick={() => setReviewModal(null)} className="px-4 py-2 bg-background text-text-secondary font-semibold rounded-xl cursor-pointer">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className={`px-4 py-2 text-white font-bold rounded-xl shadow-md disabled:opacity-50 cursor-pointer ${
                                            reviewModal.action === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                        }`}
                                    >
                                        {submittingReview ? 'Saving...' : reviewModal.action === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}
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
