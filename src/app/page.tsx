'use client';

import { Button } from "@/components/ui/button";
import { getPlaceholderImage, getPlaceholderAvatar } from "@/lib/placeholder-image";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full bg-neutral-900 text-white">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 z-0">
          <Image 
            src={getPlaceholderImage("category", "hero", 1920, 1080)}
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
            Handcrafted pieces that blend traditional craftsmanship with contemporary design.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-white text-black hover:bg-neutral-200">
              <Link href="/products">
                Shop Collection
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/about">
                Our Story
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-serif font-bold mb-12 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="relative h-[400px] mb-4 overflow-hidden bg-neutral-100">
                <Image 
                  src={getPlaceholderImage("category", category.id, 600, 800)}
                  alt={category.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-medium mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{category.description}</p>
                  <span className="inline-block border-b border-white pb-1 font-medium">
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.slug}`}
                className="group bg-white"
              >
                <div className="relative h-[300px] mb-4 overflow-hidden bg-neutral-100">
                  <Image 
                    src={getPlaceholderImage("product", product.id, 600, 600)}
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    {product.isNew && (
                      <span className="bg-black text-white text-xs font-medium px-2 py-1">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                  <p className="text-neutral-500 mb-2">{product.category}</p>
                  <p className="font-medium">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/products">
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-serif font-bold mb-12 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 border border-neutral-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image 
                    src={getPlaceholderAvatar(testimonial.id, 100)}
                    alt={testimonial.name} 
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <p className="text-sm text-neutral-500">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-neutral-700">&ldquo;{testimonial.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Join Our Newsletter</h2>
          <p className="max-w-xl mx-auto mb-8">
            Subscribe to receive updates on new arrivals, special offers, and styling tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <Button type="submit" className="bg-white text-black hover:bg-neutral-200">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

// Temporary data until we connect to the API
const categories = [
  {
    id: 1,
    name: "Agbada Sets",
    slug: "agbada-sets",
    description: "Traditional three-piece ensembles featuring flowing robes with intricate embroidery."
  },
  {
    id: 2,
    name: "Kaftan",
    slug: "kaftan",
    description: "Elegant, comfortable attire perfect for both formal occasions and everyday wear."
  },
  {
    id: 3,
    name: "Accessories",
    slug: "accessories",
    description: "Complete your look with our selection of traditional caps, beads, and more."
  }
];

const featuredProducts = [
  {
    id: 1,
    name: "Royal Agbada Set",
    slug: "royal-agbada-set",
    category: "Agbada Sets",
    price: 85000,
    isNew: true
  },
  {
    id: 3,
    name: "Velvet Agbada",
    slug: "velvet-agbada",
    category: "Agbada Sets",
    price: 95000,
    isNew: true
  },
  {
    id: 2,
    name: "Embroidered Kaftan",
    slug: "embroidered-kaftan",
    category: "Kaftan",
    price: 45000,
    isNew: false
  },
  {
    id: 8,
    name: "Beaded Necklace",
    slug: "beaded-necklace",
    category: "Accessories",
    price: 25000,
    isNew: true
  }
];

const testimonials = [
  {
    id: 1,
    name: "Oluwaseun A.",
    location: "Lagos, Nigeria",
    text: "The quality of my Agbada set exceeded my expectations. The craftsmanship is impeccable, and I received countless compliments at my brother's wedding."
  },
  {
    id: 2,
    name: "Chijioke M.",
    location: "Abuja, Nigeria",
    text: "I've ordered multiple kaftans from Tab.ng and each one has been perfect. The attention to detail and the comfort of the fabric make these my go-to for both work and special occasions."
  },
  {
    id: 3,
    name: "Kofi O.",
    location: "Accra, Ghana",
    text: "The shipping was fast, and the packaging was excellent. The Agbada I ordered fits perfectly, and the embroidery is even more beautiful in person."
  }
];
