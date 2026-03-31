import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo + description + contact */}
          <div>
            <h3 className="text-white font-bold text-xl mb-3">ShopNext</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your trusted online grocery store for fresh and natural products delivered to your door.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-gray-200 mb-2">Contact Us</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+1 (800) 555-0100</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>support@shopnext.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: My Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">My Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:text-white transition-colors">Profile</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Orders</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link href="/checkout" className="hover:text-white transition-colors">Checkout</Link></li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h3 className="text-white font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/delivery-info" className="hover:text-white transition-colors">Delivery Info</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get the latest deals and offers.
            </p>
            <form action="/newsletter" method="POST" className="flex flex-col gap-2">
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="px-3 py-2 rounded-md text-sm bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ShopNext. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
