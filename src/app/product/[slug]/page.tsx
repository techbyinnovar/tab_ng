'use client';

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import { api } from "@/lib/trpc";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [selectedSize, setSelectedSize] = useState("m");
  const [quantity, setQuantity] = useState(1);
  
  // Find product by slug (in a real app, this would be a database query)
  const product = products.find(p => p.slug === params.slug);
  
  // Handle case where product is not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/products">
            Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  // Handle adding to cart
  const handleAddToCart = () => {
    console.log('Added to cart:', {
      product,
      size: selectedSize,
      quantity
    });
    // In a real app, this would dispatch to a cart state manager or API
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Images */}
        <div className="w-full lg:w-3/5">
          <div className="relative h-[600px] bg-neutral-100">
            <Image 
              src={getPlaceholderImage("product", product.id, 800, 800)}
              alt={product.name} 
              fill 
              className="object-cover"
              priority
            />
            {product.isNew && (
              <span className="absolute top-4 right-4 bg-black text-white text-xs font-medium px-2 py-1 z-10">
                NEW
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-[100px] bg-neutral-100 cursor-pointer">
                <Image 
                  src={getPlaceholderImage("product", `${product.id}-view-${i}`, 400, 400)}
                  alt={`${product.name} view ${i}`} 
                  fill 
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-2/5">
          <div className="sticky top-24">
            <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
            <Link href={`/category/${product.category.toLowerCase().replace(' ', '-')}`} className="text-neutral-500 hover:underline mb-4 inline-block">
              {product.category}
            </Link>
            <p className="text-2xl font-medium mb-6">₦{product.price.toLocaleString()}</p>
            
            <Separator className="my-6" />
            
            {/* Size Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex gap-3">
                {['s', 'm', 'l', 'xl', 'xxl'].map((size) => (
                  <button
                    key={size}
                    className={`h-10 w-10 flex items-center justify-center uppercase border ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-neutral-300 hover:border-neutral-900'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex">
                <button 
                  className="h-10 w-10 flex items-center justify-center border border-neutral-300"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <div className="h-10 w-10 flex items-center justify-center border-t border-b border-neutral-300">
                  {quantity}
                </div>
                <button 
                  className="h-10 w-10 flex items-center justify-center border border-neutral-300"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              className="w-full h-12 bg-black text-white hover:bg-neutral-800 mb-4"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            
            {/* Shipping and Returns */}
            <div className="text-sm text-neutral-600 space-y-2 mb-8">
              <p>Free shipping on orders over ₦50,000</p>
              <p>30-day return policy</p>
            </div>
            
            {/* Product Information Tabs */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="sizing">Sizing</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="text-neutral-700">
                <p>
                  {product.description || `The ${product.name} is a premium piece crafted with the finest materials to ensure both comfort and elegance. Each piece is meticulously handcrafted by skilled artisans, ensuring exceptional quality and attention to detail.`}
                </p>
              </TabsContent>
              <TabsContent value="details" className="text-neutral-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Premium quality fabric</li>
                  <li>Hand-embroidered details</li>
                  <li>Comfortable fit</li>
                  <li>Made in Nigeria</li>
                  <li>100% authentic</li>
                </ul>
              </TabsContent>
              <TabsContent value="sizing" className="text-neutral-700">
                <p className="mb-4">Our sizes run true to standard measurements:</p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Chest (inches)</th>
                      <th className="text-left py-2">Waist (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">S</td>
                      <td className="py-2">36-38</td>
                      <td className="py-2">30-32</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">M</td>
                      <td className="py-2">39-41</td>
                      <td className="py-2">33-35</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">L</td>
                      <td className="py-2">42-44</td>
                      <td className="py-2">36-38</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">XL</td>
                      <td className="py-2">45-47</td>
                      <td className="py-2">39-41</td>
                    </tr>
                    <tr>
                      <td className="py-2">XXL</td>
                      <td className="py-2">48-50</td>
                      <td className="py-2">42-44</td>
                    </tr>
                  </tbody>
                </table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <h2 className="text-2xl font-serif font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4)
            .map((relatedProduct) => (
              <Link 
                key={relatedProduct.id} 
                href={`/product/${relatedProduct.slug}`}
                className="group"
              >
                <div className="relative h-[300px] mb-4 overflow-hidden bg-neutral-100">
                  <Image 
                    src={getPlaceholderImage("product", relatedProduct.id, 400, 400)}
                    alt={relatedProduct.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">{relatedProduct.name}</h3>
                <p className="font-medium">₦{relatedProduct.price.toLocaleString()}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

// Temporary product data until we connect to the API
const products = [
  {
    id: 1,
    name: "Royal Agbada Set",
    slug: "royal-agbada-set",
    category: "Agbada Sets",
    price: 85000,
    isNew: true,
    description: "The Royal Agbada Set is our premium offering, featuring intricate hand-embroidered patterns that showcase the rich heritage of African craftsmanship. Made from the finest quality fabric, this three-piece set includes a flowing outer robe, an inner kaftan, and matching trousers."
  },
  {
    id: 2,
    name: "Embroidered Kaftan",
    slug: "embroidered-kaftan",
    category: "Kaftan",
    price: 45000,
    isNew: false,
    description: "Our Embroidered Kaftan combines traditional African design elements with modern tailoring for a comfortable yet sophisticated look. The detailed embroidery around the neckline and cuffs adds a touch of elegance to this versatile piece."
  },
  {
    id: 3,
    name: "Velvet Agbada",
    slug: "velvet-agbada",
    category: "Agbada Sets",
    price: 95000,
    isNew: true,
    description: "The Velvet Agbada is a luxurious take on the traditional attire, crafted from premium velvet fabric that drapes beautifully. The gold embroidery creates a striking contrast against the rich fabric, making this a standout piece for special occasions."
  },
  {
    id: 4,
    name: "Classic Kaftan",
    slug: "classic-kaftan",
    category: "Kaftan",
    price: 35000,
    isNew: false,
    description: "Our Classic Kaftan offers timeless elegance with its clean lines and subtle detailing. Made from breathable cotton blend fabric, it provides both comfort and style for everyday wear or casual gatherings."
  },
  {
    id: 5,
    name: "Premium Agbada Set",
    slug: "premium-agbada-set",
    category: "Agbada Sets",
    price: 120000,
    isNew: true,
    description: "The Premium Agbada Set represents the pinnacle of luxury African attire. Each piece is meticulously crafted with attention to every detail, from the elaborate embroidery to the precise tailoring. This set is designed to make a statement at the most prestigious events."
  },
  {
    id: 6,
    name: "Luxury Kaftan",
    slug: "luxury-kaftan",
    category: "Kaftan",
    price: 65000,
    isNew: false,
    description: "The Luxury Kaftan elevates the traditional design with premium fabric and exquisite detailing. The subtle sheen of the material catches the light beautifully, while the comfortable cut ensures you look and feel your best throughout any occasion."
  },
  {
    id: 7,
    name: "Traditional Cap",
    slug: "traditional-cap",
    category: "Accessories",
    price: 15000,
    isNew: false,
    description: "Complete your look with our Traditional Cap, handcrafted using time-honored techniques. The intricate pattern and quality materials reflect the rich cultural heritage behind this essential accessory."
  },
  {
    id: 8,
    name: "Beaded Necklace",
    slug: "beaded-necklace",
    category: "Accessories",
    price: 25000,
    isNew: true,
    description: "Our Beaded Necklace features handcrafted beads arranged in a traditional pattern that adds a touch of authenticity to any outfit. Each bead is carefully selected and placed to create a piece that honors African artistic traditions."
  },
];
