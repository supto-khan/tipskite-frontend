'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Mail, Send, Users, CheckCircle2, Clock, Plus } from 'lucide-react'
import { Select } from '@/app/components/ui/select'

export default function EmailCampaignsDashboard() {
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Form Modal State
    const [showModal, setShowModal] = useState(false)
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [audience, setAudience] = useState<'all' | 'supporters' | 'members'>('all')
    const [sending, setSending] = useState(false)

    const fetchCampaigns = async () => {
        try {
            const res = await axios.get('/api/v1/creator/campaigns')
            setCampaigns(res.data.campaigns || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const handleCreateAndSend = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)
        try {
            // 1. Create draft
            const draftRes = await axios.post('/api/v1/creator/campaigns', {
                subject,
                body,
                audience,
            })

            const campaignId = draftRes.data.campaign.id

            // 2. Dispatch
            const sendRes = await axios.post(`/api/v1/creator/campaigns/${campaignId}/send`)
            alert(sendRes.data.message)

            setShowModal(false)
            setSubject('')
            setBody('')
            setAudience('all')
            fetchCampaigns()
        } catch (e) {
            console.error(e)
        } finally {
            setSending(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto py-8 space-y-8 px-4 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-border/40 rounded-xl" />
                        <div className="h-4 w-72 bg-border/40 rounded-lg" />
                    </div>
                    <div className="h-10 w-40 bg-border/40 rounded-full" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
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
        <div className="max-w-5xl mx-auto py-8 space-y-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-text-primary flex items-center space-x-2">
                        <Mail className="h-6 w-6 text-primary-600" />
                        <span>Email Broadcasts & Newsletters</span>
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Send updates, project announcements, and newsletter posts directly to your supporters' inbox.
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Email Broadcast</span>
                </button>
            </div>

            {/* Past Campaigns Table */}
            <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-text-primary text-base">Broadcast History</h3>

                {campaigns.length === 0 ? (
                    <div className="text-center py-12 text-xs text-text-muted space-y-2">
                        <Mail className="h-8 w-8 text-text-muted mx-auto" />
                        <div>No broadcast newsletters sent yet.</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border text-xs font-semibold text-text-muted">
                                    <th className="pb-3">Subject</th>
                                    <th className="pb-3">Audience</th>
                                    <th className="pb-3">Recipients</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Sent At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-xs text-text-secondary">
                                {campaigns.map((c) => (
                                    <tr key={c.id}>
                                        <td className="py-3 font-bold text-text-primary max-w-xs truncate">{c.subject}</td>
                                        <td className="py-3 capitalize text-text-muted font-medium">
                                            {c.audience === 'all' ? 'All Supporters' : c.audience}
                                        </td>
                                        <td className="py-3 font-mono text-primary-600 font-bold">{c.delivered_count || 0}</td>
                                        <td className="py-3">
                                            {c.status === 'sent' ? (
                                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success-50 text-success-700">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>Sent</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-background text-text-secondary">
                                                    <Clock className="h-3 w-3" />
                                                    <span>Draft</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-text-muted font-mono text-[11px]">
                                            {c.sent_at ? new Date(c.sent_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create & Send Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-surface rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                        <h3 className="text-lg font-black text-text-primary">Compose Email Broadcast</h3>

                        <form onSubmit={handleCreateAndSend} className="space-y-4">
                            <Select
                                label="Target Audience"
                                value={audience}
                                onChange={(val) => setAudience(val as any)}
                                options={[
                                    { value: 'all', label: 'All Supporters & Members' },
                                    { value: 'members', label: 'Active Tier Members Only' }
                                ]}
                            />

                            <div>
                                <label className="block text-xs font-bold text-text-secondary">Email Subject Line</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Big Announcement & Monthly Creator Update!"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary">Email Content (Markdown / Text)</label>
                                <textarea
                                    rows={6}
                                    required
                                    placeholder="Write your email newsletter update here..."
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-background hover:bg-border text-text-secondary text-xs font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center space-x-1"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    <span>{sending ? 'Sending Broadcast...' : 'Dispatch Broadcast'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
