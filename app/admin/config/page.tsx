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
    Lock
} from 'lucide-react'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

export default function PlatformConfigPage() {
    const [settings, setSettings] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    // Form inputs
    const [platformFee, setPlatformFee] = useState<number>(5.0)
    const [minPayout, setMinPayout] = useState<number>(500)
    const [reason, setReason] = useState('')
    const [saving, setSaving] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/v1/admin/config/settings')
            const s = res.data.settings
            setSettings(s)
            setPlatformFee(s.platform_fee_percent || 5.0)
            setMinPayout(s.min_payout_amount_bdt || 500)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setSuccessMsg('')

        try {
            const res = await axios.put('/api/v1/admin/config/settings', {
                platform_fee_percent: platformFee,
                min_payout_amount_bdt: minPayout,
                reason,
            })
            setSuccessMsg('System settings successfully updated and logged.')
            setReason('')
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
                    subtitle="Manage platform take-rate fees, payout limits, supported payment gateways, and global settings."
                />

                {successMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Financial Take-Rate & Payout Settings */}
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
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

                    {/* Integrated Gateways & Methods (Read-Only) */}
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-text-primary text-base flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                            <span>Payment Gateways & Disbursal Channels</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                                <span className="font-bold text-text-primary block">Active Checkout Gateway</span>
                                <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-50 text-emerald-700 text-[11px]">
                                    SSLCommerz (Sandbox / Production)
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                                <span className="font-bold text-text-primary block">Supported Payout Channels</span>
                                <div className="flex items-center space-x-2 pt-1 font-mono text-[11px]">
                                    <span className="px-2 py-0.5 bg-pink-50 text-pink-700 font-bold rounded">bKash</span>
                                    <span className="px-2 py-0.5 bg-orange-50 text-orange-700 font-bold rounded">Nagad</span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded">Bank EFT</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Reason & Submit */}
                    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
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
                                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center space-x-2"
                            >
                                <Save className="h-4 w-4" />
                                <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    )
}
