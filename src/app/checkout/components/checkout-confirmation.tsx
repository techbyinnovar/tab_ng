'use client';

import { Button } from "@/components/ui/button";
import { useCheckout } from "@/contexts/checkout-context";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import { isValidImageUrl } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CheckoutConfirmation() {
  const { orderSummary, customerInfo, shippingAddress, paymentMethod } = useCheckout();

  if (!orderSummary) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
        <p className="text-neutral-600 mb-2">
          Your order has been received and is being processed.
        </p>
        <p className="text-neutral-500 text-sm">
          Order #{orderSummary.orderNumber}
        </p>
      </div>
      
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <div className="bg-neutral-50 p-4 border-b border-neutral-200">
          <h3 className="font-medium">Order Summary</h3>
        </div>
        
        <div className="divide-y divide-neutral-200">
          {orderSummary.items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="p-4 flex items-center gap-4">
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
                <p className="font-medium line-clamp-1">{item.name}</p>
                <p className="text-sm text-neutral-500">Size: {item.size.toUpperCase()}</p>
              </div>
              
              <div className="text-right">
                <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                <p className="text-sm text-neutral-500">₦{item.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 space-y-2 border-t border-neutral-200 bg-neutral-50">
          <div className="flex justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span>₦{orderSummary.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Shipping</span>
            <span>
              {orderSummary.shipping === 0 
                ? 'Free' 
                : `₦${orderSummary.shipping.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-2 border-t border-neutral-200 mt-2">
            <span>Total</span>
            <span>₦{orderSummary.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="bg-neutral-50 p-4 border-b border-neutral-200">
            <h3 className="font-medium">Customer Information</h3>
          </div>
          <div className="p-4">
            <p className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</p>
            <p className="text-neutral-600">{customerInfo.email}</p>
            <p className="text-neutral-600">{customerInfo.phone}</p>
          </div>
        </div>
        
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="bg-neutral-50 p-4 border-b border-neutral-200">
            <h3 className="font-medium">Shipping Address</h3>
          </div>
          <div className="p-4">
            <p className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</p>
            <p className="text-neutral-600">{shippingAddress.address}</p>
            {shippingAddress.apartment && (
              <p className="text-neutral-600">{shippingAddress.apartment}</p>
            )}
            <p className="text-neutral-600">
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </p>
            <p className="text-neutral-600">{shippingAddress.country}</p>
          </div>
        </div>
      </div>
      
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <div className="bg-neutral-50 p-4 border-b border-neutral-200">
          <h3 className="font-medium">Payment Method</h3>
        </div>
        <div className="p-4">
          {paymentMethod.type === 'paystack' ? (
            <p className="text-neutral-600">Paid via Paystack (Card Payment)</p>
          ) : (
            <p className="text-neutral-600">Cash on Delivery</p>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-neutral-600 mb-6">
          A confirmation email has been sent to {customerInfo.email}
        </p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
