'use client';

import { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  multiple = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use a more flexible type for Cloudinary's callback
  const onUpload = (results: { info?: { secure_url?: string } | string }) => {
    if (results?.info && typeof results.info === 'object' && 'secure_url' in results.info) {
      // Ensure secure_url is defined before passing it
      if (results.info.secure_url) {
        onChange(results.info.secure_url);
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      {(multiple || value.length === 0) && (
        <CldUploadWidget 
          onUpload={onUpload} 
          uploadPreset="ml_default"
          options={{
            maxFiles: multiple ? 10 : 1,
            sources: ['local', 'url', 'camera'],
            resourceType: 'image',
          }}
        >
          {({ open }) => {
            const onClick = () => {
              open();
            };

            return (
              <Button
                type="button"
                disabled={disabled}
                variant="secondary"
                onClick={onClick}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
};

export default ImageUpload;
