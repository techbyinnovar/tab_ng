'use client';

import SliderForm from "../components/slider-form";

export default function NewSliderPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Slider</h1>
      <SliderForm mode="create" />
    </div>
  );
}
