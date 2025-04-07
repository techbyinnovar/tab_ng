'use client';

import { useCart } from "@/contexts/cart-context";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import { isValidImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function CheckoutSummary() {
  const { items, subtotal } = useCart();
  
  // Calculate shipping cost (free over ₦50,000)
  const shippingCost = subtotal > 50000 ? 0 : 2500;
  
  // Calculate total
  const total = subtotal + shippingCost;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-neutral-200">
        <h3 className="font-medium">Order Summary</h3>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="p-4 flex gap-3 border-b border-neutral-200">
            <div className="relative h-16 w-16 flex-shrink-0 bg-neutral-100">
              <Image 
                src={isValidImageUrl(item.image) 
                  ? item.image 
                  : getPlaceholderImage("product", item.id, 64, 64)}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute -top-2 -right-2 bg-neutral-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <Link 
                href={`/product/${item.slug}`}
                className="font-medium hover:text-primary transition-colors line-clamp-1"
              >
                {item.name}
              </Link>
              <p className="text-sm text-neutral-500">Size: {item.size.toUpperCase()}</p>
            </div>
            
            <div className="text-right">
              <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 space-y-2 border-t border-neutral-200 bg-neutral-50">
        <div className="flex justify-between">
          <span className="text-neutral-600">Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">Shipping</span>
          <span>
            {shippingCost === 0 
              ? 'Free' 
              : `₦${shippingCost.toLocaleString()}`}
          </span>
        </div>
        {shippingCost > 0 && (
          <div className="text-xs text-neutral-500">
            Free shipping on orders over ₦50,000
          </div>
        )}
        <div className="flex justify-between font-medium text-lg pt-2 border-t border-neutral-200 mt-2">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
