import React from 'react'

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-border/40 dark:bg-border/60 rounded-2xl ${className}`}
        />
    )
}

export function CardSkeleton() {
    return (
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-1/3 rounded-xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
            <div className="pt-4 flex items-center justify-between border-t border-border/50">
                <Skeleton className="h-8 w-24 rounded-xl" />
                <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
        </div>
    )
}

export function GridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    )
}

export function TableRowSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-3 w-full">
                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                        <div className="space-y-2 w-full max-w-md">
                            <Skeleton className="h-4 w-3/4 rounded-md" />
                            <Skeleton className="h-3 w-1/2 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full shrink-0" />
                </div>
            ))}
        </div>
    )
}
