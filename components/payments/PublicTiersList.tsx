'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Check, Star } from 'lucide-react'

export default function PublicTiersList({ slug }: { slug: string }) {
    const [tiers, setTiers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [subscribingId, setSubscribingId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        axios.get(`/api/v1/creators/${slug}/tiers`)
            .then((res) => setTiers(res.data.tiers || []))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false))
    }, [slug])

    const handleSubscribe = async (tierId: string) => {
        setSubscribingId(tierId)
        setError(null)

        try {
            const res = await axios.post('/api/v1/subscriptions', {
                membership_tier_id: tierId,
            })
            if (res.data?.redirect_url) {
                window.location.href = res.data.redirect_url
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                window.location.href = `/login?redirect=/${slug}`
            } else {
                setError(err.response?.data?.message || 'Failed to initiate subscription')
            }
            setSubscribingId(null)
        }
    }

    if (loading) {
        return <div className="p-4 text-xs text-text-muted text-center">Loading membership tiers...</div>
    }

    if (tiers.length === 0) {
        return (
            <div className="p-6 bg-surface rounded-2xl border border-border text-center text-xs text-text-muted">
                This creator hasn't published membership tiers yet.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {error && <div className="p-3 bg-error-50 text-error-700 text-xs rounded-xl">{error}</div>}

            {tiers.map((tier) => (
                <div key={tier.id} className="bg-surface rounded-2xl p-6 border border-border shadow-sm space-y-4 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-text-primary text-base">{tier.name}</h3>
                            <div className="text-xl font-extrabold text-primary-600 mt-1">
                                BDT {(tier.price_cents / 100).toFixed(0)}{' '}
                                <span className="text-xs font-normal text-text-muted">/{tier.interval}</span>
                            </div>
                        </div>
                        <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                            <Star className="h-5 w-5" />
                        </div>
                    </div>

                    {tier.description && (
                        <p className="text-xs text-text-secondary leading-relaxed">{tier.description}</p>
                    )}

                    {tier.perks && tier.perks.length > 0 && (
                        <ul className="space-y-2 border-t border-border pt-3">
                            {tier.perks.map((perk: string, idx: number) => (
                                <li key={idx} className="flex items-center text-xs text-text-secondary space-x-2">
                                    <Check className="h-3.5 w-3.5 text-success-500 flex-shrink-0" />
                                    <span>{perk}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        onClick={() => handleSubscribe(tier.id)}
                        disabled={subscribingId === tier.id}
                        className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                    >
                        {subscribingId === tier.id ? 'Redirecting to payment...' : 'Join Membership'}
                    </button>
                </div>
            ))}
        </div>
    )
}
