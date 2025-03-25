'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import Image from "next/image";
import { useState } from "react";
import { Pencil, Eye, Plus, Search, Trash2 } from "lucide-react";

// Mock product data
const initialProducts = [
  {
    id: 1,
    name: "Royal Agbada Set",
    slug: "royal-agbada-set",
    category: "Agbada Sets",
    price: 85000,
    stock: 12,
    isNew: true,
    status: "Active",
  },
  {
    id: 2,
    name: "Embroidered Kaftan",
    slug: "embroidered-kaftan",
    category: "Kaftan",
    price: 45000,
    stock: 18,
    isNew: false,
    status: "Active",
  },
  {
    id: 3,
    name: "Velvet Agbada",
    slug: "velvet-agbada",
    category: "Agbada Sets",
    price: 95000,
    stock: 8,
    isNew: true,
    status: "Active",
  },
  {
    id: 4,
    name: "Classic Kaftan",
    slug: "classic-kaftan",
    category: "Kaftan",
    price: 35000,
    stock: 24,
    isNew: false,
    status: "Active",
  },
  {
    id: 5,
    name: "Premium Agbada Set",
    slug: "premium-agbada-set",
    category: "Agbada Sets",
    price: 120000,
    stock: 5,
    isNew: true,
    status: "Active",
  },
  {
    id: 6,
    name: "Luxury Kaftan",
    slug: "luxury-kaftan",
    category: "Kaftan",
    price: 65000,
    stock: 15,
    isNew: false,
    status: "Active",
  },
  {
    id: 7,
    name: "Traditional Cap",
    slug: "traditional-cap",
    category: "Accessories",
    price: 15000,
    stock: 30,
    isNew: false,
    status: "Active",
  },
  {
    id: 8,
    name: "Beaded Necklace",
    slug: "beaded-necklace",
    category: "Accessories",
    price: 25000,
    stock: 20,
    isNew: true,
    status: "Active",
  },
  {
    id: 9,
    name: "Handcrafted Shoes",
    slug: "handcrafted-shoes",
    category: "Accessories",
    price: 55000,
    stock: 0,
    isNew: false,
    status: "Out of Stock",
  },
  {
    id: 10,
    name: "Limited Edition Agbada",
    slug: "limited-edition-agbada",
    category: "Agbada Sets",
    price: 150000,
    stock: 0,
    isNew: false,
    status: "Draft",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter products based on search query and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle product deletion
  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your product inventory and listings.</p>
        </div>
        <Button className="md:w-auto w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Products</CardTitle>
          <CardDescription>
            Use the filters below to find specific products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
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
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="out of stock">Out of Stock</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-neutral-50">
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Image
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Category
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Price
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Stock
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b transition-colors hover:bg-neutral-50"
                >
                  <td className="p-4 align-middle">
                    <div className="relative h-10 w-10 rounded overflow-hidden">
                      <Image 
                        src={getPlaceholderImage("product", product.id, 100, 100)}
                        alt={product.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4 align-middle font-medium">
                    {product.name}
                    {product.isNew && (
                      <span className="ml-2 bg-black text-white text-xs px-1.5 py-0.5">
                        NEW
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle">{product.category}</td>
                  <td className="p-4 align-middle">₦{product.price.toLocaleString()}</td>
                  <td className="p-4 align-middle">{product.stock}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : product.status === "Out of Stock"
                          ? "bg-red-100 text-red-800"
                          : "bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-neutral-500 mb-6">
            Try adjusting your filters or add a new product.
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          Showing <strong>{filteredProducts.length}</strong> of{" "}
          <strong>{products.length}</strong> products
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-neutral-100">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
