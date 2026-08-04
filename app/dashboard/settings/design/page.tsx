'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from '@/lib/axios'
import {
    User,
    CreditCard,
    Palette,
    Check,
    Loader2,
    Sparkles,
    Layout,
    Eye,
    Save,
    Coffee
} from 'lucide-react'

export default function PageDesignSettings() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Form fields
    const [layoutType, setLayoutType] = useState<'presets' | 'standard'>('presets')
    const [preset1, setPreset1] = useState('100')
    const [preset2, setPreset2] = useState('300')
    const [preset3, setPreset3] = useState('500')
    const [buttonWording, setButtonWording] = useState('Support')
    const [showSupporterWall, setShowSupporterWall] = useState(true)

    // Unit Coffee defaults if standard layout selected
    const [unitNoun, setUnitNoun] = useState('coffee')
    const [unitEmoji, setUnitEmoji] = useState('☕')
    const [unitPrice, setUnitPrice] = useState('100')

    const buttonWordingOptions = ['Support', 'Pay', 'Send', 'Donate', 'Buy']

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/v1/creator/profile')
                const profile = res.data?.profile || res.data
                if (profile) {
                    setLayoutType(profile.layout_type || 'presets')
                    setButtonWording(profile.button_wording || 'Support')
                    setShowSupporterWall(profile.show_supporter_wall !== false)
                    setUnitNoun(profile.unit_noun || 'coffee')
                    setUnitEmoji(profile.unit_emoji || '☕')
                    setUnitPrice(profile.unit_price_cents ? (profile.unit_price_cents / 100).toString() : '100')

                    if (Array.isArray(profile.unit_presets) && profile.unit_presets.length >= 3) {
                        setPreset1((profile.unit_presets[0] / 100).toString())
                        setPreset2((profile.unit_presets[1] / 100).toString())
                        setPreset3((profile.unit_presets[2] / 100).toString())
                    }
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setSaving(true)
        setMessage(null)
        setError(null)

        const presetsArray = [
            Math.max(10, Math.round(parseFloat(preset1) || 100) * 100),
            Math.max(10, Math.round(parseFloat(preset2) || 300) * 100),
            Math.max(10, Math.round(parseFloat(preset3) || 500) * 100),
        ]

        try {
            await axios.patch('/api/v1/creator/profile', {
                layout_type: layoutType,
                button_wording: buttonWording,
                show_supporter_wall: showSupporterWall,
                unit_presets: presetsArray,
                unit_noun: unitNoun,
                unit_emoji: unitEmoji,
                unit_price_cents: Math.max(100, Math.round(parseFloat(unitPrice) || 100) * 100),
            })
            setMessage('Page design settings saved successfully!')
            setTimeout(() => setMessage(null), 3000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update page design settings.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-border/40 rounded-xl" />
                    <div className="h-4 w-72 bg-border/40 rounded-lg" />
                </div>
                <div className="bg-surface border border-border rounded-3xl p-6 space-y-6 shadow-xs">
                    <div className="h-28 w-full bg-border/40 rounded-2xl" />
                    <div className="h-20 w-full bg-border/40 rounded-2xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Page Design</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Customize how your public support page looks and behaves for your audience.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-full shadow-xs transition-all flex items-center space-x-2 w-fit cursor-pointer disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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
                    className="pb-3 text-sm font-semibold text-primary-600 border-b-2 border-primary-600 flex items-center gap-2"
                >
                    <Palette className="w-4 h-4" />
                    <span>Page Design</span>
                </Link>
                <Link
                    href="/dashboard/settings/payouts"
                    className="pb-3 text-sm font-medium text-text-muted hover:text-text-secondary flex items-center gap-2"
                >
                    <CreditCard className="w-4 h-4" />
                    <span>Payout & KYC</span>
                </Link>
            </div>

            {message && (
                <div className="p-4 text-xs font-bold text-success-700 bg-success-50 border border-success-200 rounded-2xl flex items-center space-x-2 animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>{message}</span>
                </div>
            )}

            {error && (
                <div className="p-4 text-xs font-bold text-error-700 bg-error-50 border border-error-200 rounded-2xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Choose Layout */}
                <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Choose a Layout</h3>
                        <p className="text-xs text-text-muted mt-0.5">Select how supporters choose their contribution amount.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option 1: Preset Amounts (Recommended) */}
                        <div
                            onClick={() => setLayoutType('presets')}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-4 select-none ${
                                layoutType === 'presets'
                                    ? 'border-primary-600 bg-primary-500/5 ring-1 ring-primary-500/20'
                                    : 'border-border bg-background hover:border-text-muted'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                        layoutType === 'presets' ? 'border-primary-600 bg-primary-600' : 'border-border'
                                    }`}>
                                        {layoutType === 'presets' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <span className="font-bold text-sm text-text-primary">Preset Amounts</span>
                                </div>
                                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                    RECOMMENDED
                                </span>
                            </div>

                            {/* Mini Layout Mockup */}
                            <div className="bg-surface border border-border rounded-xl p-3.5 space-y-2.5">
                                <div className="text-[11px] font-bold text-text-secondary text-center">Support Creator</div>
                                <div className="flex items-center justify-center gap-1.5">
                                    <div className="px-2.5 py-1.5 bg-primary-600 text-white rounded-lg text-[10px] font-bold">
                                        ৳{preset1}
                                    </div>
                                    <div className="px-2.5 py-1.5 bg-background border border-border text-text-secondary rounded-lg text-[10px] font-bold">
                                        ৳{preset2}
                                    </div>
                                    <div className="px-2.5 py-1.5 bg-background border border-border text-text-secondary rounded-lg text-[10px] font-bold">
                                        ৳{preset3}
                                    </div>
                                </div>
                                <div className="w-full py-2 bg-primary-600 text-white rounded-lg text-[10px] font-bold text-center uppercase tracking-wider">
                                    {buttonWording} ৳{preset1}
                                </div>
                            </div>
                        </div>

                        {/* Option 2: Quantity Multiplier (Coffee View) */}
                        <div
                            onClick={() => setLayoutType('standard')}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-4 select-none ${
                                layoutType === 'standard'
                                    ? 'border-primary-600 bg-primary-500/5 ring-1 ring-primary-500/20'
                                    : 'border-border bg-background hover:border-text-muted'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                        layoutType === 'standard' ? 'border-primary-600 bg-primary-600' : 'border-border'
                                    }`}>
                                        {layoutType === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <span className="font-bold text-sm text-text-primary">Quantity Multiplier</span>
                                </div>
                            </div>

                            {/* Mini Layout Mockup */}
                            <div className="bg-surface border border-border rounded-xl p-3.5 space-y-2.5">
                                <div className="text-[11px] font-bold text-text-secondary text-center">
                                    Buy {unitEmoji} {unitNoun}
                                </div>
                                <div className="flex items-center justify-center space-x-2 bg-background border border-border p-1.5 rounded-lg">
                                    <span className="text-xs">{unitEmoji}</span>
                                    <span className="text-[10px] font-mono text-text-muted">x</span>
                                    <div className="px-2 py-0.5 bg-primary-600 text-white rounded font-bold text-[10px]">1</div>
                                    <div className="px-2 py-0.5 text-text-secondary font-bold text-[10px]">3</div>
                                    <div className="px-2 py-0.5 text-text-secondary font-bold text-[10px]">5</div>
                                </div>
                                <div className="w-full py-2 bg-primary-600 text-white rounded-lg text-[10px] font-bold text-center uppercase tracking-wider">
                                    {buttonWording} ৳{unitPrice}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preset Amounts Configuration */}
                {layoutType === 'presets' ? (
                    <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">Suggested Amounts (BDT)</h3>
                                <p className="text-xs text-text-muted mt-0.5">Set the quick single-click support amounts shown on your page.</p>
                            </div>
                            <span className="px-2.5 py-1 bg-primary-100 text-primary-700 text-[10px] font-extrabold rounded-full uppercase">
                                RECOMMENDED
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-secondary">Amount 1</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-text-muted text-sm font-bold">৳</span>
                                    <input
                                        type="number"
                                        min="10"
                                        value={preset1}
                                        onChange={(e) => setPreset1(e.target.value)}
                                        className="w-full bg-background border border-border rounded-2xl pl-9 pr-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-secondary">Amount 2</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-text-muted text-sm font-bold">৳</span>
                                    <input
                                        type="number"
                                        min="10"
                                        value={preset2}
                                        onChange={(e) => setPreset2(e.target.value)}
                                        className="w-full bg-background border border-border rounded-2xl pl-9 pr-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-secondary">Amount 3</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-text-muted text-sm font-bold">৳</span>
                                    <input
                                        type="number"
                                        min="10"
                                        value={preset3}
                                        onChange={(e) => setPreset3(e.target.value)}
                                        className="w-full bg-background border border-border rounded-2xl pl-9 pr-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary">Quantity Unit Settings</h3>
                            <p className="text-xs text-text-muted mt-0.5">Customize your unit item, emoji, and single unit price.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-secondary">Unit Noun</label>
                                <input
                                    type="text"
                                    value={unitNoun}
                                    onChange={(e) => setUnitNoun(e.target.value)}
                                    placeholder="coffee"
                                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-secondary">Emoji</label>
                                <input
                                    type="text"
                                    value={unitEmoji}
                                    onChange={(e) => setUnitEmoji(e.target.value)}
                                    placeholder="coffee"
                                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-secondary">Single Unit Price (BDT)</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-text-muted text-sm font-bold">৳</span>
                                    <input
                                        type="number"
                                        min="10"
                                        value={unitPrice}
                                        onChange={(e) => setUnitPrice(e.target.value)}
                                        className="w-full bg-background border border-border rounded-2xl pl-9 pr-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Button Action Wording */}
                <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Button Action Wording</h3>
                        <p className="text-xs text-text-muted mt-0.5">What action verb should be displayed on your primary payment button?</p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                        {buttonWordingOptions.map((word) => (
                            <button
                                key={word}
                                type="button"
                                onClick={() => setButtonWording(word)}
                                className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all border cursor-pointer ${
                                    buttonWording === word
                                        ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                                        : 'bg-background text-text-secondary border-border hover:border-text-muted'
                                }`}
                            >
                                {word}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Feed Toggle */}
                <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs flex items-center justify-between gap-4">
                    <div className="space-y-1 max-w-md">
                        <h3 className="text-base font-bold text-text-primary">Supporter Wall & Recent Feed</h3>
                        <p className="text-xs text-text-muted">
                            Display the recent supporters list and public comments feed on your profile page.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowSupporterWall(!showSupporterWall)}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                            showSupporterWall ? 'bg-primary-600' : 'bg-border'
                        }`}
                    >
                        <div
                            className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                showSupporterWall ? 'translate-x-6' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-full shadow-xs transition-all inline-flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{saving ? 'Saving Settings...' : 'Save Page Design'}</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
