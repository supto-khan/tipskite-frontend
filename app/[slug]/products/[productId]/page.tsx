import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PublicProductDetailClient from './PublicProductDetailClient'

async function getProductDetail(slug: string, productId: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    try {
        const res = await fetch(`${baseUrl}/api/v1/creators/${slug}/products/${productId}`, {
            next: { revalidate: 10 },
        })

        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; productId: string }>
}): Promise<Metadata> {
    const { slug, productId } = await params
    const data = await getProductDetail(slug, productId)

    if (!data?.product) {
        return { title: 'Product Not Found - TipsKite' }
    }

    const { product, creator } = data
    const creatorName = creator?.display_name || slug

    return {
        title: `${product.title} by ${creatorName} — TipsKite`,
        description: product.description?.substring(0, 160) || `Buy ${product.title} by ${creatorName} on TipsKite.`,
    }
}

export default async function PublicProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string; productId: string }>
}) {
    const { slug, productId } = await params
    const data = await getProductDetail(slug, productId)

    if (!data?.product) {
        notFound()
    }

    return (
        <PublicProductDetailClient
            slug={slug}
            product={data.product}
            creator={data.creator}
            reviews={data.reviews || []}
            reviewStats={data.review_stats || { average_rating: 5, total_reviews: 0, star_counts: {} }}
        />
    )
}
