'use client';

import { Button } from "@/components/ui/button";
import { getPlaceholderImage, getPlaceholderAvatar } from "@/lib/placeholder-image";
import { isValidImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/trpc";
import { useState, useEffect } from "react";
import HomepageSlider from "@/components/ui/homepage-slider";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  // Fetch featured products from the database
  const { data: featuredProducts, isLoading: loadingFeaturedProducts } = 
    api.product.getAll.useQuery({ 
      featured: true,
      limit: 4
    });
    
  // Fetch categories from the database
  const { data: categoriesData, isLoading: isCategoriesLoading } = 
    api.category.getAll.useQuery();
    
  // Fetch new arrivals from the database
  const { data: newArrivals, isLoading: loadingNewArrivals } = 
    api.product.getAll.useQuery({
      isNew: true,
      limit: 4
    });
    
  // Fetch sliders from the database
  const { data: sliders, isLoading: isSlidersLoading } = 
    api.slider.getActive.useQuery();
    
  // Fetch testimonials (using a placeholder for now since we don't have a testimonial router)
  const testimonials = [
    {
      id: 1,
      name: "Oluwaseun A.",
      location: "Lagos, Nigeria",
      text: "The quality of my Agbada set exceeded my expectations. The craftsmanship is impeccable, and I received countless compliments at my brother's wedding."
    },
    {
      id: 2,
      name: "Chijioke M.",
      location: "Abuja, Nigeria",
      text: "I've ordered multiple kaftans from Tab.ng and each one has been perfect. The attention to detail and the comfort of the fabric make these my go-to for both work and special occasions."
    },
    {
      id: 3,
      name: "Kofi O.",
      location: "Accra, Ghana",
      text: "The shipping was fast, and the packaging was excellent. The Agbada I ordered fits perfectly, and the embroidery is even more beautiful in person."
    }
  ];
  
  const featuredCategories = [
    {
      id: 1,
      name: "Agbada",
      image: getPlaceholderImage("category", 1, 600, 800)
    },
    {
      id: 2,
      name: "Kaftan",
      image: getPlaceholderImage("category", 2, 600, 800)
    },
    {
      id: 3,
      name: "Suit",
      image: getPlaceholderImage("category", 3, 600, 800)
    }
  ];
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-neutral-900 text-white">
        {isSlidersLoading ? (
          // Loading state
          <div className="h-[80vh] w-full bg-neutral-900 flex items-center justify-center">
            <div className="animate-pulse text-white">Loading...</div>
          </div>
        ) : (
          <HomepageSlider slides={sliders || []} />
        )}
      </section>

      {/* Featured Categories */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isCategoriesLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="relative h-80 rounded-lg overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            ))
          ) : (
            // Actual categories
            categoriesData?.slice(0, 3).map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`} className="group">
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
                  <Image 
                    src={category.image && isValidImageUrl(category.image) 
                      ? category.image 
                      : getPlaceholderImage("category", category.id, 600, 800)}
                    alt={category.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <h3 className="text-2xl font-serif font-bold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingFeaturedProducts ? (
              // Loading skeleton
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              // Actual products
              featuredProducts?.items.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-64">
                      <Image 
                        src={getPlaceholderImage("product", product.id, 500, 500)}
                        alt={product.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-neutral-500 text-sm">{product.category.name}</p>
                      <p className="mt-2 font-semibold">₦{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingNewArrivals ? (
            // Loading skeleton
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <Skeleton className="h-64 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))
          ) : (
            // Actual products
            newArrivals?.items.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-64">
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                      New
                    </div>
                    <Image 
                      src={getPlaceholderImage("product", product.id, 500, 500)}
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-neutral-500 text-sm">{product.category.name}</p>
                    <p className="mt-2 font-semibold">₦{product.price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-neutral-800 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image 
                      src={getPlaceholderAvatar(testimonial.id)}
                      alt={testimonial.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-neutral-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <p className="italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
