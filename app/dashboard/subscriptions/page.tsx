'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { CreditCard, Calendar, AlertCircle } from 'lucide-react'

import ConfirmModal from '@/components/ui/ConfirmModal'

export default function SupporterSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [subToCancel, setSubToCancel] = useState<string | null>(null)
    const [canceling, setCanceling] = useState(false)

    const fetchSubscriptions = async () => {
        try {
            const res = await axios.get('/api/v1/supporter/subscriptions')
            setSubscriptions(res.data.subscriptions || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubscriptions()
    }, [])

    const confirmCancelSubscription = async () => {
        if (!subToCancel) return
        setCanceling(true)
        try {
            await axios.post(`/api/v1/subscriptions/${subToCancel}/cancel`)
            setSubToCancel(null)
            fetchSubscriptions()
        } catch (e) {
            console.error(e)
        } finally {
            setCanceling(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div className="space-y-2">
                    <div className="h-8 w-44 bg-border/40 rounded-xl" />
                    <div className="h-4 w-64 bg-border/40 rounded-lg" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-surface border border-border rounded-3xl p-6 space-y-3 shadow-xs">
                            <div className="flex items-center justify-between">
                                <div className="h-6 w-1/3 bg-border/40 rounded-xl" />
                                <div className="h-6 w-20 bg-border/40 rounded-full" />
                            </div>
                            <div className="h-4 w-full bg-border/40 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">My Subscriptions</h1>
                <p className="mt-1 text-sm text-text-secondary">
                    Manage active creator memberships and subscription renewals.
                </p>
            </div>

            {subscriptions.length === 0 ? (
                <div className="bg-surface rounded-2xl shadow-sm border border-border p-12 text-center space-y-4">
                    <div className="p-4 bg-primary-50 text-primary-600 rounded-full w-fit mx-auto">
                        <CreditCard className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">No active subscriptions</h3>
                    <p className="text-sm text-text-muted max-w-md mx-auto">
                        You haven't subscribed to any creator membership tiers yet. Visit your favorite creator's page to support them monthly!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {subscriptions.map((sub) => (
                        <div key={sub.id} className="bg-surface rounded-2xl shadow-sm border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {sub.creator_profile?.user?.avatar_url ? (
                                        <img src={sub.creator_profile.user.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <CreditCard className="h-6 w-6 text-primary-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">
                                        {sub.membership_tier?.name || 'Membership'}
                                    </h3>
                                    <p className="text-xs text-text-muted">
                                        Creator: <span className="font-semibold text-text-secondary">{sub.creator_profile?.user?.display_name || sub.creator_profile?.slug}</span>
                                    </p>
                                    <div className="mt-1 flex items-center space-x-2 text-xs text-text-muted">
                                        <Calendar className="h-3.5 w-3.5 text-text-muted" />
                                        <span>Next renewal: {sub.next_charge_date ? new Date(sub.next_charge_date).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end space-x-4">
                                <div className="text-right">
                                    <div className="text-lg font-bold text-text-primary">
                                        BDT {(sub.amount_cents / 100).toFixed(0)} <span className="text-xs font-normal text-text-muted">/{sub.interval}</span>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                        sub.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-background text-text-primary'
                                    }`}>
                                        {sub.status}
                                    </span>
                                </div>

                                {sub.status === 'active' && (
                                    <button
                                        onClick={() => setSubToCancel(sub.id)}
                                        className="py-1.5 px-3 bg-error-50 hover:bg-error-100 text-error-600 text-xs font-semibold rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={!!subToCancel}
                title="Cancel Subscription?"
                message="Are you sure you want to cancel this subscription? Your access will continue until the end of the current billing period."
                confirmText="Cancel Subscription"
                cancelText="Keep Subscription"
                variant="danger"
                isLoading={canceling}
                onConfirm={confirmCancelSubscription}
                onClose={() => setSubToCancel(null)}
            />
        </div>
    )
}
