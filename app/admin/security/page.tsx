'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    ShieldCheck,
    Lock,
    Key,
    UserX,
    Clock,
    AlertOctagon,
    ChevronLeft,
    ChevronRight,
    Terminal,
    Search,
    FileText
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function SecurityAndAuditPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [meta, setMeta] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    // Emergency Revoke Modal
    const [showRevokeModal, setShowRevokeModal] = useState(false)
    const [reason, setReason] = useState('')
    const [revoking, setRevoking] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`/api/v1/admin/security/audit-logs?page=${page}`)
            setLogs(res.data.data || [])
            setMeta(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [page])

    const handleGlobalRevoke = async (e: React.FormEvent) => {
        e.preventDefault()
        setRevoking(true)
        setSuccessMsg('')

        try {
            await axios.post('/api/v1/admin/security/revoke-global-sessions', { reason })
            setSuccessMsg('Global user tokens and active sessions have been purged.')
            setShowRevokeModal(false)
            setReason('')
            fetchLogs()
        } catch (e) {
            console.error(e)
            alert('Failed to revoke global sessions')
        } finally {
            setRevoking(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="Security & Compliance Audit"
                    subtitle="Immutable admin action audit trail log stream, session security controls, and global token revocation."
                />

                {successMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Security Action Header Controls */}
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                            <Lock className="h-4 w-4 text-rose-600" />
                            <span>Global Session Control</span>
                        </h3>
                        <p className="text-xs text-text-muted">In case of a security breach or incident, forcefully sign out all non-admin platform users.</p>
                    </div>

                    <button
                        onClick={() => setShowRevokeModal(true)}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2"
                    >
                        <UserX className="h-4 w-4" />
                        <span>Revoke All Global User Sessions</span>
                    </button>
                </div>

                {/* Audit Trail Stream Table */}
                <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                    <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                        <Terminal className="h-4 w-4 text-primary-600" />
                        <span>Immutable System Audit Trail</span>
                    </h3>

                    {loading ? (
                        <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading compliance audit logs...</div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-xs text-text-muted">No audit action records found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                        <th className="pb-3">Admin Operator</th>
                                        <th className="pb-3">Action Type</th>
                                        <th className="pb-3">Target Entity</th>
                                        <th className="pb-3">Reason / Justification</th>
                                        <th className="pb-3">IP Address</th>
                                        <th className="pb-3">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-background/50 transition-colors">
                                            <td className="py-3 font-semibold text-text-primary">
                                                {log.admin_user?.email || 'Admin Operator'}
                                            </td>
                                            <td className="py-3">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-50 text-primary-700 font-mono">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="py-3 font-mono text-[11px] text-text-muted">
                                                {log.target_type}: {log.target_id?.substring(0, 10)}
                                            </td>
                                            <td className="py-3 max-w-xs text-text-muted truncate">
                                                {log.reason || '<No reason logged>'}
                                            </td>
                                            <td className="py-3 font-mono text-[11px] text-text-muted">
                                                {log.ip_address || '127.0.0.1'}
                                            </td>
                                            <td className="py-3 font-mono text-text-muted text-[11px]">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                            <span className="text-text-muted">Page {meta.current_page} of {meta.last_page}</span>
                            <div className="flex items-center space-x-2">
                                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 border border-border rounded-xl disabled:opacity-50">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button disabled={page === meta.last_page} onClick={() => setPage(page + 1)} className="p-2 border border-border rounded-xl disabled:opacity-50">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Emergency Revoke Confirmation Modal */}
                {showRevokeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <div className="flex items-center space-x-2 text-rose-600">
                                <AlertOctagon className="h-5 w-5" />
                                <h3 className="text-base font-bold text-text-primary">Confirm Emergency Global Session Revocation</h3>
                            </div>
                            <p className="text-xs text-text-muted">
                                This will instantly revoke all active Sanctum tokens for creators and supporters platform-wide, forcing them to re-authenticate.
                            </p>
                            <form onSubmit={handleGlobalRevoke} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-text-secondary mb-1">Incident Justification Reason</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="State security incident details..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button type="button" onClick={() => setShowRevokeModal(false)} className="px-4 py-2 bg-background text-text-secondary font-semibold rounded-xl">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={revoking} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50">
                                        {revoking ? 'Revoking Sessions...' : 'Confirm Global Revocation'}
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
