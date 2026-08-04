'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Bell, Heart, Coffee, Shield, ShoppingBag } from 'lucide-react'

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        axios.get('/api/v1/notifications')
            .then((res) => {
                const list = res.data.notifications || []
                setNotifications(list)
                setUnreadCount(list.length)
            })
            .catch((e) => console.error(e))
    }, [])

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-background relative"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-600 rounded-full ring-2 ring-white" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface rounded-2xl shadow-2xl border border-border p-4 z-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                        <h4 className="font-bold text-text-primary text-xs">Activity Notifications</h4>
                        <span className="text-[10px] text-text-muted">{notifications.length} recent</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                            <div className="text-center py-6 text-xs text-text-muted">No new notifications</div>
                        ) : (
                            notifications.map((item) => (
                                <div key={item.id} className="p-3 bg-background rounded-xl space-y-1 text-xs">
                                    <div className="flex items-center justify-between font-bold text-text-primary">
                                        <span>{item.title}</span>
                                        <span className="text-[10px] text-text-muted">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-text-secondary">{item.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
