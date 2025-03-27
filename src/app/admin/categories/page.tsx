'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [parentFilter, setParentFilter] = useState("all");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // Fetch all categories
  const { data: categoriesData, isLoading: loadingCategories, refetch } = 
    api.category.getAll.useQuery({
      includeSubcategories: true,
    });
  
  // Delete category mutation
  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Category deleted successfully");
      refetch();
      setCategoryToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
      setCategoryToDelete(null);
    }
  });

  // Handle category deletion
  const handleDeleteCategory = (id: string) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory.mutate({ id: categoryToDelete });
    }
  };

  // Filter categories based on search query and parent filter
  const filteredCategories = categoriesData?.filter((category) => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesParent = 
      parentFilter === "all" || 
      (parentFilter === "top-level" && !category.parentId) ||
      (parentFilter === "sub" && category.parentId);
    
    return matchesSearch && matchesParent;
  }) || [];

  // Count subcategories for each category
  const getSubcategoryCount = (category: typeof categoriesData[0]) => {
    return category.subcategories?.length || 0;
  };

  // Count products for each category (this would require an additional API call in a real app)
  /*const getProductCount = (categoryId: string) => {
    // This is a placeholder. In a real app, you would fetch this data from the API
    return "N/A";
  };*/

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-neutral-500 mt-1">Manage your product categories.</p>
        </div>
        <Button className="md:w-auto w-full" size="sm" asChild>
          <Link href="/admin/categories/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Category
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Categories</CardTitle>
          <CardDescription>
            Use the filters below to find specific categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={parentFilter} onValueChange={setParentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="top-level">Top Level Categories</SelectItem>
                  <SelectItem value="sub">Subcategories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setParentFilter("all");
            }}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
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
                  Slug
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Parent
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Subcategories
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loadingCategories ? (
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
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-neutral-500">
                    No categories found. Try adjusting your filters or add a new category.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b transition-colors hover:bg-neutral-50"
                  >
                    <td className="p-4 align-middle">
                      <div className="relative h-10 w-10 rounded overflow-hidden">
                        <Image 
                          src={category.image || getPlaceholderImage("category", category.id, 100, 100)}
                          alt={category.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {category.name}
                    </td>
                    <td className="p-4 align-middle text-neutral-600">
                      {category.slug}
                    </td>
                    <td className="p-4 align-middle">
                      {category.parentId ? (
                        <Link 
                          href={`/admin/categories/${category.parentId}`}
                          className="text-blue-600 hover:underline"
                        >
                          View Parent
                        </Link>
                      ) : (
                        <span className="text-neutral-500">None</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      {getSubcategoryCount(category) > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {getSubcategoryCount(category)}
                        </span>
                      ) : (
                        <span className="text-neutral-500">None</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/admin/categories/${category.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/admin/categories/${category.id}/edit`}>
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
                              onClick={() => handleDeleteCategory(category.id)}
                              disabled={getSubcategoryCount(category) > 0}
                              title={getSubcategoryCount(category) > 0 ? "Cannot delete category with subcategories" : "Delete category"}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the category
                                &quot;{category.name}&quot; and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deleteCategory.isPending && categoryToDelete === category.id ? (
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
      {!loadingCategories && categoriesData?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No categories found</h3>
          <p className="text-neutral-500 mb-6">
            Get started by adding your first category.
          </p>
          <Button asChild>
            <Link href="/admin/categories/create">
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
