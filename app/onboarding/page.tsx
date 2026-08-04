'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
    const router = useRouter()
    const [slug, setSlug] = useState('')
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
    const [checking, setChecking] = useState(false)
    const [errors, setErrors] = useState<any>([])

    const checkSlug = async (value: string) => {
        setSlug(value)
        if (value.length < 3) {
            setIsAvailable(null)
            return
        }

        setChecking(true)
        try {
            await axios.get(`/api/v1/slugs/check?value=${value}`)
            setIsAvailable(true)
            setErrors([])
        } catch (error: any) {
            setIsAvailable(false)
            if (error.response?.status === 422) {
                setErrors(error.response.data.error?.fields || error.response.data.errors)
            }
        } finally {
            setChecking(false)
        }
    }

    const submitProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isAvailable) return

        try {
            await axios.patch('/api/v1/creator/profile', { slug })
            router.push('/dashboard')
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.error?.fields || error.response.data.errors)
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-xl shadow-sm border border-border">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-text-primary">
                        Claim your page
                    </h2>
                    <p className="mt-2 text-center text-sm text-text-secondary">
                        Choose a URL for your TipsKite page.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={submitProfile}>
                    <div>
                        <label htmlFor="slug" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                            Choose Your Username
                        </label>
                        <div className="mt-1 relative flex rounded-xl shadow-sm border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 bg-surface">
                            <span className="inline-flex items-center px-4 bg-background text-text-muted font-medium text-sm border-r border-border">
                                tipskite.com/
                            </span>
                            <input
                                type="text"
                                name="slug"
                                id="slug"
                                className="block w-full text-text-primary text-sm font-semibold py-3 px-4 focus:outline-none bg-transparent"
                                placeholder="yourname"
                                value={slug}
                                onChange={(e) => checkSlug(e.target.value)}
                            />
                        </div>
                        {checking && <p className="mt-2 text-sm text-text-muted">Checking availability...</p>}
                        {!checking && isAvailable === true && <p className="mt-2 text-sm text-success-600">This URL is available!</p>}
                        {!checking && isAvailable === false && errors.value && <p className="mt-2 text-sm text-error-600">{errors.value[0]}</p>}
                        {errors.slug && <p className="mt-2 text-sm text-error-600">{errors.slug[0]}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={!isAvailable || checking}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
