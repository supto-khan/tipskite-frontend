'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from '@/lib/axios'
import {
    User,
    CreditCard,
    Palette,
    Check,
    Loader2,
    Sparkles,
    Layout,
    Eye,
    Save,
    Coffee,
    Plus,
    X,
    Send,
    Phone,
    Mail,
    Globe,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Brush,
    Image as ImageIcon,
    Upload,
    Trash2,
    Layers,
    ArrowRight
} from 'lucide-react'
import CustomStorefrontRequestModal from '@/components/creator/CustomStorefrontRequestModal'

// Preset Curated Solid Colors
const SOLID_COLOR_PRESETS = [
    { name: 'Indigo', hex: '#4f46e5' },
    { name: 'Deep Slate', hex: '#0f172a' },
    { name: 'Ocean Blue', hex: '#0284c7' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Rose Red', hex: '#e11d48' },
    { name: 'Royal Purple', hex: '#7c3aed' },
    { name: 'Amber Gold', hex: '#d97706' },
    { name: 'Dark Teal', hex: '#0f766e' },
    { name: 'Midnight', hex: '#18181b' },
]

// Preset Curated Gradients
const GRADIENT_PRESETS = [
    { name: 'Neon Violet', from: '#6366f1', to: '#9333ea', dir: 'to-r' },
    { name: 'Sunset Glow', from: '#f43f5e', to: '#fb923c', dir: 'to-r' },
    { name: 'Ocean Breeze', from: '#0284c7', to: '#38bdf8', dir: 'to-r' },
    { name: 'Emerald Forest', from: '#059669', to: '#10b981', dir: 'to-br' },
    { name: 'Cyber Teal', from: '#0f766e', to: '#06b6d4', dir: 'to-r' },
    { name: 'Royal Velvet', from: '#4c1d95', to: '#db2777', dir: 'to-br' },
    { name: 'Dark Carbon', from: '#0f172a', to: '#334155', dir: 'to-b' },
    { name: 'Electric Fire', from: '#ea580c', to: '#f43f5e', dir: 'to-tr' },
]

export default function PageDesignSettings() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Creator Profile Data
    const [profileData, setProfileData] = useState<any>(null)

    // Form fields - Layout & Support Options
    const [layoutType, setLayoutType] = useState<'presets' | 'standard'>('presets')
    const [preset1, setPreset1] = useState('100')
    const [preset2, setPreset2] = useState('300')
    const [preset3, setPreset3] = useState('500')
    const [buttonWording, setButtonWording] = useState('Support')
    const [showSupporterWall, setShowSupporterWall] = useState(true)

    // Unit Coffee defaults if standard layout selected
    const [unitNoun, setUnitNoun] = useState('coffee')
    const [unitEmoji, setUnitEmoji] = useState('☕')
    const [unitPrice, setUnitPrice] = useState('100')

    const buttonWordingOptions = ['Support', 'Pay', 'Send', 'Donate', 'Buy']

    // Header Background Customization state
    const [headerBgType, setHeaderBgType] = useState<'image' | 'color' | 'gradient'>('gradient')
    const [coverImageUrl, setCoverImageUrl] = useState('')
    const [headerColor, setHeaderColor] = useState('#6366f1')
    const [headerGradientFrom, setHeaderGradientFrom] = useState('#6366f1')
    const [headerGradientTo, setHeaderGradientTo] = useState('#9333ea')
    const [headerGradientDirection, setHeaderGradientDirection] = useState('to-r')
    const [uploadingCover, setUploadingCover] = useState(false)

    // Custom Storefront Request state
    const [customRequests, setCustomRequests] = useState<any[]>([])
    const [loadingRequests, setLoadingRequests] = useState(true)
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
    const [brandName, setBrandName] = useState('')
    const [contactEmail, setContactEmail] = useState('')

    const fetchCustomRequests = async () => {
        try {
            const res = await axios.get('/api/v1/creator/custom-storefront-requests')
            setCustomRequests(res.data?.requests || [])
        } catch (e) {
            console.error('Failed to load custom storefront requests:', e)
        } finally {
            setLoadingRequests(false)
        }
    }

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/v1/creator/profile')
            const profile = res.data?.profile || res.data
            if (profile) {
                setProfileData(profile)
                setLayoutType(profile.layout_type || 'presets')
                setButtonWording(profile.button_wording || 'Support')
                setShowSupporterWall(profile.show_supporter_wall !== false)
                setUnitNoun(profile.unit_noun || 'coffee')
                setUnitEmoji(profile.unit_emoji || '☕')
                setUnitPrice(profile.unit_price_cents ? (profile.unit_price_cents / 100).toString() : '100')

                if (Array.isArray(profile.unit_presets) && profile.unit_presets.length >= 3) {
                    setPreset1((profile.unit_presets[0] / 100).toString())
                    setPreset2((profile.unit_presets[1] / 100).toString())
                    setPreset3((profile.unit_presets[2] / 100).toString())
                }

                if (profile.user?.email && !contactEmail) {
                    setContactEmail(profile.user.email)
                }
                if (profile.display_name && !brandName) {
                    setBrandName(profile.display_name)
                }

                // Header background fields
                setHeaderBgType(profile.header_bg_type || (profile.cover_image_url ? 'image' : 'gradient'))
                setCoverImageUrl(profile.cover_image_url || '')
                setHeaderColor(profile.header_color || '#6366f1')
                setHeaderGradientFrom(profile.header_gradient_from || '#6366f1')
                setHeaderGradientTo(profile.header_gradient_to || '#9333ea')
                setHeaderGradientDirection(profile.header_gradient_direction || 'to-r')
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
        fetchCustomRequests()
    }, [])

    const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingCover(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('context', 'cover')

            const res = await axios.post('/api/v1/creator/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            if (res.data?.url) {
                setCoverImageUrl(res.data.url)
                setHeaderBgType('image')
            }
        } catch (err: any) {
            console.error('Failed to upload cover photo:', err)
            setError(err.response?.data?.message || 'Failed to upload cover photo.')
        } finally {
            setUploadingCover(false)
        }
    }

    const directionToCSS = (dir: string) => {
        switch (dir) {
            case 'to-r': return 'to right'
            case 'to-l': return 'to left'
            case 'to-b': return 'to bottom'
            case 'to-t': return 'to top'
            case 'to-br': return 'to bottom right'
            case 'to-tr': return 'to top right'
            case 'to-bl': return 'to bottom left'
            case 'to-tl': return 'to top left'
            default: return 'to right'
        }
    }

    const getPreviewStyle = (): React.CSSProperties => {
        if (headerBgType === 'image' && coverImageUrl) {
            return {
                backgroundImage: `url(${coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }
        }
        if (headerBgType === 'color') {
            return { backgroundColor: headerColor || '#6366f1' }
        }
        const dir = directionToCSS(headerGradientDirection)
        return {
            background: `linear-gradient(${dir}, ${headerGradientFrom || '#6366f1'}, ${headerGradientTo || '#9333ea'})`,
        }
    }

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setSaving(true)
        setMessage(null)
        setError(null)

        const presetsArray = [
            Math.max(10, Math.round(parseFloat(preset1) || 100) * 100),
            Math.max(10, Math.round(parseFloat(preset2) || 300) * 100),
            Math.max(10, Math.round(parseFloat(preset3) || 500) * 100),
        ]

        try {
            await axios.patch('/api/v1/creator/profile', {
                layout_type: layoutType,
                button_wording: buttonWording,
                show_supporter_wall: showSupporterWall,
                unit_presets: presetsArray,
                unit_noun: unitNoun,
                unit_emoji: unitEmoji,
                unit_price_cents: Math.max(100, Math.round(parseFloat(unitPrice) || 100) * 100),
                header_bg_type: headerBgType,
                cover_image_url: coverImageUrl.trim() || null,
                header_color: headerColor,
                header_gradient_from: headerGradientFrom,
                header_gradient_to: headerGradientTo,
                header_gradient_direction: headerGradientDirection,
            })
            setMessage('Page design and header background saved successfully!')
            setTimeout(() => setMessage(null), 3000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update page design settings.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-border/40 rounded-xl" />
                    <div className="h-4 w-72 bg-border/40 rounded-lg" />
                </div>
                <div className="bg-surface border border-border rounded-3xl p-6 space-y-6 shadow-xs">
                    <div className="h-28 w-full bg-border/40 rounded-2xl" />
                    <div className="h-20 w-full bg-border/40 rounded-2xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Page Design & Header Styling</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Customize your public profile header background (photo, solid color, or gradient) and supporter contribution layout.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-full shadow-xs transition-all flex items-center space-x-2 w-fit cursor-pointer disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border space-x-6">
                <Link
                    href="/dashboard/settings"
                    className="pb-3 text-sm font-medium text-text-muted hover:text-text-secondary flex items-center gap-2"
                >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                </Link>
                <Link
                    href="/dashboard/settings/design"
                    className="pb-3 text-sm font-semibold text-primary-600 border-b-2 border-primary-600 flex items-center gap-2"
                >
                    <Palette className="w-4 h-4" />
                    <span>Page Design</span>
                </Link>
                <Link
                    href="/dashboard/settings/payouts"
                    className="pb-3 text-sm font-medium text-text-muted hover:text-text-secondary flex items-center gap-2"
                >
                    <CreditCard className="w-4 h-4" />
                    <span>Payout & KYC</span>
                </Link>
            </div>

            {message && (
                <div className="p-4 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>{message}</span>
                </div>
            )}

            {error && (
                <div className="p-4 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* ── SECTION 1: HEADER & COVER BACKGROUND ── */}
                <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary flex items-center space-x-2">
                                <Palette className="w-5 h-5 text-primary-600" />
                                <span>Public Header Background</span>
                            </h3>
                            <p className="text-xs text-text-muted mt-0.5">
                                Select a custom cover image, a clean solid color, or a modern vibrant gradient for your public profile hero.
                            </p>
                        </div>

                        {profileData?.slug && (
                            <a
                                href={`/${profileData.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1 text-xs font-bold text-primary-600 hover:underline"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Public Page</span>
                            </a>
                        )}
                    </div>

                    {/* Live Header Preview Mockup */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-text-secondary">Live Header Preview</span>
                        <div
                            style={getPreviewStyle()}
                            className="w-full h-40 sm:h-48 rounded-3xl relative overflow-hidden border border-border/40 shadow-inner flex items-end p-4 transition-all duration-300"
                        >
                            <div className="bg-surface/90 backdrop-blur-md rounded-2xl p-3 flex items-center space-x-3 border border-border/50 shadow-sm max-w-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary-100 border border-primary-300 flex items-center justify-center overflow-hidden flex-shrink-0 text-primary-600 font-bold text-xs">
                                    {profileData?.avatar_url ? (
                                        <img src={profileData.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="truncate">
                                    <div className="font-extrabold text-xs text-text-primary truncate">
                                        {profileData?.display_name || 'Your Creator Title'}
                                    </div>
                                    <div className="text-[10px] text-primary-600 font-mono">
                                        tipskite.com/{profileData?.slug || 'creator'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Type Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setHeaderBgType('gradient')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                                headerBgType === 'gradient'
                                    ? 'border-primary-600 bg-primary-500/10 text-primary-600 shadow-xs'
                                    : 'border-border bg-background text-text-secondary hover:border-text-muted'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4" />
                                <span className="font-bold text-xs">Gradient Colors</span>
                            </div>
                            <p className="text-[11px] text-text-muted leading-tight">
                                Smooth multi-color blend with customizable angles.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setHeaderBgType('color')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                                headerBgType === 'color'
                                    ? 'border-primary-600 bg-primary-500/10 text-primary-600 shadow-xs'
                                    : 'border-border bg-background text-text-secondary hover:border-text-muted'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Brush className="w-4 h-4" />
                                <span className="font-bold text-xs">Single Solid Color</span>
                            </div>
                            <p className="text-[11px] text-text-muted leading-tight">
                                Clean, uniform brand color backdrop.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setHeaderBgType('image')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                                headerBgType === 'image'
                                    ? 'border-primary-600 bg-primary-500/10 text-primary-600 shadow-xs'
                                    : 'border-border bg-background text-text-secondary hover:border-text-muted'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <ImageIcon className="w-4 h-4" />
                                <span className="font-bold text-xs">Cover Photo Image</span>
                            </div>
                            <p className="text-[11px] text-text-muted leading-tight">
                                Upload a custom banner artwork, banner photo, or graphic.
                            </p>
                        </button>
                    </div>

                    {/* ── MODE A: GRADIENT CONTROLS ── */}
                    {headerBgType === 'gradient' && (
                        <div className="p-5 bg-background rounded-2xl border border-border space-y-5 animate-in fade-in">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary block">
                                    Curated Gradient Presets
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    {GRADIENT_PRESETS.map((preset) => (
                                        <button
                                            key={preset.name}
                                            type="button"
                                            onClick={() => {
                                                setHeaderGradientFrom(preset.from)
                                                setHeaderGradientTo(preset.to)
                                                setHeaderGradientDirection(preset.dir)
                                            }}
                                            className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                                                headerGradientFrom === preset.from && headerGradientTo === preset.to
                                                    ? 'border-primary-600 ring-2 ring-primary-500/30'
                                                    : 'border-border hover:border-text-muted'
                                            }`}
                                        >
                                            <div
                                                style={{
                                                    background: `linear-gradient(${directionToCSS(preset.dir)}, ${preset.from}, ${preset.to})`,
                                                }}
                                                className="w-5 h-5 rounded-full border border-black/20 shrink-0"
                                            />
                                            <span className="text-[11px] font-bold text-text-primary truncate">
                                                {preset.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-secondary">Start Color (From)</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            value={headerGradientFrom}
                                            onChange={(e) => setHeaderGradientFrom(e.target.value)}
                                            className="w-10 h-10 rounded-xl border border-border cursor-pointer p-0.5 bg-surface"
                                        />
                                        <input
                                            type="text"
                                            value={headerGradientFrom}
                                            onChange={(e) => setHeaderGradientFrom(e.target.value)}
                                            placeholder="#6366f1"
                                            className="flex-1 px-3 py-2 border border-border rounded-xl text-xs font-mono bg-surface text-text-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-secondary">End Color (To)</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            value={headerGradientTo}
                                            onChange={(e) => setHeaderGradientTo(e.target.value)}
                                            className="w-10 h-10 rounded-xl border border-border cursor-pointer p-0.5 bg-surface"
                                        />
                                        <input
                                            type="text"
                                            value={headerGradientTo}
                                            onChange={(e) => setHeaderGradientTo(e.target.value)}
                                            placeholder="#9333ea"
                                            className="flex-1 px-3 py-2 border border-border rounded-xl text-xs font-mono bg-surface text-text-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-secondary">Gradient Direction</label>
                                    <select
                                        value={headerGradientDirection}
                                        onChange={(e) => setHeaderGradientDirection(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-border rounded-xl text-xs font-semibold bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="to-r">Horizontal (Left to Right)</option>
                                        <option value="to-b">Vertical (Top to Bottom)</option>
                                        <option value="to-br">Diagonal (Top-Left to Bottom-Right)</option>
                                        <option value="to-tr">Diagonal (Bottom-Left to Top-Right)</option>
                                        <option value="to-l">Horizontal (Right to Left)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── MODE B: SOLID COLOR CONTROLS ── */}
                    {headerBgType === 'color' && (
                        <div className="p-5 bg-background rounded-2xl border border-border space-y-5 animate-in fade-in">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary block">
                                    Popular Curated Brand Swatches
                                </label>
                                <div className="flex items-center flex-wrap gap-2">
                                    {SOLID_COLOR_PRESETS.map((preset) => (
                                        <button
                                            key={preset.hex}
                                            type="button"
                                            onClick={() => setHeaderColor(preset.hex)}
                                            className={`px-3 py-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                                                headerColor.toLowerCase() === preset.hex.toLowerCase()
                                                    ? 'border-primary-600 ring-2 ring-primary-500/30'
                                                    : 'border-border hover:border-text-muted'
                                            }`}
                                        >
                                            <div
                                                style={{ backgroundColor: preset.hex }}
                                                className="w-4 h-4 rounded-full border border-black/20"
                                            />
                                            <span className="text-xs font-bold text-text-primary">
                                                {preset.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-4 border-t border-border/60 max-w-sm">
                                <label className="text-xs font-bold text-text-secondary">Custom Hex Color</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={headerColor}
                                        onChange={(e) => setHeaderColor(e.target.value)}
                                        className="w-10 h-10 rounded-xl border border-border cursor-pointer p-0.5 bg-surface"
                                    />
                                    <input
                                        type="text"
                                        value={headerColor}
                                        onChange={(e) => setHeaderColor(e.target.value)}
                                        placeholder="#4f46e5"
                                        className="flex-1 px-3 py-2 border border-border rounded-xl text-xs font-mono bg-surface text-text-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── MODE C: COVER PHOTO IMAGE ── */}
                    {headerBgType === 'image' && (
                        <div className="p-5 bg-background rounded-2xl border border-border space-y-4 animate-in fade-in">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-text-secondary">Upload Cover Banner Photo</span>
                                    <p className="text-[11px] text-text-muted">Recommended dimension: 1920x600px (Max 10MB JPG, PNG, or WebP).</p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <label className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer">
                                        {uploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                        <span>{uploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverFileUpload}
                                            disabled={uploadingCover}
                                            className="hidden"
                                        />
                                    </label>

                                    {coverImageUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setCoverImageUrl('')}
                                            className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                                            title="Remove Cover Image"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Remove</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="text-[11px] font-bold text-text-muted">Or Paste Direct Image URL</label>
                                <input
                                    type="text"
                                    value={coverImageUrl}
                                    onChange={(e) => setCoverImageUrl(e.target.value)}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-3.5 py-2.5 border border-border rounded-xl text-xs bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── SECTION 2: CHOOSE SUPPORT LAYOUT ── */}
                <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Choose a Layout</h3>
                        <p className="text-xs text-text-muted mt-0.5">Select how supporters choose their contribution amount.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option 1: Preset Amounts (Recommended) */}
                        <div
                            onClick={() => setLayoutType('presets')}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-4 select-none ${
                                layoutType === 'presets'
                                    ? 'border-primary-600 bg-primary-500/5 ring-1 ring-primary-500/20'
                                    : 'border-border bg-background hover:border-text-muted'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                        layoutType === 'presets' ? 'border-primary-600 bg-primary-600' : 'border-border'
                                    }`}>
                                        {layoutType === 'presets' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <span className="font-bold text-sm text-text-primary">Preset Amounts</span>
                                </div>
                                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                    RECOMMENDED
                                </span>
                            </div>

                            {/* Mini Layout Mockup */}
                            <div className="bg-surface border border-border rounded-xl p-3.5 space-y-2.5">
                                <div className="text-[11px] font-bold text-text-secondary text-center">Support Creator</div>
                                <div className="flex items-center justify-center gap-1.5">
                                    <div className="px-2.5 py-1.5 bg-primary-600 text-white rounded-lg text-[10px] font-bold">
                                        ৳{preset1}
                                    </div>
                                    <div className="px-2.5 py-1.5 bg-background border border-border text-text-secondary rounded-lg text-[10px] font-bold">
                                        ৳{preset2}
                                    </div>
                                    <div className="px-2.5 py-1.5 bg-background border border-border text-text-secondary rounded-lg text-[10px] font-bold">
                                        ৳{preset3}
                                    </div>
                                </div>
                                <div className="w-full py-2 bg-primary-600 text-white rounded-lg text-[10px] font-bold text-center uppercase tracking-wider">
                                    {buttonWording} ৳{preset1}
                                </div>
                            </div>
                        </div>

                        {/* Option 2: Quantity Multiplier (Coffee View) */}
                        <div
                            onClick={() => setLayoutType('standard')}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-4 select-none ${
                                layoutType === 'standard'
                                    ? 'border-primary-600 bg-primary-500/5 ring-1 ring-primary-500/20'
                                    : 'border-border bg-background hover:border-text-muted'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                        layoutType === 'standard' ? 'border-primary-600 bg-primary-600' : 'border-border'
                                    }`}>
                                        {layoutType === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <span className="font-bold text-sm text-text-primary">Quantity Multiplier</span>
                                </div>
                            </div>

                            {/* Mini Multiplier Mockup */}
                            <div className="bg-surface border border-border rounded-xl p-3.5 space-y-2.5">
                                <div className="text-[11px] font-bold text-text-secondary text-center flex items-center justify-center space-x-1">
                                    <span>Buy a {unitNoun}</span>
                                    <span>{unitEmoji}</span>
                                </div>
                                <div className="flex items-center justify-center gap-1.5">
                                    {[1, 3, 5].map((q) => (
                                        <div
                                            key={q}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                                q === 1 ? 'bg-primary-600 text-white border-primary-600' : 'bg-background border-border text-text-secondary'
                                            }`}
                                        >
                                            {q}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full py-2 bg-primary-600 text-white rounded-lg text-[10px] font-bold text-center uppercase tracking-wider">
                                    {buttonWording} ৳{unitPrice}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Context Specific Inputs */}
                    {layoutType === 'presets' ? (
                        <div className="space-y-4 pt-4 border-t border-border">
                            <h4 className="font-bold text-xs text-text-secondary uppercase tracking-wider">Configure 3 Preset Amounts (BDT)</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-text-muted block mb-1">Preset 1</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">৳</span>
                                        <input
                                            type="number"
                                            min="10"
                                            value={preset1}
                                            onChange={(e) => setPreset1(e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-text-muted block mb-1">Preset 2</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">৳</span>
                                        <input
                                            type="number"
                                            min="10"
                                            value={preset2}
                                            onChange={(e) => setPreset2(e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-text-muted block mb-1">Preset 3</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">৳</span>
                                        <input
                                            type="number"
                                            min="10"
                                            value={preset3}
                                            onChange={(e) => setPreset3(e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 pt-4 border-t border-border">
                            <h4 className="font-bold text-xs text-text-secondary uppercase tracking-wider">Unit Multiplier Configuration</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-text-muted block mb-1">Unit Noun</label>
                                    <input
                                        type="text"
                                        value={unitNoun}
                                        onChange={(e) => setUnitNoun(e.target.value)}
                                        placeholder="coffee, tea, burger"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-text-muted block mb-1">Unit Emoji</label>
                                    <input
                                        type="text"
                                        value={unitEmoji}
                                        onChange={(e) => setUnitEmoji(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-text-muted block mb-1">Price per Unit (BDT)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">৳</span>
                                        <input
                                            type="number"
                                            min="10"
                                            value={unitPrice}
                                            onChange={(e) => setUnitPrice(e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── SECTION 3: BUTTON WORDING & SUPPORTER WALL ── */}
                <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Button Copy & Preferences</h3>
                        <p className="text-xs text-text-muted mt-0.5">Customize the action text on your primary contribution button.</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-text-secondary block">Select Button Wording</label>
                        <div className="flex flex-wrap gap-2">
                            {buttonWordingOptions.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setButtonWording(opt)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        buttonWording === opt
                                            ? 'bg-primary-600 text-white shadow-xs'
                                            : 'bg-background border border-border text-text-secondary hover:border-text-muted'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                        <div>
                            <span className="font-bold text-xs text-text-primary block">Display Supporter Wall</span>
                            <span className="text-[11px] text-text-muted">Show recent tips and supporter messages on your public page.</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={showSupporterWall}
                            onChange={(e) => setShowSupporterWall(e.target.checked)}
                            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{saving ? 'Saving Design...' : 'Save Page Design'}</span>
                    </button>
                </div>
            </form>

            {/* ── SECTION 4: BESPOKE CUSTOM STOREFRONT REQUEST ── */}
            <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-bold text-text-primary">Bespoke Storefront & Custom Design</h3>
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-primary-500/10 text-primary-600 text-[10px] font-extrabold border border-primary-500/20">
                                <Sparkles className="w-3 h-3" />
                                <span>Tailored</span>
                            </span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed max-w-xl">
                            Need custom hero sections, video embed showcases, branded buttons, or interactive portfolio widgets on your public page? Submit a custom design request to our design engineers.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsRequestModalOpen(true)}
                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center space-x-2 shrink-0 cursor-pointer hover:scale-102 active:scale-98"
                    >
                        <Brush className="w-4 h-4" />
                        <span>Request Custom Design</span>
                    </button>
                </div>

                {/* Submitted Requests History */}
                {loadingRequests ? (
                    <div className="text-xs text-text-muted py-4 animate-pulse">Loading design requests...</div>
                ) : customRequests.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border">
                        <span className="text-xs font-bold text-text-secondary block">Your Submitted Design Requests</span>
                        <div className="space-y-2.5">
                            {customRequests.map((req) => {
                                const statusMap: Record<string, { label: string; badge: string }> = {
                                    pending: { label: 'Pending Review', badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
                                    in_review: { label: 'In Review (Contacting You)', badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
                                    approved: { label: 'Approved & In Progress', badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
                                    completed: { label: 'Completed & Deployed', badge: 'bg-violet-500/10 text-violet-600 border-violet-500/20' },
                                    rejected: { label: 'Declined', badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
                                }
                                const currentStatus = statusMap[req.status] || { label: req.status, badge: 'bg-surface border-border text-text-muted' }

                                return (
                                    <div key={req.id} className="p-4 bg-background rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-text-primary">{req.brand_name}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${currentStatus.badge}`}>
                                                    {currentStatus.label}
                                                </span>
                                            </div>
                                            <p className="text-text-muted line-clamp-1 text-[11px]">{req.design_requirements}</p>
                                            {req.admin_notes && (
                                                <div className="text-[11px] text-primary-600 font-semibold bg-primary-500/5 p-2 rounded-xl border border-primary-500/10 mt-1">
                                                    Note from Design Team: {req.admin_notes}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-[10px] font-mono text-text-muted whitespace-nowrap">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Request Custom Storefront Modal ── */}
            <CustomStorefrontRequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                defaultBrandName={brandName}
                defaultEmail={contactEmail}
                onSuccess={fetchCustomRequests}
            />
        </div>
    )
}
