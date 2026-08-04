'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Plus, Check, Trash2, CreditCard } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function CreatorMemberships() {
    const [tiers, setTiers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [tierToDelete, setTierToDelete] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    // Form states
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [priceBDT, setPriceBDT] = useState('500')
    const [perkInput, setPerkInput] = useState('')
    const [perks, setPerks] = useState<string[]>([])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTiers = async () => {
        try {
            const res = await axios.get('/api/v1/creator/membership-tiers')
            setTiers(res.data.tiers || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTiers()
    }, [])

    const addPerk = () => {
        if (perkInput.trim()) {
            setPerks([...perks, perkInput.trim()])
            setPerkInput('')
        }
    }

    const removePerk = (index: number) => {
        setPerks(perks.filter((_, i) => i !== index))
    }

    const handleCreateTier = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            await axios.post('/api/v1/creator/membership-tiers', {
                name,
                description,
                price_cents: Math.round(parseFloat(priceBDT) * 100),
                interval: 'month',
                perks,
            })
            setShowModal(false)
            setName('')
            setDescription('')
            setPriceBDT('500')
            setPerks([])
            fetchTiers()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create membership tier')
        } finally {
            setSaving(false)
        }
    }

    const confirmDeleteTier = async () => {
        if (!tierToDelete) return
        setDeleting(true)
        try {
            await axios.delete(`/api/v1/creator/membership-tiers/${tierToDelete}`)
            setTierToDelete(null)
            fetchTiers()
        } catch (e) {
            console.error(e)
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-8 w-44 bg-border/40 rounded-xl" />
                        <div className="h-4 w-64 bg-border/40 rounded-lg" />
                    </div>
                    <div className="h-10 w-36 bg-border/40 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-xs">
                            <div className="h-6 w-3/4 bg-border/40 rounded-xl" />
                            <div className="h-8 w-24 bg-border/40 rounded-xl" />
                            <div className="h-4 w-full bg-border/40 rounded-lg" />
                            <div className="h-4 w-2/3 bg-border/40 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Membership Tiers</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Create monthly membership levels for your most loyal supporters.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-md flex items-center space-x-2 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    <span>Create Tier</span>
                </button>
            </div>

            {tiers.length === 0 ? (
                <div className="bg-surface rounded-2xl shadow-sm border border-border p-12 text-center space-y-4">
                    <div className="p-4 bg-primary-50 text-primary-600 rounded-full w-fit mx-auto">
                        <CreditCard className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">No membership tiers yet</h3>
                    <p className="text-sm text-text-muted max-w-md mx-auto">
                        Set up subscription levels to offer exclusive perks, discord roles, or early access content to your supporters.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg inline-flex items-center space-x-1"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Your First Tier</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((tier) => (
                        <div key={tier.id} className="bg-surface rounded-2xl shadow-sm border border-border p-6 flex flex-col justify-between relative">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-text-primary">{tier.name}</h3>
                                    <button
                                        onClick={() => setTierToDelete(tier.id)}
                                        className="text-text-muted hover:text-error-600 p-1 transition-all"
                                        title="Delete Tier"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="mt-2 text-2xl font-extrabold text-primary-600">
                                    BDT {(tier.price_cents / 100).toFixed(0)} <span className="text-xs font-normal text-text-muted">/{tier.interval}</span>
                                </div>
                                {tier.description && (
                                    <p className="mt-3 text-xs text-text-secondary">{tier.description}</p>
                                )}

                                {tier.perks && tier.perks.length > 0 && (
                                    <ul className="mt-4 space-y-2 border-t border-border pt-4">
                                        {tier.perks.map((perk: string, idx: number) => (
                                            <li key={idx} className="flex items-center text-xs text-text-secondary space-x-2">
                                                <Check className="h-4 w-4 text-success-500 flex-shrink-0" />
                                                <span>{perk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-border text-xs text-text-muted">
                                {tier.member_count} active members
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for creating a tier */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-text-primary">Create Membership Tier</h3>

                        {error && <div className="p-3 bg-error-50 text-error-700 text-xs rounded-lg">{error}</div>}

                        <form onSubmit={handleCreateTier} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary">Tier Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Bronze Supporter, VIP Club"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary">Price (BDT / Month)</label>
                                <input
                                    type="number"
                                    required
                                    min={10}
                                    value={priceBDT}
                                    onChange={(e) => setPriceBDT(e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary">Description</label>
                                <textarea
                                    rows={2}
                                    placeholder="Brief description of what members get..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary">Perks List</label>
                                <div className="flex space-x-2 mt-1">
                                    <input
                                        type="text"
                                        placeholder="Add a perk (e.g. Discord role)"
                                        value={perkInput}
                                        onChange={(e) => setPerkInput(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-border rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={addPerk}
                                        className="px-3 py-2 bg-background hover:bg-border text-text-secondary text-xs font-semibold rounded-xl"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {perks.map((p, i) => (
                                        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                                            {p}
                                            <button type="button" onClick={() => removePerk(i)} className="ml-1 text-primary-400 hover:text-primary-600">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-background hover:bg-border text-text-secondary text-xs font-semibold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-md disabled:opacity-50"
                                >
                                    {saving ? 'Creating...' : 'Save Tier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!tierToDelete}
                title="Delete Membership Tier?"
                message="Are you sure you want to delete this tier? Existing active subscribers will retain access."
                confirmText="Delete Tier"
                cancelText="Cancel"
                variant="danger"
                isLoading={deleting}
                onConfirm={confirmDeleteTier}
                onClose={() => setTierToDelete(null)}
            />
        </div>
    )
}
