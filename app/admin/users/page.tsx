'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    Users,
    Search,
    Shield,
    UserCheck,
    UserX,
    KeyRound,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    ShieldAlert,
    CheckCircle2,
    Clock,
    X,
    AlertCircle
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([])
    const [meta, setMeta] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Filters & Search
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)

    // Selected user for details slide-over / actions
    const [selectedUser, setSelectedUser] = useState<any | null>(null)
    const [userDetailData, setUserDetailData] = useState<any | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)

    // Modal state for action confirmation
    const [actionModal, setActionModal] = useState<{
        type: 'status' | 'role' | 'revoke'
        title: string
        user: any
    } | null>(null)
    const [newStatus, setNewStatus] = useState('')
    const [newRole, setNewRole] = useState('')
    const [actionReason, setActionReason] = useState('')
    const [submittingAction, setSubmittingAction] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.append('search', search)
            if (roleFilter) params.append('role', roleFilter)
            if (statusFilter) params.append('status', statusFilter)
            params.append('page', page.toString())

            const res = await axios.get(`/api/v1/admin/users?${params.toString()}`)
            setUsers(res.data.data || [])
            setMeta(res.data)
        } catch (e) {
            console.error('Failed to fetch users:', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page, roleFilter, statusFilter])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchUsers()
    }

    const openUserDetail = async (user: any) => {
        setSelectedUser(user)
        setLoadingDetail(true)
        try {
            const res = await axios.get(`/api/v1/admin/users/${user.id}`)
            setUserDetailData(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingDetail(false)
        }
    }

    const handleActionSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!actionModal) return

        setSubmittingAction(true)
        try {
            if (actionModal.type === 'status') {
                await axios.patch(`/api/v1/admin/users/${actionModal.user.id}/status`, {
                    account_status: newStatus,
                    reason: actionReason,
                })
            } else if (actionModal.type === 'role') {
                await axios.patch(`/api/v1/admin/users/${actionModal.user.id}/role`, {
                    role: newRole,
                    reason: actionReason,
                })
            } else if (actionModal.type === 'revoke') {
                await axios.post(`/api/v1/admin/users/${actionModal.user.id}/revoke-tokens`)
            }

            setActionModal(null)
            setActionReason('')
            fetchUsers()
            if (selectedUser) {
                openUserDetail(selectedUser)
            }
        } catch (e) {
            console.error(e)
            alert('Failed to complete administrative action')
        } finally {
            setSubmittingAction(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="User Management"
                    subtitle="Platform accounts, user roles, security statuses, and administrative actions."
                />

                {/* Filters and Search Bar */}
                <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background focus:ring-primary-500 focus:border-primary-500 text-text-primary"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-3.5 w-3.5 text-text-muted" />
                            <span className="text-xs font-semibold text-text-muted">Filters:</span>
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value)
                                setPage(1)
                            }}
                            className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                        >
                            <option value="">All Roles</option>
                            <option value="creator">Creator</option>
                            <option value="supporter">Supporter</option>
                            <option value="admin">Admin</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value)
                                setPage(1)
                            }}
                            className="px-3 py-2 border border-border rounded-xl text-xs bg-background text-text-primary font-semibold"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="restricted">Restricted</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-xs text-text-muted animate-pulse">Loading platform users...</div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12 text-xs text-text-muted">No users matched your criteria.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                        <th className="pb-3">User</th>
                                        <th className="pb-3">Role</th>
                                        <th className="pb-3">Account Status</th>
                                        <th className="pb-3">Joined</th>
                                        <th className="pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40 text-xs text-text-secondary">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-background/50 transition-colors">
                                            <td className="py-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                                                        {u.display_name?.substring(0, 2).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-text-primary block">{u.display_name}</span>
                                                        <span className="text-[11px] text-text-muted font-mono">{u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    u.role === 'admin'
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                        : u.role === 'creator'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                                    u.account_status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : u.account_status === 'restricted'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                    {u.account_status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                                                    <span className="capitalize">{u.account_status}</span>
                                                </span>
                                            </td>
                                            <td className="py-3 font-mono text-text-muted text-[11px]">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => openUserDetail(u)}
                                                        className="p-1.5 hover:bg-background rounded-lg text-text-muted hover:text-text-primary transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setActionModal({
                                                                type: 'status',
                                                                title: `Change Account Status for ${u.display_name}`,
                                                                user: u,
                                                            })
                                                            setNewStatus(u.account_status)
                                                        }}
                                                        className="p-1.5 hover:bg-background rounded-lg text-text-muted hover:text-amber-600 transition-colors"
                                                        title="Modify Status"
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setActionModal({
                                                                type: 'role',
                                                                title: `Change Role for ${u.display_name}`,
                                                                user: u,
                                                            })
                                                            setNewRole(u.role)
                                                        }}
                                                        className="p-1.5 hover:bg-background rounded-lg text-text-muted hover:text-purple-600 transition-colors"
                                                        title="Change Role"
                                                    >
                                                        <UserCheck className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Bar */}
                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                            <span className="text-text-muted">
                                Showing page {meta.current_page} of {meta.last_page} ({meta.total} total users)
                            </span>
                            <div className="flex items-center space-x-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="p-2 border border-border rounded-xl hover:bg-background disabled:opacity-50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    disabled={page === meta.last_page}
                                    onClick={() => setPage(page + 1)}
                                    className="p-2 border border-border rounded-xl hover:bg-background disabled:opacity-50"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Detail Slide-over Panel */}
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
                        <div className="bg-surface w-full max-w-md h-full border-l border-border shadow-2xl p-6 overflow-y-auto space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-border">
                                <h3 className="font-bold text-base text-text-primary">User Profile Overview</h3>
                                <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-background rounded-lg text-text-muted">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {loadingDetail ? (
                                <div className="py-12 text-center text-xs text-text-muted animate-pulse">Loading detailed metrics...</div>
                            ) : (
                                <div className="space-y-6 text-xs">
                                    {/* User Summary Header */}
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                                            {selectedUser.display_name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-sm text-text-primary">{selectedUser.display_name}</h4>
                                            <p className="text-text-muted font-mono">{selectedUser.email}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-50 text-primary-700">
                                                    Role: {selectedUser.role}
                                                </span>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                                    Status: {selectedUser.account_status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Metrics Cards */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-background rounded-xl border border-border">
                                            <span className="text-[11px] text-text-muted font-semibold block">Total Transactions</span>
                                            <span className="text-base font-extrabold text-text-primary mt-1 block">
                                                {userDetailData?.stats?.transaction_count || 0}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-background rounded-xl border border-border">
                                            <span className="text-[11px] text-text-muted font-semibold block">Total Support Spent</span>
                                            <span className="text-base font-extrabold text-emerald-600 mt-1 block">
                                                BDT {((userDetailData?.stats?.total_spent_cents || 0) / 100).toFixed(0)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Creator Profile Link if exists */}
                                    {selectedUser.creator_profile && (
                                        <div className="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-200">
                                            <span className="font-bold block">Creator Profile Linked</span>
                                            <span className="text-[11px] font-mono block">Slug: /{selectedUser.creator_profile.slug}</span>
                                        </div>
                                    )}

                                    {/* Quick Admin Actions */}
                                    <div className="space-y-2 pt-2 border-t border-border">
                                        <span className="font-bold text-text-primary block">Quick Administrative Actions</span>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => {
                                                    setActionModal({
                                                        type: 'revoke',
                                                        title: `Revoke all active tokens for ${selectedUser.display_name}`,
                                                        user: selectedUser,
                                                    })
                                                }}
                                                className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-bold rounded-xl flex items-center justify-center space-x-2 border border-amber-200"
                                            >
                                                <KeyRound className="h-3.5 w-3.5" />
                                                <span>Force Revoke Active Tokens</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Audit History Log */}
                                    <div className="space-y-2 pt-2 border-t border-border">
                                        <span className="font-bold text-text-primary block">User Audit Trail</span>
                                        {userDetailData?.audit_logs?.length === 0 ? (
                                            <p className="text-text-muted italic">No admin actions recorded for this user.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {userDetailData?.audit_logs?.map((log: any) => (
                                                    <div key={log.id} className="p-2.5 bg-background rounded-xl border border-border/60">
                                                        <div className="flex justify-between font-bold text-[11px]">
                                                            <span>{log.action}</span>
                                                            <span className="font-mono text-text-muted">{new Date(log.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-text-muted mt-0.5">{log.reason}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Modal for Status / Role / Token Actions */}
                {actionModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border">
                            <h3 className="text-base font-bold text-text-primary">{actionModal.title}</h3>

                            <form onSubmit={handleActionSubmit} className="space-y-4 text-xs">
                                {actionModal.type === 'status' && (
                                    <div>
                                        <label className="block font-semibold text-text-secondary mb-1">Select Account Status</label>
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary font-bold"
                                        >
                                            <option value="active">Active</option>
                                            <option value="restricted">Restricted</option>
                                            <option value="suspended">Suspended (Invalidates tokens)</option>
                                        </select>
                                    </div>
                                )}

                                {actionModal.type === 'role' && (
                                    <div>
                                        <label className="block font-semibold text-text-secondary mb-1">Select User Role</label>
                                        <select
                                            value={newRole}
                                            onChange={(e) => setNewRole(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary font-bold"
                                        >
                                            <option value="supporter">Supporter</option>
                                            <option value="creator">Creator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                )}

                                {actionModal.type !== 'revoke' && (
                                    <div>
                                        <label className="block font-semibold text-text-secondary mb-1">Reason for Action (Recorded in Audit Trail)</label>
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="Enter justification..."
                                            value={actionReason}
                                            onChange={(e) => setActionReason(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary"
                                        />
                                    </div>
                                )}

                                {actionModal.type === 'revoke' && (
                                    <p className="text-text-muted">
                                        Are you sure you want to invalidate all Sanctum personal access tokens for {actionModal.user.display_name}? The user will be immediately logged out of all active devices.
                                    </p>
                                )}

                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setActionModal(null)}
                                        className="px-4 py-2 bg-background hover:bg-border text-text-secondary font-semibold rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingAction}
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                                    >
                                        {submittingAction ? 'Processing...' : 'Confirm Action'}
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
