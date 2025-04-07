'use client';

import { api } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import SliderForm from "../components/slider-form";
import { Loader2 } from "lucide-react";

export default function EditSliderPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';

  const { data: slider, isLoading, error } = api.slider.getById.useQuery({ id });

  useEffect(() => {
    if (error) {
      console.error("Error loading slider:", error);
      router.push('/admin/sliders');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading slider...</p>
        </div>
      </div>
    );
  }

  if (!slider) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Slider Not Found</h1>
        <p>The slider you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Slider</h1>
      <SliderForm initialData={slider} mode="edit" />
    </div>
  );
}
