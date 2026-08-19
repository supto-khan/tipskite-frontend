'use client'

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageSliderProps {
    images: string[]
    alt?: string
    aspectRatio?: string
    className?: string
    imageClassName?: string
    showDots?: boolean
    showArrows?: boolean
    autoplay?: boolean
    autoplayDelay?: number
}

export default function ImageSlider({
    images = [],
    alt = 'Product image',
    aspectRatio = 'aspect-video',
    className = '',
    imageClassName = 'w-full h-full object-cover',
    showDots = true,
    showArrows = true,
    autoplay = false,
    autoplayDelay = 4000,
}: ImageSliderProps) {
    const validImages = Array.isArray(images) ? images.filter(Boolean) : []

    const plugins = autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })] : []
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

    const scrollPrev = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const scrollTo = useCallback((index: number, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (emblaApi) emblaApi.scrollTo(index)
    }, [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        setScrollSnaps(emblaApi.scrollSnapList())
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    if (validImages.length === 0) {
        return null
    }

    if (validImages.length === 1) {
        return (
            <div className={`relative w-full overflow-hidden ${className}`}>
                <img
                    src={validImages[0]}
                    alt={alt}
                    className={imageClassName}
                />
            </div>
        )
    }

    return (
        <div className={`relative group w-full overflow-hidden ${className}`}>
            <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                <div className="flex w-full h-full">
                    {validImages.map((src, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 relative w-full h-full">
                            <img
                                src={src}
                                alt={`${alt} - ${index + 1}`}
                                className={imageClassName}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {showArrows && (
                <>
                    <button
                        type="button"
                        onClick={scrollPrev}
                        aria-label="Previous image"
                        className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs z-10 shadow-md"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={scrollNext}
                        aria-label="Next image"
                        className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs z-10 shadow-md"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {showDots && scrollSnaps.length > 1 && (
                <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={(e) => scrollTo(index, e)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`cursor-pointer transition-all rounded-full ${
                                index === selectedIndex
                                    ? 'w-5 h-1.5 bg-primary shadow-xs'
                                    : 'w-1.5 h-1.5 bg-white/70 hover:bg-white'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
