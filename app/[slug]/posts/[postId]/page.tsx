import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, Lock, User, Eye, Heart, Calendar } from 'lucide-react'

async function getPostData(slug: string, postId: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    try {
        const res = await fetch(`${backendUrl}/api/v1/creators/${slug}/posts/${postId}`, {
            cache: 'no-store',
        })
        if (!res.ok) return null
        return await res.json()
    } catch (e) {
        return null
    }
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string; postId: string }>
}): Promise<Metadata> {
    const { slug, postId } = await params
    const data = await getPostData(slug, postId)

    if (!data?.post) {
        return { title: 'Post Not Found - TipsKite' }
    }

    const { post } = data
    return {
        title: `${post.title || 'Exclusive Post'} by ${post.creator?.display_name || slug} - TipsKite`,
        description: post.excerpt || post.body?.substring(0, 150) || 'Read this post on TipsKite.',
    }
}

export default async function PublicPostDetailPage({
    params
}: {
    params: Promise<{ slug: string; postId: string }>
}) {
    const { slug, postId } = await params
    const data = await getPostData(slug, postId)

    if (!data?.post) {
        notFound()
    }

    const { post } = data
    const creator = post.creator || { display_name: slug, slug }
    const dateStr = post.published_at
        ? new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
          })
        : 'Jul 30, 2026'

    return (
        <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Back to Creator Page Link */}
                <Link
                    href={`/${slug}`}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-text-muted hover:text-text-primary transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to {creator.display_name}'s page</span>
                </Link>

                {/* Main Post Container */}
                <div className="bg-surface border border-border rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
                    {/* Creator Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-border">
                        <Link href={`/${slug}`} className="flex items-center space-x-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary-100 border border-primary-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                {creator.avatar_url ? (
                                    <img src={creator.avatar_url} alt={creator.display_name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-6 h-6 text-primary-600" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-text-primary group-hover:text-primary-600 transition-all text-base">
                                    {creator.display_name}
                                </h3>
                                <p className="text-xs text-text-muted font-medium">@{creator.slug}</p>
                            </div>
                        </Link>

                        {/* Visibility Tag */}
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-success-50 text-success-700 border border-success-200 font-extrabold rounded-md text-[10px] uppercase">
                            <Globe className="w-3 h-3" />
                            <span>{post.visibility}</span>
                        </span>
                    </div>

                    {/* Post Meta */}
                    <div className="flex items-center space-x-3 text-xs text-text-muted">
                        <span className="flex items-center space-x-1 font-semibold">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{dateStr}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1 font-semibold">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{post.like_count || 0} supporters liked</span>
                        </span>
                    </div>

                    {/* Post Title */}
                    {post.title && (
                        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight leading-snug">
                            {post.title}
                        </h1>
                    )}

                    {/* Attached Cover Image */}
                    {post.cover_image_url && (
                        <div className="rounded-2xl overflow-hidden border border-border my-4 max-h-[450px]">
                            <img src={post.cover_image_url} alt={post.title || 'Post image'} className="w-full h-full object-cover max-h-[450px]" />
                        </div>
                    )}

                    {/* Content / Locked State */}
                    {post.is_locked ? (
                        <div className="bg-background border border-border rounded-2xl p-8 text-center space-y-4 my-6">
                            <div className="w-12 h-12 rounded-full bg-accent/15 text-accent mx-auto flex items-center justify-center">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-text-primary">This post is locked</h4>
                            <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                                Support {creator.display_name} to unlock this exclusive post and get access to all supporter content.
                            </p>
                            <Link
                                href={`/${slug}`}
                                className="inline-flex items-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-full shadow-xs transition-all"
                            >
                                Support {creator.display_name}
                            </Link>
                        </div>
                    ) : (
                        <div className="text-sm md:text-base text-text-secondary leading-relaxed whitespace-pre-wrap pt-2">
                            {post.body}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
