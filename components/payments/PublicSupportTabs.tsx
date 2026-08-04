'use client'

import { useState } from 'react'
import TipModal from './TipModal'
import PublicTiersList from './PublicTiersList'
import { Coffee, Star } from 'lucide-react'

export default function PublicSupportTabs({ profile }: { profile: any }) {
    const [activeTab, setActiveTab] = useState<'tip' | 'membership'>('tip')

    const creatorName = profile.display_name || profile.user?.display_name || 'Creator'
    const slug = profile.slug

    return (
        <div suppressHydrationWarning className="space-y-4 font-sans w-full">
            <div suppressHydrationWarning className="flex bg-border/60 p-1 rounded-2xl">
                <button
                    onClick={() => setActiveTab('tip')}
                    className={`flex-1 py-2.5 px-3 text-xs font-extrabold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        activeTab === 'tip' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                    <Coffee className="h-4 w-4 text-warning-600 text-amber-500" />
                    <span>{profile.button_wording || 'Support'}</span>
                </button>
                <button
                    onClick={() => setActiveTab('membership')}
                    className={`flex-1 py-2.5 px-3 text-xs font-extrabold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        activeTab === 'membership' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                    <Star className="h-4 w-4 text-primary-600 text-primary" />
                    <span>Membership</span>
                </button>
            </div>

            {activeTab === 'tip' && <TipModal profile={profile} />}
            {activeTab === 'membership' && <PublicTiersList slug={slug} />}
        </div>
    )
}
