'use client';

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import { isValidImageUrl } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    subtotal,
    itemCount,
    setIsCartOpen
  } = useCart();

  // Close the cart drawer when viewing the cart page
  useEffect(() => {
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  // Calculate shipping cost (free over ₦50,000)
  const shippingCost = subtotal > 50000 ? 0 : 2500;
  
  // Calculate total
  const total = subtotal + shippingCost;

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-neutral-500 mb-6">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-neutral-200 flex justify-between">
              <h2 className="font-medium">Cart Items</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
            
            <div className="divide-y divide-neutral-200">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="p-6 flex flex-col sm:flex-row gap-4">
                  {/* Product image */}
                  <div className="relative h-32 w-32 flex-shrink-0 bg-neutral-100 self-center sm:self-start">
                    <Link href={`/product/${item.slug}`}>
                      <Image 
                        src={isValidImageUrl(item.image) 
                          ? item.image 
                          : getPlaceholderImage("product", item.id, 128, 128)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <Link 
                        href={`/product/${item.slug}`}
                        className="font-medium text-lg hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="text-sm text-neutral-500 mt-1">
                        Size: {item.size.toUpperCase()}
                      </div>
                      <div className="text-sm font-medium mt-1">
                        ₦{item.price.toLocaleString()} each
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2 px-0"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-medium text-lg">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                      
                      <div className="flex items-center border rounded">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden sticky top-20">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="font-medium">Order Summary</h2>
            </div>
            
            <div className="p-6 space-y-4">
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
              
              {shippingCost > 0 && (
                <div className="text-sm text-neutral-500">
                  Free shipping on orders over ₦50,000
                </div>
              )}
              
              <div className="border-t border-neutral-200 pt-4 mt-4 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">₦{total.toLocaleString()}</span>
              </div>
              
              <Button className="w-full mt-6" size="lg" asChild>
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
              
              <div className="text-xs text-center text-neutral-500 mt-4">
                Secure checkout powered by Paystack
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
