import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { slugify } from '@/lib/utils/format'
import { Trash2 } from 'lucide-react'
import type { Category } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAdmin = any

async function createCategory(formData: FormData) {
  'use server'
  const admin = createAdminClient() as AnyAdmin
  const name = formData.get('name') as string
  await admin.from('categories').insert({
    name,
    slug: slugify(name),
    description: (formData.get('description') as string) || null,
  })
  revalidatePath('/admin/categories')
}

async function deleteCategory(id: string) {
  'use server'
  const admin = createAdminClient() as AnyAdmin
  await admin.from('categories').delete().eq('id', id)
  revalidatePath('/admin/categories')
}

export default async function AdminCategoriesPage() {
  const admin = createAdminClient() as AnyAdmin
  const { data: rawCats } = await admin.from('categories').select('*').order('name')
  const categories = (rawCats ?? []) as Category[]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Categories</h1>

      <div className="max-w-md">
        <h2 className="font-semibold mb-4">Add Category</h2>
        <form action={createCategory} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" />
          </div>
          <Button type="submit">Add Category</Button>
        </form>
      </div>

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{cat.slug}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{cat.description ?? '—'}</TableCell>
              <TableCell className="text-right">
                <form action={async () => {
                  'use server'
                  await deleteCategory(cat.id)
                }}>
                  <Button variant="ghost" size="icon" type="submit" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
