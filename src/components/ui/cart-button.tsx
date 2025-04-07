'use client';

import { useCart } from "@/contexts/cart-context";
import { ShoppingBag } from "lucide-react";
import { Button } from "./button";

export function CartButton() {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setIsCartOpen(true)}
      className="relative"
      aria-label="Open shopping cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
}
