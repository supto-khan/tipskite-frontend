'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import {
    CreditCard,
    User,
    Palette,
    Save,
    Loader2,
    Check,
    Camera,
    Trash2
} from 'lucide-react'
import { Input } from '@/app/components/ui/input'

// Custom SVG Icons for Social Platforms
const FacebookIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
)

const InstagramIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
)

const YoutubeIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
)

const TiktokIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.26 6.26 0 0 0 3 15.57a6.26 6.26 0 0 0 10.64 4.43 6.2 6.2 0 0 0 1.95-4.51V8.5a8.28 8.28 0 0 0 4.77 1.53V6.57a4.85 4.85 0 0 1-.77.12z"/>
    </svg>
)

const LinkedinIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
    </svg>
)

const XTwitterIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
)

const GithubIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
)

const RedditIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.18 1.207.49 1.207-.869 2.85-1.43 4.674-1.5l.93-4.364 3.32.698a1.25 1.25 0 0 1 1.1 1.174z"/>
    </svg>
)

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)

    // Section 1: General Info State
    const [avatarUrl, setAvatarUrl] = useState('')
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('')
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [bio, setBio] = useState('')
    const [category, setCategory] = useState('')
    const [slug, setSlug] = useState('')
    const [savingGeneral, setSavingGeneral] = useState(false)
    const [generalMessage, setGeneralMessage] = useState<string | null>(null)
    const [generalErrors, setGeneralErrors] = useState<Record<string, string[]>>({})

    // Section 2: Social Links State
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        linkedin: '',
        twitter: '',
        github: '',
        reddit: '',
    })
    const [savingSocial, setSavingSocial] = useState(false)
    const [socialMessage, setSocialMessage] = useState<string | null>(null)
    const [socialError, setSocialError] = useState<string | null>(null)

    useEffect(() => {
        axios.get('/api/v1/creator/profile')
            .then(res => {
                const profile = res.data.profile || res.data
                if (profile) {
                    setAvatarUrl(profile.avatar_url || '')
                    setBio(profile.bio || '')
                    setCategory(profile.category || '')
                    setSlug(profile.slug || '')

                    if (profile.social_links && typeof profile.social_links === 'object') {
                        setSocialLinks({
                            facebook: profile.social_links.facebook || '',
                            instagram: profile.social_links.instagram || '',
                            youtube: profile.social_links.youtube || '',
                            tiktok: profile.social_links.tiktok || '',
                            linkedin: profile.social_links.linkedin || '',
                            twitter: profile.social_links.twitter || '',
                            github: profile.social_links.github || '',
                            reddit: profile.social_links.reddit || '',
                        })
                    }
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const maxSizeBytes = 5 * 1024 * 1024
        if (file.size > maxSizeBytes) {
            setGeneralErrors({ avatar: [`Selected avatar (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 5MB maximum upload limit.`] })
            e.target.value = ''
            return
        }

        setGeneralErrors({})
        setAvatarFile(file)
        setAvatarPreviewUrl(URL.createObjectURL(file))
    }

    const handleRemoveAvatar = () => {
        setAvatarFile(null)
        setAvatarPreviewUrl('')
        setAvatarUrl('')
    }

    // Handler 1: Save General Information (Uploads avatar if new file picked)
    const handleSaveGeneral = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingGeneral(true)
        setGeneralMessage(null)
        setGeneralErrors({})

        let finalAvatarUrl = avatarUrl

        try {
            if (avatarFile) {
                setUploadingAvatar(true)
                const formData = new FormData()
                formData.append('file', avatarFile)
                const uploadRes = await axios.post('/api/v1/creator/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                if (uploadRes.data?.url) {
                    finalAvatarUrl = uploadRes.data.url
                    setAvatarUrl(finalAvatarUrl)
                    setAvatarFile(null)
                    setAvatarPreviewUrl('')
                }
            }

            await axios.patch('/api/v1/creator/profile', {
                avatar_url: finalAvatarUrl,
                bio,
                category,
                slug,
            })
            setGeneralMessage('General profile information saved successfully!')
            setTimeout(() => setGeneralMessage(null), 3000)
        } catch (err: any) {
            if (err.response?.status === 422) {
                setGeneralErrors(err.response.data.error?.fields || err.response.data.errors || {})
            } else {
                setGeneralErrors({ general: ['Failed to save general information.'] })
            }
        } finally {
            setSavingGeneral(false)
            setUploadingAvatar(false)
        }
    }

    // Handler 2: Save Social Links
    const handleSocialChange = (key: keyof typeof socialLinks, value: string) => {
        setSocialLinks(prev => ({ ...prev, [key]: value }))
    }

    const handleSaveSocial = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingSocial(true)
        setSocialMessage(null)
        setSocialError(null)

        try {
            await axios.patch('/api/v1/creator/profile', {
                social_links: socialLinks,
            })
            setSocialMessage('Social profiles saved successfully!')
            setTimeout(() => setSocialMessage(null), 3000)
        } catch (err: any) {
            setSocialError('Failed to save social links. Please check the URLs.')
        } finally {
            setSavingSocial(false)
        }
    }

    if (loading) {
        return (
            <div suppressHydrationWarning className="max-w-4xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div suppressHydrationWarning className="space-y-2">
                    <div suppressHydrationWarning className="h-8 w-44 bg-border/40 rounded-xl" />
                    <div suppressHydrationWarning className="h-4 w-64 bg-border/40 rounded-lg" />
                </div>
                <div suppressHydrationWarning className="bg-surface border border-border rounded-3xl p-6 space-y-6 shadow-xs">
                    <div suppressHydrationWarning className="h-10 w-full bg-border/40 rounded-2xl" />
                    <div suppressHydrationWarning className="h-10 w-full bg-border/40 rounded-2xl" />
                    <div suppressHydrationWarning className="h-24 w-full bg-border/40 rounded-2xl" />
                </div>
            </div>
        )
    }

    return (
        <div suppressHydrationWarning className="max-w-4xl mx-auto py-6 space-y-8 font-sans">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Creator Profile</h1>
                <p className="mt-1 text-sm text-text-muted">
                    Manage your public handle, bio, niche category, social links, and account security.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border space-x-6">
                <Link
                    href="/dashboard/settings"
                    className="pb-3 text-sm font-semibold text-primary-600 border-b-2 border-primary-600 flex items-center gap-2"
                >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                </Link>
                <Link
                    href="/dashboard/settings/design"
                    className="pb-3 text-sm font-medium text-text-muted hover:text-text-secondary flex items-center gap-2"
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

            {/* CARD 1: General Information */}
            <form onSubmit={handleSaveGeneral} className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">General Information</h3>
                        <p className="text-xs text-text-muted mt-0.5">Basic details displayed on your public creator page.</p>
                    </div>
                </div>

                {generalMessage && (
                    <div className="p-3.5 text-xs font-bold text-success-700 bg-success-50 border border-success-200 rounded-2xl flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>{generalMessage}</span>
                    </div>
                )}

                {generalErrors.general && (
                    <div className="p-3.5 text-xs font-bold text-error-700 bg-error-50 border border-error-200 rounded-2xl">
                        {generalErrors.general[0]}
                    </div>
                )}

                {/* Profile Picture Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-border">
                    <div className="relative w-24 h-24 rounded-full border-4 border-surface shadow-md overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 group">
                        {(avatarPreviewUrl || avatarUrl) ? (
                            <img src={avatarPreviewUrl || avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-black text-primary">{slug ? slug[0].toUpperCase() : 'U'}</span>
                        )}

                        {uploadingAvatar && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Profile Picture</h4>
                        <p className="text-xs text-text-muted">
                            {avatarFile ? 'New picture selected. Click "Save General Info" to apply.' : 'Upload your brand logo or photo. JPG, PNG, WEBP (Max 10MB).'}
                        </p>
                        
                        <div className="flex items-center justify-center sm:justify-start space-x-3 pt-1">
                            <label className="cursor-pointer px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center space-x-1.5 disabled:opacity-50">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarSelect}
                                    disabled={uploadingAvatar}
                                />
                                <Camera className="w-3.5 h-3.5" />
                                <span>{avatarFile ? 'Change Selection' : 'Select Picture'}</span>
                            </label>

                            {(avatarPreviewUrl || avatarUrl) && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    className="px-3 py-2 bg-surface hover:bg-background text-error text-xs font-semibold rounded-xl border border-border transition-colors inline-flex items-center space-x-1 cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Remove</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">TipsKite URL Handle</label>
                        <div className="flex rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                            <span className="inline-flex items-center px-4 bg-border/40 text-text-muted text-xs font-bold border-r border-border">
                                tipskite.com/
                            </span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full bg-transparent px-4 py-3 text-sm font-bold text-text-primary focus:outline-none"
                                placeholder="yourhandle"
                            />
                        </div>
                        {generalErrors.slug && <p className="text-xs text-error-500 font-semibold mt-1">{generalErrors.slug[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">Category / Creative Field</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Gaming, Tech, Digital Art, Music..."
                        />
                        {generalErrors.category && <p className="text-xs text-error-500 font-semibold mt-1">{generalErrors.category[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">About & Bio</label>
                        <textarea
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Share your story and tell your supporters what content or projects you build..."
                        />
                        {generalErrors.bio && <p className="text-xs text-error-500 font-semibold mt-1">{generalErrors.bio[0]}</p>}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={savingGeneral}
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                        {savingGeneral ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{savingGeneral ? 'Saving...' : 'Save General Info'}</span>
                    </button>
                </div>
            </form>

            {/* CARD 2: Social Profiles */}
            <form onSubmit={handleSaveSocial} className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-text-primary">Social Profiles</h3>
                    <p className="text-xs text-text-muted mt-0.5">Link your social media accounts.</p>
                </div>

                {socialMessage && (
                    <div className="p-3.5 text-xs font-bold text-success-700 bg-success-50 border border-success-200 rounded-2xl flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>{socialMessage}</span>
                    </div>
                )}

                {socialError && (
                    <div className="p-3.5 text-xs font-bold text-error-700 bg-error-50 border border-error-200 rounded-2xl">
                        {socialError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Facebook */}
                    <div className="flex rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="inline-flex items-center px-3.5 bg-border/30 text-text-muted border-r border-border">
                            <FacebookIcon />
                        </span>
                        <input
                            type="url"
                            value={socialLinks.facebook}
                            onChange={(e) => handleSocialChange('facebook', e.target.value)}
                            placeholder="Facebook Link"
                            className="w-full bg-transparent px-3.5 py-3 text-xs font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                    </div>

                    {/* Instagram */}
                    <div className="flex rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="inline-flex items-center px-3.5 bg-border/30 text-text-muted border-r border-border">
                            <InstagramIcon />
                        </span>
                        <input
                            type="url"
                            value={socialLinks.instagram}
                            onChange={(e) => handleSocialChange('instagram', e.target.value)}
                            placeholder="Instagram Link"
                            className="w-full bg-transparent px-3.5 py-3 text-xs font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                    </div>

                    {/* YouTube */}
                    <div className="flex rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="inline-flex items-center px-3.5 bg-border/30 text-text-muted border-r border-border">
                            <YoutubeIcon />
                        </span>
                        <input
                            type="url"
                            value={socialLinks.youtube}
                            onChange={(e) => handleSocialChange('youtube', e.target.value)}
                            placeholder="YouTube Link"
                            className="w-full bg-transparent px-3.5 py-3 text-xs font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                    </div>

                    {/* TikTok */}
                    <div className="flex rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="inline-flex items-center px-3.5 bg-border/30 text-text-muted border-r border-border">
                            <TiktokIcon />
                        </span>
                        <input
                            type="url"
                            value={socialLinks.tiktok}
                            onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                            placeholder="TikTok Link"
                            className="w-full bg-transparent px-3.5 py-3 text-xs font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                    </div>

                    {/* LinkedIn */}
                    <div className="flex rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="inline-flex items-center px-3.5 bg-border/30 text-text-muted border-r border-border">
                            <LinkedinIcon />
                        </span>
                        <input
                            type="url"
                            value={socialLinks.linkedin}
                            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                            placeholder="LinkedIn Link"
                            className="w-full bg-transparent px-3.5 py-3 text-xs font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                    </div>

                    {/* X (Twitter) */}
                    <div className="flex rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="inline-flex items-center px-3.5 bg-border/30 text-text-muted border-r border-border">
                            <XTwitterIcon />
                        </span>
                        <input
                            type="url"
                            value={socialLinks.twitter}
                            onChange={(e) => handleSocialChange('twitter', e.target.value)}
                            placeholder="X (Twitter) Link"
                            className="w-full bg-transparent px-3.5 py-3 text-xs font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                    </div>

                    {/* GitHub */}
                    <div className="flex rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="inline-flex items-center px-3.5 bg-border/30 text-text-muted border-r border-border">
                            <GithubIcon />
                        </span>
                        <input
                            type="url"
                            value={socialLinks.github}
                            onChange={(e) => handleSocialChange('github', e.target.value)}
                            placeholder="GitHub Link"
                            className="w-full bg-transparent px-3.5 py-3 text-xs font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                    </div>

                    {/* Reddit */}
                    <div className="flex rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="inline-flex items-center px-3.5 bg-border/30 text-text-muted border-r border-border">
                            <RedditIcon />
                        </span>
                        <input
                            type="url"
                            value={socialLinks.reddit}
                            onChange={(e) => handleSocialChange('reddit', e.target.value)}
                            placeholder="Reddit Link"
                            className="w-full bg-transparent px-3.5 py-3 text-xs font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={savingSocial}
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                        {savingSocial ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{savingSocial ? 'Saving...' : 'Save Social Links'}</span>
                    </button>
                </div>
            </form>

            {/* CARD 3: Password & Security */}
            <PasswordSecurityCard />
        </div>
    )
}

function PasswordSecurityCard() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [updating, setUpdating] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== passwordConfirmation) {
            setError('New passwords do not match.')
            return
        }

        setUpdating(true)
        setMessage(null)
        setError(null)

        try {
            await axios.put('/api/v1/user/password', {
                current_password: currentPassword || undefined,
                password,
                password_confirmation: passwordConfirmation,
            })
            setMessage('Password updated successfully!')
            setCurrentPassword('')
            setPassword('')
            setPasswordConfirmation('')
            setTimeout(() => setMessage(null), 3000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update password. Please check your credentials.')
        } finally {
            setUpdating(false)
        }
    }

    return (
        <form onSubmit={handlePasswordUpdate} className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-6">
            <div>
                <h3 className="text-lg font-bold text-text-primary">Password & Security</h3>
                <p className="text-xs text-text-muted mt-0.5">Update your password to keep your creator account secure.</p>
            </div>

            {message && (
                <div className="p-3.5 text-xs font-bold text-success-700 bg-success-50 border border-success-200 rounded-2xl flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>{message}</span>
                </div>
            )}

            {error && (
                <div className="p-3.5 text-xs font-bold text-error-700 bg-error-50 border border-error-200 rounded-2xl">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                />

                <Input
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="••••••••"
                />
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={updating || !password}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-40"
                >
                    {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{updating ? 'Updating...' : 'Update Password'}</span>
                </button>
            </div>
        </form>
    )
}
