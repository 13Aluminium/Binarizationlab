import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import MathModal from './MathModal';

interface BinarizedImageProps {
  originalImage: HTMLImageElement | null;
  algorithm: 'otsu' | 'niblack' | 'sauvola';
  title: string;
  year: string;
  description: string;
  process: (
    imgData: ImageData,
    canvas: HTMLCanvasElement,
    k?: number
  ) => Promise<ImageData | null>;
  isProcessing: boolean;
  formula: string;
  mathExplanation: string;
  pseudoCode: string;
}


const BinarizedImage: React.FC<BinarizedImageProps> = ({
  originalImage,
  algorithm,
  title,
  year,
  description,
  process,
  isProcessing,
  formula,
  mathExplanation,
  pseudoCode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showMath, setShowMath] = useState(false);
  const [kValue, setKValue] = useState(algorithm === 'niblack' ? -0.2 : 0.5);

  useEffect(() => {
    const processImage = async () => {
      const canvas = canvasRef.current;
      if (!canvas || !originalImage) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      ctx.drawImage(originalImage, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const resultData = await process(imgData, canvas, kValue);
      
      if (resultData) {
        ctx.putImageData(resultData, 0, 0);
      }
    };

    processImage();
  }, [originalImage, process, kValue]);

  const handleKValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKValue(parseFloat(e.target.value));
  };

  return (
    <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-800 flex items-center">
            {title}
            <span className="ml-2 text-xs font-normal text-stone-500">({year})</span>
          </h3>
          <button
            onClick={() => setShowMath(true)}
            className="text-stone-500 hover:text-stone-700 transition-colors"
            title="Show mathematical explanation"
          >
            <Info size={20} />
          </button>
        </div>
        <p className="text-sm text-stone-600 mt-1">{description}</p>
        
        {(algorithm === 'niblack' || algorithm === 'sauvola') && (
          <div className="mt-3">
            <label className="text-sm text-stone-600 flex items-center justify-between">
              k value: {kValue.toFixed(2)}
              <input
                type="range"
                min={algorithm === 'niblack' ? -0.5 : 0}
                max={algorithm === 'niblack' ? 0 : 1}
                step="0.01"
                value={kValue}
                onChange={handleKValueChange}
                className="w-full mt-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>
      
      <div className="relative">
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 bg-opacity-75">
            <div className="w-6 h-6 border-2 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="relative bg-white aspect-video flex items-center justify-center overflow-hidden border-y border-stone-200">
          {originalImage ? (
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-full object-contain" 
            />
          ) : (
            <div className="text-stone-400 text-sm">No image to process</div>
          )}
        </div>
      </div>

      <MathModal
        isOpen={showMath}
        onClose={() => setShowMath(false)}
        title={`${title} - Mathematical Details`}
        formula={formula}
        explanation={mathExplanation}
        pseudoCode={pseudoCode}
      />
    </div>
  );
};

export default BinarizedImage;