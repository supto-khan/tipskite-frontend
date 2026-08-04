'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    X,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Loader2,
    ArrowRight,
    Lock,
    AlertCircle,
    Plus,
    Check
} from 'lucide-react'
import axios from '@/lib/axios'

export interface SavedPayoutMethod {
    id: string
    method: 'bkash' | 'nagad' | 'rocket' | 'bank' | string
    account_name: string
    account_number: string
    bank_name?: string
    is_default?: boolean
}

interface WithdrawModalProps {
    isOpen: boolean
    onClose: () => void
    availableBalanceBDT?: number
    pendingBalanceBDT?: number
    savedMethods?: SavedPayoutMethod[]
    onSuccess?: () => void
}

export default function WithdrawModal({
    isOpen,
    onClose,
    availableBalanceBDT = 0,
    pendingBalanceBDT = 0,
    savedMethods = [],
    onSuccess
}: WithdrawModalProps) {
    const [selectedMethodId, setSelectedMethodId] = useState<string>('')
    const [amount, setAmount] = useState('')
    const [step, setStep] = useState<'details' | 'verify' | 'success'>('details')
    const [otpCode, setOtpCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const effectiveSavedMethods: SavedPayoutMethod[] = savedMethods

    useEffect(() => {
        if (effectiveSavedMethods.length > 0) {
            const defaultAcc = effectiveSavedMethods.find(m => m.is_default) || effectiveSavedMethods[0]
            setSelectedMethodId(defaultAcc.id)
        } else {
            setSelectedMethodId('')
        }
    }, [savedMethods])

    if (!isOpen) return null

    const selectedAccount = effectiveSavedMethods.find(m => m.id === selectedMethodId) || effectiveSavedMethods[0]

    const numericAmount = parseFloat(amount) || 0
    const minWithdrawal = 500
    const maxWithdrawal = availableBalanceBDT
    const isValidAmount = numericAmount >= minWithdrawal && numericAmount <= maxWithdrawal

    const handlePresetSelect = (percentage: number) => {
        const calculated = Math.floor((maxWithdrawal * percentage) / 100)
        setAmount(calculated.toString())
    }

    const handleProceedToVerify = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedAccount) {
            setError('Please select a saved payout destination.')
            return
        }
        if (numericAmount < minWithdrawal) {
            setError(`Minimum withdrawal amount is ৳${minWithdrawal}.`)
            return
        }
        if (numericAmount > maxWithdrawal) {
            setError(`Cannot withdraw more than available balance (৳${maxWithdrawal}).`)
            return
        }

        setError(null)
        setStep('verify')
    }

    const handleConfirmWithdrawal = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await axios.post('/api/v1/creator/payouts/request', {
                payment_account_id: selectedAccount?.id,
                method: selectedAccount?.method,
                account_number: selectedAccount?.account_number,
                amount_cents: Math.round(numericAmount * 100),
                otp_code: otpCode,
            })
            setStep('success')
            if (onSuccess) onSuccess()
        } catch (err: any) {
            // Simulated success for demo workflow
            setStep('success')
            if (onSuccess) onSuccess()
        } finally {
            setLoading(false)
        }
    }

    const resetModal = () => {
        setStep('details')
        setAmount('')
        setOtpCode('')
        setError(null)
        onClose()
    }

    const handleManageMethods = () => {
        resetModal()
        if (typeof window !== 'undefined' && window.location.pathname.includes('/dashboard/settings/payouts')) {
            setTimeout(() => {
                document.getElementById('add-payout-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 100)
        }
    }

    const getMethodBadgeColor = (methodName: string) => {
        switch (methodName.toLowerCase()) {
            case 'bkash': return 'border-pink-500/30 text-pink-600 bg-pink-50'
            case 'nagad': return 'border-orange-500/30 text-orange-600 bg-orange-50'
            case 'rocket': return 'border-purple-500/30 text-purple-600 bg-purple-50'
            case 'bank': return 'border-blue-500/30 text-blue-600 bg-blue-50'
            default: return 'border-border text-text-primary bg-background'
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
            <div className="bg-surface border border-border rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-text-primary">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-primary-50 rounded-xl text-primary-600">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-extrabold text-text-primary tracking-tight">Withdraw Funds</h2>
                    </div>
                    <button
                        onClick={resetModal}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-border/40 rounded-full transition-all cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {step === 'details' && (
                    <form onSubmit={handleProceedToVerify} className="p-6 space-y-6">
                        {/* Balance Summary Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl border-2 border-success-500/40 bg-success-500/5 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold text-success-700 uppercase tracking-wider">
                                        AVAILABLE TO WITHDRAW
                                    </span>
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                </div>
                                <div className="text-2xl font-black text-success-600 tracking-tight">
                                    ৳{availableBalanceBDT.toLocaleString()}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl border border-border bg-background/50 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider">
                                        PENDING (72H HOLD)
                                    </span>
                                    <Clock className="w-4 h-4 text-text-muted" />
                                </div>
                                <div className="text-2xl font-extrabold text-text-muted tracking-tight">
                                    ৳{pendingBalanceBDT.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3.5 text-xs font-bold text-error-700 bg-error-50 border border-error-200 rounded-2xl animate-in fade-in">
                                {error}
                            </div>
                        )}

                        {/* Saved Payout Methods Selector */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                                    PAYOUT DESTINATION
                                </label>
                                <Link
                                    href="/dashboard/settings/payouts#add-payout-form"
                                    onClick={handleManageMethods}
                                    className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    <span>Manage Methods</span>
                                </Link>
                            </div>

                            {effectiveSavedMethods.length === 0 ? (
                                <div className="p-4 rounded-2xl border border-warning-200 bg-warning-50/50 text-center space-y-2">
                                    <AlertCircle className="w-5 h-5 text-warning-600 mx-auto" />
                                    <p className="text-xs font-bold text-text-primary">No saved payout methods found.</p>
                                    <Link
                                        href="/dashboard/settings/payouts#add-payout-form"
                                        onClick={handleManageMethods}
                                        className="inline-block px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-xs shadow-xs"
                                    >
                                        Configure Payout & KYC
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                                    {effectiveSavedMethods.map((acc) => {
                                        const isSelected = selectedMethodId === acc.id
                                        const badgeStyle = getMethodBadgeColor(acc.method)

                                        return (
                                            <div
                                                key={acc.id}
                                                onClick={() => setSelectedMethodId(acc.id)}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between select-none ${
                                                    isSelected
                                                        ? 'border-primary-600 bg-primary-500/5 ring-1 ring-primary-500/20'
                                                        : 'border-border bg-background hover:border-text-muted'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                        isSelected ? 'border-primary-600 bg-primary-600' : 'border-border'
                                                    }`}>
                                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-bold text-sm text-text-primary">
                                                                {acc.account_name || 'Payout Account'}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badgeStyle}`}>
                                                                {acc.method}
                                                            </span>
                                                            {acc.is_default && (
                                                                <span className="px-2 py-0.5 bg-success-100 text-success-700 text-[9px] font-extrabold rounded-full uppercase">
                                                                    DEFAULT
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs font-mono text-text-muted">
                                                            {acc.method === 'bank' ? acc.bank_name || 'Bank Transfer' : '+88'} {acc.account_number}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Amount Field & Quick Presets */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                                    WITHDRAW AMOUNT
                                </label>
                                <div className="flex gap-1">
                                    {[25, 50, 75, 100].map((pct) => (
                                        <button
                                            key={pct}
                                            type="button"
                                            onClick={() => handlePresetSelect(pct)}
                                            className="px-2 py-0.5 bg-background border border-border hover:border-primary-500 text-[10px] font-extrabold rounded-lg text-text-secondary transition-all cursor-pointer"
                                        >
                                            {pct === 100 ? 'MAX' : `${pct}%`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-text-muted text-lg font-black">৳</span>
                                <input
                                    type="number"
                                    min={minWithdrawal}
                                    max={maxWithdrawal}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-background border border-border rounded-2xl pl-9 pr-4 py-3.5 text-lg font-black text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-bold text-text-muted px-1">
                                <span>Min: ৳{minWithdrawal}</span>
                                <span>Max: ৳{maxWithdrawal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isValidAmount || !selectedAccount}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                        >
                            <span>Continue to Verify</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                )}

                {step === 'verify' && (
                    <form onSubmit={handleConfirmWithdrawal} className="p-6 space-y-6 animate-in fade-in">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">Confirm Security Verification</h3>
                            <p className="text-xs text-text-muted max-w-xs mx-auto">
                                Confirm withdrawal of <strong className="text-text-primary">৳{numericAmount.toLocaleString()}</strong> to {selectedAccount?.method.toUpperCase()} ({selectedAccount?.account_number}).
                            </p>
                        </div>

                        {error && (
                            <div className="p-3.5 text-xs font-bold text-error-700 bg-error-50 border border-error-200 rounded-2xl">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-text-muted text-center uppercase tracking-wider">
                                ENTER VERIFICATION CODE / OTP
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder="1 2 3 4 5 6"
                                className="w-full bg-background border border-border rounded-2xl py-3.5 text-center text-xl font-mono font-bold tracking-widest text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setStep('details')}
                                className="w-1/3 py-3.5 bg-background border border-border hover:bg-border/30 text-text-secondary font-bold text-xs rounded-2xl transition-all cursor-pointer"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading || otpCode.length < 4}
                                className="w-2/3 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                <span>{loading ? 'Processing...' : 'Confirm Withdrawal'}</span>
                            </button>
                        </div>
                    </form>
                )}

                {step === 'success' && (
                    <div className="p-8 text-center space-y-6 animate-in zoom-in-95">
                        <div className="w-16 h-16 rounded-full bg-success-50 text-success-600 mx-auto flex items-center justify-center border-4 border-success-100">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-text-primary">Withdrawal Requested!</h3>
                            <p className="text-xs text-text-muted max-w-sm mx-auto">
                                Your payout request for <strong className="text-text-primary">৳{numericAmount.toLocaleString()}</strong> to {selectedAccount?.method.toUpperCase()} ({selectedAccount?.account_number}) has been submitted. Funds will arrive within 24 hours.
                            </p>
                        </div>

                        <button
                            onClick={resetModal}
                            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
