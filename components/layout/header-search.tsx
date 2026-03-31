'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function HeaderSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/products${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ''}`)
  }
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl">
      <input
        type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Search for products, brands and categories..."
        className="w-full border border-border border-r-0 rounded-l-md px-4 py-2.5 text-sm bg-background focus:outline-none focus:border-primary"
      />
      <button type="submit" className="bg-primary text-primary-foreground px-5 rounded-r-md hover:bg-primary/90 transition-colors flex items-center justify-center flex-shrink-0">
        <Search className="h-4 w-4" />
      </button>
    </form>
  )
}
