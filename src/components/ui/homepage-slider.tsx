'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import { isValidImageUrl } from '@/lib/utils';
import { getPlaceholderImage } from '@/lib/placeholder-image';
import { cn } from "@/lib/utils";

interface SliderItem {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  buttonText?: string | null;
  buttonLink?: string | null;
  isActive: boolean;
  order: number;
}

interface ButtonStyling {
  buttonStyle?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonClass?: string;
}

interface SliderStylingData {
  [key: string]: ButtonStyling;
}

interface HomepageSliderProps {
  slides: SliderItem[];
  autoplaySpeed?: number;
  showControls?: boolean;
  showAutoplayControls?: boolean;
  showDots?: boolean;
}

export default function HomepageSlider({
  slides,
  autoplaySpeed = 5000,
  showControls = true,
  showAutoplayControls = true,
  showDots = true,
}: HomepageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [stylingData, setStylingData] = useState<SliderStylingData>({});

  // Filter out inactive slides
  const activeSlides = slides.filter(slide => slide.isActive);

  // If no slides are provided or active, show a default slide
  const hasSlides = activeSlides.length > 0;

  // Handle automatic slide transition
  useEffect(() => {
    if (!hasSlides || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [activeSlides, autoplaySpeed, isAutoPlaying, hasSlides]);

  // Pause autoplay when user interacts with the slider
  const pauseAutoplay = useCallback(() => setIsAutoPlaying(false), []);
  const resumeAutoplay = useCallback(() => setIsAutoPlaying(true), []);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    pauseAutoplay();
    // Resume autoplay after a period of inactivity
    setTimeout(resumeAutoplay, 10000);
  }, [pauseAutoplay, resumeAutoplay]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    pauseAutoplay();
    setTimeout(resumeAutoplay, 10000);
  }, [pauseAutoplay, resumeAutoplay, activeSlides]);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    pauseAutoplay();
    setTimeout(resumeAutoplay, 10000);
  }, [pauseAutoplay, resumeAutoplay, activeSlides]);

  // Load styling data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStylingData: SliderStylingData = {};
      
      // Load styling data for each slide
      slides.forEach(slide => {
        try {
          const data = localStorage.getItem(`slider-styling-${slide.id}`);
          if (data) {
            storedStylingData[slide.id] = JSON.parse(data);
          }
        } catch (error) {
          console.error('Error loading slider styling data:', error);
        }
      });
      
      setStylingData(storedStylingData);
    }
  }, [slides]);

  // If no slides, show a default slide
  if (!hasSlides) {
    return (
      <div className="relative h-[80vh] w-full bg-neutral-900 text-white">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 z-0">
          <Image 
            src={getPlaceholderImage("category", "default", 1920, 1080)}
            alt="Tab.ng - Luxury African Attire" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4 md:px-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 max-w-3xl">
            Luxury African Attire for the Modern Man
          </h1>
          <p className="text-xl max-w-xl mb-8">
            Discover our collection of premium African clothing, handcrafted with the finest materials.
          </p>
          <div>
            <Link href="/products">
              <Button size="lg" className="text-lg px-8 py-6">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the current slide
  const slide = activeSlides[currentSlide];

  return (
    <div 
      className="relative h-[80vh] w-full bg-neutral-900 text-white overflow-hidden"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Slide background */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div 
        className="absolute inset-0 z-0 transition-transform duration-500 ease-in-out"
        style={{ transform: `scale(${isAutoPlaying ? '1.05' : '1'})` }}
      >
        <Image 
          src={isValidImageUrl(slide.imageUrl) 
            ? slide.imageUrl 
            : getPlaceholderImage("category", slide.id, 1920, 1080)}
          alt={slide.title} 
          fill 
          className="object-cover transition-transform duration-700 ease-in-out"
          priority
        />
      </div>

      {/* Slide content */}
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4 md:px-6">
        <div className="max-w-3xl transition-all duration-500 ease-in-out">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 animate-fadeIn">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-xl max-w-xl mb-8 animate-fadeIn animation-delay-200">
              {slide.subtitle}
            </p>
          )}
          {slide.buttonText && slide.buttonLink && (
            <div className="animate-fadeIn animation-delay-400">
              <Link href={slide.buttonLink}>
                <Button 
                  size={stylingData[slide.id]?.buttonSize || "lg"}
                  variant={stylingData[slide.id]?.buttonStyle || "default"}
                  className={cn(stylingData[slide.id]?.buttonClass, "text-lg px-8 py-6")}
                >
                  {slide.buttonText}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      {showControls && activeSlides.length > 1 && (
        <>
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
            onClick={goToPrevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
            onClick={goToNextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Autoplay controls */}
      {showAutoplayControls && (
        <div className="absolute bottom-6 right-6 z-30 flex space-x-2">
          <button
            className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            aria-label="Toggle autoplay"
          >
            {isAutoPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </button>
        </div>
      )}

      {/* Dots navigation */}
      {showDots && activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
