'use client';

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import { isValidImageUrl } from "@/lib/utils";
import { api } from "@/lib/trpc";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("m");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  // Fetch product by slug from the database
  const { data: product, isLoading } = api.product.getBySlug.useQuery(
    { slug: params.slug },
    {
      // If the product is not found, redirect to products page
      onError: () => {
        router.push('/products');
      }
    }
  );
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Get the main product image or use a placeholder
    const productImage = product.images && product.images[0] && isValidImageUrl(product.images[0])
      ? product.images[0]
      : getPlaceholderImage("product", product.id, 800, 800);
    
    // Add the item to the cart
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImage,
      quantity: quantity,
      size: selectedSize,
      slug: product.slug,
    });
  };

  // Show loading state while fetching product
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="w-full md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-6 w-1/3 mb-8" />
            <Skeleton className="h-24 w-full mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle case where product is not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button asChild>
          <Link href="/products">
            Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square bg-neutral-100 mb-4">
            <Image 
              src={product.images && product.images[0] && isValidImageUrl(product.images[0])
                ? product.images[0]
                : getPlaceholderImage("product", product.id, 800, 800)}
              alt={product.name} 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images && product.images.length > 1 
              ? product.images.slice(1).map((image, i) => (
                <div key={i} className="relative aspect-square bg-neutral-100 cursor-pointer">
                  <Image 
                    src={isValidImageUrl(image) 
                      ? image 
                      : getPlaceholderImage("product", `${product.id}-${i+1}`, 200, 200)}
                    alt={`${product.name} view ${i+1}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
              ))
              : [1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-square bg-neutral-100 cursor-pointer">
                  <Image 
                    src={getPlaceholderImage("product", `${product.id}-${i}`, 200, 200)}
                    alt={`${product.name} view ${i}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
              ))
            }
          </div>
        </div>
        
        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
          <p className="text-neutral-500 mb-4">{product.category.name}</p>
          <p className="text-2xl font-medium mb-6">₦{product.price.toLocaleString()}</p>
          
          <div className="prose prose-neutral mb-8 max-w-none">
            <p>{product.description}</p>
          </div>
          
          {/* Product Options */}
          <div className="space-y-6 mb-8">
            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s">Small</SelectItem>
                  <SelectItem value="m">Medium</SelectItem>
                  <SelectItem value="l">Large</SelectItem>
                  <SelectItem value="xl">X-Large</SelectItem>
                  <SelectItem value="xxl">XX-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-r-none"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </Button>
                <div className="flex-1 flex items-center justify-center border-y border-input">
                  {quantity}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-l-none"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button className="w-full" size="lg" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b justify-start rounded-none">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="prose prose-neutral max-w-none">
              <p>{product.description}</p>
              <p>Our pieces are handcrafted by skilled artisans using traditional techniques passed down through generations, ensuring each item is unique and of the highest quality.</p>
            </div>
          </TabsContent>
          <TabsContent value="details" className="py-6">
            <div className="prose prose-neutral max-w-none">
              <ul>
                <li><strong>Material:</strong> {product.material || 'Premium cotton blend'}</li>
                <li><strong>Care:</strong> Dry clean only</li>
                <li><strong>Origin:</strong> Made in Nigeria</li>
                <li><strong>Shipping:</strong> 3-5 business days</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-neutral-200 pb-6">
                    <div className="flex items-center mb-2">
                      <div className="font-medium">{review.userName}</div>
                      <div className="text-neutral-500 text-sm ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mb-2">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                    <p>{review.content}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would ideally fetch related products from the API */}
          {[1, 2, 3, 4].map((i) => (
            <Link key={i} href={`/products`} className="group">
              <div className="bg-white border border-neutral-200 hover:shadow-md transition-shadow">
                <div className="relative h-[300px] overflow-hidden">
                  <Image 
                    src={getPlaceholderImage("product", `related-${i}`, 400, 400)}
                    alt={`Related product ${i}`} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium group-hover:text-primary transition-colors">Related Product {i}</h3>
                  <p className="text-neutral-500 mb-2">{product.category.name}</p>
                  <p className="font-semibold">₦{(product.price * 0.8 + i * 5000).toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
