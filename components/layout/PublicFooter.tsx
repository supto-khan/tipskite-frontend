import Link from 'next/link'
import { Sparkles, Heart } from 'lucide-react'

export default function PublicFooter() {
    return (
        <footer suppressHydrationWarning className="mt-20 border-t border-border bg-surface/50 font-sans">
            <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Brand & Mission */}
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-primary text-white font-black flex items-center justify-center text-sm shadow-xs">
                        T
                    </div>
                    <div className="text-xs">
                        <span className="font-extrabold text-text-primary text-sm">
                            Tips<span className="text-primary">Kite</span>
                        </span>
                        <p className="text-text-muted">Empowering creators in Bangladesh to monetize their passion.</p>
                        <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                            A product of{' '}
                            <a
                                href="https://prosolverhq.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-text-primary hover:text-primary transition-colors underline decoration-border underline-offset-2"
                            >
                                ProsolverHQ
                            </a>
                        </p>
                    </div>
                </div>

                {/* Creator CTA & Platform Links */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted font-medium">
                    <Link href="/signup" className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-colors">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Create your TipsKite page free</span>
                    </Link>
                    <span suppressHydrationWarning>© {new Date().getFullYear()} TipsKite</span>
                    <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
                </div>
            </div>
        </footer>
    )
}
