import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (image: HTMLImageElement) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match('image.*')) {
        alert('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          onImageUpload(img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ease-in-out ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {isDragging ? 'Drop to upload' : 'Upload an image'}
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        Drag and drop an image, or click to browse
      </p>
      <div className="mt-4">
        <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
          Select image
        </label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          accept="image/*"
          disabled={isProcessing}
        />
      </div>
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;