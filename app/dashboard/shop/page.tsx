'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
    Plus,
    ShoppingBag,
    Trash2,
    Pencil,
    Download,
    Package,
    Video,
    FileText,
    ExternalLink,
    Search,
    ChevronDown,
    Sparkles,
    Settings,
    Clock,
    CheckCircle2,
    SlidersHorizontal,
    Share2,
    Zap,
    Users,
    X,
    Tag,
    Gift,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    UploadCloud,
    Link2,
    Mail,
    FileUp,
    ArrowRight,
    ArrowLeft,
    Eye,
    Check
} from 'lucide-react'
import ImageSlider from '@/components/ui/ImageSlider'
import ConfirmModal from '@/components/ui/ConfirmModal'

type ProductType = 'digital' | 'call' | 'bundle'
type DeliveryMode = 'instant' | 'order'
type AssetType = 'file' | 'gdrive'
type DiscountMode = 'indefinite' | 'limited'
type TabState = 'active' | 'pending'
type FormStep = 1 | 2 | 3 | 4

interface FAQItem {
    id: string
    question: string
    answer: string
}

interface BuyerRequirement {
    id: string
    label: string
}

const CATEGORY_OPTIONS = [
    'Design',
    'Software Development',
    'Freelancing & Digital Marketing',
    '1-on-1 Services & Consultation',
    'Self Improvement',
    'Subscription',
    'Business & Finance',
    'Audio & Music',
    'Video & Film',
    'Photography & LUTs',
    'Education & Exam Prep',
    'Gaming & Esports',
    'Other'
]

export default function CreatorShop() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<TabState>('active')
    const [offeringTypeFilter, setOfferingTypeFilter] = useState<'all' | 'digital' | 'call' | 'bundle'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showToolsMenu, setShowToolsMenu] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingProductId, setEditingProductId] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState<FormStep>(1)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    // User info & creator profile state
    const [userEmail, setUserEmail] = useState('')
    const [creatorSlug, setCreatorSlug] = useState('')
    const [copiedProductId, setCopiedProductId] = useState<string | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    // Form fields
    const [selectedType, setSelectedType] = useState<ProductType>('digital')
    const [isAffiliateEnabled, setIsAffiliateEnabled] = useState(false)
    const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('instant')
    const [assetType, setAssetType] = useState<AssetType>('file')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
    const [driveUrl, setDriveUrl] = useState('')
    const [meetingLink, setMeetingLink] = useState('')
    const [selectedBundleProductIds, setSelectedBundleProductIds] = useState<string[]>([])
    const [deliveryMethod, setDeliveryMethod] = useState('')
    const [buyerRequirements, setBuyerRequirements] = useState<BuyerRequirement[]>([])
    const [supportEmail, setSupportEmail] = useState('')
    const [supportWhatsapp, setSupportWhatsapp] = useState('')

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Other')
    const [priceBdt, setPriceBdt] = useState('500')
    const [isFreeForEveryone, setIsFreeForEveryone] = useState(false)
    const [isDiscounted, setIsDiscounted] = useState(false)
    const [discountedPriceBdt, setDiscountedPriceBdt] = useState('350')
    const [discountMode, setDiscountMode] = useState<DiscountMode>('limited')
    const [offerEndsAt, setOfferEndsAt] = useState('')
    const [description, setDescription] = useState('Get access to my exclusive digital content.')
    const [downloadLimit, setDownloadLimit] = useState('5')
    const [coverImageUrl, setCoverImageUrl] = useState('')

    // Confirmation fields
    const [successMessage, setSuccessMessage] = useState('Thanks for your support!')
    const [isContentConfirmed, setIsContentConfirmed] = useState(false)

    // FAQs & Gallery Local Previews
    const [faqs, setFaqs] = useState<FAQItem[]>([])
    const [gallery, setGallery] = useState<string[]>([])

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const showToast = (message: string) => {
        setToastMessage(message)
        setTimeout(() => {
            setToastMessage(null)
        }, 3000)
    }

    const copyToClipboard = async (text: string, productId?: string) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text)
            } else {
                const textArea = document.createElement('textarea')
                textArea.value = text
                textArea.style.position = 'fixed'
                textArea.style.opacity = '0'
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
            }
            if (productId) {
                setCopiedProductId(productId)
                setTimeout(() => setCopiedProductId(null), 2000)
            }
            showToast('Link copied to clipboard!')
        } catch {
            showToast('Failed to copy link.')
        }
    }

    const fetchInitialData = async () => {
        try {
            const [productsRes, profileRes] = await Promise.allSettled([
                axios.get('/api/v1/creator/products'),
                axios.get('/api/v1/creator/profile')
            ])

            if (productsRes.status === 'fulfilled') {
                setProducts(productsRes.value.data.products || [])
            }

            if (profileRes.status === 'fulfilled') {
                const profile = profileRes.value.data?.profile || profileRes.value.data
                const slug = profile?.slug || ''
                if (slug) {
                    setCreatorSlug(slug)
                }
                const email = profile?.user?.email || profile?.email || ''
                if (email) {
                    setUserEmail(email)
                    setSupportEmail(email)
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInitialData()
    }, [])

    const resetFormFields = () => {
        setEditingProductId(null)
        setTitle('')
        setCategory('Design')
        setDescription('Get access to my exclusive digital content.')
        setPriceBdt('500')
        setCoverImageUrl('')
        setGallery([])
        setSelectedFile(null)
        setSelectedFileName(null)
        setDriveUrl('')
        setMeetingLink('')
        setDeliveryMethod('')
        setSelectedBundleProductIds([])
        setFaqs([])
        setBuyerRequirements([])
        setSupportEmail(userEmail || '')
        setSupportWhatsapp('')
        setIsDiscounted(false)
        setDiscountedPriceBdt('350')
        setIsFreeForEveryone(false)
        setIsAffiliateEnabled(false)
        setDiscountMode('limited')
        setOfferEndsAt('')
        setDeliveryMode('instant')
        setAssetType('file')
        setSuccessMessage('Thanks for your support!')
        setIsContentConfirmed(false)
        setError(null)
        setCurrentStep(1)
    }

    const handleOpenModal = (type: ProductType = 'digital') => {
        resetFormFields()
        setSelectedType(type)
        setSupportEmail(userEmail || '')
        if (type === 'call') {
            setTitle('1-on-1 Strategy & Mentorship Call')
            setDescription('Book a private 30-minute 1-on-1 strategy call with me.')
            setPriceBdt('1500')
            setCategory('Education & Exam Prep')
        } else if (type === 'bundle') {
            setTitle('Ultimate Creators Asset Bundle')
            setDescription('Get immediate access to all my top resources, guides, and templates.')
            setPriceBdt('2500')
            setCategory('Design')
        }
        setShowModal(true)
    }

    const handleOpenEditModal = (product: any) => {
        setEditingProductId(product.id)
        setSelectedType(product.type || 'digital')
        setTitle(product.title || '')
        setCategory(product.category || 'Other')
        setDescription(product.description || '')
        setCoverImageUrl(product.cover_image_url || '')

        let parsedGallery: string[] = []
        if (Array.isArray(product.gallery)) {
            parsedGallery = product.gallery
        } else if (typeof product.gallery === 'string') {
            try {
                const parsed = JSON.parse(product.gallery)
                if (Array.isArray(parsed)) parsedGallery = parsed
            } catch (e) {
                if (product.gallery) parsedGallery = [product.gallery]
            }
        }

        // If gallery is empty but cover_image_url exists, include cover_image_url in gallery so it displays
        if (parsedGallery.length === 0 && product.cover_image_url) {
            parsedGallery = [product.cover_image_url]
        }

        setGallery(parsedGallery)
        setPriceBdt((product.price_cents / 100).toString())
        setIsDiscounted(!!product.discount_price_cents)
        setDiscountedPriceBdt(product.discount_price_cents ? (product.discount_price_cents / 100).toString() : '350')
        setIsFreeForEveryone(product.is_free || product.price_cents === 0)
        setIsAffiliateEnabled(product.is_affiliate_enabled || false)
        setDiscountMode(product.discount_mode || 'limited')
        setOfferEndsAt(product.offer_ends_at ? product.offer_ends_at.slice(0, 16) : '')
        setDeliveryMode(product.delivery_mode || 'instant')
        setAssetType(product.asset_type || 'file')

        // Prepopulate attached file info if available
        setSelectedFile(null)
        if (product.file && product.file.original_name) {
            const sizeMb = product.file.size_bytes ? (product.file.size_bytes / (1024 * 1024)).toFixed(1) : null
            setSelectedFileName(sizeMb ? `${product.file.original_name} (${sizeMb} MB)` : product.file.original_name)
        } else if (product.file_id) {
            setSelectedFileName(`Attached File (${product.file_id.slice(0, 8)}...)`)
        } else {
            setSelectedFileName(null)
        }

        setDriveUrl(product.drive_url || '')
        setMeetingLink(product.drive_url || '')
        setDeliveryMethod(product.delivery_method || '')
        setSelectedBundleProductIds(product.bundled_product_ids || [])
        setBuyerRequirements(product.buyer_requirements || [])
        setSupportEmail(product.support_email || '')
        setSupportWhatsapp(product.support_whatsapp || '')
        setSuccessMessage(product.success_message || 'Thanks for your support!')
        setIsContentConfirmed(product.is_content_confirmed || true)
        setFaqs(product.faqs || [])
        setCurrentStep(1)
        setError(null)
        setShowModal(true)
    }

    // Upload gallery image file to media endpoint and store clean storage URL
    const handlePickGalleryImage = async (file: File) => {
        if (gallery.length >= 5) return

        const maxSizeBytes = 5 * 1024 * 1024
        if (file.size > maxSizeBytes) {
            setError(`Selected image (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 5MB maximum upload limit.`)
            return
        }

        setError(null)
        const uploadData = new FormData()
        uploadData.append('file', file)

        try {
            const res = await axios.post('/api/v1/creator/media/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const uploadedUrl = res.data?.url
            if (uploadedUrl) {
                setGallery((prev) => [...prev, uploadedUrl])
                if (!coverImageUrl) setCoverImageUrl(uploadedUrl)
            }
        } catch (uploadErr: any) {
            setError(uploadErr.response?.data?.message || 'Failed to upload image. Please try again.')
        }
    }

    const handleAddFaq = () => {
        if (faqs.length >= 5) return
        setFaqs((prev) => [
            ...prev,
            { id: Date.now().toString(), question: '', answer: '' }
        ])
    }

    const handleRemoveFaq = (id: string) => {
        setFaqs((prev) => prev.filter((item) => item.id !== id))
    }

    const handleFaqChange = (id: string, field: 'question' | 'answer', value: string) => {
        setFaqs((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        )
    }

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault()

        if (currentStep === 2) {
            const basePriceVal = parseFloat(priceBdt || '0')
            const discountPriceVal = parseFloat(discountedPriceBdt || '0')
            if (isDiscounted && !isFreeForEveryone && (!discountedPriceBdt || discountPriceVal >= basePriceVal)) {
                setError('Discounted price must be smaller than the regular base price.')
                return
            }
        }

        if (currentStep < 4) {
            setError(null)
            setCurrentStep((prev) => (prev + 1) as FormStep)
            return
        }

        if (!isContentConfirmed) {
            setError('Please accept the content guidelines confirmation checkbox.')
            return
        }

        if (selectedType === 'bundle' && selectedBundleProductIds.length < 2) {
            setError('Please select at least 2 products to include in this combo bundle.')
            return
        }

        const basePriceNum = parseFloat(priceBdt || '0')
        const discountPriceNum = parseFloat(discountedPriceBdt || '0')
        if (isDiscounted && !isFreeForEveryone && (!discountedPriceBdt || discountPriceNum >= basePriceNum)) {
            setError('Discounted price must be smaller than the regular base price.')
            return
        }

        setSaving(true)
        setError(null)

        const finalPrice = isFreeForEveryone ? 0 : Math.round(parseFloat(priceBdt || '0') * 100)
        const finalDiscountPrice = isDiscounted && discountedPriceBdt ? Math.round(parseFloat(discountedPriceBdt) * 100) : null
        const finalCoverUrl = coverImageUrl || (gallery.length > 0 ? gallery[0] : null)

        const formData = new FormData()
        formData.append('title', title || 'Untitled Listing')
        formData.append('category', category)
        if (description) formData.append('description', description)
        if (finalCoverUrl) formData.append('cover_image_url', finalCoverUrl)
        formData.append('price_cents', finalPrice.toString())
        if (finalDiscountPrice !== null) formData.append('discount_price_cents', finalDiscountPrice.toString())
        formData.append('is_free', isFreeForEveryone ? '1' : '0')
        formData.append('is_affiliate_enabled', isAffiliateEnabled ? '1' : '0')
        formData.append('delivery_mode', selectedType === 'bundle' ? 'instant' : deliveryMode)
        formData.append('asset_type', assetType)

        const finalDriveUrl = selectedType === 'call' ? meetingLink : driveUrl
        if (finalDriveUrl) formData.append('drive_url', finalDriveUrl)

        const finalDeliveryMethod = selectedType === 'call' ? 'Zoom Call' : selectedType === 'bundle' ? 'Bundle Combo Access' : deliveryMethod
        if (finalDeliveryMethod) formData.append('delivery_method', finalDeliveryMethod)

        if (supportEmail) formData.append('support_email', supportEmail)
        if (supportWhatsapp) formData.append('support_whatsapp', supportWhatsapp)
        formData.append('success_message', successMessage || 'Thanks for your support!')
        formData.append('is_content_confirmed', isContentConfirmed ? '1' : '0')
        formData.append('discount_mode', discountMode)
        if (offerEndsAt) formData.append('offer_ends_at', offerEndsAt)
        formData.append('download_limit', downloadLimit.toString())
        formData.append('type', selectedType)

        selectedBundleProductIds.forEach((id, idx) => {
            formData.append(`bundled_product_ids[${idx}]`, id)
        })

        faqs.forEach((faq, idx) => {
            formData.append(`faqs[${idx}][question]`, faq.question)
            formData.append(`faqs[${idx}][answer]`, faq.answer)
        })

        const validGallery = gallery.filter((url) => typeof url === 'string' && !url.startsWith('data:'))
        validGallery.forEach((url, idx) => {
            formData.append(`gallery[${idx}]`, url)
        })

        if (selectedFile && selectedType === 'digital' && assetType === 'file') {
            formData.append('file', selectedFile)
        }

        try {
            if (editingProductId) {
                formData.append('_method', 'PUT')
                await axios.post(`/api/v1/creator/products/${editingProductId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            } else {
                await axios.post('/api/v1/creator/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            }
            setShowModal(false)
            resetFormFields()
            fetchInitialData()
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error?.message || 'Failed to save listing')
        } finally {
            setSaving(false)
        }
    }

    const confirmDeleteProduct = async () => {
        if (!itemToDelete) return
        setDeleting(true)
        try {
            await axios.delete(`/api/v1/creator/products/${itemToDelete}`)
            setItemToDelete(null)
            fetchInitialData()
        } catch (e) {
            console.error(e)
        } finally {
            setDeleting(false)
        }
    }

    const filteredProducts = products.filter((item) => {
        const isApproved = item.approval_status === 'approved'
        const matchesTab = activeTab === 'active' ? isApproved : !isApproved
        const matchesType = offeringTypeFilter === 'all' ? true : (item.type || 'digital') === offeringTypeFilter
        const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTab && matchesType && matchesSearch
    })

    const activeCount = products.filter((p) => p.approval_status === 'approved').length
    const pendingCount = products.filter((p) => p.approval_status !== 'approved').length

    // Calculate total individual value of selected bundle items
    const selectedBundleTotalBdt = selectedBundleProductIds.reduce((sum, id) => {
        const prod = products.find((p) => p.id === id)
        return sum + (prod ? prod.price_cents / 100 : 0)
    }, 0)

    if (loading) {
        return (
            <div suppressHydrationWarning className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-pulse font-sans">
                <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} suppressHydrationWarning className="h-28 bg-surface border border-border rounded-2xl" />
                    ))}
                </div>
                <div suppressHydrationWarning className="flex items-center justify-between">
                    <div suppressHydrationWarning className="h-10 w-48 bg-surface border border-border rounded-xl" />
                    <div suppressHydrationWarning className="h-10 w-32 bg-surface border border-border rounded-xl" />
                </div>
                <div suppressHydrationWarning className="h-64 bg-surface border border-border rounded-3xl" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 font-sans">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-text-primary text-background px-4 py-3 rounded-2xl shadow-xl border border-border flex items-center space-x-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Quick Create Offerings Header Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Digital Product Card */}
                <button
                    onClick={() => handleOpenModal('digital')}
                    className="cursor-pointer group relative text-left bg-surface hover:bg-elevated-surface border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                    <div className="flex items-start space-x-4 relative z-10">
                        <div className="p-3.5 bg-primary/10 text-primary rounded-xl group-hover:scale-105 transition-transform">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-text-primary text-base group-hover:text-primary transition-colors">
                                    Digital Product
                                </h3>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    Instant
                                </span>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed">
                                Sell eBooks, PDFs, presets, templates, or media files.
                            </p>
                        </div>
                    </div>
                </button>

                {/* 2. 1-on-1 Zoom Call */}
                <button
                    onClick={() => handleOpenModal('call')}
                    className="cursor-pointer group relative text-left bg-surface hover:bg-elevated-surface border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                    <div className="flex items-start space-x-4 relative z-10">
                        <div className="p-3.5 bg-primary/10 text-primary rounded-xl group-hover:scale-105 transition-transform">
                            <Video className="h-6 w-6" />
                        </div>
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-text-primary text-base group-hover:text-primary transition-colors">
                                    1-on-1 Call
                                </h3>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    Session
                                </span>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed">
                                Offer paid consultation calls, mentoring, or coaching.
                            </p>
                        </div>
                    </div>
                </button>

                {/* 3. Product Bundle */}
                <button
                    onClick={() => handleOpenModal('bundle')}
                    className="cursor-pointer group relative text-left bg-surface hover:bg-elevated-surface border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                    <div className="flex items-start space-x-4 relative z-10">
                        <div className="p-3.5 bg-primary/10 text-primary rounded-xl group-hover:scale-105 transition-transform">
                            <Package className="h-6 w-6" />
                        </div>
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-text-primary text-base group-hover:text-primary transition-colors">
                                    Product Bundle
                                </h3>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    High Value
                                </span>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed">
                                Combine multiple items into a single curated deal.
                            </p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Catalog Section Header & Control Bar */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary tracking-tight">Your Listings</h2>
                        <a
                            href={creatorSlug ? `/${creatorSlug}/shop` : '/shop'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs text-primary hover:underline font-medium mt-0.5 group"
                        >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>View public shop storefront</span>
                            <ExternalLink className="h-3 w-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => handleOpenModal('digital')}
                            className="cursor-pointer py-2.5 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md flex items-center space-x-2 transition-all active:scale-[0.98]"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Create Listing</span>
                        </button>
                    </div>
                </div>

                {/* Filter Controls Row & Offering Category Tabs */}
                <div className="flex flex-col gap-4 pt-2">
                    {/* Offering Category Filter Tabs */}
                    <div className="flex items-center space-x-2 border-b border-border pb-3 overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setOfferingTypeFilter('all')}
                            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                                offeringTypeFilter === 'all'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                            }`}
                        >
                            All Offerings ({products.length})
                        </button>
                        <button
                            onClick={() => setOfferingTypeFilter('digital')}
                            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                                offeringTypeFilter === 'digital'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                            }`}
                        >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Digital Products</span>
                        </button>
                        <button
                            onClick={() => setOfferingTypeFilter('call')}
                            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                                offeringTypeFilter === 'call'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                            }`}
                        >
                            <Video className="h-3.5 w-3.5" />
                            <span>1-on-1 Services & Calls</span>
                        </button>
                        <button
                            onClick={() => setOfferingTypeFilter('bundle')}
                            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                                offeringTypeFilter === 'bundle'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'bg-surface hover:bg-elevated-surface text-text-secondary border border-border'
                            }`}
                        >
                            <Package className="h-3.5 w-3.5" />
                            <span>Product Bundles</span>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Status Tabs */}
                        <div className="flex items-center bg-surface border border-border p-1 rounded-xl w-fit text-xs font-medium">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`cursor-pointer px-4 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                                    activeTab === 'active'
                                        ? 'bg-elevated-surface text-text-primary font-semibold shadow-xs'
                                        : 'text-text-muted hover:text-text-secondary'
                                }`}
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                <span>Active</span>
                                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-border/50 font-semibold">
                                    {activeCount}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`cursor-pointer px-4 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                                    activeTab === 'pending'
                                        ? 'bg-elevated-surface text-text-primary font-semibold shadow-xs'
                                        : 'text-text-muted hover:text-text-secondary'
                                }`}
                            >
                                <Clock className="h-3.5 w-3.5 text-text-muted" />
                                <span>Pending</span>
                                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-border/50 font-semibold">
                                    {pendingCount}
                                </span>
                            </button>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Search className="h-3.5 w-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search listings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-3 py-1.5 bg-surface border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary w-44 sm:w-56"
                                />
                            </div>

                            {/* Tools Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowToolsMenu(!showToolsMenu)}
                                    className="cursor-pointer px-3 py-1.5 bg-surface hover:bg-elevated-surface border border-border rounded-xl text-xs font-medium text-text-secondary flex items-center space-x-1.5 transition-colors"
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    <span>Tools</span>
                                    <ChevronDown className="h-3 w-3" />
                                </button>

                                {showToolsMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-elevated-surface border border-border rounded-xl shadow-lg p-1.5 z-20 space-y-1 text-xs">
                                        <button
                                            onClick={() => {
                                                setShowToolsMenu(false)
                                                window.location.href = '/dashboard/settings'
                                            }}
                                            className="cursor-pointer w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg flex items-center space-x-2 transition-colors"
                                        >
                                            <Settings className="h-3.5 w-3.5" />
                                            <span>Shop Settings</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowToolsMenu(false)
                                                const shopUrl = `${window.location.origin}/${creatorSlug || 'shop'}/shop`
                                                copyToClipboard(shopUrl)
                                            }}
                                            className="cursor-pointer w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg flex items-center space-x-2 transition-colors"
                                        >
                                            <Share2 className="h-3.5 w-3.5" />
                                            <span>Copy Storefront Link</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area (Empty State or Product Grid) */}
            {filteredProducts.length === 0 ? (
                <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-border bg-surface p-12 text-center space-y-5">
                    <div className="relative z-10 space-y-4">
                        <div className="p-4 bg-primary/10 text-primary rounded-2xl w-fit mx-auto shadow-inner">
                            <ShoppingBag className="h-8 w-8" />
                        </div>
                        <div className="max-w-sm mx-auto space-y-1">
                            <h3 className="text-lg font-bold text-text-primary">
                                {activeTab === 'active' ? 'No active products' : 'No pending approval products'}
                            </h3>
                            <p className="text-xs text-text-muted leading-relaxed">
                                {activeTab === 'active'
                                    ? 'Create a product and publish it to start accepting payments and digital downloads.'
                                    : 'Items awaiting review or verification will appear in this tab.'}
                            </p>
                        </div>
                        <button
                            onClick={() => handleOpenModal('digital')}
                            className="cursor-pointer py-2.5 px-5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 shadow-xs transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Create First Listing</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => {
                        const thumbnail = product.cover_image_url || (Array.isArray(product.gallery) && product.gallery.length > 0 ? product.gallery[0] : null)
                        const priceBdtVal = product.price_cents ? product.price_cents / 100 : 0
                        const discountPriceBdtVal = product.discount_price_cents ? product.discount_price_cents / 100 : null
                        const isFree = product.is_free || priceBdtVal === 0
                        const hasActiveOffer = !isFree && discountPriceBdtVal !== null && discountPriceBdtVal < priceBdtVal
                        const savingsPercent = hasActiveOffer && priceBdtVal > 0
                            ? Math.round(((priceBdtVal - discountPriceBdtVal!) / priceBdtVal) * 100)
                            : 0
                        const faqCount = Array.isArray(product.faqs) ? product.faqs.length : 0
                        const bundleItemCount = Array.isArray(product.bundled_product_ids) ? product.bundled_product_ids.length : 0
                        const productImages: string[] = Array.from(
                            new Set([
                                ...(product.cover_image_url ? [product.cover_image_url] : []),
                                ...(Array.isArray(product.gallery) ? product.gallery : []),
                            ])
                        ).filter(Boolean)

                        return (
                            <div
                                key={product.id}
                                className="group bg-surface hover:bg-elevated-surface rounded-3xl border border-border shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                            >
                                <div className="p-5 space-y-4">
                                    {/* Thumbnail Banner with Badges */}
                                    <div className="h-44 w-full rounded-2xl bg-background overflow-hidden relative border border-border group-hover:border-primary/30 transition-colors">
                                        {productImages.length > 0 ? (
                                            <ImageSlider
                                                images={productImages}
                                                alt={product.title}
                                                className="w-full h-full"
                                                imageClassName="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                                                showDots={productImages.length > 1}
                                                showArrows={productImages.length > 1}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary/5 flex flex-col items-center justify-center p-4 text-center space-y-2">
                                                <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                                                    {product.type === 'call' ? (
                                                        <Video className="h-7 w-7" />
                                                    ) : product.type === 'bundle' ? (
                                                        <Package className="h-7 w-7" />
                                                    ) : (
                                                        <FileText className="h-7 w-7" />
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
                                                    {product.category || 'Digital Item'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Top Left Badge: Product Type & Delivery */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                                            <span className="px-2.5 py-1 rounded-xl bg-surface/90 backdrop-blur-md border border-border text-[10px] font-extrabold text-text-primary uppercase tracking-wider shadow-xs flex items-center space-x-1">
                                                {product.type === 'bundle' ? (
                                                    <>
                                                        <Package className="h-3 w-3 text-primary" />
                                                        <span>{bundleItemCount > 0 ? `${bundleItemCount} Items Bundle` : 'Bundle'}</span>
                                                    </>
                                                ) : product.type === 'call' ? (
                                                    <>
                                                        <Video className="h-3 w-3 text-primary" />
                                                        <span>1-on-1 Call</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="h-3 w-3 text-primary" />
                                                        <span>{product.delivery_mode === 'order' ? 'Order Based' : 'Instant File'}</span>
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {/* Top Right Badge: Offer / Discount Banner */}
                                        <div className="absolute top-3 right-3 z-10">
                                            {isFree ? (
                                                <span className="px-2.5 py-1 rounded-xl bg-success text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center space-x-1">
                                                    <Gift className="h-3 w-3" />
                                                    <span>FREE</span>
                                                </span>
                                            ) : hasActiveOffer ? (
                                                <span className="px-2.5 py-1 rounded-xl bg-error text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center space-x-1 animate-pulse">
                                                    <Tag className="h-3 w-3" />
                                                    <span>SAVE {savingsPercent}%</span>
                                                </span>
                                            ) : null}
                                        </div>

                                        {/* Bottom Overlay Banner for Limited Time Offer */}
                                        {hasActiveOffer && product.discount_mode === 'limited' && product.offer_ends_at && (
                                            <div className="absolute bottom-0 inset-x-0 bg-error/90 text-white text-[10px] font-bold px-3 py-1 flex items-center justify-between backdrop-blur-xs">
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>Limited Time Deal</span>
                                                </span>
                                                <span>Ends {new Date(product.offer_ends_at).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Category Pill & Approval Status Badge */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                                            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                                {product.category || 'Digital'}
                                            </span>
                                            {product.approval_status === 'approved' ? (
                                                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-extrabold flex items-center space-x-1">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>Live</span>
                                                </span>
                                            ) : product.approval_status === 'rejected' ? (
                                                <span className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-extrabold">
                                                    Rejected
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-extrabold flex items-center space-x-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>Pending Approval</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-1 bg-background p-1 rounded-xl border border-border">
                                            <button
                                                onClick={() => handleOpenEditModal(product)}
                                                className="cursor-pointer p-1.5 text-text-muted hover:text-primary hover:bg-surface rounded-lg transition-colors"
                                                title="Edit Product"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const productSlug = product.slug || product.id
                                                    const productUrl = `${window.location.origin}/${creatorSlug || 'creator'}/products/${productSlug}`
                                                    copyToClipboard(productUrl, product.id)
                                                }}
                                                className="cursor-pointer p-1.5 text-text-muted hover:text-primary hover:bg-surface rounded-lg transition-colors"
                                                title="Copy Product Link"
                                            >
                                                {copiedProductId === product.id ? (
                                                    <Check className="h-3.5 w-3.5 text-success" />
                                                ) : (
                                                    <Share2 className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setItemToDelete(product.id)}
                                                className="cursor-pointer p-1.5 text-text-muted hover:text-error hover:bg-surface rounded-lg transition-colors"
                                                title="Delete Product"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <div className="space-y-1.5">
                                        <h3 className="font-extrabold text-text-primary text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                                            {product.title}
                                        </h3>
                                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                                            {product.description || 'No description provided for this item.'}
                                        </p>
                                    </div>

                                    {/* Metadata Badges (Deliverables, FAQs, Affiliate) */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-text-muted">
                                        {product.asset_type === 'gdrive' && (
                                            <span className="px-2 py-0.5 rounded-md bg-background border border-border flex items-center space-x-1">
                                                <Link2 className="h-3 w-3 text-primary" />
                                                <span>Google Drive</span>
                                            </span>
                                        )}
                                        {faqCount > 0 && (
                                            <span className="px-2 py-0.5 rounded-md bg-background border border-border flex items-center space-x-1">
                                                <Sparkles className="h-3 w-3 text-primary" />
                                                <span>{faqCount} FAQs</span>
                                            </span>
                                        )}
                                        {product.is_affiliate_enabled && (
                                            <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-medium flex items-center space-x-1">
                                                <Users className="h-3 w-3" />
                                                <span>Affiliate</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing & Sales Footer Bar */}
                                <div className="p-5 pt-3 bg-surface/50 border-t border-border flex items-center justify-between mt-1">
                                    <div className="flex items-baseline space-x-2">
                                        {isFree ? (
                                            <span className="text-lg font-black text-success">FREE</span>
                                        ) : hasActiveOffer ? (
                                            <>
                                                <span className="text-lg font-black text-primary">৳ {discountPriceBdtVal}</span>
                                                <span className="text-xs text-text-muted line-through">৳ {priceBdtVal}</span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-black text-text-primary">৳ {priceBdtVal}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-1.5 text-xs text-text-muted bg-background px-3 py-1.5 rounded-xl border border-border shadow-2xs">
                                        <Download className="h-3.5 w-3.5 text-primary" />
                                        <span className="font-semibold text-text-primary">{product.sales_count ?? product.purchase_count ?? product.purchases_count ?? 0}</span>
                                        <span className="text-[11px]">sales</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modal for Creating / Editing Listing */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-elevated-surface text-text-primary border border-border rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
                        {/* Modal Header & Progress Stepper */}
                        <div className="p-6 border-b border-border bg-surface space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                        {selectedType === 'digital' ? 'DIGITAL PRODUCT' : selectedType === 'call' ? '1-ON-1 CALL' : 'PRODUCT BUNDLE'}
                                    </span>
                                    <h2 className="text-xl font-bold text-text-primary tracking-tight">
                                        {editingProductId ? 'Edit Listing' : 'Create New Listing'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowModal(false)
                                        resetFormFields()
                                    }}
                                    className="cursor-pointer text-text-muted hover:text-text-primary p-2 rounded-xl hover:bg-background transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* 4-Step Stepper Header */}
                            <div className="grid grid-cols-4 gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                                        currentStep === 1
                                            ? 'border-primary bg-primary/10 text-text-primary font-bold shadow-xs'
                                            : 'border-border text-text-muted hover:border-border'
                                    }`}
                                >
                                    <div className="text-[10px] uppercase tracking-wider text-primary font-extrabold">Step 1</div>
                                    <div className="text-xs truncate">Basic Info</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                                        currentStep === 2
                                            ? 'border-primary bg-primary/10 text-text-primary font-bold shadow-xs'
                                            : 'border-border text-text-muted hover:border-border'
                                    }`}
                                >
                                    <div className="text-[10px] uppercase tracking-wider text-primary font-extrabold">Step 2</div>
                                    <div className="text-xs truncate">Pricing & Promo</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(3)}
                                    className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                                        currentStep === 3
                                            ? 'border-primary bg-primary/10 text-text-primary font-bold shadow-xs'
                                            : 'border-border text-text-muted hover:border-border'
                                    }`}
                                >
                                    <div className="text-[10px] uppercase tracking-wider text-primary font-extrabold">Step 3</div>
                                    <div className="text-xs truncate">Content & FAQ</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(4)}
                                    className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                                        currentStep === 4
                                            ? 'border-primary bg-primary/10 text-text-primary font-bold shadow-xs'
                                            : 'border-border text-text-muted hover:border-border'
                                    }`}
                                >
                                    <div className="text-[10px] uppercase tracking-wider text-primary font-extrabold">Step 4</div>
                                    <div className="text-xs truncate">{selectedType === 'bundle' ? 'Bundle Summary' : 'Delivery & Publish'}</div>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body: Split 2-Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto custom-scrollbar">
                            {/* Left Column: Interactive Form Steps */}
                            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                                {error && <div className="p-3.5 bg-error/10 text-error text-xs rounded-xl border border-error/20 font-medium">{error}</div>}

                                <form onSubmit={handleCreateProduct} className="space-y-6">
                                    {/* STEP 1: Basic Info & Offering Details */}
                                    {currentStep === 1 && (
                                        <div className="space-y-5 animate-in fade-in duration-200">
                                            {/* Bundle Selection Section */}
                                            {selectedType === 'bundle' ? (
                                                <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <label className="block text-xs font-semibold text-text-secondary">
                                                            Add Products to Bundle <span className="text-error">*</span>
                                                        </label>
                                                        <span className="text-[11px] text-primary font-bold">
                                                            {selectedBundleProductIds.length} included
                                                        </span>
                                                    </div>

                                                    {/* Dropdown Select Menu */}
                                                    <div className="relative">
                                                        <select
                                                            value=""
                                                            onChange={(e) => {
                                                                const chosenId = e.target.value
                                                                if (chosenId && !selectedBundleProductIds.includes(chosenId)) {
                                                                    setSelectedBundleProductIds((prev) => [...prev, chosenId])
                                                                }
                                                            }}
                                                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-xs text-text-primary appearance-none focus:outline-none focus:border-primary cursor-pointer font-medium"
                                                        >
                                                            <option value="" disabled>-- Select a product to add to combo --</option>
                                                            {products
                                                                .filter((p) => p.id !== editingProductId && !selectedBundleProductIds.includes(p.id))
                                                                .map((p) => (
                                                                    <option key={p.id} value={p.id}>
                                                                        {p.title} (৳{(p.price_cents / 100).toFixed(0)})
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        <ChevronDown className="h-4 w-4 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                    </div>

                                                    {/* List of Selected Product Badges / Cards */}
                                                    {selectedBundleProductIds.length > 0 ? (
                                                        <div className="space-y-2 pt-1">
                                                            <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
                                                                Included Products:
                                                            </label>
                                                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                                                {selectedBundleProductIds.map((id) => {
                                                                    const prod = products.find((p) => p.id === id)
                                                                    if (!prod) return null
                                                                    return (
                                                                        <div
                                                                            key={id}
                                                                            className="flex items-center justify-between p-3 bg-background border border-border rounded-xl text-xs text-text-primary shadow-2xs"
                                                                        >
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                                                                                    <Package className="h-4 w-4" />
                                                                                </div>
                                                                                <div>
                                                                                    <h5 className="font-semibold text-text-primary text-xs">{prod.title}</h5>
                                                                                    <span className="text-[10px] text-text-muted">{prod.category || 'Digital'}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center space-x-3">
                                                                                <span className="font-bold text-primary text-xs">
                                                                                    ৳ {(prod.price_cents / 100).toFixed(0)}
                                                                                </span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setSelectedBundleProductIds((prev) => prev.filter((pId) => pId !== id))}
                                                                                    className="cursor-pointer text-text-muted hover:text-error p-1 hover:bg-error/10 rounded-lg transition-colors"
                                                                                    title="Remove product from bundle"
                                                                                >
                                                                                    <X className="h-4 w-4" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-text-muted italic">
                                                            No products added yet. Select products from the dropdown above to create a bundle.
                                                        </p>
                                                    )}

                                                    {selectedBundleTotalBdt > 0 && (
                                                        <div className="pt-2 flex items-center justify-between text-xs text-text-muted border-t border-border">
                                                            <span>Combined Value:</span>
                                                            <span className="font-bold text-text-primary line-through">৳ {selectedBundleTotalBdt.toFixed(0)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : selectedType === 'digital' ? (
                                                /* Delivery Mode Choice Cards (Only shown for standard Digital Products) */
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-semibold text-text-secondary">Delivery Method</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeliveryMode('instant')}
                                                            className={`cursor-pointer text-left p-4 rounded-2xl border transition-all ${
                                                                deliveryMode === 'instant'
                                                                    ? 'border-primary bg-primary/10 text-text-primary font-semibold'
                                                                    : 'border-border bg-surface text-text-muted hover:border-border'
                                                            }`}
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`h-2.5 w-2.5 rounded-full ${deliveryMode === 'instant' ? 'bg-primary' : 'bg-text-muted'}`} />
                                                                <h4 className="font-bold text-xs text-text-primary">Instant Delivery</h4>
                                                            </div>
                                                            <p className="text-[11px] text-text-muted mt-1">Automatic download or Drive link.</p>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => setDeliveryMode('order')}
                                                            className={`cursor-pointer text-left p-4 rounded-2xl border transition-all ${
                                                                deliveryMode === 'order'
                                                                    ? 'border-primary bg-primary/10 text-text-primary font-semibold'
                                                                    : 'border-border bg-surface text-text-muted hover:border-border'
                                                            }`}
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`h-2.5 w-2.5 rounded-full ${deliveryMode === 'order' ? 'bg-primary' : 'bg-text-muted'}`} />
                                                                <h4 className="font-bold text-xs text-text-primary">Order Based</h4>
                                                            </div>
                                                            <p className="text-[11px] text-text-muted mt-1">Manual delivery after review.</p>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {/* Product Name */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-text-secondary">Listing Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder={selectedType === 'call' ? "e.g. 1-on-1 Strategy Call" : selectedType === 'bundle' ? "e.g. Creator Ultimate Master Bundle" : "What are you offering? (e.g. Preset Bundle 2026)"}
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                                                />
                                            </div>

                                            {/* Category */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-text-secondary">Category <span className="text-error">*</span></label>
                                                <div className="relative">
                                                    <select
                                                        value={category}
                                                        onChange={(e) => setCategory(e.target.value)}
                                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-text-primary appearance-none focus:outline-none focus:border-primary cursor-pointer"
                                                    >
                                                        {CATEGORY_OPTIONS.map((cat) => (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="h-4 w-4 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: Pricing & Discount Options */}
                                    {currentStep === 2 && (
                                        <div className="space-y-5 animate-in fade-in duration-200">
                                            {/* Base Price */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-text-secondary">
                                                    {selectedType === 'bundle' ? 'Combo Price (BDT)' : 'Base Price (BDT)'}
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-base">৳</span>
                                                    <input
                                                        type="number"
                                                        required={!isFreeForEveryone}
                                                        disabled={isFreeForEveryone}
                                                        min="0"
                                                        value={isFreeForEveryone ? '0' : priceBdt}
                                                        onChange={(e) => setPriceBdt(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-3 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary disabled:opacity-50 font-medium"
                                                    />
                                                </div>
                                                <p className="text-[11px] text-text-muted">
                                                    {selectedType === 'bundle' && selectedBundleTotalBdt > 0
                                                        ? `Suggested combo discount vs original ৳${selectedBundleTotalBdt.toFixed(0)} total.`
                                                        : 'Minimum price is ৳20 — or make it free below.'}
                                                </p>
                                            </div>

                                            {/* Toggle Options (Free & Discounted) */}
                                            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
                                                {/* Free Switch */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                                            <Gift className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-xs font-bold text-text-primary">Make it free for everyone</h5>
                                                            <p className="text-[11px] text-text-muted">Buyers get it for ৳0 at checkout.</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={isFreeForEveryone}
                                                            onChange={(e) => {
                                                                setIsFreeForEveryone(e.target.checked)
                                                                if (e.target.checked) setIsDiscounted(false)
                                                            }}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </label>
                                                </div>

                                                <div className="border-t border-border" />

                                                {/* Discounted Price Switch */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                                            <Tag className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-xs font-bold text-text-primary">Discounted price</h5>
                                                            <p className="text-[11px] text-text-muted">Cross out the original price and charge less.</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            disabled={isFreeForEveryone}
                                                            checked={isDiscounted}
                                                            onChange={(e) => setIsDiscounted(e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary disabled:opacity-40"></div>
                                                    </label>
                                                </div>

                                                {/* Discount Expanded Options */}
                                                {isDiscounted && !isFreeForEveryone && (
                                                    <div className="pt-3 space-y-4 border-t border-border animate-in fade-in duration-200">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <label className="block text-xs font-semibold text-text-secondary">Discounted price (BDT)</label>
                                                                {parseFloat(priceBdt || '0') > 0 && (
                                                                    <span className="text-[10px] font-bold text-text-muted">Must be less than ৳{priceBdt}</span>
                                                                )}
                                                            </div>
                                                            <div className="relative">
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-base">৳</span>
                                                                <input
                                                                    type="number"
                                                                    placeholder="e.g. 350"
                                                                    min="0"
                                                                    max={parseFloat(priceBdt || '0') > 0 ? (parseFloat(priceBdt) - 1).toString() : undefined}
                                                                    value={discountedPriceBdt}
                                                                    onChange={(e) => {
                                                                        setDiscountedPriceBdt(e.target.value)
                                                                        if (error) setError(null)
                                                                    }}
                                                                    className={`w-full pl-9 pr-4 py-3 bg-background border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none font-medium ${
                                                                        parseFloat(discountedPriceBdt || '0') >= parseFloat(priceBdt || '0')
                                                                            ? 'border-error focus:border-error'
                                                                            : 'border-border focus:border-primary'
                                                                    }`}
                                                                />
                                                            </div>
                                                            {parseFloat(discountedPriceBdt || '0') >= parseFloat(priceBdt || '0') && (
                                                                <p className="text-[11px] font-bold text-error mt-1">
                                                                    Discounted price must be smaller than the regular base price (৳{priceBdt}).
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDiscountMode('indefinite')}
                                                                className={`cursor-pointer text-left p-3.5 rounded-xl border transition-all ${
                                                                    discountMode === 'indefinite'
                                                                        ? 'border-primary bg-primary/10 text-text-primary font-semibold'
                                                                        : 'border-border bg-background text-text-muted hover:border-border'
                                                                }`}
                                                            >
                                                                <h5 className="text-xs font-bold text-text-primary">Until I remove it</h5>
                                                                <p className="text-[10px] text-text-muted mt-0.5">Stays until turned off</p>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => setDiscountMode('limited')}
                                                                className={`cursor-pointer text-left p-3.5 rounded-xl border transition-all ${
                                                                    discountMode === 'limited'
                                                                        ? 'border-primary bg-primary/10 text-text-primary font-semibold'
                                                                        : 'border-border bg-background text-text-muted hover:border-border'
                                                                }`}
                                                            >
                                                                <h5 className="text-xs font-bold text-text-primary">Limited-time offer</h5>
                                                                <p className="text-[10px] text-text-muted mt-0.5">Auto-reverts at deadline</p>
                                                            </button>
                                                        </div>

                                                        {discountMode === 'limited' && (
                                                            <div className="space-y-1 pt-1">
                                                                <label className="block text-xs font-semibold text-text-secondary">Offer ends at</label>
                                                                <input
                                                                    type="datetime-local"
                                                                    value={offerEndsAt}
                                                                    onChange={(e) => setOfferEndsAt(e.target.value)}
                                                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary cursor-pointer"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3: Description, Gallery & FAQs */}
                                    {currentStep === 3 && (
                                        <div className="space-y-5 animate-in fade-in duration-200">
                                            {/* Description Editor */}
                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold text-text-secondary">Description</label>
                                                <div className="bg-background border border-border rounded-xl overflow-hidden">
                                                    <div className="flex items-center space-x-1 p-2 bg-surface border-b border-border text-text-muted text-xs">
                                                        <select className="bg-transparent border-none text-xs font-medium text-text-secondary px-2 py-1 focus:outline-none cursor-pointer">
                                                            <option>Normal</option>
                                                            <option>Heading 1</option>
                                                        </select>
                                                        <div className="h-4 w-px bg-border mx-1" />
                                                        <button type="button" className="p-1 hover:text-text-primary rounded cursor-pointer"><Bold className="h-3.5 w-3.5" /></button>
                                                        <button type="button" className="p-1 hover:text-text-primary rounded cursor-pointer"><Italic className="h-3.5 w-3.5" /></button>
                                                        <button type="button" className="p-1 hover:text-text-primary rounded cursor-pointer"><UnderlineIcon className="h-3.5 w-3.5" /></button>
                                                        <button type="button" className="p-1 hover:text-text-primary rounded cursor-pointer"><LinkIcon className="h-3.5 w-3.5" /></button>
                                                    </div>
                                                    <textarea
                                                        rows={4}
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        className="w-full p-4 bg-transparent border-none text-xs text-text-primary focus:outline-none leading-relaxed"
                                                    />
                                                </div>
                                            </div>

                                            {/* Gallery Uploader */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="block text-xs font-semibold text-text-secondary">Gallery ({gallery.length}/5)</label>
                                                    <span className="text-[11px] text-text-muted">First image is cover</span>
                                                </div>

                                                <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                                                    <label className="cursor-pointer shrink-0 w-32 h-24 border-2 border-dashed border-border hover:border-primary bg-background rounded-2xl flex flex-col items-center justify-center text-center p-2 transition-all">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0]
                                                                if (file) handlePickGalleryImage(file)
                                                            }}
                                                        />
                                                        <Plus className="h-5 w-5 text-primary" />
                                                        <span className="text-[9px] font-bold text-text-primary uppercase mt-1">UPLOAD 16:9</span>
                                                    </label>

                                                    {gallery.map((url, idx) => (
                                                        <div key={idx} className="relative shrink-0 w-32 h-24 rounded-2xl border border-border overflow-hidden bg-background">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                                                                className="cursor-pointer absolute top-1.5 right-1.5 p-1 bg-surface/80 hover:bg-error text-text-primary hover:text-white rounded-full transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* FAQ Builder */}
                                            <div className="space-y-3 pt-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="block text-xs font-semibold text-text-secondary">Frequently Asked Questions</label>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddFaq}
                                                        disabled={faqs.length >= 5}
                                                        className="cursor-pointer px-3 py-1 bg-surface border border-border rounded-lg text-xs font-semibold text-text-primary disabled:opacity-40"
                                                    >
                                                        + Add FAQ ({faqs.length}/5)
                                                    </button>
                                                </div>

                                                {faqs.map((faq) => (
                                                    <div key={faq.id} className="relative bg-surface border border-border rounded-xl p-3.5 space-y-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFaq(faq.id)}
                                                            className="cursor-pointer absolute top-2 right-2 p-1 text-text-muted hover:text-error"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                        <input
                                                            type="text"
                                                            placeholder="Question (e.g. Do I get lifetime access?)"
                                                            value={faq.question}
                                                            onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                                                            className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-text-primary focus:outline-none"
                                                        />
                                                        <textarea
                                                            rows={2}
                                                            placeholder="Answer"
                                                            value={faq.answer}
                                                            onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                                                            className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-text-primary focus:outline-none"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 4: Delivery Configuration & Confirmation */}
                                    {currentStep === 4 && (
                                        <div className="space-y-5 animate-in fade-in duration-200">
                                            {/* Delivery Setup */}
                                            {selectedType === 'bundle' ? (
                                                <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
                                                    <div className="flex items-center space-x-2 border-b border-border pb-3">
                                                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                                                            <Package className="h-4 w-4" />
                                                        </div>
                                                        <h4 className="text-xs font-bold tracking-wide uppercase text-text-primary">BUNDLE DELIVERABLES</h4>
                                                    </div>
                                                    <p className="text-xs text-text-muted leading-relaxed">
                                                        Buyers will automatically receive instant download access to all {selectedBundleProductIds.length} bundled products upon purchase.
                                                    </p>
                                                </div>
                                            ) : selectedType === 'call' ? (
                                                <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
                                                    <div className="flex items-center space-x-2 border-b border-border pb-3">
                                                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                                                            <Video className="h-4 w-4" />
                                                        </div>
                                                        <h4 className="text-xs font-bold tracking-wide uppercase text-text-primary">DELIVERY</h4>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="block text-xs font-semibold text-text-secondary">
                                                            Zoom / Meeting Link <span className="text-error">*</span>
                                                        </label>
                                                        <div className="relative">
                                                            <Video className="h-4 w-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                            <input
                                                                type="url"
                                                                required
                                                                placeholder="https://zoom.us/j/..."
                                                                value={meetingLink}
                                                                onChange={(e) => setMeetingLink(e.target.value)}
                                                                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : deliveryMode === 'instant' ? (
                                                <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
                                                    <div className="flex items-center space-x-2 border-b border-border pb-3">
                                                        <FileText className="h-4 w-4 text-primary" />
                                                        <h4 className="text-xs font-bold tracking-wide uppercase text-text-primary">Instant Asset Delivery</h4>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setAssetType('file')}
                                                            className={`cursor-pointer p-3 rounded-xl border text-left transition-all ${
                                                                assetType === 'file'
                                                                    ? 'border-primary bg-primary/10 text-text-primary font-semibold'
                                                                    : 'border-border bg-background text-text-muted'
                                                            }`}
                                                        >
                                                            <div className="text-xs font-bold">Upload File</div>
                                                            <p className="text-[10px] text-text-muted">Host file & auto-download</p>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => setAssetType('gdrive')}
                                                            className={`cursor-pointer p-3 rounded-xl border text-left transition-all ${
                                                                assetType === 'gdrive'
                                                                    ? 'border-primary bg-primary/10 text-text-primary font-semibold'
                                                                    : 'border-border bg-background text-text-muted'
                                                            }`}
                                                        >
                                                            <div className="text-xs font-bold">Google Drive Link</div>
                                                            <p className="text-[10px] text-text-muted">Share via Drive URL</p>
                                                        </button>
                                                    </div>

                                                    {assetType === 'file' ? (
                                                        <div className="border border-dashed border-border rounded-2xl p-5 text-center bg-background space-y-3">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <UploadCloud className="h-6 w-6 text-primary mb-1" />
                                                                <p className="text-xs font-bold text-text-primary">{selectedFileName || 'No file selected'}</p>
                                                                <p className="text-[10px] text-text-muted mt-0.5">PDF, ZIP, Image, Video, or Audio (Max 150MB limit)</p>
                                                            </div>
                                                            {selectedFile && (
                                                                <div className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold rounded-full border border-emerald-500/20">
                                                                    <Check className="h-3 w-3" />
                                                                    <span>{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB file ready to upload</span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary/90 transition-all">
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        onChange={(e) => {
                                                                            const f = e.target.files?.[0]
                                                                            if (f) {
                                                                                const maxSizeBytes = 150 * 1024 * 1024
                                                                                if (f.size > maxSizeBytes) {
                                                                                    setError(`Selected file (${(f.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 150MB maximum upload limit.`)
                                                                                    setSelectedFile(null)
                                                                                    setSelectedFileName(null)
                                                                                    e.target.value = ''
                                                                                    return
                                                                                }
                                                                                setError(null)
                                                                                setSelectedFile(f)
                                                                                setSelectedFileName(f.name)
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span>{selectedFile ? 'Change File' : 'Choose File (Max 150MB)'}</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="url"
                                                            placeholder="https://drive.google.com/file/d/..."
                                                            value={driveUrl}
                                                            onChange={(e) => setDriveUrl(e.target.value)}
                                                            className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none"
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
                                                    <h4 className="text-xs font-bold uppercase text-text-primary">Order Based Delivery Setup</h4>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Delivered via Email / WhatsApp"
                                                        value={deliveryMethod}
                                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                                        className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none"
                                                    />
                                                </div>
                                            )}

                                            {/* Contact Seller Channels (Email & WhatsApp) */}
                                            <div className="bg-surface border border-border rounded-2xl p-4 space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase text-text-primary">Contact Seller Channels</h4>
                                                    <p className="text-[11px] text-text-muted mt-0.5">
                                                        Configure Email, WhatsApp, or both for buyer inquiries on the product page.
                                                    </p>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="block text-xs font-semibold text-text-secondary">Support Email</label>
                                                        <input
                                                            type="email"
                                                            placeholder="support@example.com"
                                                            value={supportEmail}
                                                            onChange={(e) => setSupportEmail(e.target.value)}
                                                            className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="block text-xs font-semibold text-text-secondary">Support WhatsApp</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. +8801700000000 or WhatsApp Link"
                                                            value={supportWhatsapp}
                                                            onChange={(e) => setSupportWhatsapp(e.target.value)}
                                                            className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Confirmation Checkbox */}
                                            <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
                                                <div className="space-y-1">
                                                    <label className="block text-xs font-semibold text-text-secondary">Success Message</label>
                                                    <input
                                                        type="text"
                                                        value={successMessage}
                                                        onChange={(e) => setSuccessMessage(e.target.value)}
                                                        className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none"
                                                    />
                                                </div>

                                                <label className="flex items-start space-x-3 cursor-pointer pt-2">
                                                    <input
                                                        type="checkbox"
                                                        required
                                                        checked={isContentConfirmed}
                                                        onChange={(e) => setIsContentConfirmed(e.target.checked)}
                                                        className="mt-0.5 rounded border-border text-primary focus:ring-primary cursor-pointer h-4 w-4"
                                                    />
                                                    <span className="text-xs text-text-secondary leading-relaxed">
                                                        I created this and confirm it contains no illegal, adult, or copyrighted content.
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Form Step Controls */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        {currentStep > 1 ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as FormStep) : prev))
                                                }}
                                                className="cursor-pointer px-4 py-2 bg-surface hover:bg-background text-text-secondary text-xs font-semibold rounded-xl flex items-center space-x-1.5 border border-border"
                                            >
                                                <ArrowLeft className="h-3.5 w-3.5" />
                                                <span>Back</span>
                                            </button>
                                        ) : (
                                            <div />
                                        )}

                                        {currentStep < 4 ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as FormStep) : prev))
                                                }}
                                                className="cursor-pointer px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs"
                                            >
                                                <span>Next Step</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={saving || !isContentConfirmed}
                                                className="cursor-pointer px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-md disabled:opacity-50 flex items-center space-x-2"
                                            >
                                                {saving ? (
                                                    <span>{editingProductId ? 'Saving...' : 'Publishing...'}</span>
                                                ) : (
                                                    <>
                                                        <Zap className="h-4 w-4" />
                                                        <span>{editingProductId ? 'Save Changes' : 'Publish Listing'}</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Right Column: Live Storefront Card Preview Box */}
                            <div className="lg:col-span-5 bg-surface border-l border-border p-6 sm:p-8 flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                                        <Eye className="h-4 w-4 text-primary" />
                                        <span>Live Storefront Preview</span>
                                    </div>

                                    {/* Live Product Card Mockup */}
                                    <div className="bg-elevated-surface border border-border rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden">
                                        <div className="h-44 w-full rounded-xl bg-background overflow-hidden relative border border-border">
                                            {coverImageUrl || gallery.length > 0 ? (
                                                <img
                                                    src={coverImageUrl || gallery[0]}
                                                    alt="Cover preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-text-muted space-y-1 bg-primary/5">
                                                    <ShoppingBag className="h-8 w-8 text-primary/40" />
                                                    <span className="text-[10px]">No image uploaded</span>
                                                </div>
                                            )}

                                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-surface/90 border border-border text-[10px] font-bold text-text-primary uppercase">
                                                {selectedType === 'bundle' ? 'Combo Bundle' : selectedType === 'call' ? '1-on-1 Session' : deliveryMode === 'instant' ? 'Instant File' : 'Order Based'}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
                                                {category}
                                            </span>
                                            <h3 className="font-bold text-text-primary text-base leading-snug line-clamp-1">
                                                {title || (selectedType === 'bundle' ? 'Ultimate Product Bundle' : selectedType === 'call' ? '1-on-1 Strategy Call' : 'Untitled Listing Name')}
                                            </h3>
                                            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                                                {description || 'No description added yet.'}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-border flex items-center justify-between">
                                            <div>
                                                {isFreeForEveryone ? (
                                                    <span className="text-base font-black text-primary">FREE</span>
                                                ) : isDiscounted && discountedPriceBdt ? (
                                                    <div className="flex items-baseline space-x-2">
                                                        <span className="text-base font-black text-primary">৳ {discountedPriceBdt}</span>
                                                        <span className="text-xs text-text-muted line-through">৳ {priceBdt}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-base font-black text-text-primary">৳ {priceBdt}</span>
                                                )}
                                            </div>
                                            <div className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold shadow-xs">
                                                {selectedType === 'bundle' ? 'Get Bundle' : selectedType === 'call' ? 'Book Call' : 'Get Access'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs text-text-muted space-y-1">
                                    <div className="font-semibold text-primary flex items-center space-x-1.5">
                                        <Check className="h-3.5 w-3.5" />
                                        <span>Ready to monetize</span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed">Your shop listing will instantly feature on your public storefront upon publishing.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!itemToDelete}
                title="Delete Product?"
                message="Are you sure you want to delete this product? Buyers will no longer be able to purchase it."
                confirmText="Delete Product"
                cancelText="Cancel"
                variant="danger"
                isLoading={deleting}
                onConfirm={confirmDeleteProduct}
                onClose={() => setItemToDelete(null)}
            />
        </div>
    )
}
