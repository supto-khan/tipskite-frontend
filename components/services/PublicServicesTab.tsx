'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Briefcase, Clock, ArrowRight } from 'lucide-react'

interface PublicServicesTabProps {
    slug: string
}

export default function PublicServicesTab({ slug }: PublicServicesTabProps) {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Booking modal
    const [bookingService, setBookingService] = useState<any | null>(null)
    const [supporterName, setSupporterName] = useState('')
    const [supporterEmail, setSupporterEmail] = useState('')
    const [intakeAnswers, setIntakeAnswers] = useState<Record<string, string>>({})
    const [ordering, setOrdering] = useState(false)

    useEffect(() => {
        axios
            .get(`/api/v1/creators/${slug}/services`)
            .then((res) => {
                setServices(res.data.services || [])
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [slug])

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!bookingService) return

        setOrdering(true)
        try {
            const res = await axios.post(`/api/v1/services/${bookingService.id}/order`, {
                supporter_name: supporterName,
                supporter_email: supporterEmail,
                intake_response: intakeAnswers,
            })

            if (res.data.payment_url) {
                window.location.href = res.data.payment_url
            }
        } catch (e) {
            console.error(e)
            setOrdering(false)
        }
    }

    if (loading) {
        return <div className="py-8 text-center text-xs text-text-muted">Loading services...</div>
    }

    if (services.length === 0) {
        return (
            <div className="text-center py-12 bg-surface rounded-3xl border border-border p-8 space-y-2">
                <Briefcase className="h-8 w-8 text-text-muted mx-auto" />
                <h4 className="font-bold text-text-primary text-sm">No 1-on-1 Services Currently Offered</h4>
                <p className="text-xs text-text-muted">This creator has not listed any services yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="bg-surface rounded-3xl border border-border p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-text-primary text-base">{service.title}</h3>
                                <span className="px-3 py-1 bg-primary-50 text-primary-700 font-extrabold text-xs rounded-full">
                                    BDT {(service.price_cents / 100).toFixed(0)}
                                </span>
                            </div>
                            <p className="text-xs text-text-secondary line-clamp-3">{service.description || 'No description provided.'}</p>
                        </div>

                        <div className="pt-2 border-t border-border flex items-center justify-between">
                            <span className="flex items-center space-x-1 text-xs text-text-muted">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{service.delivery_days || 3} Days Delivery</span>
                            </span>

                            <button
                                onClick={() => setBookingService(service)}
                                className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1 transition-all"
                            >
                                <span>Book Service</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Modal */}
            {bookingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-surface rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-primary-600">Booking Service</span>
                            <h3 className="text-lg font-black text-text-primary">{bookingService.title}</h3>
                            <div className="text-sm font-bold text-text-primary">
                                BDT {(bookingService.price_cents / 100).toFixed(0)}
                            </div>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Tanvir Hossain"
                                    value={supporterName}
                                    onChange={(e) => setSupporterName(e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary">Your Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="tanvir@example.com"
                                    value={supporterEmail}
                                    onChange={(e) => setSupporterEmail(e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            {/* Render Intake Schema Fields if available */}
                            {bookingService.intake_schema && bookingService.intake_schema.length > 0 && (
                                <div className="space-y-3 pt-2 border-t border-border">
                                    <div className="text-xs font-bold text-text-secondary">Requirements / Details:</div>
                                    {bookingService.intake_schema.map((field: any, idx: number) => (
                                        <div key={idx}>
                                            <label className="block text-xs font-medium text-text-secondary">{field.label}</label>
                                            <input
                                                type={field.type || 'text'}
                                                required={field.required}
                                                onChange={(e) =>
                                                    setIntakeAnswers((prev) => ({
                                                        ...prev,
                                                        [field.key || field.label]: e.target.value,
                                                    }))
                                                }
                                                className="mt-1 w-full px-3 py-2 border border-border rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setBookingService(null)}
                                    className="px-4 py-2 bg-background hover:bg-border text-text-secondary text-xs font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ordering}
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                                >
                                    {ordering ? 'Redirecting to Payment...' : 'Proceed to Checkout'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
