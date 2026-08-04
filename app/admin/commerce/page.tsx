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
    ExternalLink
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function CommerceSuitePage() {
    const [activeTab, setActiveTab] = useState<'products' | 'tiers' | 'services' | 'courses'>('products')

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

    // Toggling Publish State
    const [publishModal, setPublishModal] = useState<{ product: any; action: 'publish' | 'unpublish' } | null>(null)
    const [reason, setReason] = useState('')
    const [submitting, setSubmitting] = useState(false)

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

    const handlePublishToggle = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!publishModal) return

        setSubmitting(true)
        try {
            await axios.patch(`/api/v1/admin/products/${publishModal.product.id}/publish`, {
                is_published: publishModal.action === 'publish',
                reason,
            })
            setPublishModal(null)
            setReason('')
            fetchProducts()
        } catch (e) {
            console.error(e)
            alert('Failed to update product publish status')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Commerce Suite"
                    subtitle="Platform-wide management of creator digital downloads, membership tiers, 1-on-1 services, and courses."
                />

                {/* Sub-navigation Tabs */}
                <div className="flex items-center space-x-2 border-b border-border mb-6">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-1 flex items-center space-x-2 ${
                            activeTab === 'products' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Digital Products</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('tiers')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-1 flex items-center space-x-2 ${
                            activeTab === 'tiers' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <Layers className="h-4 w-4" />
                        <span>Membership Tiers</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('services')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-1 flex items-center space-x-2 ${
                            activeTab === 'services' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                    >
                        <Wrench className="h-4 w-4" />
                        <span>1-on-1 Services</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`pb-3 text-xs font-extrabold transition-all border-b-2 px-1 flex items-center space-x-2 ${
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
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-xl">
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
                                                <th className="pb-3">Purchases</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                            {products.map((p) => (
                                                <tr key={p.id}>
                                                    <td className="py-3 font-bold text-text-primary">{p.title}</td>
                                                    <td className="py-3 font-mono text-text-muted">
                                                        {p.creator_profile?.display_name || 'Creator'} (/{p.creator_profile?.slug})
                                                    </td>
                                                    <td className="py-3 font-mono font-bold text-emerald-600">
                                                        {p.is_free ? 'FREE' : `BDT ${((p.price_cents || 0) / 100).toFixed(2)}`}
                                                    </td>
                                                    <td className="py-3 font-mono">{p.purchase_count || 0}</td>
                                                    <td className="py-3">
                                                        {p.is_published ? (
                                                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                <span>Published</span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-600">
                                                                <Clock className="h-3 w-3" />
                                                                <span>Unpublished</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3">
                                                        <button
                                                            onClick={() => setPublishModal({ product: p, action: p.is_published ? 'unpublish' : 'publish' })}
                                                            className={`p-1.5 hover:bg-background rounded-lg transition-colors ${p.is_published ? 'text-rose-600' : 'text-emerald-600'}`}
                                                            title={p.is_published ? 'Unpublish Product' : 'Publish Product'}
                                                        >
                                                            <Globe className="h-4 w-4" />
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

                {/* TAB 2: MEMBERSHIP TIERS */}
                {activeTab === 'tiers' && (
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-text-primary text-base">Creator Membership Tiers</h3>
                        {loadingTiers ? (
                            <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading membership tiers...</div>
                        ) : tiers.length === 0 ? (
                            <div className="text-center py-12 text-xs text-text-muted">No membership tiers configured.</div>
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

                {/* TAB 3: SERVICES */}
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
                                            <th className="pb-3">Delivery Days</th>
                                            <th className="pb-3">Open Orders</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40 text-text-secondary">
                                        {services.map((s) => (
                                            <tr key={s.id}>
                                                <td className="py-3 font-bold text-text-primary">{s.title}</td>
                                                <td className="py-3 font-mono text-text-muted">{s.creator_profile?.display_name || 'Creator'}</td>
                                                <td className="py-3 font-bold font-mono text-amber-600">BDT {((s.price_cents || 0) / 100).toFixed(2)}</td>
                                                <td className="py-3 font-mono">{s.delivery_days} days</td>
                                                <td className="py-3 font-mono">{s.open_order_count || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 4: COURSES */}
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
                                            <th className="pb-3">Regular Price</th>
                                            <th className="pb-3">Status</th>
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
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {c.is_published ? 'Published' : 'Draft'}
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

                {/* Publish Toggle Modal */}
                {publishModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">
                                {publishModal.action === 'publish' ? 'Publish Product' : 'Unpublish Product'}
                            </h3>
                            <form onSubmit={handlePublishToggle} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">Reason for Admin Action</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Enter reason..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button type="button" onClick={() => setPublishModal(null)} className="px-4 py-2 bg-background text-text-secondary font-semibold rounded-xl">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50">
                                        {submitting ? 'Saving...' : 'Confirm Action'}
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
