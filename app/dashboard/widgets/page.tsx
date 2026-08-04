'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Copy, RefreshCw, Radio, Play, Check, Settings, Sparkles, AlertCircle } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function CreatorWidgets() {
    const [overlayUrl, setOverlayUrl] = useState('')
    const [setting, setSetting] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [showRotateConfirm, setShowRotateConfirm] = useState(false)

    // Config form
    const [minAmountBdt, setMinAmountBdt] = useState('0')
    const [durationSeconds, setDurationSeconds] = useState('8')
    const [messageTemplate, setMessageTemplate] = useState('{name} supported with BDT {amount}!')
    const [saving, setSaving] = useState(false)
    const [rotating, setRotating] = useState(false)
    const [testAlert, setTestAlert] = useState(false)

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/v1/creator/stream-alert')
            setSetting(res.data.alert_setting)
            setOverlayUrl(res.data.overlay_url)
            setMinAmountBdt((res.data.alert_setting.min_amount_cents / 100).toString())
            setDurationSeconds(res.data.alert_setting.duration_seconds.toString())
            setMessageTemplate(res.data.alert_setting.message_template)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleCopy = () => {
        navigator.clipboard.writeText(overlayUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleRotate = async () => {
        setRotating(true)
        try {
            const res = await axios.post('/api/v1/creator/stream-alert/rotate')
            setSetting(res.data.alert_setting)
            setOverlayUrl(res.data.overlay_url)
            setShowRotateConfirm(false)
        } catch (e) {
            console.error(e)
        } finally {
            setRotating(false)
        }
    }

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await axios.put('/api/v1/creator/stream-alert', {
                min_amount_cents: Math.round(parseFloat(minAmountBdt) * 100),
                duration_seconds: parseInt(durationSeconds, 10),
                message_template: messageTemplate,
            })
            setSetting(res.data.alert_setting)
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    const triggerTestAlert = () => {
        setTestAlert(true)
        setTimeout(() => setTestAlert(false), parseInt(durationSeconds, 10) * 1000)
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div className="space-y-2">
                    <div className="h-8 w-56 bg-border/40 rounded-xl" />
                    <div className="h-4 w-72 bg-border/40 rounded-lg" />
                </div>
                <div className="bg-surface border border-border rounded-3xl p-6 space-y-6 shadow-xs">
                    <div className="h-12 w-full bg-border/40 rounded-2xl" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-20 w-full bg-border/40 rounded-2xl" />
                        <div className="h-20 w-full bg-border/40 rounded-2xl" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-text-primary flex items-center gap-2">
                    <Radio className="h-6 w-6 text-primary-500" />
                    <span>Stream Alerts &amp; OBS Widgets</span>
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                    Display real-time popup alerts on your live stream (OBS, Streamlabs, vMix) whenever supporters tip or subscribe.
                </p>
            </div>

            {/* OBS Browser Source URL Box */}
            <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
                        </span>
                        <h3 className="font-bold text-base text-text-primary">OBS Browser Source URL</h3>
                    </div>
                    <button
                        onClick={() => setShowRotateConfirm(true)}
                        disabled={rotating}
                        className="text-xs text-text-muted hover:text-error-500 flex items-center space-x-1.5 transition-all self-start sm:self-auto font-medium"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${rotating ? 'animate-spin' : ''}`} />
                        <span>Rotate Secret URL</span>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                        type="text"
                        readOnly
                        value={overlayUrl}
                        className="flex-1 px-4 py-3 bg-background border border-border rounded-2xl text-xs text-text-secondary font-mono focus:outline-none select-all"
                    />
                    <button
                        onClick={handleCopy}
                        className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 flex-shrink-0 transition-all shadow-xs"
                    >
                        {copied ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted bg-background/50 border border-border/50 rounded-xl p-3">
                    <AlertCircle className="h-4 w-4 text-primary-500 flex-shrink-0" />
                    <span>Paste this URL into OBS Studio as a <strong>Browser Source</strong> (Recommended Width: 800, Height: 600). Keep this URL private!</span>
                </div>
            </div>

            {/* Config & Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-text-primary text-sm flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-primary-500" />
                        <span>Customize Alert Popup</span>
                    </h3>

                    <form onSubmit={handleSaveConfig} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1">Minimum Amount Threshold (BDT)</label>
                            <input
                                type="number"
                                min="0"
                                value={minAmountBdt}
                                onChange={(e) => setMinAmountBdt(e.target.value)}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-2xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1">Alert On-Screen Duration (Seconds)</label>
                            <input
                                type="number"
                                min="3"
                                max="30"
                                value={durationSeconds}
                                onChange={(e) => setDurationSeconds(e.target.value)}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-2xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1">Message Template</label>
                            <input
                                type="text"
                                value={messageTemplate}
                                onChange={(e) => setMessageTemplate(e.target.value)}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-2xl text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <p className="text-[11px] text-text-muted mt-1.5">Placeholders: <code className="bg-background border border-border px-1 py-0.5 rounded text-text-secondary">{"{name}"}</code>, <code className="bg-background border border-border px-1 py-0.5 rounded text-text-secondary">{"{amount}"}</code></p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="py-2.5 px-6 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-2xl shadow-xs disabled:opacity-50 transition-all"
                            >
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview Box */}
                <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between items-center relative overflow-hidden min-h-[300px]">
                    <div className="w-full flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            <span>Live Preview</span>
                        </span>
                        <button
                            onClick={triggerTestAlert}
                            className="py-1.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-all"
                        >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>Test Alert</span>
                        </button>
                    </div>

                    <div className="my-auto py-8 w-full flex justify-center">
                        {testAlert ? (
                            <div className="animate-bounce bg-gradient-to-r from-amber-500 via-primary-600 to-purple-600 p-0.5 rounded-3xl shadow-xl max-w-sm w-full">
                                <div className="bg-elevated-surface text-text-primary rounded-3xl p-5 text-center space-y-1.5 border border-border">
                                    <div className="text-3xl">🎉</div>
                                    <h4 className="text-base font-black text-amber-500">Rahim Developer</h4>
                                    <div className="text-xl font-extrabold text-text-primary">BDT 500.00</div>
                                    <p className="text-xs text-text-secondary font-medium">
                                        {messageTemplate.replace('{name}', 'Rahim Developer').replace('{amount}', '500.00')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-text-muted text-center max-w-xs space-y-1">
                                <p suppressHydrationWarning className="font-medium text-text-secondary">OBS Stream Overlay Preview</p>
                                <p>Click <strong className="text-text-primary">"Test Alert"</strong> to test on-screen notification popup</p>
                            </div>
                        )}
                    </div>

                    <div className="text-[10px] font-medium text-text-muted bg-background border border-border px-2.5 py-1 rounded-full">
                        Transparent Stream Overlay (800 × 600)
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showRotateConfirm}
                title="Rotate OBS Secret URL?"
                message="Rotating the token will invalidate your current OBS URL in stream software. You will need to copy the new URL to OBS."
                confirmText="Rotate Secret URL"
                cancelText="Cancel"
                variant="danger"
                isLoading={rotating}
                onConfirm={handleRotate}
                onClose={() => setShowRotateConfirm(false)}
            />
        </div>
    )
}
