import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            const currentPath = window.location.pathname
            if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/onboarding')) {
                window.location.href = '/login?expired=1'
            }
        }
        return Promise.reject(error)
    }
)

export default axios
