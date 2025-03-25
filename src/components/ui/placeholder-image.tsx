import React from 'react';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  type?: 'product' | 'category' | 'testimonial';
  width?: number;
  height?: number;
  text?: string;
  className?: string;
}

export function PlaceholderImage({
  type = 'product',
  width = 800,
  height = 600,
  text,
  className,
}: PlaceholderImageProps) {
  const aspectRatio = width / height;
  const displayText = text || `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  
  // Generate a background color based on the type
  const getBackgroundColor = () => {
    switch (type) {
      case 'product':
        return '#f3f4f6'; // Light gray
      case 'category':
        return '#e5e7eb'; // Slightly darker gray
      case 'testimonial':
        return '#f8fafc'; // Very light blue-gray
      default:
        return '#f3f4f6';
    }
  };

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        className
      )}
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: getBackgroundColor(),
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect
          width={width}
          height={height}
          fill="none"
        />
        
        {/* Logo or brand mark */}
        <g opacity="0.1">
          <path
            d="M400 250 L450 350 L350 350 Z"
            fill="#000"
            transform={`scale(${width / 800})`}
          />
        </g>
        
        {/* Text */}
        <text
          x="50%"
          y="50%"
          fontFamily="sans-serif"
          fontSize={width / 20}
          fontWeight="bold"
          fill="#9ca3af"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {displayText}
        </text>
      </svg>
    </div>
  );
}

// Helper function to generate a data URL for the placeholder
export function getPlaceholderImageUrl(
  type: 'product' | 'category' | 'testimonial' = 'product',
  id?: number | string,
  width = 800,
  height = 600
): string {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return '';
  }
  
  // Set background color
  let bgColor = '#f3f4f6';
  if (type === 'category') bgColor = '#e5e7eb';
  if (type === 'testimonial') bgColor = '#f8fafc';
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Draw a subtle pattern
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  
  // Draw grid lines
  const gridSize = 40;
  for (let i = 0; i < width; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  
  for (let i = 0; i < height; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
  
  // Draw text
  const text = id ? `${type.charAt(0).toUpperCase() + type.slice(1)} ${id}` : type;
  ctx.font = `bold ${width / 20}px sans-serif`;
  ctx.fillStyle = '#9ca3af';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Add a subtle brand mark
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.moveTo(width / 2, height / 2 - 50);
  ctx.lineTo(width / 2 + 50, height / 2 + 50);
  ctx.lineTo(width / 2 - 50, height / 2 + 50);
  ctx.closePath();
  ctx.fill();
  
  // Return data URL
  return canvas.toDataURL('image/png');
}
