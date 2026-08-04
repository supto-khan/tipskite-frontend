'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { ShoppingBag, ArrowRight, ChevronDown, ChevronUp, Flame, Tag, FileText, Video, Package, Clock, Users, Sparkles, AlertCircle, Cloud, Gift, Zap } from 'lucide-react'

export default function PublicShopSection({ slug, creatorName }: { slug: string; creatorName: string }) {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAll, setShowAll] = useState(false)

    // Purchase Modal state
    const [buyingProduct, setBuyingProduct] = useState<any | null>(null)
    const [supporterEmail, setSupporterEmail] = useState('')
    const [supporterName, setSupporterName] = useState('')
    const [purchasing, setPurchasing] = useState(false)
    const [productError, setProductError] = useState<string | null>(null)

    useEffect(() => {
        axios.get(`/api/v1/creators/${slug}/products`)
            .then((res) => setProducts(res.data.products || []))
            .catch(console.error)
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

    if (loading) {
        return (
            <div suppressHydrationWarning className="p-8 bg-surface rounded-3xl border border-border animate-pulse text-xs text-text-muted text-center space-y-4">
                <div suppressHydrationWarning className="h-6 w-48 bg-border/50 rounded-lg mx-auto" />
                <div suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} suppressHydrationWarning className="h-64 bg-background border border-border rounded-2xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return null
    }

    const displayedProducts = showAll ? products : products.slice(0, 6)

    return (
        <div suppressHydrationWarning className="bg-surface rounded-3xl shadow-md border border-border p-6 md:p-8 space-y-6 font-sans">
            {/* Header Bar */}
            <div suppressHydrationWarning className="flex items-center justify-between border-b border-border pb-4">
                <div suppressHydrationWarning className="flex items-center space-x-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-text-primary tracking-tight">Shop</h2>
                        <p className="text-xs text-text-muted font-medium">Instant access products & services by {creatorName}</p>
                    </div>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                    {products.length} {products.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {/* 3 Columns Rich Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => {
                    const priceBdtVal = product.price_cents ? product.price_cents / 100 : 0
                    const discountPriceBdtVal = product.discount_price_cents ? product.discount_price_cents / 100 : null
                    const isFree = product.is_free || priceBdtVal === 0
                    const hasActiveOffer = !isFree && discountPriceBdtVal !== null && discountPriceBdtVal < priceBdtVal

                    const discountAmount = hasActiveOffer ? priceBdtVal - discountPriceBdtVal : 0
                    const discountPercentage = hasActiveOffer && priceBdtVal > 0 ? Math.round((discountAmount / priceBdtVal) * 100) : 0

                    const isBundle = product.type === 'bundle'
                    const isCall = product.type === 'call'

                    // Social proof buyers count
                    const buyersCount = product.sales_count || product.orders_count || product.purchased_count || product.buyers_count || 0

                    // Time limited offer expiration text
                    let offerTimeLeft = null
                    if (product.offer_expires_at) {
                        const expireDate = new Date(product.offer_expires_at)
                        const now = new Date()
                        const diffTime = expireDate.getTime() - now.getTime()
                        if (diffTime > 0) {
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            offerTimeLeft = diffDays === 1 ? 'Ends today' : `Ends in ${diffDays} days`
                        }
                    } else if (hasActiveOffer) {
                        offerTimeLeft = 'Limited time offer'
                    }

                    return (
                        <div
                            key={product.id}
                            className="bg-background rounded-3xl border border-border hover:border-primary/40 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative"
                        >
                            <div className="space-y-3">
                                {/* Cover Image Container with Overlays */}
                                <div className="h-44 w-full bg-surface overflow-hidden relative border-b border-border/70">
                                    {product.cover_image_url ? (
                                        <img
                                            src={product.cover_image_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary/60 space-y-1">
                                            {isBundle ? (
                                                <Package className="h-10 w-10 opacity-70" />
                                            ) : isCall ? (
                                                <Video className="h-10 w-10 opacity-70" />
                                            ) : (
                                                <FileText className="h-10 w-10 opacity-70" />
                                            )}
                                        </div>
                                    )}

                                    {/* Top Overlay Badges */}
                                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                        <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                                            {isBundle ? (
                                                <>
                                                    <Package className="h-3 w-3 text-amber-400" />
                                                    <span>Bundle Deal</span>
                                                </>
                                            ) : isCall ? (
                                                <>
                                                    <Video className="h-3 w-3 text-emerald-400" />
                                                    <span>1-on-1 Session</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="h-3 w-3 text-primary-300" />
                                                    <span>Digital Product</span>
                                                </>
                                            )}
                                        </span>

                                        {isFree ? (
                                            <span className="px-2.5 py-1 rounded-xl bg-success text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                                                FREE
                                            </span>
                                        ) : hasActiveOffer ? (
                                            <span className="px-2.5 py-1 rounded-xl bg-error text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center space-x-1 animate-pulse">
                                                <Flame className="h-3 w-3 fill-current" />
                                                <span>SAVE {discountPercentage}%</span>
                                            </span>
                                        ) : null}
                                    </div>

                                    {/* Bottom-left Deliverable Tag & Expiration pill */}
                                    <div className="absolute bottom-2.5 left-3 flex items-center space-x-1.5">
                                        <span className="px-2 py-0.5 rounded-lg bg-surface/90 backdrop-blur-xs text-text-primary text-[10px] font-bold border border-border/80 shadow-xs flex items-center space-x-1">
                                            {product.deliverable_type === 'google_drive' ? (
                                                <>
                                                    <Cloud className="h-3 w-3 text-sky-500" />
                                                    <span>Google Drive</span>
                                                </>
                                            ) : isCall ? (
                                                <>
                                                    <Video className="h-3 w-3 text-emerald-500" />
                                                    <span>Zoom Meeting</span>
                                                </>
                                            ) : isBundle ? (
                                                <>
                                                    <Gift className="h-3 w-3 text-amber-500" />
                                                    <span>Curated Bundle</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="h-3 w-3 text-amber-400" />
                                                    <span>Instant Download</span>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-5 pt-1 space-y-3">
                                    {/* Expiration Timer Pill */}
                                    {offerTimeLeft && (
                                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-extrabold uppercase tracking-wide">
                                            <Clock className="h-3 w-3 animate-spin" />
                                            <span>{offerTimeLeft}</span>
                                        </div>
                                    )}

                                    <a href={`/${slug}/products/${product.id}`} className="block">
                                        <h3 className="font-extrabold text-text-primary text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                            {product.title}
                                        </h3>
                                    </a>

                                    {product.description && (
                                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-medium">
                                            {product.description}
                                        </p>
                                    )}

                                    {/* Buyers Count Social Proof */}
                                    {buyersCount > 0 && (
                                        <div className="flex items-center space-x-1.5 text-xs text-text-muted font-semibold pt-1">
                                            <Users className="h-3.5 w-3.5 text-primary" />
                                            <span>{buyersCount} {buyersCount === 1 ? 'person' : 'people'} bought this</span>
                                        </div>
                                    )}

                                    {/* Savings banner pill if offer active */}
                                    {hasActiveOffer && (
                                        <div className="p-2 bg-error/10 border border-error/20 rounded-xl text-error text-[11px] font-bold flex items-center justify-between">
                                            <span className="flex items-center space-x-1">
                                                <Tag className="h-3 w-3" />
                                                <span>Special Discount</span>
                                            </span>
                                            <span>Save ৳{discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Price & Purchase Action */}
                            <div className="p-5 pt-0 mt-2">
                                <div className="p-3.5 bg-surface border border-border/80 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                                            {isFree ? 'Access' : hasActiveOffer ? 'Deal Price' : 'Price'}
                                        </span>
                                        {isFree ? (
                                            <span className="text-base font-black text-success">FREE</span>
                                        ) : hasActiveOffer ? (
                                            <div className="flex items-baseline space-x-1.5">
                                                <span className="text-base font-black text-primary">৳{discountPriceBdtVal?.toLocaleString()}</span>
                                                <span className="text-xs text-text-muted line-through font-semibold">৳{priceBdtVal.toLocaleString()}</span>
                                            </div>
                                        ) : (
                                            <span className="text-base font-black text-text-primary">৳{priceBdtVal.toLocaleString()}</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setBuyingProduct(product)}
                                        className="py-2.5 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl shadow-xs hover:shadow-md flex items-center space-x-1.5 transition-all active:scale-[0.97] cursor-pointer"
                                    >
                                        <span>{isCall ? 'Book' : isBundle ? 'Get Bundle' : isFree ? 'Get Free' : 'Buy Now'}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* View All Products Link to Dedicated Storefront Page */}
            {products.length > 6 && (
                <div className="pt-3 text-center border-t border-border">
                    <a
                        href={`/${slug}/shop`}
                        className="cursor-pointer py-3 px-6 bg-background hover:bg-elevated-surface border border-border rounded-xl text-xs font-bold text-text-primary inline-flex items-center space-x-2 transition-all shadow-xs group"
                    >
                        <span>View all {products.length} products</span>
                        <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            )}

            {/* Product Purchase Modal */}
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
                            <span>Total Amount</span>
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
        </div>
    )
}
