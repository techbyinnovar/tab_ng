'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface BlobImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  multiple?: boolean;
}

const BlobImageUpload: React.FC<BlobImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  multiple = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);

      // Only process the first file if multiple is false
      const filesToProcess = multiple ? Array.from(files) : [files[0]];

      for (const file of filesToProcess) {
        // Create a sanitized filename
        const sanitizedFilename = file.name
          .toLowerCase()
          .replace(/[^a-z0-9.]/g, '-');

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Upload to Vercel Blob via our API route
        const response = await fetch(`/api/uploadthing?filename=${encodeURIComponent(sanitizedFilename)}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const blob = await response.json();
        onChange(blob.url);

        // If not multiple, only process the first file
        if (!multiple) break;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            multiple={multiple}
            disabled={disabled || isUploading}
          />
          <Button
            type="button"
            onClick={handleUploadClick}
            variant="secondary"
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlobImageUpload;
