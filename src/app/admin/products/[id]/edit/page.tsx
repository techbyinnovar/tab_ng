'use client';

import { ProductForm } from "../../components/product-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, Loader2 } from "lucide-react";
import { api } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Fetch product data
  const { data: product, isLoading, error } = api.product.getById.useQuery(
    { id: params.id },
    {
      retry: false,
      onError: (error) => {
        toast.error(error.message || "Failed to load product");
      }
    }
  );

  // Redirect if product not found
  useEffect(() => {
    if (error) {
      router.push("/admin/products");
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          <p className="text-neutral-500">Loading product...</p>
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
          <BreadcrumbLink>Edit</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-neutral-500 mt-1">Update product information.</p>
      </div>
      
      <ProductForm 
        mode="edit" 
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          inventory: product.inventory,
          categoryId: product.categoryId,
          featured: product.featured,
          isNew: product.isNew,
          slug: product.slug,
          material: product.material || undefined,
        }} 
      />
    </div>
  );
}
