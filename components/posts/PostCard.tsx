'use client'

import { Lock, Heart, MessageSquare, Globe, Users, Shield } from 'lucide-react'

interface PostCardProps {
    post: {
        id: string
        slug: string
        title: string
        body: string | null
        excerpt: string | null
        cover_image_url: string | null
        visibility: string
        is_locked: boolean
        published_at: string
    }
    creatorName: string
}

export default function PostCard({ post, creatorName }: PostCardProps) {
    const getVisibilityBadge = () => {
        switch (post.visibility) {
            case 'supporters':
                return (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning-50 text-warning-700">
                        <Users className="h-3 w-3" />
                        <span>Supporters Only</span>
                    </span>
                )
            case 'members':
            case 'tier':
                return (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700">
                        <Shield className="h-3 w-3" />
                        <span>Members Only</span>
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-50 text-success-700">
                        <Globe className="h-3 w-3" />
                        <span>Public</span>
                    </span>
                )
        }
    }

    return (
        <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden space-y-4">
            {post.cover_image_url && (
                <div className="h-44 w-full bg-background overflow-hidden">
                    <img src={post.cover_image_url} alt="" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    {getVisibilityBadge()}
                    <span className="text-xs text-text-muted">
                        {new Date(post.published_at).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-text-primary leading-snug">{post.title}</h3>

                {post.is_locked ? (
                    <div className="bg-background border border-dashed border-border rounded-2xl p-6 text-center space-y-3 relative overflow-hidden">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-full w-fit mx-auto">
                            <Lock className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-text-primary text-sm">Exclusive Content</h4>
                            <p className="text-xs text-text-muted mt-1">
                                {post.excerpt || `Join ${creatorName}'s membership to unlock full post.`}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                        {post.body || post.excerpt}
                    </div>
                )}
            </div>
        </div>
    )
}
