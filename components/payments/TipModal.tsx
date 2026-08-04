'use client'

import { useState } from 'react'
import { Coffee } from 'lucide-react'
import axios from '@/lib/axios'

interface TipModalProps {
    profile: any
}

export default function TipModal({ profile }: TipModalProps) {
    const slug = profile?.slug
    const creatorName = profile?.display_name || profile?.user?.display_name || 'Creator'
    const layoutType = profile?.layout_type || 'presets'
    const buttonWording = profile?.button_wording || 'Support'

    // Preset amounts in BDT (converted from cents)
    const rawPresets = Array.isArray(profile?.unit_presets) && profile.unit_presets.length >= 3
        ? profile.unit_presets.map((c: number) => c / 100)
        : [100, 300, 500]

    const [selectedAmount, setSelectedAmount] = useState<number>(rawPresets[0])
    const [customAmount, setCustomAmount] = useState<string>('')
    const [quantity, setQuantity] = useState(1)

    const unitNoun = profile?.unit_noun || 'coffee'
    const unitEmoji = profile?.unit_emoji || '☕'
    const unitPriceBDT = profile?.unit_price_cents ? profile.unit_price_cents / 100 : 100

    const [supporterName, setSupporterName] = useState('')
    const [supporterEmail, setSupporterEmail] = useState('')
    const [message, setMessage] = useState('')
    const [coverFees, setCoverFees] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const baseAmountBDT = layoutType === 'presets'
        ? (customAmount ? parseFloat(customAmount) || 0 : selectedAmount)
        : quantity * unitPriceBDT

    const feeBDT = Math.round(baseAmountBDT * 0.075 * 100) / 100
    const totalBDT = coverFees ? baseAmountBDT + feeBDT : baseAmountBDT

    const handleTip = async (e: React.FormEvent) => {
        e.preventDefault()
        if (baseAmountBDT < 10) {
            setError('Minimum contribution amount is ৳10.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const res = await axios.post('/api/v1/tips', {
                slug,
                quantity: layoutType === 'presets' ? 1 : quantity,
                unit_amount_cents: Math.round(baseAmountBDT * 100),
                supporter_name: supporterName || 'Anonymous',
                supporter_email: supporterEmail || null,
                message: message || null,
                cover_fees: coverFees,
            })

            if (res.data?.redirect_url) {
                window.location.href = res.data.redirect_url
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div suppressHydrationWarning className="bg-surface rounded-3xl shadow-xl p-6 border border-border flex flex-col justify-between font-sans">
            <div suppressHydrationWarning className="flex items-center space-x-3 mb-4">
                <div suppressHydrationWarning className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                    <Coffee className="w-6 h-6 text-primary-600" />
                </div>
                <div suppressHydrationWarning>
                    <h3 className="text-lg font-bold text-text-primary">
                        {layoutType === 'presets' ? `${buttonWording} ${creatorName}` : `Buy ${creatorName} a ${unitNoun}`}
                    </h3>
                    <p className="text-xs text-text-muted">Support their creative work directly</p>
                </div>
            </div>

            {error && (
                <div suppressHydrationWarning className="p-3 bg-error-50 text-error-700 text-xs rounded-2xl border border-error-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleTip} className="space-y-5">
                {/* Layout Type 1: Presets */}
                {layoutType === 'presets' ? (
                    <div suppressHydrationWarning className="space-y-3">
                        <div suppressHydrationWarning className="grid grid-cols-3 gap-2">
                            {rawPresets.map((amt: number) => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => {
                                        setSelectedAmount(amt)
                                        setCustomAmount('')
                                    }}
                                    className={`py-3 px-2 rounded-2xl font-extrabold text-sm transition-all border cursor-pointer ${
                                        selectedAmount === amt && !customAmount
                                            ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                                            : 'bg-background text-text-primary border-border hover:border-text-muted'
                                    }`}
                                >
                                    ৳{amt}
                                </button>
                            ))}
                        </div>

                        {/* Custom amount input */}
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-text-muted text-sm font-bold">৳</span>
                            <input
                                type="number"
                                min="10"
                                placeholder="Other amount (BDT)"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                            />
                        </div>
                    </div>
                ) : (
                    /* Layout Type 2: Quantity Multiplier */
                    <div className="flex items-center justify-between p-3.5 bg-background rounded-2xl border border-border">
                        <div className="flex items-center space-x-2">
                            <span className="text-base">{unitEmoji}</span>
                            <span className="font-bold text-sm text-text-primary">× {quantity}</span>
                        </div>
                        <div className="flex space-x-1.5">
                            {[1, 3, 5, 10].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setQuantity(num)}
                                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        quantity === num
                                            ? 'bg-primary-600 text-white shadow-xs'
                                            : 'bg-surface text-text-secondary hover:bg-border border border-border'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Name */}
                <div>
                    <input
                        type="text"
                        placeholder="Name or @social (optional)"
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                </div>

                {/* Email */}
                <div>
                    <input
                        type="email"
                        placeholder="Email address (optional)"
                        value={supporterEmail}
                        onChange={(e) => setSupporterEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                </div>

                {/* Message */}
                <div>
                    <textarea
                        rows={3}
                        placeholder="Say something nice... (optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                </div>



                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <span>Processing...</span>
                    ) : (
                        <span>{buttonWording} ৳{totalBDT.toFixed(0)}</span>
                    )}
                </button>
            </form>
        </div>
    )
}
