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
import { useState, useEffect } from "react";
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

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch product data
  const { data: product, isLoading } = api.product.getById.useQuery(
    { id: params.id },
    {
      retry: false,
    }
  );

  // Handle error and redirect
  useEffect(() => {
    if (!isLoading && !product) {
      toast.error("Product not found");
      router.push("/admin/products");
    }
  }, [isLoading, product, router]);

  // Delete product mutation
  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted successfully");
      router.push("/admin/products");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
      setIsDeleting(false);
    }
  });

  // Handle product deletion
  const handleDeleteProduct = () => {
    setIsDeleting(true);
    deleteProduct.mutate({ id: params.id });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          <p className="text-neutral-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb separator={<ChevronRight className="h-4 w-4" />}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{product.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          {product.isNew && (
            <span className="bg-black text-white text-xs px-2 py-1">NEW</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
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
                  This action cannot be undone. This will permanently delete the product
                  and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteProduct}
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
        {/* Product Image */}
        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square rounded-md overflow-hidden bg-neutral-100">
              <Image 
                src={getPlaceholderImage("product", product.id, 800, 800)}
                alt={product.name} 
                fill 
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Product Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Name</h3>
                <p className="mt-1">{product.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Slug</h3>
                <p className="mt-1">{product.slug}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Category</h3>
                <p className="mt-1">{product.category.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Price</h3>
                <p className="mt-1">₦{product.price.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Inventory</h3>
                <p className="mt-1">{product.inventory} units</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Status</h3>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.inventory > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inventory > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                  {product.featured && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                      Featured
                    </span>
                  )}
                  {product.isNew && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      New
                    </span>
                  )}
                </div>
              </div>
              {product.material && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500">Material</h3>
                  <p className="mt-1">{product.material}</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Description</h3>
              <p className="mt-1 whitespace-pre-line">{product.description}</p>
            </div>
            
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Variants</h3>
                <div className="mt-2 border rounded-md">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Inventory
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {product.variants.map((variant) => (
                        <tr key={variant.id}>
                          <td className="px-4 py-3 text-sm">{variant.name}</td>
                          <td className="px-4 py-3 text-sm">₦{variant.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">{variant.inventory}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
