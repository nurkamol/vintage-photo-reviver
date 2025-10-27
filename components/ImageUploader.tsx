import React, { useCallback } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  currentImage?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImage }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="w-full aspect-square bg-background rounded-lg flex items-center justify-center">
      <label
        htmlFor="file-upload"
        className="relative w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent hover:border-purple-400 transition-colors duration-300"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {currentImage ? (
          <img src={currentImage} alt="Uploaded preview" className="w-full h-full object-contain rounded-md" />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <UploadIcon className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="font-semibold text-foreground">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP</p>
          </div>
        )}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          key={Date.now()}
        />
      </label>
    </div>
  );
};