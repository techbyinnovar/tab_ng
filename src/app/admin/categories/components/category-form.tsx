'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import ImageUpload from "@/components/ui/image-upload";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    slug: string;
    parentId: string | null;
  };
  mode: 'create' | 'edit';
}

export function CategoryForm({ initialData, mode }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [parentId, setParentId] = useState(initialData?.parentId || 'none');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [autoSlug, setAutoSlug] = useState(!initialData);
  const [images, setImages] = useState<string[]>(initialData?.image ? [initialData.image] : []);

  // Fetch categories for parent selection
  const { data: categories, isLoading: loadingCategories } = api.category.getAll.useQuery();

  // Create category mutation
  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      toast.success("Category created successfully");
      router.push("/admin/categories");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
      setIsLoading(false);
    }
  });

  // Update category mutation
  const updateCategory = api.category.update.useMutation({
    onSuccess: () => {
      toast.success("Category updated successfully");
      router.push("/admin/categories");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
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
    if (!name || !slug) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const categoryData = {
        name,
        description: description || null,
        image: images.length > 0 ? images[0] : null,
        slug,
        parentId: parentId === "none" ? null : parentId,
      };

      console.log("Submitting category data:", categoryData);

      if (mode === 'create') {
        createCategory.mutate(categoryData);
      } else if (initialData?.id) {
        updateCategory.mutate({
          id: initialData.id,
          ...categoryData,
        });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // Filter out the current category from parent options (to prevent circular references)
  const parentOptions = categories?.filter(category => 
    category.id !== initialData?.id
  ) || [];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create New Category' : 'Edit Category'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Agbada Sets"
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
                placeholder="agbada-sets"
                disabled={autoSlug}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Traditional flowing wide-sleeved robes..."
              rows={3}
            />
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="image">Category Image</Label>
            <ImageUpload
              value={images}
              disabled={isLoading}
              onChange={(url) => {
                setImages([url]); // Only keep one image for categories
              }}
              onRemove={() => {
                setImages([]);
              }}
              multiple={false}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger id="parent">
                  <SelectValue placeholder="None (Top Level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {loadingCategories ? (
                    <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                  ) : (
                    parentOptions.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/admin/categories")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Create Category' : 'Update Category'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
