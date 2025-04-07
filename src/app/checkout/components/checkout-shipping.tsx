'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCheckout } from "@/contexts/checkout-context";
import { useState } from "react";

// Nigerian states
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

export function CheckoutShipping() {
  const { shippingAddress, setShippingAddress, setCurrentStep } = useCheckout();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleStateChange = (value: string) => {
    setShippingAddress({ ...shippingAddress, state: value });
    
    // Clear error when user selects
    if (errors.state) {
      setErrors({ ...errors, state: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Address validation
    if (!shippingAddress.address) {
      newErrors.address = 'Address is required';
    }
    
    // City validation
    if (!shippingAddress.city) {
      newErrors.city = 'City is required';
    }
    
    // State validation
    if (!shippingAddress.state) {
      newErrors.state = 'State is required';
    }
    
    // Zip code validation
    if (!shippingAddress.zipCode) {
      newErrors.zipCode = 'Postal code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    setCurrentStep('information');
  };

  const handleContinue = () => {
    if (validateForm()) {
      setCurrentStep('payment');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-4">Shipping Address</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={shippingAddress.address}
              onChange={handleChange}
              placeholder="Street address"
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
            <Input
              id="apartment"
              name="apartment"
              value={shippingAddress.apartment || ''}
              onChange={handleChange}
              placeholder="Apartment, suite, unit, etc."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                placeholder="City"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="state">State</Label>
              <Select 
                value={shippingAddress.state} 
                onValueChange={handleStateChange}
              >
                <SelectTrigger id="state" className={errors.state ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">Postal code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleChange}
                placeholder="Postal code"
                className={errors.zipCode ? 'border-red-500' : ''}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={shippingAddress.country}
                disabled
                className="bg-neutral-50"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back to Information
        </Button>
        <Button onClick={handleContinue}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
