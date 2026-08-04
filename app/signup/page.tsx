'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import Link from 'next/link'
import { Input } from '@/app/components/ui/input'

export default function Signup() {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/onboarding',
    })

    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState<any>([])

    const submitForm = (event: React.FormEvent) => {
        event.preventDefault()
        register({
            display_name: displayName,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
                        Join TipsKite
                    </h2>
                    <p className="mt-2 text-center text-sm text-text-secondary">
                        Or{' '}
                        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            sign in to your account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submitForm}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="display-name" className="sr-only">Display Name</label>
                            <input
                                id="display-name"
                                name="display_name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-gray-500 text-text-primary rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                placeholder="Display Name"
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                            />
                            {errors.display_name && <p className="text-error-500 text-xs italic">{errors.display_name[0]}</p>}
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
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
                                autoComplete="new-password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="text-error-500 text-xs italic mt-1">{errors.password[0]}</p>}
                        </div>
                        <div>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                required
                                placeholder="Confirm Password"
                                value={passwordConfirmation}
                                onChange={e => setPasswordConfirmation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
