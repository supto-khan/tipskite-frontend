'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from '@/lib/axios'

export default function StreamAlertOverlay() {
    const params = useParams()
    const token = params?.token as string

    const [currentAlert, setCurrentAlert] = useState<any | null>(null)
    const [config, setConfig] = useState<any>({
        duration_seconds: 8,
        theme: 'default',
        message_template: '{name} supported with BDT {amount}!',
    })
    const [seenAlertIds, setSeenAlertIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (!token) return

        const checkFeed = async () => {
            try {
                const res = await axios.get(`/api/v1/alerts/feed/${token}`)
                if (res.data?.config) {
                    setConfig(res.data.config)
                }

                const alerts = res.data?.alerts || []
                const newAlert = alerts.find((a: any) => !seenAlertIds.has(a.id))

                if (newAlert && !currentAlert) {
                    setSeenAlertIds((prev) => new Set(prev).add(newAlert.id))
                    setCurrentAlert(newAlert)

                    setTimeout(() => {
                        setCurrentAlert(null)
                    }, (res.data.config.duration_seconds || 8) * 1000)
                }
            } catch (e) {
                console.error(e)
            }
        }

        checkFeed()
        const interval = setInterval(checkFeed, 3000)
        return () => clearInterval(interval)
    }, [token, seenAlertIds, currentAlert])

    if (!currentAlert) {
        return <div className="min-h-screen bg-transparent" />
    }

    const messageText = config.message_template
        ? config.message_template
              .replace('{name}', currentAlert.supporter_name)
              .replace('{amount}', currentAlert.amount)
              .replace('{quantity}', '1')
              .replace('{unit}', 'coffee')
        : `${currentAlert.supporter_name} supported BDT ${currentAlert.amount}!`

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-8 overflow-hidden">
            <div className="animate-bounce bg-gradient-to-r from-amber-500 via-primary-600 to-purple-600 p-1 rounded-3xl shadow-2xl max-w-lg w-full transform transition-all">
                <div className="bg-surface text-text-primary rounded-3xl p-6 text-center space-y-3 border border-border">
                    <div className="text-4xl animate-pulse">🎉</div>
                    <h2 className="text-2xl font-black tracking-wide text-amber-500 drop-shadow-md">
                        {currentAlert.supporter_name}
                    </h2>
                    <div className="text-3xl font-extrabold text-text-primary">
                        BDT {currentAlert.amount}
                    </div>
                    <p className="text-sm text-text-secondary font-medium">
                        {messageText}
                    </p>
                </div>
            </div>
        </div>
    )
}
