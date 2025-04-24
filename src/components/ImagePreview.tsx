import React, { useRef, useEffect } from 'react';

interface ImagePreviewProps {
  image: HTMLImageElement | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw original image
    ctx.drawImage(image, 0, 0);
  }, [image]);

  if (!image) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
      <h2 className="text-lg font-semibold mb-3">Original Image</h2>
      <div className="bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[300px] object-contain"
        />
      </div>
    </div>
  );
};

export default ImagePreview;