'use client';

import { ProductForm } from "../components/product-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export default function CreateProductPage() {
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
          <BreadcrumbLink>Create</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-neutral-500 mt-1">Add a new product to your store.</p>
      </div>
      
      <ProductForm mode="create" />
    </div>
  );
}
