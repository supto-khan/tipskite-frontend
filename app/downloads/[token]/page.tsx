'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from '@/lib/axios'
import { Download, CheckCircle, AlertCircle, FileText } from 'lucide-react'

export default function DownloadPage() {
    const params = useParams()
    const token = params?.token as string

    const [data, setData] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) return

        axios.get(`/api/v1/downloads/${token}`)
            .then((res) => setData(res.data))
            .catch((err) => setError(err.response?.data?.error || 'Failed to verify download token'))
            .finally(() => setLoading(false))
    }, [token])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-text-muted text-sm">Verifying your digital download link...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-surface rounded-3xl p-8 max-w-md w-full border border-border shadow-sm text-center space-y-4">
                    <div className="p-4 bg-error-50 text-error-600 rounded-full w-fit mx-auto">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h2 className="text-lg font-bold text-text-primary">Download Unavailable</h2>
                    <p className="text-xs text-text-muted">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl p-8 max-w-md w-full border border-border shadow-md text-center space-y-6">
                <div className="p-4 bg-success-50 text-success-600 rounded-full w-fit mx-auto">
                    <CheckCircle className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-xl font-bold text-text-primary">{data?.product?.title}</h1>
                    <p className="text-xs text-text-muted">{data?.product?.description || 'Your purchase has been verified!'}</p>
                </div>

                <div className="bg-background rounded-2xl p-4 space-y-1 text-xs text-text-secondary">
                    <div className="flex justify-between">
                        <span>Downloads Used</span>
                        <span className="font-bold text-text-primary">{data?.download?.count} / {data?.download?.limit}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Remaining Downloads</span>
                        <span className="font-bold text-primary-600">{data?.download?.remaining}</span>
                    </div>
                </div>

                <a
                    href={data?.download?.download_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all inline-flex"
                >
                    <Download className="h-4 w-4" />
                    <span>Download File ({data?.download?.file_name})</span>
                </a>
            </div>
        </div>
    )
}
