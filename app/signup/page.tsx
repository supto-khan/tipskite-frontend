'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import Link from 'next/link'
import { Input } from '@/app/components/ui/input'
import { User, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Heart, Zap, CheckCircle2 } from 'lucide-react'

export default function Signup() {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/onboarding',
    })

    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState<any>({})
    const [loading, setLoading] = useState(false)

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            await register({
                display_name: displayName,
                email,
                password,
                password_confirmation: passwordConfirmation,
                setErrors,
            })
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
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
                                Launch your creator page in minutes.
                            </h2>
                            <p className="text-sm text-white/80 font-medium leading-relaxed">
                                Join Bangladesh's premier platform to accept tips, sell digital products, and host online courses effortlessly.
                            </p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="relative z-10 space-y-3 my-8 border-t border-white/15 pt-6">
                        <div className="flex items-start space-x-3 text-xs font-semibold text-white/90">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>Instant bKash, Nagad & Rocket payouts</span>
                        </div>
                        <div className="flex items-start space-x-3 text-xs font-semibold text-white/90">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>Sell courses, presets, templates & 1-on-1 calls</span>
                        </div>
                        <div className="flex items-start space-x-3 text-xs font-semibold text-white/90">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>0% monthly fee to get started</span>
                        </div>
                    </div>

                    {/* Footer Testimonial Snippet */}
                    <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-white/90">
                        <p className="italic">"TipsKite made it seamless to monetize my YouTube channel in Bangladesh!"</p>
                    </div>
                </div>

                {/* Right Signup Form Column */}
                <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6 bg-surface">
                    
                    <div className="space-y-2">
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-bold border border-primary-200">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>100% Free Signup</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-xs sm:text-sm text-text-muted font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors underline decoration-primary-200 underline-offset-2">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    {/* Global Error Notice if any */}
                    {errors.general && (
                        <div className="p-3.5 rounded-2xl bg-error-50 border border-error-200 text-error-700 text-xs font-semibold leading-relaxed">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={submitForm} className="space-y-4">
                        {/* Display Name */}
                        <div>
                            <Input
                                id="display_name"
                                name="display_name"
                                type="text"
                                label="Display Name / Creator Handle"
                                placeholder="e.g. Tanvir Ahmed"
                                required
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                leftIcon={<User className="h-4 w-4" />}
                                error={errors.display_name?.[0]}
                            />
                        </div>

                        {/* Email Address */}
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

                        {/* Password */}
                        <div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock className="h-4 w-4" />}
                                error={errors.password?.[0]}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                label="Confirm Password"
                                placeholder="Re-enter password"
                                autoComplete="new-password"
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                leftIcon={<ShieldCheck className="h-4 w-4" />}
                                error={errors.password_confirmation?.[0]}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                            >
                                <span>{loading ? 'Creating Page...' : 'Get Started Free'}</span>
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </form>

                    <p className="text-[11px] text-text-muted text-center leading-relaxed">
                        By registering, you agree to TipsKite’s{' '}
                        <Link href="/terms" className="underline hover:text-text-primary transition-colors">Terms of Service</Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="underline hover:text-text-primary transition-colors">Privacy Policy</Link>.
                    </p>

                </div>
            </div>
        </div>
    )
}

