'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    Sliders,
    Save,
    Percent,
    DollarSign,
    Shield,
    CreditCard,
    AlertCircle,
    CheckCircle2,
    Lock,
    Zap,
    Check,
    Loader2,
    RefreshCw
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function PlatformConfigPage() {
    const [settings, setSettings] = useState<any | null>(null)
    const [gatewayInfo, setGatewayInfo] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    // Form inputs
    const [platformFee, setPlatformFee] = useState<number>(5.0)
    const [minPayout, setMinPayout] = useState<number>(500)
    const [activeGateway, setActiveGateway] = useState<string>('eps')
    const [reason, setReason] = useState('')
    const [saving, setSaving] = useState(false)
    const [switchingGateway, setSwitchingGateway] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/v1/admin/config/settings')
            const s = res.data.settings
            const gw = res.data.gateway_info
            setSettings(s)
            setGatewayInfo(gw)
            setPlatformFee(s.platform_fee_percent || 5.0)
            setMinPayout(s.min_payout_amount_bdt || 500)
            setActiveGateway(s.active_payment_gateway || 'eps')
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleQuickSwitchGateway = async (gateway: 'sslcommerz' | 'eps') => {
        if (gateway === activeGateway || switchingGateway) return
        setSwitchingGateway(true)
        setSuccessMsg('')

        try {
            const res = await axios.patch('/api/v1/admin/config/payment-gateway', {
                gateway,
                reason: `Switched active checkout payment gateway to ${gateway.toUpperCase()} via Admin Control Panel`,
            })

            setActiveGateway(gateway)
            setGatewayInfo(res.data.gateway_info)
            setSuccessMsg(`Payment gateway successfully switched to ${gateway.toUpperCase()}! All upcoming checkouts will process through ${gateway.toUpperCase()}.`)
            setTimeout(() => setSuccessMsg(''), 5000)
        } catch (e) {
            console.error('Failed to switch payment gateway:', e)
            alert('Failed to switch payment gateway')
        } finally {
            setSwitchingGateway(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setSuccessMsg('')

        try {
            const res = await axios.put('/api/v1/admin/config/settings', {
                platform_fee_percent: platformFee,
                min_payout_amount_bdt: minPayout,
                active_payment_gateway: activeGateway,
                reason,
            })
            setSuccessMsg('System settings successfully updated and logged.')
            setReason('')
            if (res.data?.gateway_info) {
                setGatewayInfo(res.data.gateway_info)
            }
            setTimeout(() => setSuccessMsg(''), 5000)
            fetchSettings()
        } catch (e) {
            console.error(e)
            alert('Failed to update system settings')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-background">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    <div className="text-xs text-text-muted animate-pulse">Loading Platform Settings...</div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                <AdminHeader
                    title="System & Platform Configuration"
                    subtitle="Manage active checkout payment gateway (EPS vs SSLCommerz), platform take-rate fees, and payout limits."
                />

                {successMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                <div className="space-y-6">
                    {/* ── ACTIVE PAYMENT GATEWAY TOGGLE SECTION ── */}
                    <div className="bg-surface rounded-3xl border border-border shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                                    <CreditCard className="h-5 w-5 text-primary-600" />
                                    <span>Active Checkout Payment Gateway</span>
                                </h3>
                                <p className="text-xs text-text-muted mt-0.5">
                                    Select which payment engine processes public tips, product purchases, and service orders.
                                </p>
                            </div>

                            <span className="px-3 py-1 bg-primary-500/10 text-primary-600 rounded-full text-xs font-mono font-bold w-fit border border-primary-500/20">
                                Current Active: {activeGateway.toUpperCase()}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* EPS Gateway Card */}
                            <div
                                onClick={() => handleQuickSwitchGateway('eps')}
                                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-4 select-none ${
                                    activeGateway === 'eps'
                                        ? 'border-primary-600 bg-primary-500/5 ring-2 ring-primary-500/20 shadow-xs'
                                        : 'border-border bg-background hover:border-text-muted opacity-80 hover:opacity-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            activeGateway === 'eps' ? 'border-primary-600 bg-primary-600 text-white' : 'border-border'
                                        }`}>
                                            {activeGateway === 'eps' && <Check className="w-3 h-3 stroke-[3]" />}
                                        </div>
                                        <div>
                                            <span className="font-extrabold text-sm text-text-primary block">
                                                EPS (Easy Payment System)
                                            </span>
                                            <span className="text-[11px] text-text-muted">
                                                Direct Sandbox & Live Merchant API
                                            </span>
                                        </div>
                                    </div>

                                    {activeGateway === 'eps' ? (
                                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                            ACTIVE GATEWAY
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={switchingGateway}
                                            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-bold rounded-lg transition-all"
                                        >
                                            {switchingGateway ? 'Switching...' : 'Activate'}
                                        </button>
                                    )}
                                </div>

                                <div className="bg-surface rounded-xl p-3 border border-border/60 text-[11px] space-y-1.5 font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Merchant ID:</span>
                                        <span className="text-text-primary truncate max-w-[180px]">29e86e70-0ac6-45eb...</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Supported Channels:</span>
                                        <span className="text-emerald-600 font-bold">bKash, Nagad, Rocket, Cards</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Mode:</span>
                                        <span className="text-amber-600 font-bold">Sandbox (Test Mode)</span>
                                    </div>
                                </div>
                            </div>

                            {/* SSLCommerz Gateway Card */}
                            <div
                                onClick={() => handleQuickSwitchGateway('sslcommerz')}
                                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-4 select-none ${
                                    activeGateway === 'sslcommerz'
                                        ? 'border-primary-600 bg-primary-500/5 ring-2 ring-primary-500/20 shadow-xs'
                                        : 'border-border bg-background hover:border-text-muted opacity-80 hover:opacity-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            activeGateway === 'sslcommerz' ? 'border-primary-600 bg-primary-600 text-white' : 'border-border'
                                        }`}>
                                            {activeGateway === 'sslcommerz' && <Check className="w-3 h-3 stroke-[3]" />}
                                        </div>
                                        <div>
                                            <span className="font-extrabold text-sm text-text-primary block">
                                                SSLCommerz
                                            </span>
                                            <span className="text-[11px] text-text-muted">
                                                Multi-channel Payment Gateway
                                            </span>
                                        </div>
                                    </div>

                                    {activeGateway === 'sslcommerz' ? (
                                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                            ACTIVE GATEWAY
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={switchingGateway}
                                            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-bold rounded-lg transition-all"
                                        >
                                            {switchingGateway ? 'Switching...' : 'Activate'}
                                        </button>
                                    )}
                                </div>

                                <div className="bg-surface rounded-xl p-3 border border-border/60 text-[11px] space-y-1.5 font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Store ID:</span>
                                        <span className="text-text-primary truncate max-w-[180px]">johol69e90edbc12fa</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Supported Channels:</span>
                                        <span className="text-emerald-600 font-bold">Cards, MFS, Internet Banking</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Mode:</span>
                                        <span className="text-amber-600 font-bold">Sandbox (Test Mode)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Financial Take-Rate & Payout Settings */}
                        <div className="bg-surface rounded-3xl border border-border shadow-xs p-6 sm:p-8 space-y-4">
                            <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                                <Sliders className="h-4 w-4 text-primary-600" />
                                <span>Global Financial Parameters</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted mb-1 flex items-center space-x-1">
                                        <Percent className="h-3.5 w-3.5 text-primary-600" />
                                        <span>Platform Fee Percentage (%)</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="50"
                                        value={platformFee}
                                        onChange={(e) => setPlatformFee(parseFloat(e.target.value))}
                                        className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-text-primary font-mono text-sm font-bold"
                                    />
                                    <p className="text-[11px] text-text-muted mt-1">Default TipSkite take-rate on tips, products, services, & subscriptions.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted mb-1 flex items-center space-x-1">
                                        <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                                        <span>Minimum Creator Payout Limit (BDT)</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="10"
                                        min="100"
                                        value={minPayout}
                                        onChange={(e) => setMinPayout(parseFloat(e.target.value))}
                                        className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-text-primary font-mono text-sm font-bold"
                                    />
                                    <p className="text-[11px] text-text-muted mt-1">Minimum wallet balance required for creators to request payout.</p>
                                </div>
                            </div>
                        </div>

                        {/* Supported Payout Channels */}
                        <div className="bg-surface rounded-3xl border border-border shadow-xs p-6 sm:p-8 space-y-4">
                            <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                                <span>Supported Creator Disbursal Channels</span>
                            </h3>

                            <div className="p-4 rounded-2xl bg-background border border-border space-y-2 text-xs">
                                <span className="font-bold text-text-primary block">Active Payout Methods</span>
                                <div className="flex items-center space-x-2 pt-1 font-mono text-[11px]">
                                    <span className="px-2.5 py-1 bg-pink-50 text-pink-700 font-bold rounded-lg border border-pink-200">bKash</span>
                                    <span className="px-2.5 py-1 bg-orange-50 text-orange-700 font-bold rounded-lg border border-orange-200">Nagad</span>
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">Bank EFT</span>
                                </div>
                            </div>
                        </div>

                        {/* Change Reason & Submit */}
                        <div className="bg-surface rounded-3xl border border-border shadow-xs p-6 sm:p-8 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-1">
                                    Justification Reason for Config Update <span className="text-rose-600">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="Enter justification for administrative audit trail..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-text-primary text-xs"
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={saving || !reason}
                                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
