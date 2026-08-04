'use client'

import { useState, useEffect, useRef } from 'react'
import axios from '@/lib/axios'
import ConfirmModal from '@/components/ui/ConfirmModal'
import {
    ImageIcon,
    Loader2,
    Trash2,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Type,
    GraduationCap,
    Check,
    Edit3,
    Plus,
    X
} from 'lucide-react'

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null)

    // Form state
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [regularPrice, setRegularPrice] = useState('5000')
    const [discountedPrice, setDiscountedPrice] = useState('2500')
    const [isFree, setIsFree] = useState(false)
    const [coverImageUrl, setCoverImageUrl] = useState('')
    const [description, setDescription] = useState('')

    const [uploadingImage, setUploadingImage] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Modal state for deletion
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchCourses = async () => {
        try {
            const res = await axios.get('/api/v1/creator/courses')
            setCourses(res.data.courses || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    const openCreateModal = () => {
        setEditingCourseId(null)
        setTitle('')
        setSubtitle('')
        setRegularPrice('5000')
        setDiscountedPrice('2500')
        setIsFree(false)
        setCoverImageUrl('')
        setDescription('')
        setError(null)
        setShowModal(true)
    }

    const openEditModal = (course: any) => {
        setEditingCourseId(course.id)
        setTitle(course.title || '')
        setSubtitle(course.subtitle || '')
        setRegularPrice(course.regular_price ? String(course.regular_price) : '0')
        setDiscountedPrice(course.discounted_price ? String(course.discounted_price) : '')
        setIsFree(!!course.is_free)
        setCoverImageUrl(course.cover_image_url || '')
        setDescription(course.description || '')
        setError(null)
        setShowModal(true)
    }

    const [coverImageFile, setCoverImageFile] = useState<File | null>(null)

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
        const selected = description.substring(start, end)

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
            case 'quote':
                formatted = `\n> ${selected || 'quoted text'}`
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

        const newDesc = description.substring(0, start) + formatted + description.substring(end)
        setDescription(newDesc)
    }

    const handleSaveCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) {
            setError('Please enter a course title.')
            return
        }

        setSaving(true)
        setError(null)

        const payload = {
            title: title.trim(),
            subtitle: subtitle.trim() || null,
            regular_price: isFree ? 0 : parseFloat(regularPrice) || 0,
            discounted_price: isFree ? null : (discountedPrice ? parseFloat(discountedPrice) : null),
            is_free: isFree,
            cover_image_url: coverImageUrl || null,
            description: description || null,
        }

        try {
            if (editingCourseId) {
                await axios.put(`/api/v1/creator/courses/${editingCourseId}`, payload)
            } else {
                await axios.post('/api/v1/creator/courses', payload)
            }
            setShowModal(false)
            fetchCourses()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save course')
        } finally {
            setSaving(false)
        }
    }

    const confirmDeleteCourse = async () => {
        if (!courseToDelete) return
        setDeleting(true)
        try {
            await axios.delete(`/api/v1/creator/courses/${courseToDelete}`)
            setCourseToDelete(null)
            fetchCourses()
        } catch (e) {
            console.error(e)
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto py-6 space-y-8 font-sans animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-8 w-40 bg-border/40 rounded-xl" />
                        <div className="h-4 w-64 bg-border/40 rounded-lg" />
                    </div>
                    <div className="h-10 w-44 bg-border/40 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-xs space-y-4">
                            <div className="h-44 w-full bg-border/40" />
                            <div className="p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="h-6 w-20 bg-border/40 rounded-full" />
                                    <div className="h-6 w-16 bg-border/40 rounded-xl" />
                                </div>
                                <div className="h-6 w-3/4 bg-border/40 rounded-xl" />
                                <div className="h-4 w-full bg-border/40 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto py-6 space-y-8 font-sans">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Courses</h1>
                    <p className="text-sm text-text-muted mt-1">Create and manage your online courses for supporters.</p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-full shadow-xs transition-all flex items-center space-x-2 w-fit cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New Course</span>
                </button>
            </div>

            {/* Courses Listing Feed */}
            {courses.length === 0 ? (
                <div className="bg-surface border border-border rounded-3xl p-12 text-center space-y-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">No Courses Created</h3>
                        <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                            Offer exclusive learning courses to your audience.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-full shadow-xs transition-all inline-flex items-center space-x-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Your First Course</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-surface border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div>
                                {/* Course Cover Banner */}
                                {course.cover_image_url ? (
                                    <div className="h-44 w-full bg-background overflow-hidden border-b border-border">
                                        <img src={course.cover_image_url} alt={course.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-36 w-full bg-primary-50 text-primary-600 border-b border-border flex items-center justify-center">
                                        <GraduationCap className="w-10 h-10" />
                                    </div>
                                )}

                                <div className="p-6 space-y-3">
                                    <div className="flex items-center justify-between">
                                        {course.is_free ? (
                                            <span className="px-3 py-1 bg-success-50 text-success-700 border border-success-200 font-extrabold rounded-full text-xs uppercase">
                                                FREE
                                            </span>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-base font-extrabold text-text-primary">
                                                    ৳{course.discounted_price || course.regular_price}
                                                </span>
                                                {course.discounted_price && (
                                                    <span className="text-xs text-text-muted line-through">
                                                        ৳{course.regular_price}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => openEditModal(course)}
                                                className="p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-background transition-all"
                                                title="Edit Course"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setCourseToDelete(course.id)}
                                                className="p-2 text-text-muted hover:text-error-600 rounded-xl hover:bg-background transition-all"
                                                title="Delete Course"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-text-primary leading-snug">{course.title}</h4>
                                    {course.subtitle && (
                                        <p className="text-xs text-text-muted line-clamp-2">{course.subtitle}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Course Create / Edit Modal Dialog */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-surface border border-border rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 md:px-8 pb-4 border-b border-border flex-shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                                    {editingCourseId ? 'Edit Course' : 'Create New Course'}
                                </h2>
                                <p className="text-sm text-text-muted mt-0.5">Fill in the basics to get started.</p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-background transition-all cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:px-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                            {error && (
                                <div className="p-3.5 text-xs bg-error-50 text-error-700 border border-error-200 rounded-2xl">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSaveCourse} className="space-y-6">
                            {/* TITLE */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">TITLE</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Master React in 30 Days"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                />
                            </div>

                            {/* SUBTITLE / TAGLINE */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">SUBTITLE / TAGLINE</label>
                                    <span className="text-xs text-text-muted font-mono">{subtitle.length}/120</span>
                                </div>
                                <input
                                    type="text"
                                    maxLength={120}
                                    placeholder="A short, catchy description (max 120 chars)"
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                />
                            </div>

                            {/* PRICE INPUTS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* REGULAR PRICE */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">REGULAR PRICE</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-text-muted text-sm font-bold">৳</span>
                                        <input
                                            type="number"
                                            disabled={isFree}
                                            placeholder="5000"
                                            value={regularPrice}
                                            onChange={(e) => setRegularPrice(e.target.value)}
                                            className="w-full bg-background border border-border rounded-2xl pl-9 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium disabled:opacity-40"
                                        />
                                    </div>
                                </div>

                                {/* DISCOUNTED PRICE */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-success-600 tracking-wider uppercase">DISCOUNTED PRICE</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-success-600 text-sm font-bold">৳</span>
                                        <input
                                            type="number"
                                            disabled={isFree}
                                            placeholder="2500"
                                            value={discountedPrice}
                                            onChange={(e) => setDiscountedPrice(e.target.value)}
                                            className="w-full bg-background border border-success-500 rounded-2xl pl-9 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-success-500 transition-all font-medium disabled:opacity-40"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* FREE COURSE CHECKBOX */}
                            <div
                                onClick={() => setIsFree(!isFree)}
                                className="flex items-center space-x-3 bg-background border border-border rounded-2xl p-4 cursor-pointer hover:border-text-muted transition-all select-none"
                            >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                    isFree ? 'bg-primary-600 border-primary-600 text-white' : 'border-border bg-surface'
                                }`}>
                                    {isFree && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <span className="text-sm font-bold text-text-primary">Make this course FREE for everyone</span>
                            </div>

                            {/* COVER IMAGE DROPZONE */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">COVER IMAGE</label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />

                                {coverImageUrl ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-border max-h-72 bg-black/5 group">
                                        <img src={coverImageUrl} alt="Thumbnail" className="w-full h-full object-cover max-h-72" />
                                        <button
                                            type="button"
                                            onClick={() => setCoverImageUrl('')}
                                            className="absolute top-3 right-3 px-3 py-1.5 bg-black/80 hover:bg-black text-white text-xs font-bold rounded-xl backdrop-blur-xs transition-all flex items-center space-x-1"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Remove Thumbnail</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-border hover:border-primary-500 bg-background rounded-3xl p-8 text-center cursor-pointer transition-all space-y-3 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-surface border border-border text-text-muted group-hover:text-primary-600 flex items-center justify-center mx-auto transition-all">
                                            {uploadingImage ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-primary">
                                                {uploadingImage ? 'Uploading Image...' : 'Upload Thumbnail'}
                                            </p>
                                            <p className="text-xs text-text-muted mt-1">16:9 recommended</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* DESCRIPTION */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary tracking-wider uppercase">DESCRIPTION</label>

                                <div className="border border-border rounded-2xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary-500 transition-all">
                                    {/* Toolbar Header */}
                                    <div className="flex items-center space-x-1 px-4 py-3 border-b border-border text-text-muted overflow-x-auto text-xs font-semibold">
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
                                            onClick={() => handleFormat('quote')}
                                            className="p-1.5 hover:bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all"
                                            title="Quote"
                                        >
                                            <Quote className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleFormat('link')}
                                            className="p-1.5 hover:bg-surface rounded-lg text-text-muted hover:text-text-primary transition-all"
                                            title="Insert Link"
                                        >
                                            <LinkIcon className="w-4 h-4" />
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
                                        placeholder="What will students learn?"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-4 text-sm text-text-primary placeholder:text-text-muted bg-transparent focus:outline-none resize-y min-h-[160px]"
                                    />
                                </div>
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 bg-background hover:bg-surface text-text-secondary font-bold text-sm rounded-full transition-all border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-full shadow-xs transition-all disabled:opacity-50 inline-flex items-center space-x-2 cursor-pointer"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>{saving ? 'Saving...' : (editingCourseId ? 'Update Course' : 'Save & Continue')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            )}

            {/* Deletion Confirmation Modal */}
            <ConfirmModal
                isOpen={!!courseToDelete}
                onClose={() => setCourseToDelete(null)}
                onConfirm={confirmDeleteCourse}
                title="Delete Course"
                message="Are you sure you want to delete this course? This action cannot be undone."
                confirmText={deleting ? "Deleting..." : "Delete Course"}
                variant="danger"
            />
        </div>
    )
}
