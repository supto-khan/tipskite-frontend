import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from './axios'

export function useAuth({ middleware, redirectIfAuthenticated }: { middleware?: 'auth' | 'guest', redirectIfAuthenticated?: string } = {}) {
    const router = useRouter()

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: any) => {
        await csrf()
        setErrors([])

        axios
            .post('/api/v1/auth/register', props)
            .then(() => router.push(redirectIfAuthenticated || '/onboarding'))
            .catch(error => {
                if (error.response?.status !== 422) throw error
                setErrors(error.response.data.error?.fields || error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }: any) => {
        await csrf()
        setErrors([])
        setStatus(null)

        axios
            .post('/api/v1/auth/login', props)
            .then(() => router.push(redirectIfAuthenticated || '/dashboard'))
            .catch(error => {
                if (error.response?.status !== 422 && error.response?.status !== 401) throw error
                if (error.response?.status === 401) {
                    setErrors({ email: [error.response.data.error.message] })
                } else {
                    setErrors(error.response.data.error?.fields || error.response.data.errors)
                }
            })
    }

    const logout = async () => {
        await axios.post('/api/v1/auth/logout').then(() => router.push('/login'))
    }

    return {
        register,
        login,
        logout,
    }
}
