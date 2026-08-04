'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Share2, Copy, Check, X } from 'lucide-react'

interface ShareModalProps {
    slug: string
    creatorName: string
    isOpen: boolean
    onClose: () => void
}

export default function ShareModal({ slug, creatorName, isOpen, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isOpen || !mounted) return null

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/${slug}`
        : `https://tipskite.com/${slug}`

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-surface border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 text-text-primary animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text-primary hover:bg-background rounded-full transition-colors cursor-pointer"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <Share2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-text-primary">Share Page</h3>
                        <p className="text-xs text-text-muted font-medium">Support {creatorName}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 bg-background p-2.5 rounded-2xl border border-border">
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="bg-transparent flex-1 text-xs text-text-secondary focus:outline-none font-mono px-1"
                    />
                    <button
                        onClick={handleCopy}
                        className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs active:scale-[0.97] cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    <a
                        href={`https://twitter.com/intent/tweet?text=Support%20${encodeURIComponent(creatorName)}%20on%20TipsKite!&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 font-bold text-xs rounded-xl text-center transition-colors"
                    >
                        Share to Twitter
                    </a>
                    <a
                        href={`https://api.whatsapp.com/send?text=Support%20${encodeURIComponent(creatorName)}%20on%20TipsKite:%20${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs rounded-xl text-center transition-colors"
                    >
                        Share to WhatsApp
                    </a>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
