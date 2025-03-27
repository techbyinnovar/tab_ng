'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import { api } from "@/lib/trpc";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Edit, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
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

export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch category data
  const { data: category, isLoading } = api.category.getById.useQuery(
    { id: params.id },
    {
      retry: false,
    }
  );

  // Count products in this category
  const { data: products } = api.product.getAll.useQuery(
    { categoryId: params.id },
    { enabled: !!category }
  );

  const productCount = products?.items.length || 0;

  // Delete category mutation
  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Category deleted successfully");
      router.push("/admin/categories");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
      setIsDeleting(false);
    }
  });

  // Handle category deletion
  const handleDeleteCategory = () => {
    setIsDeleting(true);
    deleteCategory.mutate({ id: params.id });
  };

  // Handle error and redirect
  if (!isLoading && !category) {
    toast.error("Category not found");
    router.push("/admin/categories");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          <p className="text-neutral-500">Loading category details...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb separator={<ChevronRight className="h-4 w-4" />}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/categories">Categories</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{category.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/categories/${category.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting || productCount > 0}>
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteCategory}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Image */}
        <Card>
          <CardHeader>
            <CardTitle>Category Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square rounded-md overflow-hidden bg-neutral-100">
              <Image 
                src={category.image || getPlaceholderImage("category", category.id, 800, 800)}
                alt={category.name} 
                fill 
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Category Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Name</h3>
                <p className="mt-1">{category.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Slug</h3>
                <p className="mt-1">{category.slug}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Parent Category</h3>
                <p className="mt-1">
                  {category.parent ? category.parent.name : "None (Top Level)"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Products</h3>
                <p className="mt-1">{productCount} products</p>
              </div>
            </div>
            
            {category.description && (
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Description</h3>
                <p className="mt-1 whitespace-pre-line">{category.description}</p>
              </div>
            )}
            
            {category.subcategories && category.subcategories.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Subcategories</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {category.subcategories.map((subcategory) => (
                    <Link 
                      key={subcategory.id}
                      href={`/admin/categories/${subcategory.id}`}
                      className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 hover:bg-neutral-200"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {productCount > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-neutral-500">Products in this category</h3>
                  <Button variant="link" size="sm" asChild className="h-auto p-0">
                    <Link href={`/admin/products?category=${category.id}`}>
                      View all
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products?.items.slice(0, 6).map((product) => (
                    <Link 
                      key={product.id}
                      href={`/admin/products/${product.id}`}
                      className="group"
                    >
                      <div className="relative aspect-square rounded-md overflow-hidden bg-neutral-100 mb-2">
                        <Image 
                          src={getPlaceholderImage("product", product.id, 200, 200)}
                          alt={product.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-sm truncate group-hover:text-black">{product.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
