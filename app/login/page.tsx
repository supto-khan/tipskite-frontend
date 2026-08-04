'use client'

import { useEffect, useState, Suspense } from 'react'
import { useAuth } from '@/lib/useAuth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/app/components/ui/input'

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
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-text-secondary">
                        Or{' '}
                        <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                            start your page for free
                        </Link>
                    </p>
                </div>

                {isExpired && (
                    <div className="p-4 bg-warning-50 border border-warning-200 text-warning-800 text-xs font-semibold rounded-xl text-center shadow-sm">
                        Your session has expired due to inactivity. Please sign in again to continue.
                    </div>
                )}
                {status && <div className="mb-4 font-medium text-sm text-success-600">{status}</div>}
                <form className="mt-8 space-y-6" onSubmit={submitForm}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-gray-500 text-text-primary rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-error-500 text-xs italic">{errors.email[0]}</p>}
                        </div>
                        <div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="text-error-500 text-xs italic mt-1">{errors.password[0]}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
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
