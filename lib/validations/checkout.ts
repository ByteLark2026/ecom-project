import { z } from 'zod'

export const checkoutSchema = z.object({
  shipping_name: z.string().min(2, 'Full name is required'),
  shipping_email: z.string().email('Valid email is required'),
  shipping_phone: z.string().optional(),
  shipping_address: z.string().min(5, 'Address is required'),
  shipping_city: z.string().min(2, 'City is required'),
  shipping_state: z.string().min(2, 'State is required'),
  shipping_zip: z.string().min(3, 'ZIP code is required'),
  shipping_country: z.string().default('US'),
  notes: z.string().optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
