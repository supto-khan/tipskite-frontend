'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import axios from '@/lib/axios'
import PublicFooter from '@/components/layout/PublicFooter'
import {
    CheckCircle2,
    Download,
    Cloud,
    Video,
    Gift,
    Star,
    Check,
    ArrowLeft
} from 'lucide-react'

function extractErrorMsg(err: any, fallback: string): string {
    if (!err) return fallback
    const data = err.response?.data
    if (typeof data === 'string') return data
    if (typeof data?.message === 'string') return data.message
    if (typeof data?.error === 'string') return data.error
    if (data?.message && typeof data.message === 'object' && typeof data.message.message === 'string') {
        return data.message.message
    }
    if (typeof err.message === 'string') return err.message
    return fallback
}

function PaymentSuccessContent() {
    const searchParams = useSearchParams()
    const tranId = searchParams.get('tran_id')

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Review state
    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [supporterName, setSupporterName] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)
    const [reviewSubmitted, setReviewSubmitted] = useState(false)
    const [reviewError, setReviewError] = useState<string | null>(null)

    const quickTags = [
        'Great product!',
        'Exactly as described',
        'Highly recommend',
        'Amazing quality',
        'Worth every taka',
        'Fast and easy'
    ]

    useEffect(() => {
        if (!tranId) {
            setLoading(false)
            return
        }

        const fetchDetails = async () => {
            try {
                const res = await axios.get(`/api/v1/payments/success-details?tran_id=${tranId}`)
                setData(res.data)
                if (res.data?.transaction?.supporter_name) {
                    setSupporterName(res.data.transaction.supporter_name)
                }
            } catch (err: any) {
                setError(extractErrorMsg(err, 'Failed to load transaction details.'))
            } finally {
                setLoading(false)
            }
        }

        fetchDetails()
    }, [tranId])

    const handleTagClick = (tag: string) => {
        if (comment.includes(tag)) return
        setComment((prev) => (prev ? `${prev} ${tag}` : tag))
    }

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const targetProductId = data?.product?.id || data?.transaction?.metadata?.product_id || data?.transaction?.gateway_payload?.product_id
        if (!targetProductId) return

        setSubmittingReview(true)
        setReviewError(null)

        try {
            await axios.post(`/api/v1/products/${targetProductId}/reviews`, {
                supporter_name: supporterName || data?.transaction?.supporter_name || 'Verified Buyer',
                rating,
                comment,
                transaction_id: data?.transaction?.id || tranId || null,
            })
            setReviewSubmitted(true)
        } catch (err: any) {
            setReviewError(extractErrorMsg(err, 'Failed to submit review.'))
        } finally {
            setSubmittingReview(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-text-primary">
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-text-muted">Loading order confirmation...</span>
                </div>
            </div>
        )
    }

    const deliverable = data?.deliverable
    const product = data?.product
    const creator = data?.creator
    const transaction = data?.transaction

    const creatorName = creator?.display_name || 'Creator'

    return (
        <div suppressHydrationWarning className="min-h-screen flex flex-col justify-between bg-background text-text-primary font-sans">
            {/* Top Navigation */}
            <header className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href={creator?.slug ? `/${creator.slug}` : '/'}
                        className="inline-flex items-center space-x-2 text-xs font-extrabold text-text-secondary hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-background border border-transparent hover:border-border"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Return to {creatorName}</span>
                    </Link>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-text-primary">TipsKite</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            PAYMENT SUCCESS
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Thank You Container */}
            <main className="max-w-xl mx-auto px-4 py-12 w-full space-y-8">
                <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95">
                    {/* Checkmark Icon & Order Complete Title */}
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-text-muted block">
                            ORDER COMPLETE
                        </span>
                        <h1 className="text-3xl font-black text-text-primary">Thank you</h1>
                        <p className="text-xs text-text-secondary font-medium">
                            A receipt has been sent to{' '}
                            <strong className="text-text-primary">
                                {String(transaction?.supporter_email || 'your email')}
                            </strong>.
                        </p>

                        {error && (
                            <div className="p-3 bg-error-500/10 border border-error-500/20 text-error-500 text-xs rounded-xl text-center font-bold">
                                {String(error)}
                            </div>
                        )}
                    </div>

                    {/* Message from Creator & Deliverable Action Box */}
                    {deliverable && (
                        <div className="p-6 bg-background border border-border rounded-2xl space-y-4 shadow-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">
                                MESSAGE FROM {creatorName.toUpperCase()}
                            </span>
                            <p className="text-xs text-text-secondary font-medium leading-relaxed italic">
                                "{deliverable.success_message}"
                            </p>

                            <div className="pt-2">
                                <a
                                    href={deliverable.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full py-4 px-6 rounded-2xl font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer ${
                                        deliverable.type === 'drive'
                                            ? 'bg-sky-500 hover:bg-sky-600 text-white'
                                            : deliverable.type === 'call'
                                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                            : deliverable.type === 'bundle'
                                            ? 'bg-amber-400 hover:bg-amber-500 text-black'
                                            : 'bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black'
                                    }`}
                                >
                                    {deliverable.type === 'drive' ? (
                                        <Cloud className="h-4 w-4" />
                                    ) : deliverable.type === 'call' ? (
                                        <Video className="h-4 w-4" />
                                    ) : deliverable.type === 'bundle' ? (
                                        <Gift className="h-4 w-4" />
                                    ) : (
                                        <Download className="h-4 w-4" />
                                    )}
                                    <span>{deliverable.label || 'Download now'}</span>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Rate Your Purchase Review Form */}
                    {(product || transaction?.type === 'product') && (
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
                                    {/* 5-Star Interactive Selector */}
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

                                    {/* Quick Suggestion Tags */}
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {quickTags.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => handleTagClick(tag)}
                                                className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                                    comment.includes(tag)
                                                        ? 'bg-primary text-white border-primary shadow-xs'
                                                        : 'bg-background hover:bg-elevated-surface text-text-secondary border-border'
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Review Textarea */}
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
                    )}
                </div>
            </main>

            {/* Footer */}
            <PublicFooter />
        </div>
    )
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    )
}
