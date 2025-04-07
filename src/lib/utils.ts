import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "NGN";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "NGN", notation = "standard" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

/**
 * Format a number as Nigerian Naira currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function getInitials(name: string) {
  const names = name.split(" ");
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
  return initials;
}

export function generateOrderNumber() {
  const timestamp = new Date().getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `TAB-${timestamp}-${random}`;
}

/**
 * Validates if a string is a valid image URL
 * Returns true if the URL is valid and absolute (starts with http:// or https://)
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  // Check if it's a data URL (base64)
  if (url.startsWith('data:image/')) return true;
  
  // Check if it's a URL with common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
  const lowercaseUrl = url.toLowerCase();
  
  // Check for common image extensions
  const hasImageExtension = imageExtensions.some(ext => lowercaseUrl.endsWith(ext));
  
  // Check if it's a URL (starts with http:// or https:// or //)
  const isUrl = /^(https?:\/\/|\/\/)/.test(url);
  
  return isUrl && hasImageExtension;
}
