import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PublicSupportTabs from '@/components/payments/PublicSupportTabs'
import PublicContentWall from '@/components/posts/PublicContentWall'
import PublicShopSection from '@/components/shop/PublicShopSection'
import PublicFooter from '@/components/layout/PublicFooter'
import ShareModalButton from './ShareButton'
import { Coffee, Heart, User, Globe, Sparkles, Info } from 'lucide-react'

// Custom SVG Icons for Social Links
const FacebookIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
)

const InstagramIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
)

const YoutubeIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
)

const TiktokIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.81.9-5.61 3.08-7.3 1.34-1.04 3.03-1.57 4.72-1.47v4.06c-.85-.09-1.74.1-2.48.55-1.03.6-1.66 1.74-1.61 2.93.02 1.08.57 2.1 1.47 2.69.96.65 2.23.77 3.29.32 1.02-.41 1.77-1.37 1.93-2.47.07-.63.04-1.28.04-1.92V.02z"/>
    </svg>
)

const TwitterIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
)

const WebsiteIcon = () => (
    <Globe className="w-4 h-4" />
)

const socialIconMap: Record<string, { label: string; icon: React.ComponentType }> = {
    facebook: { label: 'Facebook', icon: FacebookIcon },
    instagram: { label: 'Instagram', icon: InstagramIcon },
    youtube: { label: 'YouTube', icon: YoutubeIcon },
    tiktok: { label: 'TikTok', icon: TiktokIcon },
    twitter: { label: 'Twitter', icon: TwitterIcon },
    website: { label: 'Website', icon: WebsiteIcon },
}

async function getCreatorData(slug: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    try {
        const res = await fetch(`${baseUrl}/api/v1/creators/${slug}`, {
            next: { revalidate: 10 },
        })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const data = await getCreatorData(slug)
    if (!data) return { title: 'Creator Not Found' }

    return {
        title: `${data.profile.display_name} (@${data.profile.slug})`,
        description: data.profile.bio || `Support ${data.profile.display_name} on TipsKite`,
    }
}

export default async function PublicCreatorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const data = await getCreatorData(slug)

    if (!data) {
        notFound()
    }

    const { profile, stats, recent_supporters } = data
    const socialLinks = profile.social_links && typeof profile.social_links === 'object' ? profile.social_links : {}

    const activeSocialLinks = Object.entries(socialLinks).filter(
        ([key, val]) => typeof val === 'string' && val.trim().length > 0 && socialIconMap[key]
    )

    return (
        <div suppressHydrationWarning className="min-h-screen flex flex-col justify-between bg-background font-sans">
            {/* Cover Image Header */}
            <div suppressHydrationWarning className="h-52 md:h-72 w-full bg-gradient-to-r from-primary-500 to-purple-600 relative">
                {profile.cover_image_url && (
                    <img
                        src={profile.cover_image_url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Profile Content Container - Expanded Width (max-w-6xl) */}
            <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 relative z-10 space-y-8">
                {/* User Information Top Card with Tab Bar on the Right */}
                <div suppressHydrationWarning className="bg-surface rounded-3xl shadow-md border border-border p-6 md:p-8">
                    <div suppressHydrationWarning className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Side: User Profile Info, Avatar, Integrated About Bio, Goals, Social Icons at Bottom */}
                        <div suppressHydrationWarning className="lg:col-span-7 space-y-6">
                            <div suppressHydrationWarning className="flex items-end space-x-4">
                                <div suppressHydrationWarning className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-primary-100 border-4 border-surface shadow-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="h-12 w-12 text-primary-500" />
                                    )}
                                </div>
                                <div suppressHydrationWarning className="pb-1">
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">{profile.display_name}</h1>
                                    <p className="text-sm font-bold text-primary-600">@{profile.slug}</p>
                                </div>
                            </div>

                            {/* About / Bio Section inside Main Top Card */}
                            <div suppressHydrationWarning className="space-y-1.5">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">About</h3>
                                <p className="text-text-secondary leading-relaxed text-sm font-medium">
                                    {profile.bio || `Welcome to ${profile.display_name}'s official page! Support my work, buy digital products, or book 1-on-1 services directly here.`}
                                </p>
                            </div>

                            {/* Goal Progress Card */}
                            {profile.goal_title && profile.goal_target_cents > 0 && (() => {
                                const raisedBdt = Math.round((profile.goal_raised_cents || 0) / 100)
                                const targetBdt = Math.round(profile.goal_target_cents / 100)
                                const pct = Math.min(100, Math.round((raisedBdt / targetBdt) * 100))

                                return (
                                    <div suppressHydrationWarning className="bg-background border border-border rounded-2xl p-5 space-y-3">
                                        <div suppressHydrationWarning className="flex items-center justify-between">
                                            <div suppressHydrationWarning className="flex items-center space-x-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                                    Current Goal
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold px-3 py-1 bg-surface border border-border rounded-full text-text-primary">
                                                {pct}%
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold text-text-primary leading-snug">
                                            {profile.goal_title}
                                        </h3>

                                        <div suppressHydrationWarning className="h-3 bg-surface border border-border/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>

                                        <div suppressHydrationWarning className="flex items-center justify-between text-xs font-medium">
                                            <div suppressHydrationWarning>
                                                <span className="font-bold text-text-primary text-sm">৳{raisedBdt.toLocaleString('en-US')}</span>
                                                <span className="text-text-muted ml-1">raised</span>
                                            </div>
                                            <div suppressHydrationWarning className="uppercase tracking-wider text-text-muted font-bold text-[11px]">
                                                TARGET: ৳{targetBdt.toLocaleString('en-US')}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()}

                            {/* Bottom Row: Stats Counter & Social Media Icons at the Bottom of Card */}
                            <div suppressHydrationWarning className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border">
                                <div suppressHydrationWarning className="flex items-center space-x-2 py-2 px-3.5 bg-background rounded-2xl text-xs font-bold text-text-secondary border border-border">
                                    <Heart className="h-4 w-4 text-error-500 fill-current" />
                                    <span className="font-extrabold text-text-primary">{(stats as any)?.supporter_count ?? (recent_supporters as any)?.length ?? 0}</span>
                                    <span>supporters</span>
                                </div>

                                <div suppressHydrationWarning className="flex flex-wrap items-center gap-2">
                                    {activeSocialLinks.length > 0 && (
                                        <div suppressHydrationWarning className="flex items-center gap-1.5 bg-background border border-border p-1.5 rounded-full shadow-xs">
                                            {activeSocialLinks.map(([key, url]) => {
                                                const platform = socialIconMap[key]
                                                const IconComp = platform.icon
                                                return (
                                                    <a
                                                        key={key}
                                                        href={url as string}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={platform.label}
                                                        className="w-8 h-8 rounded-full bg-surface border border-border hover:border-primary-500 hover:text-primary-600 text-text-muted transition-all flex items-center justify-center cursor-pointer shadow-xs hover:scale-105"
                                                    >
                                                        <IconComp />
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    )}

                                    <ShareModalButton slug={profile.slug} creatorName={profile.display_name} />
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Support & Membership Tab Bar Widget */}
                        <div suppressHydrationWarning className="lg:col-span-5 w-full">
                            <div suppressHydrationWarning className="bg-background border border-border rounded-3xl p-5 shadow-xs">
                                <PublicSupportTabs profile={profile} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shop Showcase Section (Below Main Profile Card, Above Tab Bar) */}
                <PublicShopSection slug={profile.slug} creatorName={profile.display_name} />

                {/* Supporter Wall, Services & Posts Feed Section */}
                <div suppressHydrationWarning className="w-full">
                    <PublicContentWall slug={profile.slug} creatorName={profile.display_name} recentSupporters={recent_supporters} />
                </div>
            </div>

            {/* Public Page Footer */}
            <PublicFooter />
        </div>
    )
}
