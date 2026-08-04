'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, RefreshCw } from 'lucide-react'
import { Suspense } from 'react'

function PaymentCancelContent() {
    const searchParams = useSearchParams()
    const reason = searchParams.get('reason')
    const tranId = searchParams.get('tran_id')

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-xl border border-border text-center space-y-6">
                <div className="flex justify-center">
                    <div className="p-4 bg-error-100 rounded-full text-error-600">
                        <XCircle className="h-12 w-12" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-extrabold text-text-primary">Payment Not Completed</h2>
                    <p className="mt-2 text-sm text-text-secondary">
                        {reason === 'canceled'
                            ? 'You canceled the payment session.'
                            : 'The payment could not be processed. Please try again.'}
                    </p>
                </div>

                {tranId && (
                    <div className="bg-background p-3 rounded-lg text-xs font-mono text-text-muted">
                        Reference ID: {tranId}
                    </div>
                )}

                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 py-3 px-6 bg-secondary hover:bg-secondary text-white font-semibold rounded-xl transition-all shadow-md"
                    >
                        <RefreshCw className="h-5 w-5" />
                        <span>Try Again</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function PaymentCancel() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentCancelContent />
        </Suspense>
    )
}
