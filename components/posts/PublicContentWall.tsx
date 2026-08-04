'use client'

import { useState } from 'react'
import PublicPostsFeed from './PublicPostsFeed'
import PublicServicesTab from '@/components/services/PublicServicesTab'
import { Coffee, FileText, Briefcase } from 'lucide-react'

interface PublicContentWallProps {
    slug: string
    creatorName: string
    recentSupporters: any[]
}

export default function PublicContentWall({
    slug,
    creatorName,
    recentSupporters,
}: PublicContentWallProps) {
    const [tab, setTab] = useState<'supporters' | 'services' | 'posts'>('supporters')

    return (
        <div suppressHydrationWarning className="space-y-6 font-sans">
            {/* Parent Navigation Tabs Row */}
            <div suppressHydrationWarning className="flex space-x-2 border-b border-border pb-2 overflow-x-auto custom-scrollbar">
                <button
                    onClick={() => setTab('supporters')}
                    className={`py-2.5 px-4 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 cursor-pointer ${
                        tab === 'supporters'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface text-text-secondary hover:bg-elevated-surface border border-border'
                    }`}
                >
                    <Coffee className="h-4 w-4" />
                    <span>Supporters ({recentSupporters.length})</span>
                </button>

                <button
                    onClick={() => setTab('services')}
                    className={`py-2.5 px-4 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 cursor-pointer ${
                        tab === 'services'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface text-text-secondary hover:bg-elevated-surface border border-border'
                    }`}
                >
                    <Briefcase className="h-4 w-4" />
                    <span>Services</span>
                </button>

                <button
                    onClick={() => setTab('posts')}
                    className={`py-2.5 px-4 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 cursor-pointer ${
                        tab === 'posts'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface text-text-secondary hover:bg-elevated-surface border border-border'
                    }`}
                >
                    <FileText className="h-4 w-4" />
                    <span>Posts</span>
                </button>
            </div>

            {/* Tab Contents */}
            {tab === 'supporters' && (
                <div suppressHydrationWarning className="bg-surface rounded-3xl shadow-xs border border-border p-6 sm:p-8 space-y-6">
                    <h2 className="text-lg font-bold text-text-primary flex items-center space-x-2">
                        <Coffee className="h-5 w-5 text-primary" />
                        <span>Recent Activity & Supporters</span>
                    </h2>

                    <div suppressHydrationWarning className="space-y-4">
                        {recentSupporters.length === 0 ? (
                            <div suppressHydrationWarning className="text-center py-12 text-sm text-text-muted bg-background rounded-2xl border border-border">
                                Be the first to buy {creatorName} a coffee or product!
                            </div>
                        ) : (
                            recentSupporters.map((item: any) => {
                                const isFreeText = item.price_text === 'FREE'

                                return (
                                    <div
                                        key={item.id}
                                        suppressHydrationWarning
                                        className="p-5 bg-background rounded-2xl space-y-3 border border-border/80 transition-all hover:border-border"
                                    >
                                        {/* Header Row: Name + Action + Badge + Price */}
                                        <div suppressHydrationWarning className="flex items-center justify-between">
                                            <div suppressHydrationWarning className="flex items-center space-x-2 flex-wrap gap-y-1">
                                                <span className="font-extrabold text-text-primary text-sm">
                                                    {item.display_name}
                                                </span>
                                                {!item.type_badge && item.quantity && (
                                                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary">
                                                        {item.quantity} {item.quantity === 1 ? 'coffee' : 'coffees'}
                                                    </span>
                                                )}
                                            </div>

                                            {item.price_text && (
                                                <span
                                                    className={`text-xs font-black tracking-tight ${
                                                        isFreeText ? 'text-emerald-500 font-extrabold' : 'text-text-muted'
                                                    }`}
                                                >
                                                    {item.price_text}
                                                </span>
                                            )}
                                        </div>

                                        {/* Quote Box for Purchased Item Title or User Comment */}
                                        {item.body && (
                                            <div suppressHydrationWarning className="p-3.5 bg-surface border border-border/70 rounded-2xl text-xs text-text-secondary font-medium leading-relaxed">
                                                {item.body}
                                            </div>
                                        )}

                                        {/* Creator Reply */}
                                        {item.creator_reply && (
                                            <div suppressHydrationWarning className="mt-2 pl-3 border-l-2 border-primary text-xs text-text-secondary">
                                                <span className="font-bold text-primary">{creatorName}: </span>
                                                {item.creator_reply}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}

            {tab === 'posts' && <PublicPostsFeed slug={slug} creatorName={creatorName} />}

            {tab === 'services' && <PublicServicesTab slug={slug} />}
        </div>
    )
}
