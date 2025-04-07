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
import BlobImageUpload from "@/components/ui/blob-image-upload";
import { isValidImageUrl } from "@/lib/utils";
import { getPlaceholderImage } from "@/lib/placeholder-image";

interface SliderFormProps {
  initialData?: {
    id: string;
    title: string;
    subtitle: string | null;
    imageUrl: string;
    buttonText: string | null;
    buttonLink: string | null;
    buttonStyle: string | null;
    buttonSize: string | null;
    buttonClass: string | null;
    order: number;
    isActive: boolean;
  };
  mode: 'create' | 'edit';
}

export default function SliderForm({ initialData, mode }: SliderFormProps) {
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [images, setImages] = useState<string[]>(
    initialData?.imageUrl ? [initialData.imageUrl] : []
  );
  const [buttonText, setButtonText] = useState(initialData?.buttonText || '');
  const [buttonLink, setButtonLink] = useState(initialData?.buttonLink || '');
  const [buttonStyle, setButtonStyle] = useState(initialData?.buttonStyle || 'default');
  const [buttonSize, setButtonSize] = useState(initialData?.buttonSize || 'default');
  const [buttonClass, setButtonClass] = useState(initialData?.buttonClass || '');
  const [order, setOrder] = useState(initialData?.order?.toString() || '0');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isLoading, setIsLoading] = useState(false);

  // API mutations
  const createSlider = api.slider.create.useMutation({
    onSuccess: () => {
      toast.success("Slider created successfully");
      router.push('/admin/sliders');
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Error creating slider: ${error.message}`);
      setIsLoading(false);
    },
  });

  const updateSlider = api.slider.update.useMutation({
    onSuccess: () => {
      toast.success("Slider updated successfully");
      router.push('/admin/sliders');
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Error updating slider: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate form
      if (!title) {
        toast.error("Please provide a title for the slider");
        setIsLoading(false);
        return;
      }

      // Validate and prepare image
      let sliderImage;
      
      if (images.length > 0) {
        // Check if the image URL is valid
        if (isValidImageUrl(images[0])) {
          sliderImage = images[0];
        } else {
          // If URL is invalid, use placeholder
          sliderImage = getPlaceholderImage('slider', title, 1920, 1080);
        }
      } else {
        // No image provided, use placeholder
        sliderImage = getPlaceholderImage('slider', title, 1920, 1080);
      }
      
      const sliderData = {
        title,
        subtitle: subtitle || null,
        imageUrl: sliderImage,
        buttonText: buttonText || null,
        buttonLink: buttonLink || null,
        order: parseInt(order || '0'),
        isActive,
      };

      // Store button styling information in localStorage for the homepage to use
      // This is a workaround since we can't store it in the database
      if (typeof window !== 'undefined') {
        const stylingData = {
          buttonStyle,
          buttonSize,
          buttonClass
        };
        localStorage.setItem(`slider-styling-${initialData?.id || 'new'}`, JSON.stringify(stylingData));
      }

      console.log("Submitting slider data:", sliderData);

      if (mode === 'create') {
        createSlider.mutate(sliderData);
      } else if (initialData?.id) {
        updateSlider.mutate({
          id: initialData.id,
          ...sliderData,
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
          <CardTitle>{mode === 'create' ? 'Create New Slider' : 'Edit Slider'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter slider title"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Textarea
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter slider subtitle"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          {/* Slider Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Slider Image</h3>
            
            <BlobImageUpload
              value={images}
              disabled={isLoading}
              onChange={(url) => setImages([url])}
              onRemove={(url) => setImages(images.filter((image) => image !== url))}
              multiple={false}
            />
            
            <p className="text-sm text-gray-500">
              Recommended image size: 1920x1080 pixels. If no image is uploaded, a placeholder will be used.
            </p>
          </div>
          
          {/* Button Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Call to Action Button (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Shop Now"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  placeholder="/products"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-4 p-4 border rounded-md bg-gray-50">
              <h4 className="font-medium">Button Styling</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonStyle">Button Style</Label>
                  <Select
                    value={buttonStyle}
                    onValueChange={setButtonStyle}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="buttonStyle">
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Filled Primary)</SelectItem>
                      <SelectItem value="secondary">Secondary (Filled Gray)</SelectItem>
                      <SelectItem value="outline">Outline (Transparent with Border)</SelectItem>
                      <SelectItem value="ghost">Ghost (Text Only with Hover)</SelectItem>
                      <SelectItem value="link">Link (Underlined Text)</SelectItem>
                      <SelectItem value="destructive">Destructive (Red)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buttonSize">Button Size</Label>
                  <Select
                    value={buttonSize}
                    onValueChange={setButtonSize}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="buttonSize">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Medium)</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonBgColor">Background Color (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonBgColor"
                    type="text"
                    placeholder="#000000 or rgb(0,0,0) or black"
                    value={buttonClass.match(/bg-\[([^\]]+)\]/) ? buttonClass.match(/bg-\[([^\]]+)\]/)?.[1] || '' : ''}
                    onChange={(e) => {
                      const color = e.target.value;
                      if (color) {
                        // Remove existing bg color class and add new one
                        const newClass = buttonClass.replace(/bg-\[[^\]]+\]\s?/, '') + ` bg-[${color}]`;
                        setButtonClass(newClass.trim());
                      } else {
                        // Remove bg color class
                        setButtonClass(buttonClass.replace(/bg-\[[^\]]+\]\s?/, '').trim());
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Input
                    type="color"
                    className="w-12 p-1 h-10"
                    value={buttonClass.match(/bg-\[#([^\]]+)\]/) ? '#' + buttonClass.match(/bg-\[#([^\]]+)\]/)?.[1] || '#000000' : '#000000'}
                    onChange={(e) => {
                      const color = e.target.value;
                      // Remove existing bg color class and add new one
                      const newClass = buttonClass.replace(/bg-\[[^\]]+\]\s?/, '') + ` bg-[${color}]`;
                      setButtonClass(newClass.trim());
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonTextColor">Text Color (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonTextColor"
                    type="text"
                    placeholder="#ffffff or rgb(255,255,255) or white"
                    value={buttonClass.match(/text-\[([^\]]+)\]/) ? buttonClass.match(/text-\[([^\]]+)\]/)?.[1] || '' : ''}
                    onChange={(e) => {
                      const color = e.target.value;
                      if (color) {
                        // Remove existing text color class and add new one
                        const newClass = buttonClass.replace(/text-\[[^\]]+\]\s?/, '') + ` text-[${color}]`;
                        setButtonClass(newClass.trim());
                      } else {
                        // Remove text color class
                        setButtonClass(buttonClass.replace(/text-\[[^\]]+\]\s?/, '').trim());
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Input
                    type="color"
                    className="w-12 p-1 h-10"
                    value={buttonClass.match(/text-\[#([^\]]+)\]/) ? '#' + buttonClass.match(/text-\[#([^\]]+)\]/)?.[1] || '#ffffff' : '#ffffff'}
                    onChange={(e) => {
                      const color = e.target.value;
                      // Remove existing text color class and add new one
                      const newClass = buttonClass.replace(/text-\[[^\]]+\]\s?/, '') + ` text-[${color}]`;
                      setButtonClass(newClass.trim());
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonHoverEffect">Hover Effect (Optional)</Label>
                <Select
                  value={buttonClass.includes('hover:scale-') ? 'scale' : 
                         buttonClass.includes('hover:shadow-') ? 'shadow' : 
                         buttonClass.includes('hover:brightness-') ? 'brightness' : 'none'}
                  onValueChange={(value) => {
                    // Remove existing hover effects
                    let newClass = buttonClass
                      .replace(/hover:scale-[^\s]+\s?/, '')
                      .replace(/hover:shadow-[^\s]+\s?/, '')
                      .replace(/hover:brightness-[^\s]+\s?/, '');
                    
                    // Add new hover effect
                    if (value === 'scale') {
                      newClass += ' hover:scale-105';
                    } else if (value === 'shadow') {
                      newClass += ' hover:shadow-lg';
                    } else if (value === 'brightness') {
                      newClass += ' hover:brightness-110';
                    }
                    
                    setButtonClass(newClass.trim());
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger id="buttonHoverEffect">
                    <SelectValue placeholder="Select a hover effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="scale">Scale (Grow on Hover)</SelectItem>
                    <SelectItem value="shadow">Shadow (Add Shadow on Hover)</SelectItem>
                    <SelectItem value="brightness">Brightness (Brighten on Hover)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonRounded">Rounded Corners</Label>
                <Select
                  value={
                    buttonClass.includes('rounded-full') ? 'full' :
                    buttonClass.includes('rounded-xl') ? 'xl' :
                    buttonClass.includes('rounded-lg') ? 'lg' :
                    buttonClass.includes('rounded-md') ? 'md' :
                    buttonClass.includes('rounded-sm') ? 'sm' :
                    buttonClass.includes('rounded-none') ? 'none' : 'md'
                  }
                  onValueChange={(value) => {
                    // Remove existing rounded classes
                    let newClass = buttonClass
                      .replace(/rounded-[^\s]+\s?/, '');
                    
                    // Add new rounded class
                    if (value !== 'none') {
                      newClass += ` rounded-${value}`;
                    } else {
                      newClass += ' rounded-none';
                    }
                    
                    setButtonClass(newClass.trim());
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger id="buttonRounded">
                    <SelectValue placeholder="Select corner style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Square Corners)</SelectItem>
                    <SelectItem value="sm">Small Rounded</SelectItem>
                    <SelectItem value="md">Medium Rounded</SelectItem>
                    <SelectItem value="lg">Large Rounded</SelectItem>
                    <SelectItem value="xl">Extra Large Rounded</SelectItem>
                    <SelectItem value="full">Fully Rounded (Pill Shape)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonPadding">Button Padding</Label>
                <Select
                  value={
                    buttonClass.includes('px-8 py-6') ? 'large' :
                    buttonClass.includes('px-6 py-4') ? 'medium' :
                    buttonClass.includes('px-4 py-2') ? 'small' : 'medium'
                  }
                  onValueChange={(value) => {
                    // Remove existing padding classes
                    let newClass = buttonClass
                      .replace(/px-[0-9]+ py-[0-9]+\s?/, '');
                    
                    // Add new padding class
                    if (value === 'small') {
                      newClass += ' px-4 py-2';
                    } else if (value === 'medium') {
                      newClass += ' px-6 py-4';
                    } else if (value === 'large') {
                      newClass += ' px-8 py-6';
                    }
                    
                    setButtonClass(newClass.trim());
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger id="buttonPadding">
                    <SelectValue placeholder="Select padding size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonClass">
                  Advanced: Custom CSS Classes
                  <span className="ml-2 text-xs text-gray-500">(For developers)</span>
                </Label>
                <Input
                  id="buttonClass"
                  value={buttonClass}
                  onChange={(e) => setButtonClass(e.target.value)}
                  placeholder="e.g., font-bold tracking-wide"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Add any custom Tailwind CSS classes for advanced styling
                </p>
              </div>
              
              <div className="mt-4 p-3 border rounded-md bg-white">
                <p className="text-sm font-medium mb-2">Button Preview:</p>
                <div className="flex items-center justify-center bg-gray-100 p-4 rounded">
                  <button 
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      buttonStyle === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
                      buttonStyle === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' :
                      buttonStyle === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' :
                      buttonStyle === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' :
                      buttonStyle === 'link' ? 'text-primary underline-offset-4 hover:underline' :
                      buttonStyle === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' :
                      'bg-primary text-primary-foreground hover:bg-primary/90'
                    } ${
                      buttonSize === 'default' ? 'h-10 px-4 py-2' :
                      buttonSize === 'sm' ? 'h-9 rounded-md px-3' :
                      buttonSize === 'lg' ? 'h-11 rounded-md px-8' :
                      'h-10 px-4 py-2'
                    } ${buttonClass}`}
                  >
                    {buttonText || 'Button Text'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Display Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  min="0"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500">
                  Lower numbers display first
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active Status</Label>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Only active sliders will be displayed on the homepage
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/sliders')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>{mode === 'create' ? 'Create Slider' : 'Update Slider'}</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
