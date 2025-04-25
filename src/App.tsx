import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import AlgorithmComparison from './components/AlgorithmComparison';
import { FileImage, Moon, Sun } from 'lucide-react';

function App() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleImageUpload = async (image: HTMLImageElement) => {
    setIsProcessing(true);
    setTimeout(() => {
      setOriginalImage(image);
      setIsProcessing(false);
    }, 100);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-900 dark:to-stone-800 transition-colors duration-200">
      <header className="bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileImage className="h-8 w-8 text-stone-700 dark:text-stone-300" />
              <h1 className="ml-2 text-2xl font-semibold text-stone-800 dark:text-stone-100">Image Binarization Lab</h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 p-6 rounded-lg shadow-md border border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold mb-3 text-stone-800 dark:text-stone-100">Upload an Image</h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
            Compare three classic image binarization algorithms: Otsu, Niblack, and Sauvola.
            Upload an image to see the differences between these thresholding techniques.
          </p>
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            isProcessing={isProcessing} 
          />
          
          {originalImage && (
            <div className="mt-4 text-sm text-stone-500 dark:text-stone-400">
              <p>Image dimensions: {originalImage.width} × {originalImage.height} px</p>
            </div>
          )}
        </div>

        {originalImage && (
          <>
            <ImagePreview image={originalImage} />
            <AlgorithmComparison 
              originalImage={originalImage}
              isProcessing={isProcessing}
            />
          </>
        )}

        {originalImage && (
          <div className="mt-10 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg p-4 shadow-md">
            <h3 className="text-stone-800 dark:text-stone-100 font-medium mb-2">About Image Binarization</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Image binarization converts a grayscale image into a binary (black and white) image. 
              It's commonly used in document image processing, optical character recognition (OCR), 
              and pattern recognition to separate foreground from background.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-b from-stone-100 to-stone-50 dark:from-stone-900 dark:to-stone-800 border-t border-stone-200 dark:border-stone-700 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-stone-500 dark:text-stone-400 text-sm text-center">
            Image Binarization Lab 
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;