'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { getStoredToken } from '@/lib/token'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = getStoredToken()
        if (!token) {
            router.replace('/login')
            return
        }

        axios.get('/api/v1/user')
            .then((res) => {
                const user = res.data
                if (user?.role === 'admin') {
                    setAuthorized(true)
                } else {
                    router.replace('/dashboard')
                }
            })
            .catch(() => {
                router.replace('/login')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [router])

    if (loading || !authorized) {
        return (
            <div suppressHydrationWarning className="min-h-screen bg-background flex items-center justify-center">
                <div suppressHydrationWarning className="flex flex-col items-center space-y-3">
                    <div suppressHydrationWarning className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-text-muted font-bold tracking-wide uppercase">Verifying Super Admin Access...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
