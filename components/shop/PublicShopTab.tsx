'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { ShoppingBag, Download, ExternalLink, Briefcase, FileText, Video, Package, Clock, ArrowRight, Tag, Gift, Check } from 'lucide-react'

type SubFilterType = 'all' | 'digital' | 'services' | 'bundle'

export default function PublicShopTab({ slug, creatorName }: { slug: string; creatorName: string }) {
    const [products, setProducts] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeSubFilter, setActiveSubFilter] = useState<SubFilterType>('all')

    // Product Buy Modal
    const [buyingProduct, setBuyingProduct] = useState<any | null>(null)
    const [supporterEmail, setSupporterEmail] = useState('')
    const [supporterName, setSupporterName] = useState('')
    const [purchasing, setPurchasing] = useState(false)
    const [productError, setProductError] = useState<string | null>(null)

    // Service Booking Modal
    const [bookingService, setBookingService] = useState<any | null>(null)
    const [serviceSupporterName, setServiceSupporterName] = useState('')
    const [serviceSupporterEmail, setServiceSupporterEmail] = useState('')
    const [intakeAnswers, setIntakeAnswers] = useState<Record<string, string>>({})
    const [orderingService, setOrderingService] = useState(false)

    useEffect(() => {
        Promise.allSettled([
            axios.get(`/api/v1/creators/${slug}/products`),
            axios.get(`/api/v1/creators/${slug}/services`)
        ])
            .then(([prodRes, servRes]) => {
                if (prodRes.status === 'fulfilled') {
                    setProducts(prodRes.value.data.products || [])
                }
                if (servRes.status === 'fulfilled') {
                    setServices(servRes.value.data.services || [])
                }
            })
            .finally(() => setLoading(false))
    }, [slug])

    const handleBuySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!buyingProduct) return

        setPurchasing(true)
        setProductError(null)

        try {
            const res = await axios.post(`/api/v1/products/${buyingProduct.id}/buy`, {
                supporter_email: supporterEmail,
                supporter_name: supporterName || 'Supporter',
            })
            if (res.data?.redirect_url) {
                window.location.href = res.data.redirect_url
            }
        } catch (err: any) {
            setProductError(err.response?.data?.message || 'Failed to initiate purchase')
            setPurchasing(false)
        }
    }

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!bookingService) return

        setOrderingService(true)
        try {
            const res = await axios.post(`/api/v1/services/${bookingService.id}/order`, {
                supporter_name: serviceSupporterName,
                supporter_email: serviceSupporterEmail,
                intake_response: intakeAnswers,
            })

            if (res.data.payment_url) {
                window.location.href = res.data.payment_url
            }
        } catch (e) {
            console.error(e)
            setOrderingService(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-xs text-text-muted text-center animate-pulse">Loading shop & services...</div>
    }

    const digitalProducts = products.filter((p) => p.type === 'digital' || !p.type)
    const callProducts = products.filter((p) => p.type === 'call')
    const bundleProducts = products.filter((p) => p.type === 'bundle')

    const hasAnyContent = products.length > 0 || services.length > 0

    if (!hasAnyContent) {
        return (
            <div className="p-12 bg-surface rounded-3xl border border-border text-center space-y-3">
                <ShoppingBag className="h-10 w-10 text-text-muted mx-auto" />
                <h4 className="font-bold text-text-primary text-base">No Shop Items or Services Listed Yet</h4>
                <p className="text-xs text-text-muted">{creatorName} has not published any digital products or 1-on-1 services yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 font-sans">
            {/* Category Filter Tabs inside Shop & Extras */}
            <div className="flex items-center space-x-2 border-b border-border pb-3 overflow-x-auto custom-scrollbar">
                <button
                    onClick={() => setActiveSubFilter('all')}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        activeSubFilter === 'all'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                    }`}
                >
                    All Items ({products.length + services.length})
                </button>
                <button
                    onClick={() => setActiveSubFilter('digital')}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                        activeSubFilter === 'digital'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                    }`}
                >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Digital Products ({digitalProducts.length})</span>
                </button>
                <button
                    onClick={() => setActiveSubFilter('services')}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                        activeSubFilter === 'services'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                    }`}
                >
                    <Video className="h-3.5 w-3.5" />
                    <span>1-on-1 Services ({services.length + callProducts.length})</span>
                </button>
                <button
                    onClick={() => setActiveSubFilter('bundle')}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                        activeSubFilter === 'bundle'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                    }`}
                >
                    <Package className="h-3.5 w-3.5" />
                    <span>Bundles ({bundleProducts.length})</span>
                </button>
            </div>

            {/* Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Render Products */}
                {(activeSubFilter === 'all' || activeSubFilter === 'digital' || activeSubFilter === 'bundle' || activeSubFilter === 'services') &&
                    products
                        .filter((product) => {
                            if (activeSubFilter === 'all') return true
                            if (activeSubFilter === 'digital') return product.type === 'digital' || !product.type
                            if (activeSubFilter === 'services') return product.type === 'call'
                            if (activeSubFilter === 'bundle') return product.type === 'bundle'
                            return true
                        })
                        .map((product) => {
                            const priceBdtVal = product.price_cents ? product.price_cents / 100 : 0
                            const discountPriceBdtVal = product.discount_price_cents ? product.discount_price_cents / 100 : null
                            const isFree = product.is_free || priceBdtVal === 0
                            const hasActiveOffer = !isFree && discountPriceBdtVal !== null && discountPriceBdtVal < priceBdtVal

                            return (
                                <div
                                    key={product.id}
                                    className="bg-surface rounded-3xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="p-6 space-y-3">
                                        {product.cover_image_url && (
                                            <div className="h-44 w-full rounded-2xl bg-background overflow-hidden relative border border-border mb-2">
                                                <img src={product.cover_image_url} alt="" className="w-full h-full object-cover" />
                                                {isFree ? (
                                                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-success text-white text-[10px] font-black uppercase shadow-xs">
                                                        FREE
                                                    </span>
                                                ) : hasActiveOffer ? (
                                                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-error text-white text-[10px] font-black uppercase shadow-xs">
                                                        OFFER
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-2">
                                            <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-extrabold uppercase">
                                                {product.type === 'bundle' ? 'Combo Bundle' : product.type === 'call' ? '1-on-1 Session' : product.category || 'Digital'}
                                            </span>
                                        </div>

                                        <h3 className="font-extrabold text-text-primary text-base leading-snug">{product.title}</h3>
                                        {product.description && (
                                            <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">{product.description}</p>
                                        )}
                                    </div>

                                    <div className="p-6 pt-0 flex items-center justify-between border-t border-border mt-4">
                                        <div>
                                            <span className="text-[10px] font-bold text-text-muted uppercase">Price</span>
                                            {isFree ? (
                                                <div className="text-lg font-black text-success">FREE</div>
                                            ) : hasActiveOffer ? (
                                                <div className="flex items-baseline space-x-1.5">
                                                    <span className="text-lg font-black text-primary">BDT {discountPriceBdtVal}</span>
                                                    <span className="text-xs text-text-muted line-through">BDT {priceBdtVal}</span>
                                                </div>
                                            ) : (
                                                <div className="text-lg font-black text-text-primary">
                                                    BDT {priceBdtVal}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setBuyingProduct(product)}
                                            className="py-2.5 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                                        >
                                            <span>{product.type === 'call' ? 'Book Call' : product.type === 'bundle' ? 'Get Bundle' : 'Get Item'}</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}

                {/* Render Dedicated 1-on-1 Services */}
                {(activeSubFilter === 'all' || activeSubFilter === 'services') &&
                    services.map((service) => (
                        <div
                            key={`service-${service.id}`}
                            className="bg-surface rounded-3xl border border-border shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-info/10 text-info text-[10px] font-extrabold uppercase flex items-center space-x-1">
                                        <Briefcase className="h-3 w-3" />
                                        <span>1-on-1 Service</span>
                                    </span>
                                    <span className="flex items-center space-x-1 text-xs text-text-muted">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{service.delivery_days || 3} Days</span>
                                    </span>
                                </div>

                                <h3 className="font-extrabold text-text-primary text-base leading-snug">{service.title}</h3>
                                <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">{service.description || 'No description provided.'}</p>
                            </div>

                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase">Service Fee</span>
                                    <div className="text-lg font-black text-primary">
                                        BDT {(service.price_cents / 100).toFixed(0)}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setBookingService(service)}
                                    className="py-2.5 px-4 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                                >
                                    <span>Book Service</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Product Buy Modal */}
            {buyingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="bg-elevated-surface text-text-primary border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-base font-bold text-text-primary">Get "{buyingProduct.title}"</h3>
                            <button
                                onClick={() => setBuyingProduct(null)}
                                className="text-text-muted hover:text-text-primary text-xs cursor-pointer"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-3.5 bg-primary/10 text-primary text-xs rounded-2xl flex items-center justify-between font-bold">
                            <span>Amount</span>
                            <span>BDT {buyingProduct.is_free ? '0 (FREE)' : (buyingProduct.discount_price_cents ? buyingProduct.discount_price_cents / 100 : buyingProduct.price_cents / 100)}</span>
                        </div>

                        {productError && <div className="p-3 bg-error/10 text-error text-xs rounded-xl">{productError}</div>}

                        <form onSubmit={handleBuySubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary">Your Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={supporterEmail}
                                    onChange={(e) => setSupporterEmail(e.target.value)}
                                    className="mt-1 w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary">Your Name (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={supporterName}
                                    onChange={(e) => setSupporterName(e.target.value)}
                                    className="mt-1 w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={purchasing}
                                className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {purchasing ? 'Redirecting to payment...' : 'Pay with bKash / Cards'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Service Booking Modal */}
            {bookingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="bg-elevated-surface text-text-primary border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-base font-bold text-text-primary">Book "{bookingService.title}"</h3>
                            <button
                                onClick={() => setBookingService(null)}
                                className="text-text-muted hover:text-text-primary text-xs cursor-pointer"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-3.5 bg-primary/10 text-primary text-xs rounded-2xl flex items-center justify-between font-bold">
                            <span>Service Fee</span>
                            <span>BDT {(bookingService.price_cents / 100).toFixed(0)}</span>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Tanvir Hossain"
                                    value={serviceSupporterName}
                                    onChange={(e) => setServiceSupporterName(e.target.value)}
                                    className="mt-1 w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary">Your Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="tanvir@example.com"
                                    value={serviceSupporterEmail}
                                    onChange={(e) => setServiceSupporterEmail(e.target.value)}
                                    className="mt-1 w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={orderingService}
                                className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {orderingService ? 'Redirecting to Payment...' : 'Proceed to Checkout'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
