'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    Activity,
    Database,
    HardDrive,
    Server,
    Cpu,
    RefreshCw,
    CheckCircle2,
    AlertTriangle,
    Layers,
    Terminal,
    Trash2,
    Shield
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function DevOpsPage() {
    const [health, setHealth] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    // Clear Cache Modal
    const [showCacheModal, setShowCacheModal] = useState(false)
    const [reason, setReason] = useState('')
    const [clearing, setClearing] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const fetchHealth = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/v1/admin/devops/health')
            setHealth(res.data.health)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHealth()
    }, [])

    const handleClearCache = async (e: React.FormEvent) => {
        e.preventDefault()
        setClearing(true)
        setSuccessMsg('')

        try {
            await axios.post('/api/v1/admin/devops/clear-cache', { reason })
            setSuccessMsg('Platform application & configuration cache cleared successfully.')
            setShowCacheModal(false)
            setReason('')
            fetchHealth()
        } catch (e) {
            console.error(e)
            alert('Failed to clear application cache')
        } finally {
            setClearing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-background">
                <AdminSidebar />
                <main className="flex-1 p-8 space-y-4">
                    <div className="text-xs text-text-muted animate-pulse">Checking infrastructure & system health status...</div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="DevOps & System Health"
                    subtitle="Platform infrastructure runtime, database connectivity status, queue worker diagnostics, and cache management."
                />

                {successMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Health Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Database Engine</span>
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Database className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-extrabold text-emerald-600 uppercase">MySQL / MariaDB</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {health?.database_status}
                            </span>
                        </div>
                        <div className="text-[11px] text-text-muted">Port 3306 (Local Workspace)</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>PHP & Framework</span>
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                <Server className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-xl font-extrabold text-text-primary font-mono">
                            PHP {health?.php_version?.substring(0, 5)}
                        </div>
                        <div className="text-[11px] text-text-muted">Laravel v{health?.laravel_version}</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Horizon Queue Workers</span>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Activity className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-xl font-extrabold text-text-primary font-mono">
                            {health?.queue_driver}
                        </div>
                        <div className="text-[11px] text-text-muted">{health?.failed_jobs_count || 0} failed jobs in queue</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
                            <span>Cache Store</span>
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                <HardDrive className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-xl font-extrabold text-text-primary font-mono capitalize">
                            {health?.cache_driver}
                        </div>
                        <div className="text-[11px] text-text-muted">Environment: {health?.environment}</div>
                    </div>
                </div>

                {/* System Maintenance & DevOps Actions */}
                <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                    <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                        <Terminal className="h-4 w-4 text-primary-600" />
                        <span>System Maintenance Operations</span>
                    </h3>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                        <div className="space-y-1">
                            <span className="font-bold text-text-primary text-xs block">Flush Application & Config Cache</span>
                            <span className="text-[11px] text-text-muted block">Runs `artisan cache:clear` and `artisan config:clear` across local environment.</span>
                        </div>

                        <button
                            onClick={() => setShowCacheModal(true)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Purge System Cache</span>
                        </button>
                    </div>
                </div>

                {/* Clear Cache Confirmation Modal */}
                {showCacheModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">Confirm System Cache Purge</h3>
                            <p className="text-xs text-text-muted">
                                Clear all application configuration and key-value cache files.
                            </p>
                            <form onSubmit={handleClearCache} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">Reason for Maintenance Action</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="State maintenance details..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button type="button" onClick={() => setShowCacheModal(false)} className="px-4 py-2 bg-background text-text-secondary font-semibold rounded-xl">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={clearing} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50">
                                        {clearing ? 'Clearing Cache...' : 'Confirm Cache Purge'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
