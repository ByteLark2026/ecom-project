'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { Product, Category } from '@/types'

type State = { error?: string } | null
type Action = (state: State, formData: FormData) => Promise<State>

interface ProductFormProps {
  product?: Product | null
  categories: Category[]
  action: (formData: FormData) => Promise<State | void>
}

export function ProductForm({ product, categories, action }: ProductFormProps) {
  const wrappedAction: Action = async (_state, formData) => {
    const result = await action(formData)
    return (result as State) ?? null
  }

  const [state, formAction, pending] = useActionState<State, FormData>(wrappedAction, null)

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{state.error}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Product name *</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compare_price">Compare price</Label>
          <Input id="compare_price" name="compare_price" type="number" step="0.01" min="0" defaultValue={product?.compare_price ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={product?.sku ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock_qty">Stock quantity</Label>
          <Input id="stock_qty" name="stock_qty" type="number" min="0" defaultValue={product?.stock_qty ?? 0} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_id">Category</Label>
          <Select name="category_id" defaultValue={product?.category_id ?? ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={product?.description ?? ''} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image URLs (one per line)</Label>
        <Textarea
          id="images"
          name="images"
          rows={3}
          placeholder="https://example.com/image.jpg"
          defaultValue={product?.images?.join('\n') ?? ''}
        />
        <p className="text-xs text-muted-foreground">Enter each image URL on a new line.</p>
      </div>

      <Separator />

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_published" name="is_published" value="true" defaultChecked={product?.is_published} className="h-4 w-4" />
          <Label htmlFor="is_published">Published</Label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_featured" name="is_featured" value="true" defaultChecked={product?.is_featured} className="h-4 w-4" />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : product ? 'Update product' : 'Create product'}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
