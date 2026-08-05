import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from './axios'
import { storeToken, removeToken, getStoredToken } from './token'

export function useAuth({ middleware, redirectIfAuthenticated }: { middleware?: 'auth' | 'guest', redirectIfAuthenticated?: string } = {}) {
    const router = useRouter()

    useEffect(() => {
        const token = getStoredToken()

        if (middleware === 'guest' && token) {
            axios.get('/api/v1/user')
                .then(res => {
                    const user = res.data
                    const target = redirectIfAuthenticated || (user?.creator_profile ? '/dashboard' : '/onboarding')
                    router.push(target)
                })
                .catch(() => {
                    removeToken()
                    delete axios.defaults.headers.common['Authorization']
                })
        }

        if (middleware === 'auth' && !token) {
            router.push('/login')
        }
    }, [middleware, redirectIfAuthenticated, router])

    const register = async ({ setErrors, ...props }: any) => {
        setErrors([])

        axios
            .post('/api/v1/auth/register', props)
            .then(res => {
                if (res.data?.token) {
                    storeToken(res.data.token)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
                }
                const user = res.data?.user
                const target = redirectIfAuthenticated || (user?.creator_profile ? '/dashboard' : '/onboarding')
                router.push(target)
            })
            .catch(error => {
                if (error.response?.status !== 422) throw error
                setErrors(error.response.data.error?.fields || error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }: any) => {
        setErrors([])
        setStatus(null)

        axios
            .post('/api/v1/auth/login', props)
            .then(res => {
                if (res.data?.token) {
                    storeToken(res.data.token)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
                }
                const user = res.data?.user
                const target = redirectIfAuthenticated || (user?.creator_profile ? '/dashboard' : '/onboarding')
                router.push(target)
            })
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
        await axios.post('/api/v1/auth/logout').finally(() => {
            removeToken()
            delete axios.defaults.headers.common['Authorization']
            router.push('/login')
        })
    }

    return {
        register,
        login,
        logout,
    }
}
