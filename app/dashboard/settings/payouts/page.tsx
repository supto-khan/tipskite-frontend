'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import {
    User,
    CreditCard,
    Palette,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Loader2,
    Save,
    Plus,
    Trash2,
    Star,
    Check
} from 'lucide-react'
import { Select } from '@/app/components/ui/select'
import WithdrawModal, { SavedPayoutMethod } from '@/components/payments/WithdrawModal'

export default function PayoutSettings() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [errors, setErrors] = useState<any>({})

    // Saved payment accounts list
    const [savedMethods, setSavedMethods] = useState<SavedPayoutMethod[]>([])

    // Form inputs for adding / editing a payout account
    const [payoutMethod, setPayoutMethod] = useState('bkash')
    const [accountName, setAccountName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [bankName, setBankName] = useState('')
    const [branchName, setBranchName] = useState('')
    const [routingNumber, setRoutingNumber] = useState('')
    const [isDefault, setIsDefault] = useState(true)
    const [kycStatus, setKycStatus] = useState('unsubmitted')

    // Balances (fetched real from creator profile / analytics backend)
    const [availableBalance, setAvailableBalance] = useState(0)
    const [pendingBalance, setPendingBalance] = useState(0)
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

    useEffect(() => {
        const fetchPayoutData = async () => {
            try {
                const [accRes, summaryRes] = await Promise.all([
                    axios.get('/api/v1/creator/payment-account'),
                    axios.get('/api/v1/creator/analytics/summary').catch(() => null),
                ])

                const accounts = accRes.data?.payment_accounts || (accRes.data?.payment_account ? [accRes.data.payment_account] : [])
                if (accounts.length > 0) {
                    setKycStatus(accRes.data?.payment_account?.kyc_status || accounts[0]?.kyc_status || 'submitted')
                    setSavedMethods(accounts.map((acc: any) => ({
                        id: acc.id,
                        method: acc.payout_method || 'bkash',
                        account_name: acc.account_name || 'Payout Account',
                        account_number: acc.account_number || '',
                        bank_name: acc.bank_name,
                        is_default: Boolean(acc.is_default),
                    })))
                }

                if (summaryRes?.data?.summary) {
                    setAvailableBalance(summaryRes.data.summary.net_cents ? summaryRes.data.summary.net_cents / 100 : 0)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
                if (window.location.hash === '#add-payout-form') {
                    setTimeout(() => {
                        document.getElementById('add-payout-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }, 300)
                }
            }
        }

        fetchPayoutData()
    }, [])

    const handleSetDefault = async (id: string) => {
        try {
            const res = await axios.post(`/api/v1/creator/payment-account/${id}/default`)
            const accounts = res.data?.payment_accounts || []
            if (accounts.length > 0) {
                setSavedMethods(accounts.map((acc: any) => ({
                    id: acc.id,
                    method: acc.payout_method || 'bkash',
                    account_name: acc.account_name || 'Payout Account',
                    account_number: acc.account_number || '',
                    bank_name: acc.bank_name,
                    is_default: Boolean(acc.is_default),
                })))
            } else {
                setSavedMethods(prev =>
                    prev.map(m => ({ ...m, is_default: m.id === id }))
                )
            }
            setMessage('Default payout destination updated.')
        } catch (err) {
            console.error(err)
        }
        setTimeout(() => setMessage(null), 3000)
    }

    const handleDeleteMethod = async (id: string) => {
        try {
            const res = await axios.delete(`/api/v1/creator/payment-account/${id}`)
            const accounts = res.data?.payment_accounts || []
            setSavedMethods(accounts.map((acc: any) => ({
                id: acc.id,
                method: acc.payout_method || 'bkash',
                account_name: acc.account_name || 'Payout Account',
                account_number: acc.account_number || '',
                bank_name: acc.bank_name,
                is_default: Boolean(acc.is_default),
            })))
            setMessage('Payout destination removed.')
        } catch (err) {
            console.error(err)
        }
        setTimeout(() => setMessage(null), 3000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)
        setErrors({})

        try {
            const res = await axios.put('/api/v1/creator/payment-account', {
                payout_method: payoutMethod,
                account_name: accountName,
                account_number: accountNumber,
                bank_name: payoutMethod === 'bank' ? bankName : null,
                branch_name: payoutMethod === 'bank' ? branchName : null,
                routing_number: payoutMethod === 'bank' ? routingNumber : null,
                is_default: isDefault,
            })

            const accounts = res.data?.payment_accounts || (res.data?.payment_account ? [res.data.payment_account] : [])
            if (accounts.length > 0) {
                setSavedMethods(accounts.map((acc: any) => ({
                    id: acc.id,
                    method: acc.payout_method || 'bkash',
                    account_name: acc.account_name || 'Payout Account',
                    account_number: acc.account_number || '',
                    bank_name: acc.bank_name,
                    is_default: Boolean(acc.is_default),
                })))
            }

            if (res.data?.payment_account?.kyc_status) {
                setKycStatus(res.data.payment_account.kyc_status)
            }

            // Clear form inputs after adding
            setPayoutMethod('bkash')
            setAccountName('')
            setAccountNumber('')
            setBankName('')
            setBranchName('')
            setRoutingNumber('')
            setIsDefault(true)

            setMessage('Payout method saved successfully!')
            setTimeout(() => setMessage(null), 3000)
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.error?.fields || err.response.data.errors || {})
            } else {
                setErrors({ general: [err.response?.data?.message || 'Failed to update payout settings.'] })
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div suppressHydrationWarning className="max-w-4xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div suppressHydrationWarning className="space-y-2">
                    <div suppressHydrationWarning className="h-8 w-44 bg-border/40 rounded-xl" />
                    <div suppressHydrationWarning className="h-4 w-64 bg-border/40 rounded-lg" />
                </div>
                <div suppressHydrationWarning className="grid grid-cols-2 gap-4">
                    <div suppressHydrationWarning className="h-28 bg-border/40 rounded-3xl" />
                    <div suppressHydrationWarning className="h-28 bg-border/40 rounded-3xl" />
                </div>
            </div>
        )
    }

    return (
        <div suppressHydrationWarning className="max-w-4xl mx-auto py-6 space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Payout & KYC</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Withdraw earnings to your saved default MFS wallet or bank account.
                    </p>
                </div>

                <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="px-6 py-3 bg-success-600 hover:bg-success-700 text-white font-black text-sm rounded-full shadow-md transition-all flex items-center space-x-2 w-fit cursor-pointer hover:scale-102 active:scale-98"
                >
                    <ArrowUpRight className="w-5 h-5" />
                    <span>Withdraw Funds</span>
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border space-x-6">
                <Link
                    href="/dashboard/settings"
                    className="pb-3 text-sm font-medium text-text-muted hover:text-text-secondary flex items-center gap-2"
                >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                </Link>
                <Link
                    href="/dashboard/settings/design"
                    className="pb-3 text-sm font-medium text-text-muted hover:text-text-secondary flex items-center gap-2"
                >
                    <Palette className="w-4 h-4" />
                    <span>Page Design</span>
                </Link>
                <Link
                    href="/dashboard/settings/payouts"
                    className="pb-3 text-sm font-semibold text-primary-600 border-b-2 border-primary-600 flex items-center gap-2"
                >
                    <CreditCard className="w-4 h-4" />
                    <span>Payout & KYC</span>
                </Link>
            </div>

            {/* Balances Overview Cards */}
            <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div suppressHydrationWarning className="p-6 rounded-3xl border-2 border-success-500/30 bg-surface shadow-xs space-y-3 relative overflow-hidden">
                    <div suppressHydrationWarning className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-success-700 uppercase tracking-wider">
                            AVAILABLE TO WITHDRAW
                        </span>
                        <span className="px-2.5 py-1 bg-success-500/10 text-success-700 text-[10px] font-black rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            READY
                        </span>
                    </div>
                    <div suppressHydrationWarning className="flex items-baseline justify-between pt-1">
                        <div className="text-3xl font-black text-success-600 tracking-tight">
                            ৳{availableBalance.toLocaleString()}
                        </div>
                        <button
                            onClick={() => setIsWithdrawOpen(true)}
                            className="px-4 py-2 bg-success-600 hover:bg-success-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                            Withdraw Now
                        </button>
                    </div>
                </div>

                <div suppressHydrationWarning className="p-6 rounded-3xl border border-border bg-surface shadow-xs space-y-3">
                    <div suppressHydrationWarning className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-text-muted uppercase tracking-wider">
                            PENDING (72H HOLD)
                        </span>
                        <Clock className="w-4 h-4 text-text-muted" />
                    </div>
                    <div className="text-3xl font-extrabold text-text-muted tracking-tight pt-1">
                        ৳{pendingBalance.toLocaleString()}
                    </div>
                </div>
            </div>

            {message && (
                <div suppressHydrationWarning className="p-4 text-xs font-bold text-success-700 bg-success-50 border border-success-200 rounded-2xl flex items-center space-x-2 animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>{message}</span>
                </div>
            )}

            {/* Saved Payout Destinations List */}
            <div suppressHydrationWarning className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Saved Payout Destinations</h3>
                        <p className="text-xs text-text-muted mt-0.5">Your configured withdrawal accounts. Set one as your default.</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize flex items-center gap-1.5 ${
                        kycStatus === 'approved' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                    }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>KYC: {kycStatus}</span>
                    </span>
                </div>

                {savedMethods.length === 0 ? (
                    <div className="p-6 rounded-2xl border border-dashed border-border text-center space-y-2 bg-background/50">
                        <CreditCard className="w-8 h-8 text-text-muted mx-auto" />
                        <p className="text-sm font-bold text-text-primary">No payout destination configured yet.</p>
                        <p className="text-xs text-text-muted max-w-sm mx-auto">
                            Add your bKash, Nagad, Rocket, or Bank account using the form below to enable withdrawals.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {savedMethods.map((acc) => (
                            <div
                                key={acc.id}
                                className={`p-5 rounded-2xl border-2 transition-all space-y-3 relative ${
                                    acc.is_default
                                        ? 'border-primary-600 bg-primary-500/5 ring-1 ring-primary-500/20'
                                        : 'border-border bg-background'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-sm text-text-primary">
                                        {acc.account_name}
                                    </span>
                                    {acc.is_default ? (
                                        <span className="px-2.5 py-0.5 bg-success-100 text-success-700 text-[10px] font-black rounded-full uppercase flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" />
                                            DEFAULT
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleSetDefault(acc.id)}
                                            className="text-[10px] font-extrabold text-primary-600 hover:underline cursor-pointer"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                                        {acc.method} {acc.bank_name ? `• ${acc.bank_name}` : ''}
                                    </div>
                                    <div className="text-sm font-mono font-bold text-text-primary">
                                        {acc.method === 'bank' ? '' : '+88 '} {acc.account_number}
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteMethod(acc.id)}
                                        className="p-1.5 text-text-muted hover:text-error-600 transition-colors cursor-pointer"
                                        title="Remove Payout Method"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Payout Method Form */}
            <form id="add-payout-form" onSubmit={handleSubmit} className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-text-primary">Add Payout Destination</h3>
                    <p className="text-xs text-text-muted mt-0.5">Link another MFS account or bank for receiving payouts.</p>
                </div>

                {errors.general && (
                    <div className="p-4 text-xs font-bold text-error-700 bg-error-50 border border-error-200 rounded-2xl">
                        {errors.general[0]}
                    </div>
                )}

                <div className="space-y-4">
                    <Select
                        label="Payout Method"
                        value={payoutMethod}
                        onChange={(val) => setPayoutMethod(val)}
                        options={[
                            { value: 'bkash', label: 'bKash Personal / Merchant' },
                            { value: 'nagad', label: 'Nagad Personal' },
                            { value: 'rocket', label: 'Rocket Personal' },
                            { value: 'bank', label: 'Bank Transfer' }
                        ]}
                    />

                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">Account Holder Full Name</label>
                        <input
                            type="text"
                            required
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g. Tanvir Ahmed (bKash Personal)"
                        />
                        {errors.account_name && <p className="text-xs text-error-500 font-semibold mt-1">{errors.account_name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">
                            {payoutMethod === 'bank' ? 'Bank Account Number' : 'MFS Mobile Number'}
                        </label>
                        <input
                            type="text"
                            required
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder={payoutMethod === 'bank' ? '1234567890' : '017XXXXXXXX'}
                        />
                        {errors.account_number && <p className="text-xs text-error-500 font-semibold mt-1">{errors.account_number[0]}</p>}
                    </div>

                    {payoutMethod === 'bank' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1">Bank Name</label>
                                <input
                                    type="text"
                                    required
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Dutch-Bangla Bank"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1">Branch Name</label>
                                <input
                                    type="text"
                                    required
                                    value={branchName}
                                    onChange={(e) => setBranchName(e.target.value)}
                                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Dhanmondi Branch"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1">Routing Number</label>
                                <input
                                    type="text"
                                    required
                                    value={routingNumber}
                                    onChange={(e) => setRoutingNumber(e.target.value)}
                                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="090261234"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="set_default"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            className="rounded border-border text-primary-600 focus:ring-primary-500 w-4 h-4"
                        />
                        <label htmlFor="set_default" className="text-xs font-bold text-text-secondary cursor-pointer">
                            Set as default payout destination
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{saving ? 'Adding...' : 'Add Payout Method'}</span>
                    </button>
                </div>
            </form>

            {/* Withdraw Modal */}
            <WithdrawModal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                availableBalanceBDT={availableBalance}
                pendingBalanceBDT={pendingBalance}
                savedMethods={savedMethods}
                onSuccess={() => {
                    setAvailableBalance(0)
                }}
            />
        </div>
    )
}
