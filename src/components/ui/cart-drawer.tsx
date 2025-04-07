'use client';

import { useCart } from "@/contexts/cart-context";
import { Button } from "./button";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import { isValidImageUrl } from "@/lib/utils";
import { useEffect } from "react";

export function CartDrawer() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    itemCount,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  // Close cart when pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [setIsCartOpen]);

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Calculate shipping cost (free over ₦50,000)
  const shippingCost = subtotal > 50000 ? 0 : 2500;
  
  // Calculate total
  const total = subtotal + shippingCost;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="font-medium">Shopping Cart ({itemCount})</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Cart content */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-neutral-500 mb-6">Looks like you haven&apos;t added any items to your cart yet.</p>
              <Button onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="px-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 py-4 border-b">
                  {/* Product image */}
                  <div className="relative h-20 w-20 flex-shrink-0 bg-neutral-100">
                    <Link 
                      href={`/product/${item.slug}`}
                      onClick={() => setIsCartOpen(false)}
                    >
                      <Image 
                        src={isValidImageUrl(item.image) 
                          ? item.image 
                          : getPlaceholderImage("product", item.id, 80, 80)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/product/${item.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="font-medium hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="text-sm text-neutral-500 mt-1">
                      Size: {item.size.toUpperCase()}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <button 
                          className="p-1 hover:bg-neutral-100"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button 
                          className="p-1 hover:bg-neutral-100"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-medium">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove button */}
                  <button 
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer with totals and checkout button */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Order summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 
                    ? "Free" 
                    : `₦${shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">₦{total.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Checkout and clear cart buttons */}
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                  Proceed to Checkout
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
