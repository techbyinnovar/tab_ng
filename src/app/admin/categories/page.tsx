'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPlaceholderImage } from "@/lib/placeholder-image";
import Image from "next/image";
import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

// Mock category data
const initialCategories = [
  {
    id: 1,
    name: "Agbada",
    slug: "agbada",
    description: "Traditional flowing wide-sleeved robes",
    productCount: 15,
    featured: true,
  },
  {
    id: 2,
    name: "Kaftan",
    slug: "kaftan",
    description: "Elegant ankle-length garments with long sleeves",
    productCount: 12,
    featured: true,
  },
  {
    id: 3,
    name: "Dashiki",
    slug: "dashiki",
    description: "Colorful garments that cover the top half of the body",
    productCount: 8,
    featured: false,
  },
  {
    id: 4,
    name: "Aso Oke",
    slug: "aso-oke",
    description: "Hand-woven cloth created by the Yoruba people",
    productCount: 10,
    featured: true,
  },
  {
    id: 5,
    name: "Ankara",
    slug: "ankara",
    description: "Vibrant African wax print fabrics",
    productCount: 20,
    featured: true,
  },
  {
    id: 6,
    name: "Isiagu",
    slug: "isiagu",
    description: "Traditional Igbo attire with lion head prints",
    productCount: 6,
    featured: false,
  },
  {
    id: 7,
    name: "Accessories",
    slug: "accessories",
    description: "Traditional caps, beads, and other accessories",
    productCount: 18,
    featured: true,
  },
  {
    id: 8,
    name: "Senegalese",
    slug: "senegalese",
    description: "Traditional clothing from Senegal",
    productCount: 7,
    featured: false,
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof initialCategories[0] | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    featured: false,
  });

  // Filter categories based on search query and featured filter
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFeatured = featuredFilter === null || category.featured === featuredFilter;
    
    return matchesSearch && matchesFeatured;
  });

  // Handle adding a new category
  const handleAddCategory = () => {
    const newId = Math.max(...categories.map(c => c.id)) + 1;
    const newCategoryItem = {
      id: newId,
      name: newCategory.name,
      slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      description: newCategory.description,
      productCount: 0,
      featured: newCategory.featured,
    };
    
    setCategories([...categories, newCategoryItem]);
    setNewCategory({ name: "", description: "", featured: false });
    setIsAddModalOpen(false);
  };

  // Handle editing a category
  const handleEditCategory = () => {
    if (!selectedCategory) return;
    
    const updatedCategories = categories.map(category => 
      category.id === selectedCategory.id 
        ? { 
            ...selectedCategory,
            slug: selectedCategory.name.toLowerCase().replace(/\s+/g, '-')
          } 
        : category
    );
    
    setCategories(updatedCategories);
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  // Handle deleting a category
  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    
    const updatedCategories = categories.filter(
      category => category.id !== selectedCategory.id
    );
    
    setCategories(updatedCategories);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-neutral-500 mt-1">Manage product categories and collections.</p>
        </div>
        <Button className="md:w-auto w-full" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-neutral-500 mt-1">
              {categories.filter(c => c.featured).length} featured
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((acc, category) => acc + category.productCount, 0)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(categories.reduce((acc, category) => acc + category.productCount, 0) / categories.length)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Per category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Categories</CardTitle>
          <CardDescription>
            Search for categories by name or description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant={featuredFilter === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setFeaturedFilter(null)}
              >
                All
              </Button>
              <Button 
                variant={featuredFilter === true ? "default" : "outline"} 
                size="sm"
                onClick={() => setFeaturedFilter(true)}
              >
                Featured
              </Button>
              <Button 
                variant={featuredFilter === false ? "default" : "outline"} 
                size="sm"
                onClick={() => setFeaturedFilter(false)}
              >
                Not Featured
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={getPlaceholderImage("category", category.id, 800, 400)}
                alt={category.name}
                fill
                className="object-cover"
              />
              {category.featured && (
                <div className="absolute top-2 right-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
                  Featured
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-500">
                  {category.productCount} products
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No categories found</h3>
          <p className="text-neutral-500 mb-6">
            Try adjusting your search or filters, or add a new category.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setFeaturedFilter(null);
            }}>
              Reset Filters
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold">Add New Category</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Category Name
                </label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g. Summer Collection"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Brief description of the category"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newCategory.featured}
                  onChange={(e) => setNewCategory({ ...newCategory, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured Category
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddCategory}
                disabled={!newCategory.name.trim()}
              >
                Add Category
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold">Edit Category</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium mb-1">
                  Category Name
                </label>
                <Input
                  id="edit-name"
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  id="edit-description"
                  value={selectedCategory.description}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={selectedCategory.featured}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                <label htmlFor="edit-featured" className="text-sm font-medium">
                  Featured Category
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCategory(null);
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditCategory}
                disabled={!selectedCategory.name.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold">Delete Category</h2>
            </div>
            <div className="p-6">
              <p>
                Are you sure you want to delete the category <strong>{selectedCategory.name}</strong>?
                This action cannot be undone.
              </p>
              {selectedCategory.productCount > 0 && (
                <p className="mt-4 text-red-500">
                  Warning: This category contains {selectedCategory.productCount} products. 
                  Deleting it may affect these products.
                </p>
              )}
            </div>
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
              }}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteCategory}
              >
                Delete Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
