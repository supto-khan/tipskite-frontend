'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import PostCard from './PostCard'

export default function PublicPostsFeed({ slug, creatorName }: { slug: string; creatorName: string }) {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`/api/v1/creators/${slug}/posts`)
            .then((res) => setPosts(res.data.posts || []))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false))
    }, [slug])

    if (loading) {
        return <div className="p-4 text-xs text-text-muted text-center">Loading creator posts...</div>
    }

    if (posts.length === 0) {
        return (
            <div className="p-8 bg-surface rounded-3xl border border-border text-center text-sm text-text-muted">
                {creatorName} hasn't published any posts yet.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} creatorName={creatorName} />
            ))}
        </div>
    )
}
