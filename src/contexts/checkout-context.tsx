'use client';

import { CartItem, useCart } from '@/contexts/cart-context';
import { convertToKobo, generatePaystackReference, initializePaystack, PaystackTransaction } from '@/lib/paystack';
import { PAYSTACK_PUBLIC_KEY } from '@/lib/paystack-config';
import React, { createContext, useContext, useState } from 'react';

export type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmation';

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ShippingAddress {
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'paystack' | 'cash-on-delivery';
  paystackReference?: string;
  paystackTransaction?: PaystackTransaction;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

interface CheckoutContextType {
  currentStep: CheckoutStep;
  setCurrentStep: (step: CheckoutStep) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  shippingAddress: ShippingAddress;
  setShippingAddress: (address: ShippingAddress) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  orderSummary: OrderSummary | null;
  setOrderSummary: (summary: OrderSummary) => void;
  completeOrder: () => Promise<void>;
  processPaystackPayment: () => Promise<void>;
  isProcessing: boolean;
}

const defaultCustomerInfo: CustomerInfo = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
};

const defaultShippingAddress: ShippingAddress = {
  address: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Nigeria',
};

const defaultPaymentMethod: PaymentMethod = {
  type: 'paystack',
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { items, subtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(defaultCustomerInfo);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(defaultShippingAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(defaultPaymentMethod);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate shipping cost (free over ₦50,000)
  const shippingCost = subtotal > 50000 ? 0 : 2500;
  
  // Calculate total
  const total = subtotal + shippingCost;

  // Generate order number
  const generateOrderNumber = () => {
    const timestamp = new Date().getTime().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TAB-${timestamp}-${random}`;
  };

  // Complete order
  const completeOrder = async () => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would make an API call to create the order
      // For now, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create order summary
      const summary: OrderSummary = {
        items: [...items],
        subtotal,
        shipping: shippingCost,
        total,
        orderNumber: generateOrderNumber(),
        paymentMethod: paymentMethod,
        paymentStatus: 'pending',
      };
      
      setOrderSummary(summary);
      setCurrentStep('confirmation');
      
      // Clear the cart after successful order
      clearCart();
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process Paystack payment
  const processPaystackPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Generate a unique reference for this transaction
      const reference = generatePaystackReference();
      
      // Update payment method with reference
      setPaymentMethod({
        ...paymentMethod,
        paystackReference: reference
      });
      
      // Initialize Paystack payment
      await initializePaystack({
        key: PAYSTACK_PUBLIC_KEY, 
        email: customerInfo.email,
        amount: convertToKobo(total),
        ref: reference,
        currency: 'NGN',
        metadata: {
          custom_fields: [
            {
              display_name: 'Customer Name',
              variable_name: 'customer_name',
              value: `${customerInfo.firstName} ${customerInfo.lastName}`
            },
            {
              display_name: 'Order Items',
              variable_name: 'order_items',
              value: `${items.length} items`
            }
          ]
        },
        onSuccess: (transaction) => {
          console.log('Payment successful:', transaction);
          
          // Update payment method with transaction details
          const updatedPaymentMethod = {
            ...paymentMethod,
            paystackReference: reference,
            paystackTransaction: transaction
          };
          
          setPaymentMethod(updatedPaymentMethod);
          
          // Create order summary
          const summary: OrderSummary = {
            items: [...items],
            subtotal,
            shipping: shippingCost,
            total,
            orderNumber: generateOrderNumber(),
            paymentMethod: updatedPaymentMethod,
            paymentStatus: 'paid'
          };
          
          // Set order summary and move to confirmation step
          setOrderSummary(summary);
          setCurrentStep('confirmation');
          
          // Clear the cart after successful payment
          clearCart();
          
          setIsProcessing(false);
        },
        onClose: () => {
          // Payment window closed without completing
          console.log('Payment window closed');
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error('Error processing Paystack payment:', error);
      setIsProcessing(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        customerInfo,
        setCustomerInfo,
        shippingAddress,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
        orderSummary,
        setOrderSummary,
        completeOrder,
        processPaystackPayment,
        isProcessing,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
