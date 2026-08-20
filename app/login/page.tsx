'use client'

import { useEffect, useState, Suspense } from 'react'
import { useAuth } from '@/lib/useAuth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/app/components/ui/input'
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react'

function LoginForm() {
    const searchParams = useSearchParams()
    const isExpired = searchParams.get('expired') === '1'

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<any>([])
    const [status, setStatus] = useState<string | null>(null)

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault()
        login({
            email,
            password,
            setErrors,
            setStatus,
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-4xl w-full bg-surface border border-border rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
                
                {/* Left Brand Feature Banner (Desktop) */}
                <div className="md:col-span-5 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background Subtle Glowing Circles */}
                    <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <Link href="/" className="inline-flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-2xl bg-white text-primary-600 flex items-center justify-center font-black text-xl shadow-lg">
                                T
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-white">
                                Tips<span className="text-accent font-black">Kite</span>
                            </span>
                        </Link>

                        <div className="space-y-3 pt-4">
                            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                                Welcome back to your creator hub.
                            </h2>
                            <p className="text-sm text-white/80 font-medium leading-relaxed">
                                Manage your tips, payouts, digital shop, and courses in one central dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="relative z-10 space-y-3 my-8 border-t border-white/15 pt-6">
                        <div className="flex items-start space-x-3 text-xs font-semibold text-white/90">
                            <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>Track real-time earnings & analytics</span>
                        </div>
                        <div className="flex items-start space-x-3 text-xs font-semibold text-white/90">
                            <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>Manage digital products & 1-on-1 bookings</span>
                        </div>
                    </div>

                    {/* Footer Badge */}
                    <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-white/90">
                        <p className="italic">"Empowering creators across Bangladesh to thrive."</p>
                    </div>
                </div>

                {/* Right Login Form Column */}
                <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6 bg-surface">
                    
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                            Sign in to your account
                        </h1>
                        <p className="text-xs sm:text-sm text-text-muted font-medium">
                            Don't have a creator page yet?{' '}
                            <Link href="/signup" className="font-bold text-primary-600 hover:text-primary-700 transition-colors underline decoration-primary-200 underline-offset-2">
                                Start for free
                            </Link>
                        </p>
                    </div>

                    {isExpired && (
                        <div className="p-4 bg-warning-50 border border-warning-200 text-warning-800 text-xs font-semibold rounded-2xl text-center shadow-xs">
                            Your session has expired due to inactivity. Please sign in again.
                        </div>
                    )}

                    {status && (
                        <div className="p-3.5 rounded-2xl bg-success-50 border border-success-200 text-success-700 text-xs font-bold text-center">
                            {status}
                        </div>
                    )}

                    {errors.general && (
                        <div className="p-3.5 rounded-2xl bg-error-50 border border-error-200 text-error-700 text-xs font-semibold leading-relaxed">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={submitForm} className="space-y-4">
                        <div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email Address"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail className="h-4 w-4" />}
                                error={errors.email?.[0]}
                            />
                        </div>

                        <div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock className="h-4 w-4" />}
                                error={errors.password?.[0]}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full py-3.5 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                            >
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-text-muted">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
