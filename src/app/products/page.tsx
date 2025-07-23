'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import { isValidImageUrl } from "@/lib/utils";
import { api } from "@/lib/trpc";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// Component that uses useSearchParams must be wrapped in Suspense
function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");

  // Fetch all categories
  const { data: categories } = api.category.getAll.useQuery();
  
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
    const matchesPriceRange = Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1];
    return matchesCategory && matchesPriceRange;
  }) || [];

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price);
      case 'price-high':
        return Number(b.price) - Number(a.price);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full md:w-1/4 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Categories</h3>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Price Range</h3>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 150000]}
                max={150000}
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between">
                <span>₩{priceRange[0].toLocaleString()}</span>
                <span>₩{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Sort By</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products grid */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingProducts ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3 mt-2" />
                  </div>
                </div>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-500">No products found matching your criteria.</p>
              </div>
            ) : (
              // Map sorted products to UI
              sortedProducts.map((product) => (
                <Link
                  href={`/product/${product.slug}`}
                  key={product.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 bg-gray-100">
                    {isValidImageUrl(product.images?.[0]) ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src={getPlaceholderImage("product", String(product.id), 600, 600)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg truncate">{product.name}</h3>
                    <p className="text-gray-500 text-sm truncate">{product.description}</p>
                    <p className="text-lg font-bold mt-2">₩{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function ProductsLoading() {
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar skeleton */}
        <div className="w-full md:w-1/4 space-y-6">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-between mt-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Products grid skeleton */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component that wraps the content with Suspense
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
