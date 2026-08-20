'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import {
    Brush,
    X,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Send
} from 'lucide-react'

interface CustomStorefrontRequestModalProps {
    isOpen: boolean
    onClose: () => void
    defaultBrandName?: string
    defaultEmail?: string
    onSuccess?: () => void
}

export default function CustomStorefrontRequestModal({
    isOpen,
    onClose,
    defaultBrandName = '',
    defaultEmail = '',
    onSuccess,
}: CustomStorefrontRequestModalProps) {
    const [brandName, setBrandName] = useState(defaultBrandName)
    const [contactEmail, setContactEmail] = useState(defaultEmail)
    const [contactPhone, setContactPhone] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [designRequirements, setDesignRequirements] = useState('')
    const [referenceLinks, setReferenceLinks] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        if (defaultBrandName && !brandName) {
            setBrandName(defaultBrandName)
        }
        if (defaultEmail && !contactEmail) {
            setContactEmail(defaultEmail)
        }
    }, [defaultBrandName, defaultEmail])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setErrorMessage(null)
        setSuccessMessage(null)

        try {
            const res = await axios.post('/api/v1/creator/custom-storefront-requests', {
                brand_name: brandName,
                contact_email: contactEmail,
                contact_phone: contactPhone || null,
                whatsapp_number: whatsappNumber || null,
                design_requirements: designRequirements,
                reference_links: referenceLinks || null,
            })

            setSuccessMessage(res.data.message || 'Custom storefront request submitted successfully!')
            if (onSuccess) onSuccess()

            setTimeout(() => {
                onClose()
                setSuccessMessage(null)
                setDesignRequirements('')
                setReferenceLinks('')
            }, 2000)
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || 'Failed to submit custom storefront request.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-surface border border-border rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 my-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-primary-500/10 text-primary-600 rounded-2xl">
                            <Brush className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-text-primary">Request Custom Storefront</h3>
                            <p className="text-xs text-text-muted">Tailor-made design for your public creator page</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-background rounded-full transition-all cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {errorMessage && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl text-xs font-semibold flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-secondary">
                                Brand / Creator Title <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                placeholder="e.g. Acme Media Hub"
                                className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-secondary">
                                Contact Email <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-secondary">
                                WhatsApp Number
                            </label>
                            <input
                                type="tel"
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                placeholder="+8801XXXXXXXXX"
                                className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-secondary">
                                Contact Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="01XXXXXXXXX"
                                className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary">
                            Design Requirements & Wishlist <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={designRequirements}
                            onChange={(e) => setDesignRequirements(e.target.value)}
                            placeholder="Describe your desired branding, color scheme, custom hero sections, video embeds, portfolio layouts, or custom buttons..."
                            className="w-full bg-background border border-border rounded-2xl p-4 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none leading-relaxed"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary">
                            Inspiration / Reference Links (Optional)
                        </label>
                        <input
                            type="text"
                            value={referenceLinks}
                            onChange={(e) => setReferenceLinks(e.target.value)}
                            placeholder="e.g. https://dribbble.com/..., https://example.com"
                            className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-background hover:bg-border/40 text-text-secondary text-xs font-bold rounded-2xl transition-all cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
