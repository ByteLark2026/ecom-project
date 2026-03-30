import { PackageSearch } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'Try adjusting your filters or check back later.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageSearch className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1 max-w-xs">{description}</p>
    </div>
  )
}
