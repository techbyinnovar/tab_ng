'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import BlobImageUpload from "@/components/ui/blob-image-upload";
import { getPlaceholderImage } from "@/lib/placeholder-image";

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory: number;
    categoryId: string;
    featured: boolean;
    isNew: boolean;
    slug: string;
    material?: string;
    images?: string[];
  };
  mode: 'create' | 'edit';
}

export function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [inventory, setInventory] = useState(initialData?.inventory?.toString() || '0');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [isNew, setIsNew] = useState(initialData?.isNew || true);
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [material, setMaterial] = useState(initialData?.material || '');
  const [autoSlug, setAutoSlug] = useState(!initialData);
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  // Fetch categories
  const { data: categories, isLoading: loadingCategories } = api.category.getAll.useQuery();

  // Create product mutation
  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully");
      router.push("/admin/products");
      router.refresh();
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error(error.message || "Failed to create product");
      setIsLoading(false);
    }
  });

  // Update product mutation
  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully");
      router.push("/admin/products");
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
      setIsLoading(false);
    }
  });

  // Handle name change and auto-generate slug
  const handleNameChange = (value: string) => {
    setName(value);
    if (autoSlug) {
      setSlug(slugify(value));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!name || !price || !inventory || !categoryId) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // Generate slug if not provided
      if (!slug) {
        setSlug(slugify(name));
      }

      // Generate a temporary ID for new products to avoid slug conflicts
      const tempId = Math.random().toString(36).substring(2, 9);

      // Use placeholder image if no images are uploaded
      let productImages = images;
      if (productImages.length === 0) {
        productImages = [getPlaceholderImage('product', name)];
      }

      // Validate image URLs
      productImages = productImages.map(img => {
        // Check if the image URL is valid
        try {
          new URL(img);
          return img;
        } catch {
          // If URL is invalid, use placeholder
          return getPlaceholderImage('product', name);
        }
      });

      // Prepare product data
      const productData = {
        name,
        description,
        price: parseFloat(price),
        inventory: parseInt(inventory),
        categoryId,
        featured,
        isNew,
        slug,
        // Use a temporary ID in the slug to avoid conflicts
        id: mode === 'create' ? `temp-${tempId}` : initialData?.id,
        material: material || undefined,
        images: productImages,
      };

      console.log("Submitting product data:", productData);

      if (mode === 'create') {
        createProduct.mutate(productData);
      } else if (initialData?.id) {
        updateProduct.mutate({
          id: initialData.id,
          ...productData,
        });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create New Product' : 'Edit Product'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Royal Agbada Set"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={autoSlug}
                      onCheckedChange={setAutoSlug}
                      id="auto-slug"
                    />
                    <Label htmlFor="auto-slug" className="text-xs">Auto-generate</Label>
                  </div>
                </div>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="royal-agbada-set"
                  disabled={autoSlug}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Premium quality Agbada set with intricate embroidery..."
                rows={4}
                required
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCategories ? (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
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
              
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Cotton, Linen, etc."
                />
              </div>
            </div>
          </div>
          
          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing & Inventory</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="45000"
                  min="0"
                  step="100"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inventory">Inventory</Label>
                <Input
                  id="inventory"
                  type="number"
                  value={inventory}
                  onChange={(e) => setInventory(e.target.value)}
                  placeholder="10"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          {/* Product Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Options</h3>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={setFeatured}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isNew"
                  checked={isNew}
                  onCheckedChange={setIsNew}
                />
                <Label htmlFor="isNew">Mark as New</Label>
              </div>
            </div>
          </div>
          
          {/* Product Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Images</h3>
            
            <BlobImageUpload
              value={images}
              disabled={isLoading}
              onChange={(url) => setImages([...images, url])}
              onRemove={(url) => setImages(images.filter((current) => current !== url))}
              multiple={true}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/admin/products")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Create Product' : 'Update Product'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
