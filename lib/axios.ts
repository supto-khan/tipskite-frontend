import Axios from 'axios'
import { getStoredToken, removeToken } from './token'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
})

// Restore Bearer token from localStorage on every page load
const token = getStoredToken()
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            const currentPath = window.location.pathname
            if (
                currentPath.startsWith('/dashboard') ||
                currentPath.startsWith('/onboarding') ||
                currentPath.startsWith('/admin')
            ) {
                removeToken()
                delete axios.defaults.headers.common['Authorization']
                window.location.href = '/login?expired=1'
            }
        }
        return Promise.reject(error)
    }
)

export default axios
