/**
 * Utility functions for generating placeholder images for the e-commerce site
 */

// Function to generate a placeholder image URL with consistent styling
export function getPlaceholderImage(
  type: "product" | "category" | "testimonial" = "product",
  id: number | string = 1,
  width = 800,
  height = 600
): string {
  // Create a base64 encoded SVG for the placeholder
  // This approach works in both client and server environments
  
  // Determine background color based on type
  let bgColor = '#f3f4f6'; // Default light gray
  if (type === 'category') bgColor = '#e5e7eb';
  if (type === 'testimonial') bgColor = '#f8fafc';
  
  // Create the SVG content
  const text = `${type.charAt(0).toUpperCase() + type.slice(1)} ${id}`;
  const fontSize = Math.floor(width / 20);
  
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}" />
      
      <!-- Grid pattern -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="1" />
      </pattern>
      <rect width="${width}" height="${height}" fill="url(#grid)" />
      
      <!-- Brand mark -->
      <path d="M ${width/2} ${height/2 - 50} L ${width/2 + 50} ${height/2 + 50} L ${width/2 - 50} ${height/2 + 50} Z" fill="rgba(0,0,0,0.1)" />
      
      <!-- Text -->
      <text 
        x="${width/2}" 
        y="${height/2}" 
        font-family="sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="#9ca3af" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >${text}</text>
    </svg>
  `;
  
  // Convert SVG to a base64 data URL
  const encodedSVG = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${encodedSVG}`;
}

// Function to generate a placeholder avatar image
export function getPlaceholderAvatar(id: number | string = 1, size = 200): string {
  // For avatars, we'll use a different style
  const colors = [
    '#f87171', // red
    '#fb923c', // orange
    '#fbbf24', // amber
    '#a3e635', // lime
    '#34d399', // emerald
    '#22d3ee', // cyan
    '#818cf8', // indigo
    '#c084fc', // purple
    '#f472b6', // pink
  ];
  
  // Use the id to select a consistent color
  const colorIndex = typeof id === 'number' 
    ? id % colors.length 
    : String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  
  const bgColor = colors[colorIndex];
  const initials = typeof id === 'string' && isNaN(Number(id)) 
    ? id.substring(0, 2).toUpperCase() 
    : 'T';
  
  const svgContent = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${bgColor}" />
      <text 
        x="${size/2}" 
        y="${size/2}" 
        font-family="sans-serif" 
        font-size="${size/2}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >${initials}</text>
    </svg>
  `;
  
  // Convert SVG to a base64 data URL
  const encodedSVG = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${encodedSVG}`;
}
