'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from '@/lib/axios'
import ShareModalButton from '../../ShareButton'
import PublicFooter from '@/components/layout/PublicFooter'
import {
    ArrowLeft,
    Star,
    CheckCircle2,
    Lock,
    Share2,
    MessageSquare,
    Download,
    Flame,
    Users,
    Tag,
    Clock,
    FileText,
    Video,
    Package,
    Cloud,
    Gift,
    Zap,
    Sparkles,
    ShieldCheck,
    Check,
    Send,
    Mail,
    Phone,
    MessageCircle
} from 'lucide-react'
import ImageSlider from '@/components/ui/ImageSlider'

interface PublicProductDetailClientProps {
    slug: string
    product: any
    creator: any
    reviews: any[]
    reviewStats: {
        average_rating: number
        total_reviews: number
        star_counts: Record<number, number>
    }
}

export default function PublicProductDetailClient({
    slug,
    product,
    creator,
    reviews: initialReviews,
    reviewStats: initialStats,
}: PublicProductDetailClientProps) {
    const creatorName = creator?.display_name || slug
    const avatarUrl = creator?.avatar_url

    // Purchase & Delivery State
    const [supporterEmail, setSupporterEmail] = useState('')
    const [supporterName, setSupporterName] = useState('')
    const [agreedTerms, setAgreedTerms] = useState(true)
    const [purchasing, setPurchasing] = useState(false)
    const [purchaseError, setPurchaseError] = useState<string | null>(null)
    const [completedTransaction, setCompletedTransaction] = useState<any | null>(null)

    // Review Form State
    const [reviews, setReviews] = useState<any[]>(initialReviews || [])
    const [stats, setStats] = useState(initialStats)
    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [reviewName, setReviewName] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)
    const [reviewSubmitted, setReviewSubmitted] = useState(false)
    const [reviewError, setReviewError] = useState<string | null>(null)

    const priceBdtVal = product.price_cents ? product.price_cents / 100 : 0
    const discountPriceBdtVal = product.discount_price_cents ? product.discount_price_cents / 100 : null
    const isFree = product.is_free || priceBdtVal === 0
    const hasActiveOffer = !isFree && discountPriceBdtVal !== null && discountPriceBdtVal < priceBdtVal

    const discountAmount = hasActiveOffer ? priceBdtVal - discountPriceBdtVal : 0
    const discountPercentage = hasActiveOffer && priceBdtVal > 0 ? Math.round((discountAmount / priceBdtVal) * 100) : 0

    const buyersCount = product.sales_count || product.purchase_count || 0

    // Quick tag suggestions for review
    const quickTags = [
        'Great product!',
        'Exactly as described',
        'Highly recommend',
        'Amazing quality',
        'Worth every taka',
        'Fast and easy'
    ]

    const handleTagClick = (tag: string) => {
        if (comment === tag) {
            setComment('')
        } else {
            setComment(tag)
        }
    }

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!agreedTerms) {
            setPurchaseError('Please agree to the Terms & Privacy policy.')
            return
        }

        setPurchasing(true)
        setPurchaseError(null)

        try {
            const res = await axios.post(`/api/v1/products/${product.id}/buy`, {
                supporter_email: supporterEmail,
                supporter_name: supporterName || 'Supporter',
            })

            if (res.data?.is_free) {
                setCompletedTransaction(res.data)
                setReviewName(supporterName || 'Supporter')
            } else if (res.data?.redirect_url) {
                const targetUrl = typeof res.data.redirect_url === 'string' ? res.data.redirect_url : res.data.redirect_url.gateway_url
                if (targetUrl) {
                    window.location.href = targetUrl
                }
            }
        } catch (err: any) {
            setPurchaseError(err.response?.data?.message || 'Failed to process purchase.')
            setPurchasing(false)
        }
    }

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmittingReview(true)
        setReviewError(null)

        try {
            const res = await axios.post(`/api/v1/products/${product.id}/reviews`, {
                supporter_name: reviewName || supporterName || 'Verified Buyer',
                rating,
                comment,
                transaction_id: completedTransaction?.transaction_id || null,
            })

            if (res.data?.review) {
                setReviews([res.data.review, ...reviews])
                setReviewSubmitted(true)
                // Update local stats
                setStats((prev) => {
                    const newTotal = prev.total_reviews + 1
                    const newStarCounts = { ...prev.star_counts }
                    newStarCounts[rating] = (newStarCounts[rating] || 0) + 1
                    return {
                        ...prev,
                        total_reviews: newTotal,
                        star_counts: newStarCounts,
                    }
                })
            }
        } catch (err: any) {
            setReviewError(err.response?.data?.message || 'Failed to submit review.')
        } finally {
            setSubmittingReview(false)
        }
    }

    return (
        <div suppressHydrationWarning className="min-h-screen flex flex-col justify-between bg-background text-text-primary font-sans">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link
                        href={`/${slug}`}
                        className="inline-flex items-center space-x-2 text-xs font-extrabold text-text-secondary hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-background border border-transparent hover:border-border"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to {creatorName}</span>
                    </Link>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-text-secondary hidden sm:inline">TipsKite</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            SHOP
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <ShareModalButton slug={slug} creatorName={creatorName} />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full space-y-12">
                {/* Completed Thank You & Delivery View */}
                {completedTransaction ? (
                    <div className="max-w-xl mx-auto bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95">
                        {/* Order Complete Status */}
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                                ORDER COMPLETE
                            </span>
                            <h1 className="text-3xl font-black text-text-primary">Thank you</h1>
                            <p className="text-xs text-text-secondary font-medium">
                                A receipt and access link have been sent to{' '}
                                <strong className="text-text-primary">{supporterEmail}</strong>.
                            </p>
                        </div>

                        {/* Creator Message & Download Box */}
                        <div className="p-6 bg-background border border-border rounded-2xl space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">
                                MESSAGE FROM {creatorName}
                            </span>
                            <p className="text-xs text-text-secondary font-medium leading-relaxed italic">
                                "{completedTransaction.success_message}"
                            </p>

                            {completedTransaction.deliverable_url && (
                                <a
                                    href={completedTransaction.deliverable_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3.5 px-6 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Download Now</span>
                                </a>
                            )}
                        </div>

                        {/* Rate Your Purchase Review Form */}
                        <div className="p-6 bg-surface border border-border rounded-2xl space-y-5">
                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-black text-text-primary">Rate your purchase</h3>
                                <p className="text-xs text-text-muted font-medium">
                                    Help future buyers by sharing how it went.
                                </p>
                            </div>

                            {reviewSubmitted ? (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-center text-xs font-bold space-y-1">
                                    <Check className="h-5 w-5 mx-auto" />
                                    <p>Thank you! Your review has been published.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    {/* 5-Star Interactive Rating */}
                                    <div className="flex items-center justify-center space-x-2 py-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1 text-amber-400 transition-transform hover:scale-125 cursor-pointer"
                                            >
                                                <Star
                                                    className={`h-8 w-8 ${
                                                        (hoverRating || rating) >= star
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-border fill-transparent'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Quick Tag Pills */}
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {quickTags.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => handleTagClick(tag)}
                                                className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                                    comment === tag
                                                        ? 'bg-primary text-white border-primary shadow-xs'
                                                        : 'bg-background hover:bg-elevated-surface text-text-secondary border-border'
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Optional Comment Input */}
                                    <textarea
                                        rows={3}
                                        placeholder="Write a few words, or tap a suggestion above (optional)"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full p-3.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary font-medium"
                                    />

                                    {reviewError && (
                                        <p className="text-xs text-error font-medium text-center">{reviewError}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                    >
                                        {submittingReview ? 'Submitting review...' : 'Submit review'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Default Product Details & Purchase Layout */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Cover, Info & Reviews */}
                        <div className="lg:col-span-7 space-y-10">
                            {/* Product Cover Image / Image Slider Container */}
                            {(() => {
                                const productImages: string[] = Array.from(
                                    new Set([
                                        ...(product.cover_image_url ? [product.cover_image_url] : []),
                                        ...(Array.isArray(product.gallery) ? product.gallery : []),
                                    ])
                                ).filter(Boolean)

                                return (
                                    <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-xs relative">
                                        <div className="aspect-video w-full bg-background relative overflow-hidden">
                                            {productImages.length > 0 ? (
                                                <ImageSlider
                                                    images={productImages}
                                                    alt={product.title}
                                                    className="w-full h-full"
                                                    imageClassName="w-full h-full object-cover"
                                                    showDots={productImages.length > 1}
                                                    showArrows={productImages.length > 1}
                                                    autoplay={productImages.length > 1}
                                                    autoplayDelay={5000}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary/60">
                                                    <FileText className="h-16 w-16" />
                                                </div>
                                            )}

                                            {/* Type Badge */}
                                            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                                <span className="px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider shadow-md">
                                                    {product.type === 'bundle'
                                                        ? 'BUNDLE'
                                                        : product.type === 'call'
                                                        ? 'SERVICE'
                                                        : 'DIGITAL PRODUCT'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()}

                            {/* Seller Info Pill */}
                            <div className="inline-flex items-center space-x-2.5 px-3.5 py-2 bg-surface border border-border rounded-full shadow-xs">
                                <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 overflow-hidden shrink-0 flex items-center justify-center font-black text-primary text-[10px]">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={creatorName} className="w-full h-full object-cover" />
                                    ) : (
                                        creatorName ? creatorName[0] : 'S'
                                    )}
                                </div>
                                <div className="flex items-center space-x-1.5 text-xs">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-text-muted px-1.5 py-0.5 rounded bg-background border border-border">
                                        SELLER
                                    </span>
                                    <span className="font-extrabold text-text-primary">{creatorName}</span>
                                </div>
                            </div>

                            {/* Title & Description */}
                            <div className="space-y-4">
                                <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight">
                                    {product.title}
                                </h1>

                                {product.description && (
                                    <div className="prose prose-sm text-text-secondary font-medium leading-relaxed whitespace-pre-line bg-surface/60 border border-border/70 rounded-2xl p-5">
                                        {product.description}
                                    </div>
                                )}

                                  {/* Action Buttons: Contact Seller (Email / WhatsApp) & Share */}
                                  <div className="flex flex-wrap items-center gap-3 pt-2">
                                      {product.support_email && (
                                          <a
                                              href={`mailto:${product.support_email}?subject=Inquiry regarding ${encodeURIComponent(product.title)}`}
                                              className="px-4 py-2.5 bg-background hover:bg-elevated-surface border border-border text-text-secondary hover:text-text-primary text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs"
                                          >
                                              <Mail className="h-4 w-4 text-primary" />
                                              <span>Contact via Email</span>
                                          </a>
                                      )}

                                      {product.support_whatsapp && (
                                          <a
                                              href={
                                                  product.support_whatsapp.startsWith('http')
                                                      ? product.support_whatsapp
                                                      : `https://wa.me/${product.support_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I have a question about "${product.title}"`)}`
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs"
                                          >
                                              <MessageCircle className="h-4 w-4 text-emerald-500" />
                                              <span>WhatsApp Seller</span>
                                          </a>
                                      )}

                                      {!product.support_email && !product.support_whatsapp && (
                                          <a
                                              href={`/${slug}`}
                                              className="px-4 py-2.5 bg-background hover:bg-elevated-surface border border-border text-text-secondary hover:text-text-primary text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs"
                                          >
                                              <MessageSquare className="h-4 w-4 text-primary" />
                                              <span>Visit Creator</span>
                                          </a>
                                      )}

                                      <ShareModalButton slug={`${slug}/products/${product.slug || product.id}`} creatorName={product.title} />
                                  </div>
                            </div>

                            {/* Reviews Section ("WHAT BUYERS SAY / Reviews") */}
                            <section className="pt-8 border-t border-border space-y-8">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                        WHAT BUYERS SAY
                                    </span>
                                    <h2 className="text-2xl font-black text-text-primary">Reviews</h2>
                                </div>

                                {/* Rating Score & Breakdown Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-6 bg-surface border border-border rounded-3xl items-center">
                                    {/* Left Score Summary */}
                                    <div className="sm:col-span-5 text-center sm:text-left space-y-2 border-b sm:border-b-0 sm:border-r border-border pb-6 sm:pb-0 sm:pr-6">
                                        {stats.total_reviews > 0 ? (
                                            <>
                                                <div className="flex items-baseline justify-center sm:justify-start space-x-1">
                                                    <span className="text-5xl font-black text-text-primary">
                                                        {stats.average_rating}
                                                    </span>
                                                    <span className="text-base font-bold text-text-muted">/5</span>
                                                </div>
                                                <div className="flex justify-center sm:justify-start space-x-1 text-amber-400">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className={`h-5 w-5 ${
                                                                s <= Math.round(stats.average_rating)
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : 'text-border fill-transparent'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-text-muted font-semibold">
                                                    Based on {stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'}
                                                </p>
                                            </>
                                        ) : (
                                            <div className="py-2 space-y-1">
                                                <span className="text-sm font-extrabold text-text-primary block">No reviews yet</span>
                                                <p className="text-xs text-text-muted">Be the first verified buyer to leave a review after purchase!</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Star Bars Breakdown */}
                                    <div className="sm:col-span-7 space-y-2 text-xs">
                                        {[5, 4, 3, 2, 1].map((starNum) => {
                                            const count = stats.star_counts[starNum] || 0
                                            const pct = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0

                                            return (
                                                <div key={starNum} className="flex items-center space-x-3">
                                                    <span className="w-4 font-bold text-text-secondary text-right">
                                                        {starNum}★
                                                    </span>
                                                    <div className="flex-1 h-2 bg-background rounded-full overflow-hidden border border-border/60">
                                                        <div
                                                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-6 text-text-muted font-semibold text-right">
                                                        {count}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Customer Reviews List */}
                                <div className="space-y-4">
                                    {reviews.length === 0 ? (
                                        <div className="p-8 bg-surface border border-border rounded-2xl text-center text-xs text-text-muted">
                                            No reviews yet. Be the first to purchase and review this item!
                                        </div>
                                    ) : (
                                        reviews.map((rev) => {
                                            const dateStr = rev.created_at
                                                ? new Date(rev.created_at).toLocaleDateString('en-US', {
                                                      month: 'short',
                                                      day: 'numeric',
                                                      year: 'numeric',
                                                  })
                                                : 'Recently'

                                            return (
                                                <div
                                                    key={rev.id}
                                                    className="p-5 bg-surface border border-border rounded-2xl space-y-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2.5">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
                                                                {rev.supporter_name[0]}
                                                            </div>
                                                            <span className="font-extrabold text-text-primary text-sm">
                                                                {rev.supporter_name}
                                                            </span>
                                                            {rev.is_verified && (
                                                                <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                                    <Check className="h-3 w-3" />
                                                                    <span>VERIFIED</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] text-text-muted font-medium">
                                                            {dateStr}
                                                        </span>
                                                    </div>

                                                    <div className="flex space-x-1 text-amber-400">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                className={`h-3.5 w-3.5 ${
                                                                    s <= rev.rating
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'text-border fill-transparent'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>

                                                    {rev.comment && (
                                                        <p className="text-xs text-text-secondary font-medium leading-relaxed">
                                                            {rev.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Sticky Purchase Widget */}
                        <div className="lg:col-span-5 sticky top-24 space-y-6">
                            <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                                {/* Price Header */}
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">
                                        PRICE
                                    </span>
                                    {isFree ? (
                                        <div className="text-4xl font-black text-emerald-500">FREE</div>
                                    ) : hasActiveOffer ? (
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-4xl font-black text-primary">
                                                ৳{discountPriceBdtVal?.toLocaleString()}
                                            </span>
                                            <span className="text-lg text-text-muted line-through font-semibold">
                                                ৳{priceBdtVal.toLocaleString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-4xl font-black text-text-primary">
                                            ৳{priceBdtVal.toLocaleString()}
                                        </div>
                                    )}
                                </div>

                                {/* Social Proof Badge */}
                                {buyersCount > 0 && (
                                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center space-x-2">
                                        <Flame className="h-4 w-4 text-amber-500 fill-current animate-bounce" />
                                        <span>{buyersCount} PEOPLE BOUGHT THIS RECENTLY</span>
                                    </div>
                                )}

                                {/* Purchase Form */}
                                <form onSubmit={handlePurchase} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-text-secondary">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="name@example.com"
                                            value={supporterEmail}
                                            onChange={(e) => setSupporterEmail(e.target.value)}
                                            className="mt-1.5 w-full px-4 py-3 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold text-text-secondary">
                                            Name <span className="text-text-muted font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            value={supporterName}
                                            onChange={(e) => setSupporterName(e.target.value)}
                                            className="mt-1.5 w-full px-4 py-3 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary font-medium"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={agreedTerms}
                                            onChange={(e) => setAgreedTerms(e.target.checked)}
                                            className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                        />
                                        <label htmlFor="terms" className="text-[11px] text-text-muted font-medium cursor-pointer">
                                            I agree to the <strong className="text-text-secondary">Terms, Privacy & Refund Policy</strong>.
                                        </label>
                                    </div>

                                    {purchaseError && (
                                        <p className="text-xs text-error font-medium">{purchaseError}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={purchasing}
                                        className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-black text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                                    >
                                        <span>{purchasing ? 'Processing...' : isFree ? 'Get it for free' : `Pay ৳${(discountPriceBdtVal || priceBdtVal).toLocaleString()}`}</span>
                                    </button>
                                </form>


                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Public Page Footer */}
            <PublicFooter />
        </div>
    )
}
