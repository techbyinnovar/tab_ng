'use client';

import { CategoryForm } from "../../components/category-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, Loader2 } from "lucide-react";
import { api } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Fetch category data
  const { data: category, isLoading } = api.category.getById.useQuery(
    { id: params.id },
    {
      retry: false,
    }
  );

  // Handle error and redirect
  useEffect(() => {
    if (!isLoading && !category) {
      toast.error("Category not found");
      router.push("/admin/categories");
    }
  }, [isLoading, category, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          <p className="text-neutral-500">Loading category...</p>
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
          <BreadcrumbLink>Edit</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-neutral-500 mt-1">Update category information.</p>
      </div>
      
      <CategoryForm 
        mode="edit" 
        initialData={{
          id: category.id,
          name: category.name,
          description: category.description,
          image: category.image,
          slug: category.slug,
          parentId: category.parentId,
        }} 
      />
    </div>
  );
}
