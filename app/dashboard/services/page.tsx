'use client'

import { useEffect, useState, useRef } from 'react'
import axios from '@/lib/axios'
import {
    Briefcase,
    Plus,
    Minus,
    Clock,
    CheckCircle2,
    Send,
    Trash2,
    Edit3,
    ImageIcon,
    Loader2,
    Info,
    X,
    Check
} from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import ImageSlider from '@/components/ui/ImageSlider'

export default function ServicesDashboard() {
    const [services, setServices] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'listings' | 'orders'>('listings')
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
    const [deletingService, setDeletingService] = useState(false)

    // Service Modal state
    const [showModal, setShowModal] = useState(false)
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null)

    // Service Form fields
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('1000')
    const [deliveryDays, setDeliveryDays] = useState(3)
    const [description, setDescription] = useState('')
    const [clientRequirements, setClientRequirements] = useState('')
    const [portfolioImages, setPortfolioImages] = useState<string[]>([])
    const [isConfirmed, setIsConfirmed] = useState(false)

    const [uploadingImage, setUploadingImage] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Deliver Order Modal
    const [deliveringOrder, setDeliveringOrder] = useState<any | null>(null)
    const [deliveryNote, setDeliveryNote] = useState('')
    const [delivering, setDelivering] = useState(false)

    const fetchData = async () => {
        try {
            const [servicesRes, ordersRes] = await Promise.all([
                axios.get('/api/v1/creator/services'),
                axios.get('/api/v1/creator/service-orders'),
            ])
            setServices(servicesRes.data.services || [])
            setOrders(ordersRes.data.orders || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const openCreateModal = () => {
        setEditingServiceId(null)
        setTitle('')
        setPrice('1000')
        setDeliveryDays(3)
        setDescription('')
        setClientRequirements('')
        setPortfolioImages([])
        setIsConfirmed(false)
        setError(null)
        setShowModal(true)
    }

    const openEditModal = (service: any) => {
        setEditingServiceId(service.id)
        setTitle(service.title || '')
        setPrice(service.price_cents ? String(service.price_cents / 100) : '1000')
        setDeliveryDays(service.delivery_days || 3)
        setDescription(service.description || '')
        let parsedPortfolio: string[] = []
        if (Array.isArray(service.portfolio_images)) {
            parsedPortfolio = service.portfolio_images
        } else if (typeof service.portfolio_images === 'string') {
            try {
                const parsed = JSON.parse(service.portfolio_images)
                if (Array.isArray(parsed)) parsedPortfolio = parsed
            } catch (e) {
                if (service.portfolio_images) parsedPortfolio = [service.portfolio_images]
            }
        }
        if (parsedPortfolio.length === 0 && service.cover_image_url) {
            parsedPortfolio = [service.cover_image_url]
        }
        setPortfolioImages(parsedPortfolio)
        setIsConfirmed(true)
        setError(null)
        setShowModal(true)
    }

    const [pendingImageFiles, setPendingImageFiles] = useState<File[]>([])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (portfolioImages.length >= 4) {
            setError('Maximum 4 portfolio images allowed.')
            return
        }

        const maxSizeBytes = 5 * 1024 * 1024
        if (file.size > maxSizeBytes) {
            setError(`Selected image (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 5MB maximum upload limit.`)
            e.target.value = ''
            return
        }

        setError(null)
        const uploadData = new FormData()
        uploadData.append('file', file)

        try {
            const res = await axios.post('/api/v1/creator/media/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const uploadedUrl = res.data?.url
            if (uploadedUrl) {
                setPortfolioImages((prev) => [...prev, uploadedUrl])
            }
        } catch (uploadErr: any) {
            setError(uploadErr.response?.data?.message || 'Failed to upload portfolio image. Please try again.')
        } finally {
            e.target.value = ''
        }
    }

    const removePortfolioImage = (index: number) => {
        setPortfolioImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSaveService = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) {
            setError('Please enter a service title.')
            return
        }

        if (!isConfirmed) {
            setError('Please confirm that you can deliver this service within the stated time.')
            return
        }

        setSaving(true)
        setError(null)

        const payload = {
            title: title.trim(),
            description: description.trim() || null,
            price_cents: Math.round((parseFloat(price) || 0) * 100),
            delivery_days: deliveryDays,
            client_requirements: clientRequirements.trim() || null,
            portfolio_images: portfolioImages,
            cover_image_url: portfolioImages[0] || null,
        }

        try {
            if (editingServiceId) {
                await axios.put(`/api/v1/creator/services/${editingServiceId}`, payload)
            } else {
                await axios.post('/api/v1/creator/services', payload)
            }
            setShowModal(false)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save service')
        } finally {
            setSaving(false)
        }
    }

    const confirmDeleteService = async () => {
        if (!serviceToDelete) return
        setDeletingService(true)
        try {
            await axios.delete(`/api/v1/creator/services/${serviceToDelete}`)
            setServiceToDelete(null)
            fetchData()
        } catch (e) {
            console.error(e)
        } finally {
            setDeletingService(false)
        }
    }

    const handleDeliverSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!deliveringOrder || !deliveryNote.trim()) return

        setDelivering(true)
        try {
            await axios.post(`/api/v1/creator/service-orders/${deliveringOrder.id}/deliver`, {
                fulfillment_data: { note: deliveryNote }
            })
            setDeliveringOrder(null)
            setDeliveryNote('')
            fetchData()
        } catch (e) {
            console.error(e)
        } finally {
            setDelivering(false)
        }
    }

    if (loading) {
        return (
            <div suppressHydrationWarning className="max-w-5xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div suppressHydrationWarning className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div suppressHydrationWarning className="space-y-2">
                        <div suppressHydrationWarning className="h-8 w-48 bg-border/40 rounded-xl" />
                        <div suppressHydrationWarning className="h-4 w-72 bg-border/40 rounded-lg" />
                    </div>
                    <div suppressHydrationWarning className="h-10 w-36 bg-border/40 rounded-full" />
                </div>
                <div suppressHydrationWarning className="flex space-x-3 border-b border-border pb-2">
                    <div suppressHydrationWarning className="h-8 w-36 bg-border/40 rounded-xl" />
                    <div suppressHydrationWarning className="h-8 w-36 bg-border/40 rounded-xl" />
                </div>
                <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} suppressHydrationWarning className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-xs">
                            <div suppressHydrationWarning className="flex items-center justify-between">
                                <div suppressHydrationWarning className="h-6 w-20 bg-border/40 rounded-full" />
                                <div suppressHydrationWarning className="h-6 w-24 bg-border/40 rounded-full" />
                            </div>
                            <div suppressHydrationWarning className="h-6 w-3/4 bg-border/40 rounded-xl" />
                            <div suppressHydrationWarning className="h-4 w-full bg-border/40 rounded-lg" />
                            <div suppressHydrationWarning className="h-4 w-2/3 bg-border/40 rounded-lg" />
                            <div suppressHydrationWarning className="pt-4 flex items-center justify-end space-x-2 border-t border-border/50">
                                <div suppressHydrationWarning className="w-8 h-8 bg-border/40 rounded-xl" />
                                <div suppressHydrationWarning className="w-8 h-8 bg-border/40 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div suppressHydrationWarning className="max-w-5xl mx-auto py-6 space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">1-on-1 Services</h1>
                    <p className="text-sm text-text-muted mt-1">Offer custom services, consultations, or services directly to your supporters.</p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-full shadow-xs transition-all flex items-center space-x-2 w-fit cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New Service</span>
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 border-b border-border pb-2">
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === 'listings'
                            ? 'bg-primary-50 text-primary-600 shadow-xs'
                            : 'text-text-secondary hover:text-text-primary hover:bg-background'
                    }`}
                >
                    Service Offerings ({services.length})
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === 'orders'
                            ? 'bg-primary-50 text-primary-600 shadow-xs'
                            : 'text-text-secondary hover:text-text-primary hover:bg-background'
                    }`}
                >
                    Booked Orders ({orders.length})
                </button>
            </div>

            {/* Listings Tab */}
            {activeTab === 'listings' && (
                <div>
                    {services.length === 0 ? (
                        <div className="bg-surface border border-border rounded-3xl p-12 text-center space-y-4 shadow-xs">
                            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">No Services Offered Yet</h3>
                                <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                                    Create a service service like code reviews, design calls, or 1-on-1 mentorship.
                                </p>
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-full shadow-xs transition-all inline-flex items-center space-x-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create New Service</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="bg-surface border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-6 space-y-4"
                                >
                                    <div className="space-y-3">
                                        {/* Portfolio Image Slider if available */}
                                        {(() => {
                                            const serviceImages: string[] = Array.from(
                                                new Set([
                                                    ...(service.cover_image_url ? [service.cover_image_url] : []),
                                                    ...(Array.isArray(service.portfolio_images) ? service.portfolio_images : []),
                                                ])
                                            ).filter(Boolean)

                                            if (serviceImages.length === 0) return null

                                            return (
                                                <div className="rounded-2xl overflow-hidden max-h-40 border border-border">
                                                    <ImageSlider
                                                        images={serviceImages}
                                                        alt={service.title}
                                                        className="w-full h-40"
                                                        imageClassName="w-full h-40 object-cover"
                                                        showDots={serviceImages.length > 1}
                                                        showArrows={serviceImages.length > 1}
                                                    />
                                                </div>
                                            )
                                        })()}

                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-extrabold text-text-primary">
                                                ৳{(service.price_cents / 100).toFixed(0)}
                                            </span>
                                            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-background text-text-secondary rounded-full font-semibold text-xs border border-border">
                                                <Clock className="w-3.5 h-3.5 text-text-muted" />
                                                <span>{service.delivery_days || 3} DAYS DELIVERY</span>
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-bold text-text-primary leading-snug">{service.title}</h4>
                                        {service.description && (
                                            <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">{service.description}</p>
                                        )}

                                        {service.client_requirements && (
                                            <div className="p-3 bg-background border border-border rounded-2xl text-xs text-text-secondary space-y-1">
                                                <span className="font-bold text-text-primary block">Client Requirements:</span>
                                                <p className="italic">{service.client_requirements}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                                        <button
                                            onClick={() => openEditModal(service)}
                                            className="p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-background transition-all"
                                            title="Edit Service"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setServiceToDelete(service.id)}
                                            className="p-2 text-text-muted hover:text-error-600 rounded-xl hover:bg-background transition-all"
                                            title="Delete Service"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Active Orders Tab */}
            {activeTab === 'orders' && (
                <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-8 text-xs text-text-muted">No service orders received yet.</div>
                    ) : (
                        <div className="divide-y divide-border">
                            {orders.map((order) => (
                                <div key={order.id} className="py-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-mono text-text-muted">{order.reference}</span>
                                            <h4 className="font-bold text-text-primary text-sm">
                                                {order.service_listing?.title || 'Custom Service'}
                                            </h4>
                                            <p className="text-xs text-text-muted">Ordered by {order.supporter_email}</p>
                                        </div>
                                        <div>
                                            {order.status === 'delivered' ? (
                                                <span className="px-3 py-1 bg-success-50 text-success-700 font-bold text-xs rounded-full inline-flex items-center space-x-1 border border-success-200">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    <span>Delivered</span>
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => setDeliveringOrder(order)}
                                                    className="py-1.5 px-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1 cursor-pointer"
                                                >
                                                    <Send className="h-3.5 w-3.5" />
                                                    <span>Deliver Work</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {order.intake_response && Object.keys(order.intake_response).length > 0 && (
                                        <div className="p-3 bg-background rounded-xl text-xs space-y-1 border border-border">
                                            <div className="font-bold text-text-secondary">Supporter Requirements Response:</div>
                                            <pre className="text-text-secondary whitespace-pre-wrap font-sans">
                                                {JSON.stringify(order.intake_response, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Create / Edit Service Modal Dialog */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-surface border border-border rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 md:px-8 pb-4 border-b border-border flex-shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                                    {editingServiceId ? 'Edit Service' : 'Create New Service'}
                                </h2>
                                <p className="text-sm text-text-muted mt-0.5">Fill in the details to start selling your service.</p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-background transition-all cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:px-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                            {error && (
                                <div className="p-3.5 text-xs bg-error-50 text-error-700 border border-error-200 rounded-2xl">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSaveService} className="space-y-6">
                            {/* Service Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">Service Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 1-on-1 Code Review & Technical Feedback"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                />
                            </div>

                            {/* Service Price & Delivery Timeframe */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Service Price */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">Price (BDT)</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-text-muted text-sm font-bold">৳</span>
                                        <input
                                            type="number"
                                            placeholder="1500"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full bg-background border border-border rounded-2xl pl-9 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Delivery Timeframe */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">Delivery Timeframe</label>
                                    <div className="flex items-center justify-between bg-background border border-border rounded-2xl p-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setDeliveryDays(Math.max(1, deliveryDays - 1))}
                                            className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-primary hover:bg-background font-bold transition-all cursor-pointer"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>

                                        <div className="text-center font-extrabold text-sm text-text-primary">
                                            <span>{deliveryDays}</span>
                                            <span className="text-[10px] text-text-muted block uppercase font-mono">DAYS</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setDeliveryDays(deliveryDays + 1)}
                                            className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-primary hover:bg-background font-bold transition-all cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Service Details & Scope */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">Service Details & Scope</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe what is included in this service and how it will be delivered..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y min-h-[110px]"
                                />
                            </div>

                            {/* Supporter Requirements */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">Supporter Requirements</label>
                                    <span className="px-2 py-0.5 bg-background border border-border rounded-md text-[10px] font-extrabold text-text-muted tracking-wider uppercase">
                                        CONFIDENTIAL
                                    </span>
                                </div>
                                <div className="relative">
                                    <textarea
                                        rows={3}
                                        placeholder="Specify any links, questions, or files you need from supporters when they order..."
                                        value={clientRequirements}
                                        onChange={(e) => setClientRequirements(e.target.value)}
                                        className="w-full bg-background border border-border rounded-2xl p-4 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y min-h-[90px]"
                                    />
                                    <Info className="w-4 h-4 text-text-muted absolute right-4 top-4 pointer-events-none" />
                                </div>
                            </div>

                            {/* Sample Media & Portfolio */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">Sample Media & Portfolio (Max 4)</label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {portfolioImages.map((imgUrl, idx) => (
                                        <div key={idx} className="relative rounded-2xl overflow-hidden border border-border h-28 bg-background group">
                                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePortfolioImage(idx)}
                                                className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black text-white rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}

                                    {portfolioImages.length < 4 && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-border hover:border-primary-500 bg-background rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer transition-all space-y-1.5 group"
                                        >
                                            {uploadingImage ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted group-hover:text-primary-600 transition-all">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                            )}
                                            <span className="text-xs font-bold text-text-muted group-hover:text-text-primary transition-all">
                                                {uploadingImage ? 'Uploading...' : 'Upload Sample'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CONFIRMATION CHECKBOX */}
                            <div
                                onClick={() => setIsConfirmed(!isConfirmed)}
                                className="flex items-center space-x-3 bg-background border border-border rounded-2xl p-4 cursor-pointer hover:border-text-muted transition-all select-none"
                            >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                    isConfirmed ? 'bg-primary-600 border-primary-600 text-white' : 'border-border bg-surface'
                                }`}>
                                    {isConfirmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <span className="text-xs font-bold text-text-primary">I confirm that I will complete and deliver this service within the agreed timeframe.</span>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 bg-background hover:bg-surface text-text-secondary font-bold text-sm rounded-full transition-all border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-full shadow-xs transition-all disabled:opacity-50 inline-flex items-center space-x-2 cursor-pointer"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>{saving ? 'Saving...' : (editingServiceId ? 'Update Service' : 'Save & Publish Service')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            )}

            {/* Deliver Order Modal */}
            {deliveringOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-surface border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-text-primary">
                            Deliver Work for {deliveringOrder.reference}
                        </h3>
                        <form onSubmit={handleDeliverSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary">Delivery Message & Links</label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Add video links, Google Drive links, or notes for the supporter..."
                                    value={deliveryNote}
                                    onChange={(e) => setDeliveryNote(e.target.value)}
                                    className="mt-1 w-full p-3 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setDeliveringOrder(null)}
                                    className="px-4 py-2 bg-background hover:bg-surface text-text-secondary text-xs font-bold rounded-xl border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={delivering}
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                                >
                                    {delivering ? 'Sending...' : 'Complete & Deliver'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!serviceToDelete}
                title="Delete Service Offering?"
                message="Are you sure you want to delete this service? Existing booked orders will not be affected."
                confirmText="Delete Service"
                cancelText="Cancel"
                variant="danger"
                isLoading={deletingService}
                onConfirm={confirmDeleteService}
                onClose={() => setServiceToDelete(null)}
            />
        </div>
    )
}
