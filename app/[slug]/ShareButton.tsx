'use client'

import { useState } from 'react'
import ShareModal from '@/components/creator/ShareModal'
import { Share2 } from 'lucide-react'

export default function ShareModalButton({ slug, creatorName }: { slug: string; creatorName: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="py-2 px-4 bg-background hover:bg-border text-text-secondary font-semibold text-xs rounded-xl flex items-center space-x-2 transition-all"
            >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
            </button>
            <ShareModal
                slug={slug}
                creatorName={creatorName}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}
