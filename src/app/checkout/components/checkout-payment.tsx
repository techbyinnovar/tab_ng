'use client';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/cart-context";
import { useCheckout } from "@/contexts/checkout-context";
import { CreditCard, Truck } from "lucide-react";
import Image from "next/image";

export function CheckoutPayment() {
  const { 
    paymentMethod, 
    setPaymentMethod, 
    setCurrentStep, 
    completeOrder, 
    processPaystackPayment,
    isProcessing 
  } = useCheckout();
  const { subtotal } = useCart();

  // Calculate shipping cost (free over ₦50,000)
  const shippingCost = subtotal > 50000 ? 0 : 2500;
  
  // Calculate total
  const total = subtotal + shippingCost;

  const handlePaymentMethodChange = (value: 'paystack' | 'cash-on-delivery') => {
    setPaymentMethod({ ...paymentMethod, type: value });
  };

  const handleBack = () => {
    setCurrentStep('shipping');
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod.type === 'paystack') {
      // Process Paystack payment
      await processPaystackPayment();
    } else {
      // Process cash on delivery order
      await completeOrder();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-4">Payment Method</h2>
        
        <div className="space-y-4">
          <div 
            className={`border rounded-lg p-4 cursor-pointer ${paymentMethod.type === 'paystack' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
            onClick={() => handlePaymentMethodChange('paystack')}
          >
            <div className="flex items-start">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 mt-1 ${paymentMethod.type === 'paystack' ? 'border-primary' : 'border-neutral-300'}`}>
                {paymentMethod.type === 'paystack' && (
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="paystack" className="flex items-center text-base font-medium cursor-pointer">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay with Card (Paystack)
                </Label>
                <p className="text-neutral-500 text-sm mt-1">
                  Pay securely using your credit or debit card via Paystack.
                </p>
                
                {paymentMethod.type === 'paystack' && (
                  <div className="mt-4 p-4 bg-white border border-neutral-200 rounded-md">
                    <div className="text-center text-sm text-neutral-500">
                      <p>You will be redirected to Paystack to complete your payment after placing your order.</p>
                      <div className="mt-2 flex justify-center space-x-2">
                        <div className="relative h-6 w-24">
                          <Image 
                            src="https://res.cloudinary.com/dkgcvlnxl/image/upload/v1617264117/paystack-logo_xg6yqy.png" 
                            alt="Paystack" 
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-6 w-12">
                          <Image 
                            src="https://res.cloudinary.com/dkgcvlnxl/image/upload/v1617264117/visa-logo_bvdqjb.png" 
                            alt="Visa" 
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-6 w-12">
                          <Image 
                            src="https://res.cloudinary.com/dkgcvlnxl/image/upload/v1617264117/mastercard-logo_yjmyoy.png" 
                            alt="Mastercard" 
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer ${paymentMethod.type === 'cash-on-delivery' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
            onClick={() => handlePaymentMethodChange('cash-on-delivery')}
          >
            <div className="flex items-start">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 mt-1 ${paymentMethod.type === 'cash-on-delivery' ? 'border-primary' : 'border-neutral-300'}`}>
                {paymentMethod.type === 'cash-on-delivery' && (
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="cash-on-delivery" className="flex items-center text-base font-medium cursor-pointer">
                  <Truck className="mr-2 h-5 w-5" />
                  Cash on Delivery
                </Label>
                <p className="text-neutral-500 text-sm mt-1">
                  Pay with cash when your order is delivered.
                </p>
                
                {paymentMethod.type === 'cash-on-delivery' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      Please have the exact amount ready when your order is delivered. Our delivery personnel do not carry change.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-neutral-200 pt-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : `₦${shippingCost.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-2 border-t border-neutral-200 mt-2">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={isProcessing}>
          Back to Shipping
        </Button>
        <Button onClick={handlePlaceOrder} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
}
