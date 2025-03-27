'use client';

import { CategoryForm } from "../components/category-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export default function CreateCategoryPage() {
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
          <BreadcrumbLink href="#">Create</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Category</h1>
        <p className="text-neutral-500 mt-1">Add a new category to your store.</p>
      </div>
      
      <CategoryForm mode="create" />
    </div>
  );
}
