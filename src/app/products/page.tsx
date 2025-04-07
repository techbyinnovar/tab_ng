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
import { Slider } from "@/components/ui/slider";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import { isValidImageUrl } from "@/lib/utils";
import { api } from "@/lib/trpc";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");

  // Fetch all categories
  const { data: categories, isLoading: loadingCategories } = api.category.getAll.useQuery();
  
  // Fetch all products
  const { data: productsData, isLoading: loadingProducts } = api.product.getAll.useQuery({
    limit: 100, // Fetch a large number of products for client-side filtering
  });

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Filter products based on selected filters
  const filteredProducts = productsData?.items.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    const matchesPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPriceRange;
  }) || [];

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "price-low-high") {
      return a.price - b.price;
    } else if (sortBy === "price-high-low") {
      return b.price - a.price;
    } else if (sortBy === "name-a-z") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "name-z-a") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Our Collection</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white p-6 border border-neutral-200 sticky top-24">
            <h2 className="font-medium text-lg mb-4">Filters</h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Category</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="cat-all" 
                    name="category" 
                    value="all" 
                    checked={selectedCategory === "all"}
                    onChange={() => setSelectedCategory("all")}
                    className="mr-2"
                  />
                  <label htmlFor="cat-all">All Categories</label>
                </div>
                
                {loadingCategories ? (
                  // Loading skeleton for categories
                  Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))
                ) : (
                  // Actual categories
                  categories?.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input 
                        type="radio" 
                        id={`cat-${category.id}`} 
                        name="category" 
                        value={category.id} 
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`cat-${category.id}`}>{category.name}</label>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <Slider 
                defaultValue={[0, 150000]} 
                max={150000} 
                step={5000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-6" 
              />
              <div className="flex items-center justify-between text-sm">
                <span>₦{priceRange[0].toLocaleString()}</span>
                <span>₦{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Reset Filters */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedCategory("all");
                setPriceRange([0, 150000]);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="w-full lg:w-3/4">
          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-neutral-600 mb-4 sm:mb-0">
              Showing {sortedProducts.length} products
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                <SelectItem value="name-z-a">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Products */}
          {loadingProducts ? (
            // Loading skeleton for products
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="bg-white border border-neutral-200">
                  <Skeleton className="h-[300px] w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            // No products found
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-neutral-600 mb-6">Try adjusting your filters to find what you&apos;re looking for.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange([0, 150000]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            // Products grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group">
                  <div className="bg-white border border-neutral-200 hover:shadow-md transition-shadow">
                    <div className="relative h-[300px] overflow-hidden">
                      {product.isNew && (
                        <div className="absolute top-2 right-2 z-10 bg-black text-white text-xs font-medium px-2 py-1">
                          NEW
                        </div>
                      )}
                      <Image 
                        src={product.images && product.images[0] && isValidImageUrl(product.images[0]) 
                          ? product.images[0] 
                          : getPlaceholderImage("product", product.id, 600, 600)}
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-neutral-500 mb-2">{product.category.name}</p>
                      <p className="font-semibold">₦{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
