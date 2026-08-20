'use client'

import { useState } from 'react'
import TipModal from './TipModal'
import PublicTiersList from './PublicTiersList'
import { Coffee, Star } from 'lucide-react'

export default function PublicSupportTabs({ profile }: { profile: any }) {
    // Membership tab temporarily on hold: render TipModal directly
    return (
        <div suppressHydrationWarning className="space-y-4 font-sans w-full">
            <TipModal profile={profile} />
        </div>
    )
}
