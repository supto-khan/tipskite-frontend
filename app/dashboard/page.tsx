'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import {
    User as UserIcon,
    Share2,
    Lock,
    CreditCard,
    ShoppingBag,
    FileText,
    ArrowRight,
    ArrowUpRight,
    Heart,
    RotateCcw,
    Check,
    Copy,
    DollarSign
} from 'lucide-react'

export default function DashboardHome() {
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [summary, setSummary] = useState<any>(null)
    const [tiersCount, setTiersCount] = useState(0)
    const [productsCount, setProductsCount] = useState(0)
    const [loading, setLoading] = useState(true)
    
    // Goal state
    const [goalTitle, setGoalTitle] = useState('')
    const [goalAmount, setGoalAmount] = useState('')
    const [currentGoal, setCurrentGoal] = useState<any>(null)
    const [savingGoal, setSavingGoal] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, summaryRes, tiersRes, productsRes] = await Promise.allSettled([
                    axios.get('/api/v1/creator/profile'),
                    axios.get('/api/v1/creator/analytics/summary'),
                    axios.get('/api/v1/creator/tiers'),
                    axios.get('/api/v1/creator/products')
                ])

                if (profileRes.status === 'fulfilled') {
                    const profData = profileRes.value.data?.profile || profileRes.value.data
                    setProfile(profData)
                    if (profData?.goal_title && profData?.goal_target_cents) {
                        setGoalTitle(profData.goal_title)
                        setGoalAmount((profData.goal_target_cents / 100).toString())
                    }
                } else if (profileRes.reason?.response?.status === 404) {
                    router.push('/onboarding')
                    return
                }

                if (summaryRes.status === 'fulfilled') {
                    setSummary(summaryRes.value.data?.summary)
                }

                if (tiersRes.status === 'fulfilled') {
                    const tiers = tiersRes.value.data?.tiers || []
                    setTiersCount(tiers.length)
                }

                if (productsRes.status === 'fulfilled') {
                    const products = productsRes.value.data?.products || []
                    setProductsCount(products.length)
                }
            } catch (e) {
                console.error('Error loading dashboard:', e)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleSaveGoal = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!goalTitle || !goalAmount) return
        setSavingGoal(true)
        try {
            const targetCents = Math.round(parseFloat(goalAmount) * 100)
            const res = await axios.patch('/api/v1/creator/profile', {
                goal_title: goalTitle,
                goal_target_cents: targetCents,
            })
            const updated = res.data.profile || res.data
            setProfile(updated)
        } catch (e) {
            console.error('Failed to save goal:', e)
        } finally {
            setSavingGoal(false)
        }
    }

    const handleResetGoal = async () => {
        setSavingGoal(true)
        try {
            const res = await axios.patch('/api/v1/creator/profile', {
                goal_title: null,
                goal_target_cents: null,
                goal_raised_cents: 0,
            })
            const updated = res.data.profile || res.data
            setProfile(updated)
            setGoalTitle('')
            setGoalAmount('')
        } catch (e) {
            console.error('Failed to reset goal:', e)
        } finally {
            setSavingGoal(false)
        }
    }

    const handleCopyPage = () => {
        const url = `${window.location.origin}/${profile?.slug || 'creator'}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div suppressHydrationWarning className="max-w-5xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                {/* Header Skeleton */}
                <div suppressHydrationWarning className="bg-surface border border-border rounded-3xl p-6 shadow-xs flex items-center justify-between">
                    <div suppressHydrationWarning className="flex items-center space-x-4">
                        <div suppressHydrationWarning className="w-14 h-14 rounded-full bg-border/40" />
                        <div suppressHydrationWarning className="space-y-2">
                            <div suppressHydrationWarning className="h-6 w-40 bg-border/40 rounded-xl" />
                            <div suppressHydrationWarning className="h-4 w-28 bg-border/40 rounded-lg" />
                        </div>
                    </div>
                    <div suppressHydrationWarning className="h-10 w-36 bg-border/40 rounded-full" />
                </div>

                {/* Earnings Stat Cards Skeleton */}
                <div suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} suppressHydrationWarning className="bg-surface border border-border rounded-3xl p-6 space-y-3 shadow-xs">
                            <div suppressHydrationWarning className="h-4 w-28 bg-border/40 rounded-lg" />
                            <div suppressHydrationWarning className="h-8 w-32 bg-border/40 rounded-xl" />
                        </div>
                    ))}
                </div>

                {/* Content Cards Skeleton */}
                <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div suppressHydrationWarning className="bg-surface border border-border rounded-3xl p-6 h-48 bg-border/20" />
                </div>
            </div>
        )
    }

    const username = profile?.user?.display_name || profile?.display_name || 'Creator'
    const slug = profile?.slug || 'yourname'
    const totalEarnings = summary?.gross_cents ? (summary.gross_cents / 100).toFixed(0) : '0'

    return (
        <div className="max-w-5xl mx-auto py-6 space-y-8 font-sans">
            {/* Top User Header Card */}
            <div className="bg-surface border border-border rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-primary-100 border-2 border-primary-500/20 flex items-center justify-center text-primary-600 font-bold overflow-hidden flex-shrink-0">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt={username} className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-7 h-7" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Hi, {username}</h2>
                        <p className="text-xs text-text-muted font-medium">tipskite.com/{slug}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Share Page Button */}
                    <button
                        onClick={handleCopyPage}
                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-surface hover:bg-background text-text-primary border border-border font-semibold text-xs rounded-full shadow-xs transition-all cursor-pointer"
                    >
                        {copied ? <Check className="w-4 h-4 text-success-600" /> : <Share2 className="w-4 h-4" />}
                        <span>{copied ? 'Copied Link!' : 'Share page'}</span>
                    </button>
                </div>
            </div>

            {/* Earnings & Goal Card */}
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-bold text-text-primary">Earnings</h3>
                            <span className="text-[10px] font-extrabold uppercase bg-background text-text-muted px-2 py-0.5 rounded-md border border-border">
                                LOCAL BDT
                            </span>
                        </div>
                        <div className="text-4xl font-extrabold text-text-primary flex items-center space-x-1">
                            <span>৳</span>
                            <span>{totalEarnings}</span>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/settings/payouts"
                        className="px-5 py-2.5 bg-success-600 hover:bg-success-700 text-white font-black text-xs rounded-full shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-102 active:scale-98"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Withdraw Funds</span>
                    </Link>
                </div>

                <hr className="border-border" />

                {/* Goal Section */}
                <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
                        CURRENT GOAL: {profile?.goal_title ? profile.goal_title.toUpperCase() : 'NONE'}
                    </div>

                    <form onSubmit={handleSaveGoal} className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Goal title..."
                            value={goalTitle}
                            onChange={(e) => setGoalTitle(e.target.value)}
                            className="flex-1 px-4 py-3 bg-background border border-border rounded-2xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            className="w-full md:w-36 px-4 py-3 bg-background border border-border rounded-2xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                            type="submit"
                            disabled={savingGoal}
                            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all disabled:opacity-50"
                        >
                            {savingGoal ? 'Saving...' : 'Save'}
                        </button>
                    </form>

                    {profile?.goal_title && (
                        <div className="pt-1 flex justify-start">
                            <button
                                onClick={handleResetGoal}
                                type="button"
                                className="inline-flex items-center space-x-1.5 text-xs text-text-muted hover:text-text-primary font-medium transition-all"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Start Fresh (Reset Progress)</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Supporters Empty State Card */}
            <div className="bg-surface border border-border rounded-3xl p-12 text-center shadow-sm space-y-3 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center text-text-muted">
                    <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-text-primary">No supporters yet</h4>
                <p className="text-xs text-text-muted max-w-sm">Your supporters' activity will appear here.</p>
            </div>

            {/* More Ways to Earn Grid */}
            <div className="space-y-5">
                <h3 className="text-xl font-bold text-text-primary">More ways to earn</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Membership Card */}
                    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-text-primary">Membership</h4>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    {tiersCount > 0
                                        ? `You have ${tiersCount} active membership tier${tiersCount === 1 ? '' : 's'} configured.`
                                        : 'Create monthly membership tiers for your biggest fans and supporters.'}
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/dashboard/memberships"
                            className="w-full py-3 px-4 bg-surface hover:bg-background border border-border text-text-primary rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs"
                        >
                            <span>{tiersCount > 0 ? 'Manage Memberships' : 'Enable Memberships'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Shop Card */}
                    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-text-primary">Shop</h4>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    {productsCount > 0
                                        ? `You have ${productsCount} item${productsCount === 1 ? '' : 's'} listed for sale in your shop.`
                                        : 'Sell digital products, exclusive content, and more.'}
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/dashboard/shop"
                            className="w-full py-3 px-4 bg-surface hover:bg-background border border-border text-text-primary rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs"
                        >
                            <span>{productsCount > 0 ? 'Manage Shop' : 'Enable Shop'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Exclusive Posts Card */}
                    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-text-primary">Exclusive posts</h4>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    Publish your best content exclusively for your supporters.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/dashboard/posts"
                            className="w-full py-3 px-4 bg-surface hover:bg-background border border-border text-text-primary rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs"
                        >
                            <span>Write a post</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Footer links */}
            <div className="pt-8 border-t border-border flex justify-center items-center space-x-8 text-xs font-semibold text-text-muted">
                <Link href="#" className="hover:text-text-primary transition-all">Help Center</Link>
                <Link href="#" className="hover:text-text-primary transition-all">FAQ</Link>
                <Link href="#" className="hover:text-text-primary transition-all">Contact</Link>
            </div>
        </div>
    )
}

