import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PublicStorefrontClient from './PublicStorefrontClient'

async function getStorefrontData(slug: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    try {
        const [creatorRes, productsRes] = await Promise.all([
            fetch(`${baseUrl}/api/v1/creators/${slug}`, { next: { revalidate: 10 } }),
            fetch(`${baseUrl}/api/v1/creators/${slug}/products`, { next: { revalidate: 10 } }),
        ])

        if (!creatorRes.ok) return null

        const creatorData = await creatorRes.json()
        const productsData = productsRes.ok ? await productsRes.json() : { products: [] }

        return {
            profile: creatorData.profile,
            products: productsData.products || [],
        }
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const data = await getStorefrontData(slug)

    if (!data?.profile) {
        return { title: 'Storefront Not Found - TipsKite' }
    }

    return {
        title: `Official Store — ${data.profile.display_name} (@${slug})`,
        description: `Explore exclusive digital products, premium assets, and 1-on-1 services by ${data.profile.display_name} on TipsKite.`,
    }
}

export default async function PublicStorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const data = await getStorefrontData(slug)

    if (!data?.profile) {
        notFound()
    }

    return <PublicStorefrontClient slug={slug} creator={data.profile} products={data.products} />
}
