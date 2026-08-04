'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import axios from '@/lib/axios'
import ShareModalButton from '../ShareButton'
import PublicFooter from '@/components/layout/PublicFooter'
import {
    ArrowLeft,
    ShoppingBag,
    Share2,
    FileText,
    Video,
    Package,
    Flame,
    Tag,
    Clock,
    Users,
    ArrowRight,
    Check,
    Cloud,
    Gift,
    Zap,
    Sparkles,
    ShieldCheck,
    Briefcase
} from 'lucide-react'

interface PublicStorefrontClientProps {
    slug: string
    creator: any
    products: any[]
}

type FilterCategory = 'all' | 'digital' | 'call' | 'bundle'

export default function PublicStorefrontClient({
    slug,
    creator,
    products,
}: PublicStorefrontClientProps) {
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Purchase Modal State
    const [buyingProduct, setBuyingProduct] = useState<any | null>(null)
    const [supporterEmail, setSupporterEmail] = useState('')
    const [supporterName, setSupporterName] = useState('')
    const [purchasing, setPurchasing] = useState(false)
    const [productError, setProductError] = useState<string | null>(null)

    const creatorName = creator?.display_name || creator?.name || slug
    const avatarUrl = creator?.avatar_url

    const digitalCount = products.filter((p) => p.type === 'digital' || !p.type).length
    const callCount = products.filter((p) => p.type === 'call').length
    const bundleCount = products.filter((p) => p.type === 'bundle').length

    const filteredProducts = products.filter((product) => {
        if (activeFilter === 'all') return true
        if (activeFilter === 'digital') return product.type === 'digital' || !product.type
        if (activeFilter === 'call') return product.type === 'call'
        if (activeFilter === 'bundle') return product.type === 'bundle'
        return true
    })

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
                const targetUrl = typeof res.data.redirect_url === 'string' ? res.data.redirect_url : res.data.redirect_url.gateway_url
                if (targetUrl) {
                    window.location.href = targetUrl
                }
            }
        } catch (err: any) {
            setProductError(err.response?.data?.message || 'Failed to initiate purchase')
            setPurchasing(false)
        }
    }

    return (
        <div suppressHydrationWarning className="min-h-screen flex flex-col justify-between bg-background text-text-primary font-sans">
            {/* Top Navigation Bar */}
            <header suppressHydrationWarning className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
                <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Left: Back to Creator Profile */}
                    <Link
                        href={`/${slug}`}
                        className="inline-flex items-center space-x-2 text-xs font-extrabold text-text-secondary hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-background border border-transparent hover:border-border"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Creator Profile</span>
                    </Link>

                    {/* Center: Creator Identity */}
                    <div className="flex items-center space-x-2.5" suppressHydrationWarning>
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-border overflow-hidden flex items-center justify-center shrink-0" suppressHydrationWarning>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={creatorName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-extrabold text-xs text-primary">{creatorName ? creatorName[0] : 'S'}</span>
                            )}
                        </div>
                        <span className="font-extrabold text-sm text-text-primary">{creatorName}</span>
                    </div>

                    {/* Right: Share Store */}
                    <div suppressHydrationWarning className="flex items-center space-x-2">
                        <ShareModalButton slug={slug} creatorName={creatorName} />
                    </div>
                </div>
            </header>

            {/* Storefront Hero Section */}
            <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6" suppressHydrationWarning>
                <div className="relative inline-block" suppressHydrationWarning>
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-surface border-4 border-surface shadow-xl overflow-hidden mx-auto" suppressHydrationWarning>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={creatorName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-3xl" suppressHydrationWarning>
                                {creatorName ? creatorName[0] : 'S'}
                            </div>
                        )}
                    </div>
                    <div suppressHydrationWarning className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg border border-white/20">
                        <Sparkles className="h-3 w-3 text-amber-400 fill-current" />
                        <span>Official Store</span>
                    </div>
                </div>

                <div suppressHydrationWarning className="space-y-3">
                    <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight leading-tight">
                        Curated by <br className="hidden sm:inline" />
                        <span className="text-primary">{creatorName}</span>
                    </h1>
                    <p className="text-sm md:text-base text-text-secondary max-w-xl mx-auto font-medium leading-relaxed">
                        Discover exclusive digital products, premium assets, and high-quality content crafted directly for the community.
                    </p>
                </div>

                <div suppressHydrationWarning className="inline-flex items-center space-x-2 px-4 py-1.5 bg-surface border border-border rounded-full shadow-xs text-xs font-extrabold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{products.length} {products.length === 1 ? 'product' : 'products'} available</span>
                </div>
            </section>

            {/* Main Catalog Content */}
            <main suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
                {/* Filter Tabs */}
                <div suppressHydrationWarning className="flex items-center justify-center space-x-2 border-b border-border pb-4 overflow-x-auto custom-scrollbar">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`cursor-pointer px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
                            activeFilter === 'all'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                        }`}
                    >
                        All Items ({products.length})
                    </button>

                    <button
                        onClick={() => setActiveFilter('digital')}
                        className={`cursor-pointer px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-2 ${
                            activeFilter === 'digital'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                        }`}
                    >
                        <FileText className="h-4 w-4" />
                        <span>Digital Products ({digitalCount})</span>
                    </button>

                    <button
                        onClick={() => setActiveFilter('call')}
                        className={`cursor-pointer px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-2 ${
                            activeFilter === 'call'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                        }`}
                    >
                        <Video className="h-4 w-4" />
                        <span>1-on-1 Services ({callCount})</span>
                    </button>

                    <button
                        onClick={() => setActiveFilter('bundle')}
                        className={`cursor-pointer px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-2 ${
                            activeFilter === 'bundle'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                        }`}
                    >
                        <Package className="h-4 w-4" />
                        <span>Bundles ({bundleCount})</span>
                    </button>
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 ? (
                    <div suppressHydrationWarning className="p-16 bg-surface rounded-3xl border border-border text-center space-y-4 max-w-md mx-auto">
                        <ShoppingBag className="h-12 w-12 text-text-muted mx-auto opacity-50" />
                        <h3 className="font-extrabold text-text-primary text-base">No Products Found</h3>
                        <p className="text-xs text-text-muted">
                            There are currently no items available in this category. Check back soon!
                        </p>
                    </div>
                ) : (
                    /* Products Grid */
                    <div suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => {
                            const priceBdtVal = product.price_cents ? product.price_cents / 100 : 0
                            const discountPriceBdtVal = product.discount_price_cents ? product.discount_price_cents / 100 : null
                            const isFree = product.is_free || priceBdtVal === 0
                            const hasActiveOffer = !isFree && discountPriceBdtVal !== null && discountPriceBdtVal < priceBdtVal

                            const discountAmount = hasActiveOffer ? priceBdtVal - discountPriceBdtVal : 0
                            const discountPercentage = hasActiveOffer && priceBdtVal > 0 ? Math.round((discountAmount / priceBdtVal) * 100) : 0

                            const isBundle = product.type === 'bundle'
                            const isCall = product.type === 'call'

                            const buyersCount = product.sales_count || product.orders_count || product.purchased_count || 0

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
                                    suppressHydrationWarning
                                    className="bg-surface rounded-3xl border border-border hover:border-primary/40 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative"
                                >
                                    <div suppressHydrationWarning className="space-y-3">
                                        {/* Cover Image Container */}
                                        <div suppressHydrationWarning className="h-52 w-full bg-background overflow-hidden relative border-b border-border/70">
                                            {product.cover_image_url ? (
                                                <img
                                                    src={product.cover_image_url}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div suppressHydrationWarning className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary/60 space-y-1">
                                                    {isBundle ? (
                                                        <Package className="h-12 w-12 opacity-70" />
                                                    ) : isCall ? (
                                                        <Video className="h-12 w-12 opacity-70" />
                                                    ) : (
                                                        <FileText className="h-12 w-12 opacity-70" />
                                                    )}
                                                </div>
                                            )}

                                            {/* Top Overlay Badges */}
                                            <div suppressHydrationWarning className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                                <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1 shadow-sm">
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
                                                    <span className="px-3 py-1 rounded-xl bg-success text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                                                        FREE
                                                    </span>
                                                ) : hasActiveOffer ? (
                                                    <span className="px-3 py-1 rounded-xl bg-error text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center space-x-1 animate-pulse">
                                                        <Flame className="h-3 w-3 fill-current" />
                                                        <span>SAVE {discountPercentage}%</span>
                                                    </span>
                                                ) : null}
                                            </div>

                                            {/* Bottom-left Deliverable Tag */}
                                            <div suppressHydrationWarning className="absolute bottom-3 left-3">
                                                <span className="px-2.5 py-1 rounded-xl bg-surface/90 backdrop-blur-xs text-text-primary text-[11px] font-bold border border-border/80 shadow-xs flex items-center space-x-1">
                                                    {product.deliverable_type === 'google_drive' ? (
                                                        <>
                                                            <Cloud className="h-3.5 w-3.5 text-sky-500" />
                                                            <span>Google Drive</span>
                                                        </>
                                                    ) : isCall ? (
                                                        <>
                                                            <Video className="h-3.5 w-3.5 text-emerald-500" />
                                                            <span>Zoom Meeting</span>
                                                        </>
                                                    ) : isBundle ? (
                                                        <>
                                                            <Gift className="h-3.5 w-3.5 text-amber-500" />
                                                            <span>Curated Bundle</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Zap className="h-3.5 w-3.5 text-amber-400" />
                                                            <span>Instant Download</span>
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div suppressHydrationWarning className="p-6 pt-2 space-y-3">
                                            {offerTimeLeft && (
                                                <div suppressHydrationWarning className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-extrabold uppercase tracking-wide">
                                                    <Clock className="h-3 w-3 animate-spin" />
                                                    <span>{offerTimeLeft}</span>
                                                </div>
                                            )}

                                            <a href={`/${slug}/products/${product.id}`} className="block">
                                                <h2 className="font-extrabold text-text-primary text-base leading-snug group-hover:text-primary transition-colors">
                                                    {product.title}
                                                </h2>
                                            </a>

                                            {product.description && (
                                                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-medium">
                                                    {product.description}
                                                </p>
                                            )}

                                            {buyersCount > 0 && (
                                                <div suppressHydrationWarning className="flex items-center space-x-1.5 text-xs text-text-muted font-semibold pt-1">
                                                    <Users className="h-3.5 w-3.5 text-primary" />
                                                    <span>{buyersCount} {buyersCount === 1 ? 'person' : 'people'} bought this</span>
                                                </div>
                                            )}

                                            {hasActiveOffer && (
                                                <div suppressHydrationWarning className="p-2.5 bg-error/10 border border-error/20 rounded-xl text-error text-[11px] font-bold flex items-center justify-between">
                                                    <span className="flex items-center space-x-1">
                                                        <Tag className="h-3.5 w-3.5" />
                                                        <span>Special Discount</span>
                                                    </span>
                                                    <span>Save ৳{discountAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div suppressHydrationWarning className="p-6 pt-0">
                                        <div suppressHydrationWarning className="p-4 bg-background border border-border/80 rounded-2xl flex items-center justify-between">
                                            <div suppressHydrationWarning>
                                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                                                    {isFree ? 'Access' : hasActiveOffer ? 'Deal Price' : 'Price'}
                                                </span>
                                                {isFree ? (
                                                    <span className="text-lg font-black text-success">FREE</span>
                                                ) : hasActiveOffer ? (
                                                    <div suppressHydrationWarning className="flex items-baseline space-x-1.5">
                                                        <span className="text-lg font-black text-primary">৳{discountPriceBdtVal?.toLocaleString()}</span>
                                                        <span className="text-xs text-text-muted line-through font-semibold">৳{priceBdtVal.toLocaleString()}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-lg font-black text-text-primary">৳{priceBdtVal.toLocaleString()}</span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setBuyingProduct(product)}
                                                className="py-2.5 px-5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl shadow-xs hover:shadow-md flex items-center space-x-1.5 transition-all active:scale-[0.97] cursor-pointer"
                                            >
                                                <span>{isCall ? 'Book' : isBundle ? 'Get Bundle' : isFree ? 'Get Free' : 'Buy Now'}</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>

            {/* Purchase Modal */}
            {buyingProduct && mounted && createPortal(
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
                </div>,
                document.body
            )}

            {/* Public Footer */}
            <PublicFooter />
        </div>
    )
}
