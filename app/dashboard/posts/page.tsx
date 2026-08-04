'use client'

import { useEffect, useState, useRef } from 'react'
import axios from '@/lib/axios'
import { Select } from '@/app/components/ui/select'
import {
    Image as ImageIcon,
    Globe,
    Lock,
    Users,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    List,
    ListOrdered,
    Type,
    Eye,
    ExternalLink,
    Trash2,
    Check,
    Loader2,
    Pencil,
    X
} from 'lucide-react'

import ConfirmModal from '@/components/ui/ConfirmModal'

export default function CreatorPosts() {
    const [posts, setPosts] = useState<any[]>([])
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Form state
    const [editingPostId, setEditingPostId] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [coverImageUrl, setCoverImageUrl] = useState('')
    const [visibility, setVisibility] = useState('public')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Modal state for deletion
    const [postToDelete, setPostToDelete] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchPosts = async () => {
        try {
            const [postsRes, profileRes] = await Promise.allSettled([
                axios.get('/api/v1/creator/posts'),
                axios.get('/api/v1/creator/profile')
            ])

            if (postsRes.status === 'fulfilled') {
                setPosts(postsRes.value.data.posts || [])
            }
            if (profileRes.status === 'fulfilled') {
                const profData = profileRes.value.data?.profile || profileRes.value.data
                setProfile(profData)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const maxSizeBytes = 5 * 1024 * 1024
        if (file.size > maxSizeBytes) {
            setError(`Selected image (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 5MB maximum upload limit.`)
            e.target.value = ''
            return
        }

        setError(null)
        setCoverImageFile(file)
        setCoverImageUrl(URL.createObjectURL(file))
    }

    const handleFormat = (type: string) => {
        if (!textareaRef.current) return
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = body.substring(start, end)

        let formatted = ''
        switch (type) {
            case 'bold':
                formatted = `**${selected || 'bold text'}**`
                break
            case 'italic':
                formatted = `*${selected || 'italic text'}*`
                break
            case 'underline':
                formatted = `<u>${selected || 'underlined text'}</u>`
                break
            case 'link':
                formatted = `[${selected || 'link text'}](https://)`
                break
            case 'bullet':
                formatted = `\n- ${selected || 'item'}`
                break
            case 'number':
                formatted = `\n1. ${selected || 'item'}`
                break
            case 'clear':
                formatted = selected.replace(/[\*\_\[\]\(\)\<\>]|^\s*[-*1-9.]+\s+/gm, '')
                break
            default:
                formatted = selected
        }

        const newBody = body.substring(0, start) + formatted + body.substring(end)
        setBody(newBody)
    }

    const handleEditPost = (post: any) => {
        setEditingPostId(post.id)
        setTitle(post.title || '')
        setBody(post.body || '')
        setCoverImageUrl(post.cover_image_url || '')
        setCoverImageFile(null)
        setVisibility(post.visibility || 'public')
        setError(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancelEdit = () => {
        setEditingPostId(null)
        setTitle('')
        setBody('')
        setCoverImageUrl('')
        setCoverImageFile(null)
        setVisibility('public')
        setError(null)
    }

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!body.trim() && !title.trim() && !coverImageUrl.trim() && !coverImageFile) {
            setError('Please write some content or add an image before publishing.')
            return
        }

        setSaving(true)
        setError(null)

        try {
            let finalCoverUrl = coverImageUrl

            if (coverImageFile) {
                const formData = new FormData()
                formData.append('file', coverImageFile)
                const uploadRes = await axios.post('/api/v1/creator/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                if (uploadRes.data?.url) {
                    finalCoverUrl = uploadRes.data.url
                }
            }

            const payload = {
                title: title.trim() || undefined,
                body,
                cover_image_url: finalCoverUrl.trim() || null,
                visibility,
            }

            if (editingPostId) {
                await axios.put(`/api/v1/creator/posts/${editingPostId}`, payload)
            } else {
                await axios.post('/api/v1/creator/posts', payload)
            }

            handleCancelEdit()
            fetchPosts()
        } catch (err: any) {
            setError(err.response?.data?.message || (editingPostId ? 'Failed to update post' : 'Failed to publish post'))
        } finally {
            setSaving(false)
        }
    }

    const confirmDeletePost = async () => {
        if (!postToDelete) return
        setDeleting(true)
        try {
            await axios.delete(`/api/v1/creator/posts/${postToDelete}`)
            setPostToDelete(null)
            fetchPosts()
        } catch (e) {
            console.error(e)
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-8 w-36 bg-border/40 rounded-xl" />
                        <div className="h-4 w-64 bg-border/40 rounded-lg" />
                    </div>
                </div>
                {/* Editor Skeleton Card */}
                <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-xs">
                    <div className="h-6 w-32 bg-border/40 rounded-xl" />
                    <div className="h-10 w-full bg-border/40 rounded-2xl" />
                    <div className="h-28 w-full bg-border/40 rounded-2xl" />
                    <div className="flex justify-end">
                        <div className="h-10 w-32 bg-border/40 rounded-full" />
                    </div>
                </div>
                {/* Feed Items Skeleton */}
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-surface border border-border rounded-3xl p-6 space-y-3 shadow-xs">
                            <div className="flex items-center justify-between">
                                <div className="h-5 w-24 bg-border/40 rounded-full" />
                                <div className="h-4 w-20 bg-border/40 rounded-lg" />
                            </div>
                            <div className="h-6 w-2/3 bg-border/40 rounded-xl" />
                            <div className="h-4 w-full bg-border/40 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-8 font-sans">
            {/* Header */}
            <div className="text-center space-y-1">
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Create a Post</h1>
                <p className="text-sm text-text-muted">Share updates with your supporters.</p>
            </div>

            {/* Post Creator Card */}
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                {error && (
                    <div className="p-3 text-xs bg-error-50 text-error-700 border border-error-200 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCreatePost} className="space-y-4">
                    {/* Post Title Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Post Title (Optional)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-xl font-bold text-text-primary placeholder:text-text-muted bg-transparent focus:outline-none py-1"
                        />
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    {/* Image Preview Box if image set */}
                    {coverImageUrl && (
                        <div className="relative rounded-2xl overflow-hidden border border-border max-h-64 bg-black/5 group">
                            <img src={coverImageUrl} alt="Post Attachment" className="w-full h-full object-cover max-h-64" />
                            <button
                                type="button"
                                onClick={() => {
                                    setCoverImageUrl('')
                                    setCoverImageFile(null)
                                }}
                                className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-xl backdrop-blur-xs transition-all flex items-center space-x-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Image</span>
                            </button>
                        </div>
                    )}

                    {/* Rich Editor Box */}
                    <div className="border border-border rounded-2xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
                        {/* Toolbar Header */}
                        <div className="flex items-center space-x-1 px-4 py-2.5 border-b border-border text-text-secondary overflow-x-auto text-xs font-semibold">
                            <select className="bg-transparent border-none text-xs font-semibold text-text-secondary focus:outline-none pr-2 cursor-pointer">
                                <option value="normal">Normal</option>
                                <option value="h1">Heading 1</option>
                                <option value="h2">Heading 2</option>
                            </select>

                            <div className="h-4 w-px bg-border mx-1" />

                            <button
                                type="button"
                                onClick={() => handleFormat('bold')}
                                className="p-1.5 hover:bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all font-bold"
                                title="Bold"
                            >
                                <Bold className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat('italic')}
                                className="p-1.5 hover:bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all italic"
                                title="Italic"
                            >
                                <Italic className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat('underline')}
                                className="p-1.5 hover:bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all underline"
                                title="Underline"
                            >
                                <UnderlineIcon className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat('link')}
                                className="p-1.5 hover:bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all"
                                title="Insert Link"
                            >
                                <LinkIcon className="w-4 h-4" />
                            </button>

                            <div className="h-4 w-px bg-border mx-1" />

                            <button
                                type="button"
                                onClick={() => handleFormat('number')}
                                className="p-1.5 hover:bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all"
                                title="Numbered List"
                            >
                                <ListOrdered className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat('bullet')}
                                className="p-1.5 hover:bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all"
                                title="Bulleted List"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormat('clear')}
                                className="p-1.5 hover:bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all"
                                title="Clear Formatting"
                            >
                                <Type className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Editor Textarea */}
                        <textarea
                            ref={textareaRef}
                            rows={6}
                            placeholder="Write your post here..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full p-4 text-sm text-text-primary placeholder:text-text-muted placeholder:italic bg-transparent focus:outline-none resize-y min-h-[160px]"
                        />
                    </div>

                    {/* Bottom Action Controls Bar */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className={`p-2 rounded-xl transition-all cursor-pointer ${
                                    coverImageUrl
                                        ? 'bg-primary-50 text-primary-600 font-bold'
                                        : 'text-text-muted hover:text-text-primary hover:bg-background'
                                }`}
                                title="Upload Image File"
                            >
                                <ImageIcon className="w-5 h-5" />
                            </button>

                            {/* Visibility Selector */}
                            <div className="w-48">
                                <Select
                                    value={visibility}
                                    onChange={(val) => setVisibility(val)}
                                    options={[
                                        { value: 'public', label: 'Public' },
                                        { value: 'supporters', label: 'Supporters Only' },
                                        { value: 'members', label: 'Members Only' }
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {editingPostId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2.5 bg-background hover:bg-border/40 text-text-muted hover:text-text-primary font-bold text-sm rounded-full transition-all cursor-pointer flex items-center space-x-1"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-full shadow-xs transition-all disabled:opacity-50 inline-flex items-center space-x-2 cursor-pointer"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>{saving ? (editingPostId ? 'Updating...' : 'Publishing...') : (editingPostId ? 'Update Post' : 'Publish Post')}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Published Posts Feed */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="bg-surface border border-border rounded-3xl p-8 text-center text-xs text-text-muted">
                        No published posts yet. Compose one above!
                    </div>
                ) : (
                    posts.map((post) => {
                        const dateStr = post.published_at
                            ? new Date(post.published_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                              })
                            : 'Jul 30, 2026'

                        const viewsCount = post.views_count || 0

                        return (
                            <div
                                key={post.id}
                                className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-3 group transition-all overflow-hidden"
                            >
                                {/* Post Meta Bar */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 text-xs">
                                        {/* Public Badge */}
                                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-success-50 text-success-700 border border-success-200 font-extrabold rounded-md text-[10px] tracking-wide uppercase">
                                            <Globe className="w-3 h-3" />
                                            <span>{post.visibility.toUpperCase()}</span>
                                        </span>

                                        <span className="font-semibold text-text-muted">{dateStr}</span>
                                        <span className="text-text-muted">•</span>

                                        {/* Views Pill */}
                                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-background text-text-secondary rounded-full font-semibold text-[11px]">
                                            <Eye className="w-3.5 h-3.5 text-text-muted" />
                                            <span>{viewsCount} views</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => handleEditPost(post)}
                                            className="p-1.5 text-text-muted hover:text-primary-600 rounded-lg hover:bg-background transition-all"
                                            title="Edit Post"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => window.open(`/${profile?.slug || 'creator'}/posts/${post.id}`, '_blank')}
                                            className="p-1.5 text-text-muted hover:text-primary-600 rounded-lg hover:bg-background transition-all"
                                            title="View Post Details Page"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setPostToDelete(post.id)}
                                            className="p-1.5 text-text-muted hover:text-error-600 rounded-lg hover:bg-background transition-all"
                                            title="Delete Post"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Post Image if uploaded */}
                                {post.cover_image_url && (
                                    <div className="rounded-2xl overflow-hidden border border-border max-h-72 my-2">
                                        <img src={post.cover_image_url} alt="" className="w-full h-full object-cover max-h-72" />
                                    </div>
                                )}

                                {/* Post Title & Content */}
                                {post.title && (
                                    <h4 className="text-base font-bold text-text-primary pt-1">
                                        {post.title}
                                    </h4>
                                )}

                                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-normal">
                                    {post.body}
                                </p>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Smooth Deletion Action Popup Modal */}
            <ConfirmModal
                isOpen={!!postToDelete}
                title="Delete Post?"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete Post"
                cancelText="Cancel"
                variant="danger"
                isLoading={deleting}
                onConfirm={confirmDeletePost}
                onClose={() => setPostToDelete(null)}
            />
        </div>
    )
}
