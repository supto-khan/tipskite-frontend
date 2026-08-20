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

const LinkedInIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
)

const GithubIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
)

const RedditIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.18 1.207.49 1.207-.869 2.85-1.43 4.674-1.5l.93-4.364 3.32.698a1.25 1.25 0 0 1 1.1 1.174z"/>
    </svg>
)

const WebsiteIcon = () => (
    <Globe className="w-4 h-4" />
)

const socialIconMap: Record<string, { label: string; icon: React.ComponentType; hoverClass: string }> = {
    facebook: {
        label: 'Facebook',
        icon: FacebookIcon,
        hoverClass: 'hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10',
    },
    instagram: {
        label: 'Instagram',
        icon: InstagramIcon,
        hoverClass: 'hover:border-[#E4405F] hover:text-[#E4405F] hover:bg-[#E4405F]/10',
    },
    youtube: {
        label: 'YouTube',
        icon: YoutubeIcon,
        hoverClass: 'hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-[#FF0000]/10',
    },
    tiktok: {
        label: 'TikTok',
        icon: TiktokIcon,
        hoverClass: 'hover:border-[#EE1D52] hover:text-[#EE1D52] hover:bg-[#EE1D52]/10 dark:hover:border-[#69C9D0] dark:hover:text-[#69C9D0] dark:hover:bg-[#69C9D0]/10',
    },
    twitter: {
        label: 'X (Twitter)',
        icon: TwitterIcon,
        hoverClass: 'hover:border-[#1DA1F2] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10',
    },
    linkedin: {
        label: 'LinkedIn',
        icon: LinkedInIcon,
        hoverClass: 'hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-[#0A66C2]/10',
    },
    github: {
        label: 'GitHub',
        icon: GithubIcon,
        hoverClass: 'hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10',
    },
    reddit: {
        label: 'Reddit',
        icon: RedditIcon,
        hoverClass: 'hover:border-[#FF4500] hover:text-[#FF4500] hover:bg-[#FF4500]/10',
    },
    website: {
        label: 'Website',
        icon: WebsiteIcon,
        hoverClass: 'hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50',
    },
}

async function getCreatorData(slug: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
    try {
        const res = await fetch(`${baseUrl}/api/v1/creators/${slug}`, {
            cache: 'no-store',
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
    let socialLinks: Record<string, any> = {}
    if (profile.social_links) {
        if (typeof profile.social_links === 'object') {
            socialLinks = profile.social_links
        } else if (typeof profile.social_links === 'string') {
            try {
                socialLinks = JSON.parse(profile.social_links)
            } catch (e) {
                socialLinks = {}
            }
        }
    }

    const activeSocialLinks = Object.entries(socialLinks).filter(
        ([key, val]) => typeof val === 'string' && val.trim().length > 0 && socialIconMap[key]
    )

    const directionToCSS = (dir?: string) => {
        switch (dir) {
            case 'to-r': return 'to right'
            case 'to-l': return 'to left'
            case 'to-b': return 'to bottom'
            case 'to-t': return 'to top'
            case 'to-br': return 'to bottom right'
            case 'to-tr': return 'to top right'
            case 'to-bl': return 'to bottom left'
            case 'to-tl': return 'to top left'
            default: return 'to right'
        }
    }

    const getHeaderBackgroundStyle = (): React.CSSProperties => {
        const type = profile.header_bg_type || (profile.cover_image_url ? 'image' : 'gradient')

        if (type === 'image' && profile.cover_image_url) {
            return {}
        }

        if (type === 'color' && profile.header_color) {
            return { backgroundColor: profile.header_color }
        }

        const from = profile.header_gradient_from || '#6366f1'
        const to = profile.header_gradient_to || '#9333ea'
        const dir = directionToCSS(profile.header_gradient_direction)
        return {
            background: `linear-gradient(${dir}, ${from}, ${to})`,
        }
    }

    return (
        <div suppressHydrationWarning className="min-h-screen flex flex-col justify-between bg-background font-sans">
            {/* Cover Image / Color / Gradient Header */}
            <div
                suppressHydrationWarning
                style={getHeaderBackgroundStyle()}
                className="h-52 md:h-72 w-full bg-gradient-to-r from-primary-500 to-purple-600 relative overflow-hidden"
            >
                {(profile.header_bg_type === 'image' || !profile.header_bg_type) && profile.cover_image_url && (
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
                                                        className={`w-8 h-8 rounded-full bg-surface border border-border text-text-muted transition-all flex items-center justify-center cursor-pointer shadow-xs hover:scale-110 ${platform.hoverClass}`}
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
