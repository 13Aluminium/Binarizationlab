import React, { useEffect, useRef, useState } from 'react';
import { Info, Download } from 'lucide-react';
import MathModal from './MathModal';

interface BinarizedImageProps {
  originalImage: HTMLImageElement | null;
  algorithm: string;
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
  onDownload?: (algorithm: string, result: ImageData) => void;
  hasParameter?: boolean;
  defaultParameter?: number;
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
  onDownload,
  hasParameter,
  defaultParameter,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showMath, setShowMath] = useState(false);
  const [parameter, setParameter] = useState(defaultParameter || 0);
  const [processedImage, setProcessedImage] = useState<ImageData | null>(null);

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
      const resultData = await process(imgData, canvas, parameter);
      
      if (resultData) {
        ctx.putImageData(resultData, 0, 0);
        setProcessedImage(resultData);
      }
    };

    processImage();
  }, [originalImage, process, parameter]);

  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParameter(parseFloat(e.target.value));
  };

  const handleDownload = () => {
    if (processedImage && onDownload) {
      onDownload(algorithm, processedImage);
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 flex items-center">
            {title}
            <span className="ml-2 text-xs font-normal text-stone-500 dark:text-stone-400">({year})</span>
          </h3>
          <div className="flex items-center space-x-2">
            {onDownload && (
              <button
                onClick={handleDownload}
                className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
                title="Download result"
              >
                <Download size={20} />
              </button>
            )}
            <button
              onClick={() => setShowMath(true)}
              className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
              title="Show mathematical explanation"
            >
              <Info size={20} />
            </button>
          </div>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{description}</p>
        
        {hasParameter && (
          <div className="mt-3">
            <label className="text-sm text-stone-600 dark:text-stone-400 flex items-center justify-between">
              Parameter value: {parameter.toFixed(2)}
              <input
                type="range"
                min={algorithm === 'niblack' || algorithm === 'nick' ? -0.5 : 0}
                max={algorithm === 'niblack' || algorithm === 'nick' ? 0 : 1}
                step="0.01"
                value={parameter}
                onChange={handleParameterChange}
                className="w-full mt-1 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>
      
      <div className="relative">
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 dark:bg-stone-800 bg-opacity-75 dark:bg-opacity-75">
            <div className="w-6 h-6 border-2 border-stone-600 dark:border-stone-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="relative bg-white dark:bg-stone-900 aspect-video flex items-center justify-center overflow-hidden border-y border-stone-200 dark:border-stone-700">
          {originalImage ? (
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-full object-contain" 
            />
          ) : (
            <div className="text-stone-400 dark:text-stone-600 text-sm">No image to process</div>
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