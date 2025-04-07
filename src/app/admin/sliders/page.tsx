'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/trpc";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { isValidImageUrl } from "@/lib/utils";
import { getPlaceholderImage } from "@/lib/placeholder-image";

export default function SlidersPage() {
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedSliders, setReorderedSliders] = useState<Array<{
    id: string;
    title: string;
    subtitle: string | null;
    imageUrl: string;
    buttonText: string | null;
    buttonLink: string | null;
    order: number;
    isActive: boolean;
  }>>([]);

  const { data: sliders, isLoading, refetch } = api.slider.getAll.useQuery();
  const deleteSlider = api.slider.delete.useMutation({
    onSuccess: () => {
      toast.success("Slider deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting slider: ${error.message}`);
    },
  });

  const updateOrder = api.slider.updateOrder.useMutation({
    onSuccess: () => {
      toast.success("Slider order updated successfully");
      refetch();
      setIsReordering(false);
    },
    onError: (error) => {
      toast.error(`Error updating slider order: ${error.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      deleteSlider.mutate({ id });
    }
  };

  const startReordering = () => {
    if (sliders) {
      setReorderedSliders([...sliders]);
      setIsReordering(true);
    }
  };

  const cancelReordering = () => {
    setIsReordering(false);
  };

  const moveSlider = (index: number, direction: 'up' | 'down') => {
    if (!reorderedSliders) return;

    const newOrder = [...reorderedSliders];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newOrder.length) return;

    // Swap the items
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    
    // Update the order property
    newOrder.forEach((slider, idx) => {
      slider.order = idx;
    });

    setReorderedSliders(newOrder);
  };

  const saveOrder = () => {
    if (!reorderedSliders) return;

    const orderData = reorderedSliders.map((slider, index) => ({
      id: slider.id,
      order: index,
    }));

    updateOrder.mutate(orderData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Homepage Sliders</h1>
        <div className="flex gap-2">
          {isReordering ? (
            <>
              <Button variant="outline" onClick={cancelReordering}>
                Cancel
              </Button>
              <Button onClick={saveOrder}>Save Order</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={startReordering} disabled={!sliders || sliders.length < 2}>
                Reorder Sliders
              </Button>
              <Link href="/admin/sliders/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Slider
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading sliders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {isReordering ? (
            reorderedSliders?.map((slider, index) => (
              <Card key={slider.id} className="overflow-hidden">
                <div className="flex">
                  <div className="relative w-[300px] h-[200px]">
                    <Image
                      src={isValidImageUrl(slider.imageUrl) 
                        ? slider.imageUrl 
                        : getPlaceholderImage("slider", slider.id, 600, 400)}
                      alt={slider.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold">{slider.title}</h2>
                        {slider.subtitle && <p className="text-gray-500 mt-1">{slider.subtitle}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => moveSlider(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => moveSlider(index, 'down')}
                          disabled={index === reorderedSliders.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      {slider.buttonText && (
                        <div className="mt-2">
                          <span className="font-medium">Button:</span> {slider.buttonText}
                        </div>
                      )}
                      {slider.buttonLink && (
                        <div className="mt-1">
                          <span className="font-medium">Link:</span> {slider.buttonLink}
                        </div>
                      )}
                      <div className="mt-2">
                        <span className="font-medium">Status:</span>{" "}
                        <span className={slider.isActive ? "text-green-600" : "text-red-600"}>
                          {slider.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            sliders?.map((slider) => (
              <Card key={slider.id} className="overflow-hidden">
                <div className="flex">
                  <div className="relative w-[300px] h-[200px]">
                    <Image
                      src={isValidImageUrl(slider.imageUrl) 
                        ? slider.imageUrl 
                        : getPlaceholderImage("slider", slider.id, 600, 400)}
                      alt={slider.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold">{slider.title}</h2>
                        {slider.subtitle && <p className="text-gray-500 mt-1">{slider.subtitle}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/sliders/${slider.id}`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleDelete(slider.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      {slider.buttonText && (
                        <div className="mt-2">
                          <span className="font-medium">Button:</span> {slider.buttonText}
                        </div>
                      )}
                      {slider.buttonLink && (
                        <div className="mt-1">
                          <span className="font-medium">Link:</span> {slider.buttonLink}
                        </div>
                      )}
                      <div className="mt-2">
                        <span className="font-medium">Status:</span>{" "}
                        <span className={slider.isActive ? "text-green-600" : "text-red-600"}>
                          {slider.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="font-medium">Order:</span> {slider.order}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}

          {sliders?.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No sliders found</CardTitle>
                <CardDescription>
                  Create your first slider to display on the homepage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/sliders/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Slider
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
