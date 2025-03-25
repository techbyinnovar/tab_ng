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
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    const matchesPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPriceRange;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    // Default: newest
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[40vh] w-full bg-neutral-900 text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 z-0">
          <Image 
            src={getPlaceholderImage("category", 1, 1920, 600)}
            alt="Our Collection" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our Collection
          </h1>
          <p className="text-lg max-w-xl">
            Discover our handcrafted luxury pieces that blend traditional African craftsmanship with contemporary design.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="agbada sets">Agbada Sets</SelectItem>
                  <SelectItem value="kaftan">Kaftan</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[250px]">
              <label className="text-sm font-medium mb-1 block">Price Range: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}</label>
              <Slider
                defaultValue={[0, 150000]}
                max={150000}
                step={5000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Newest" />
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

        <Separator className="mb-8" />

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <Link 
              key={product.id} 
              href={`/product/${product.slug}`}
              className="group"
            >
              <div className="relative h-[400px] mb-4 overflow-hidden bg-neutral-100">
                <Image 
                  src={getPlaceholderImage("product", product.id, 400, 400)}
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 z-10">
                  {product.isNew && (
                    <span className="bg-black text-white text-xs font-medium px-2 py-1">
                      NEW
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">{product.name}</h3>
              <p className="text-neutral-500 mb-2">{product.category}</p>
              <p className="font-medium">₦{product.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-neutral-500 mb-6">Try adjusting your filters to find what you&apos;re looking for.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory("all");
                setPriceRange([0, 150000]);
                setSortBy("newest");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
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
  },
  {
    id: 2,
    name: "Embroidered Kaftan",
    slug: "embroidered-kaftan",
    category: "Kaftan",
    price: 45000,
    isNew: false,
  },
  {
    id: 3,
    name: "Velvet Agbada",
    slug: "velvet-agbada",
    category: "Agbada Sets",
    price: 95000,
    isNew: true,
  },
  {
    id: 4,
    name: "Classic Kaftan",
    slug: "classic-kaftan",
    category: "Kaftan",
    price: 35000,
    isNew: false,
  },
  {
    id: 5,
    name: "Premium Agbada Set",
    slug: "premium-agbada-set",
    category: "Agbada Sets",
    price: 120000,
    isNew: true,
  },
  {
    id: 6,
    name: "Luxury Kaftan",
    slug: "luxury-kaftan",
    category: "Kaftan",
    price: 65000,
    isNew: false,
  },
  {
    id: 7,
    name: "Traditional Cap",
    slug: "traditional-cap",
    category: "Accessories",
    price: 15000,
    isNew: false,
  },
  {
    id: 8,
    name: "Beaded Necklace",
    slug: "beaded-necklace",
    category: "Accessories",
    price: 25000,
    isNew: true,
  },
];
