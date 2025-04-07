'use client';

import { CheckoutStep, useCheckout } from "@/contexts/checkout-context";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutProgressProps {
  className?: string;
}

export function CheckoutProgress({ className }: CheckoutProgressProps) {
  const { currentStep } = useCheckout();
  
  const steps: { id: CheckoutStep; label: string }[] = [
    { id: 'information', label: 'Information' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmation', label: 'Confirmation' },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const isStepComplete = (stepId: CheckoutStep) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = steps.findIndex(step => step.id === stepId);
    return stepIndex < currentIndex;
  };

  const isStepCurrent = (stepId: CheckoutStep) => {
    return currentStep === stepId;
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isComplete = isStepComplete(step.id);
          const isCurrent = isStepCurrent(step.id);
          
          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  isComplete ? "bg-primary border-primary text-white" : 
                  isCurrent ? "border-primary text-primary" : 
                  "border-neutral-300 text-neutral-400"
                )}
              >
                {isComplete ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-1",
                  isComplete || isCurrent ? "text-primary font-medium" : "text-neutral-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
        
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 -translate-y-1/2 bg-neutral-200">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ 
              width: `${
                currentStep === 'information' ? '0%' :
                currentStep === 'shipping' ? '33.33%' :
                currentStep === 'payment' ? '66.66%' :
                '100%'
              }` 
            }}
          />
        </div>
      </div>
    </div>
  );
}
