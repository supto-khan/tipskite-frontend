'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react'

interface ConfirmModalProps {
    isOpen: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'primary' | 'info'
    isLoading?: boolean
    onConfirm: () => void
    onClose: () => void
}

export default function ConfirmModal({
    isOpen,
    title = 'Are you sure?',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
    onConfirm,
    onClose
}: ConfirmModalProps) {
    const [render, setRender] = useState(isOpen)
    const [visible, setVisible] = useState(isOpen)

    useEffect(() => {
        if (isOpen) {
            setRender(true)
            // Trigger animation frame for CSS transition
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
            const timer = setTimeout(() => setRender(false), 200)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!render) return null

    const iconMap = {
        danger: <AlertTriangle className="w-6 h-6 text-error-600" />,
        primary: <Info className="w-6 h-6 text-primary-600" />,
        info: <CheckCircle2 className="w-6 h-6 text-info-600" />,
    }

    const bgIconMap = {
        danger: 'bg-error-50 border-error-200',
        primary: 'bg-primary-50 border-primary-200',
        info: 'bg-info-50 border-info-200',
    }

    const buttonMap = {
        danger: 'bg-error-600 hover:bg-error-700 text-white shadow-xs',
        primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-xs',
        info: 'bg-info-600 hover:bg-info-700 text-white shadow-xs',
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
                visible ? 'bg-black/60 backdrop-blur-xs opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
            }`}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-surface border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 transition-all duration-200 transform ${
                    visible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-2 opacity-0'
                }`}
            >
                <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-2xl border ${bgIconMap[variant]} flex-shrink-0`}>
                        {iconMap[variant]}
                    </div>
                    <div className="space-y-1 flex-1 pr-2">
                        <h3 className="text-lg font-extrabold text-text-primary leading-snug">{title}</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 bg-background hover:bg-border text-text-secondary text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-5 py-2 text-xs font-bold rounded-xl transition-all disabled:opacity-50 inline-flex items-center space-x-1.5 ${buttonMap[variant]}`}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
