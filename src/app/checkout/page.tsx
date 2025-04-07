'use client';

import { useCart } from "@/contexts/cart-context";
import { CheckoutProvider, useCheckout } from "@/contexts/checkout-context";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { CheckoutConfirmation } from "./components/checkout-confirmation";
import { CheckoutInformation } from "./components/checkout-information";
import { CheckoutPayment } from "./components/checkout-payment";
import { CheckoutProgress } from "./components/checkout-progress";
import { CheckoutShipping } from "./components/checkout-shipping";
import { CheckoutSummary } from "./components/checkout-summary";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function CheckoutContent() {
  const { currentStep } = useCheckout();
  const { items, itemCount } = useCart();
  const router = useRouter();

  // Debugging: Log current step changes
  useEffect(() => {
    console.log('Current checkout step:', currentStep);
  }, [currentStep]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0 && currentStep !== 'confirmation') {
      router.push('/cart');
    }
  }, [items.length, currentStep, router]);

  // If cart is empty and not on confirmation step, show loading
  if (items.length === 0 && currentStep !== 'confirmation') {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="font-serif text-2xl font-bold mb-8">
          Tab.ng
        </Link>
        
        {currentStep !== 'confirmation' && (
          <CheckoutProgress className="w-full max-w-2xl" />
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 'information' && <CheckoutInformation />}
          {currentStep === 'shipping' && <CheckoutShipping />}
          {currentStep === 'payment' && <CheckoutPayment />}
          {currentStep === 'confirmation' && <CheckoutConfirmation />}
        </div>
        
        {currentStep !== 'confirmation' && (
          <div className="lg:col-span-1">
            <CheckoutSummary />
            
            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/cart" className="flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Back to Cart ({itemCount})
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
