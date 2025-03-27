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
import { api } from "@/lib/trpc";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Pencil, Eye, Plus, Search, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Fetch all products
  const { data: productsData, isLoading: loadingProducts, refetch } = 
    api.product.getAll.useQuery({ limit: 100 });
    
  // Fetch all categories for the filter
  const { data: categories, isLoading: loadingCategories } = 
    api.category.getAll.useQuery();
    
  // Delete product mutation
  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted successfully");
      refetch();
      setProductToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
      setProductToDelete(null);
    }
  });

  // Handle product deletion
  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct.mutate({ id: productToDelete });
    }
  };

  // Filter products based on search query and filters
  const filteredProducts = productsData?.items.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      categoryFilter === "all" || 
      product.categoryId === categoryFilter;
      
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && product.inventory > 0) ||
      (statusFilter === "out of stock" && product.inventory === 0);
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your product inventory and listings.</p>
        </div>
        <Button className="md:w-auto w-full" size="sm" asChild>
          <Link href="/admin/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
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
                  {loadingCategories ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
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
                  <SelectItem value="active">In Stock</SelectItem>
                  <SelectItem value="out of stock">Out of Stock</SelectItem>
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
              {loadingProducts ? (
                // Loading skeleton
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b transition-colors">
                    <td className="p-4 align-middle">
                      <Skeleton className="h-10 w-10 rounded" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-5 w-32" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-5 w-24" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-5 w-16" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-5 w-10" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-5 w-20" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-neutral-500">
                    No products found. Try adjusting your filters or add a new product.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
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
                    <td className="p-4 align-middle">{product.category.name}</td>
                    <td className="p-4 align-middle">₦{product.price.toLocaleString()}</td>
                    <td className="p-4 align-middle">{product.inventory}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.inventory > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inventory > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product
                                &quot;{product.name}&quot; and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setProductToDelete(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deleteProduct.isPending && productToDelete === product.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {!loadingProducts && productsData?.items.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-neutral-500 mb-6">
            Get started by adding your first product.
          </p>
          <Button asChild>
            <Link href="/admin/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
