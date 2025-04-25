import React, { useState, useCallback } from 'react';
import BinarizedImage from './BinarizedImage';
import { saveAs } from 'file-saver';
import {
  otsuThreshold,
  niblackThreshold,
  sauvolaThreshold,
  wolfThreshold,
  nickThreshold,
  trSinghThreshold,
  iSauvolaThreshold,
  wanThreshold
} from '../utils/binarizationAlgorithms';
import 'katex/dist/katex.min.css';

interface AlgorithmComparisonProps {
  originalImage: HTMLImageElement | null;
  isProcessing: boolean;
}

interface Algorithm {
  id: string;
  name: string;
  year: string;
  method: typeof otsuThreshold;
  description: string;
  formula: string;
  mathExplanation: string;
  pseudoCode: string;
  hasParameter?: boolean;
  defaultParameter?: number;
}

const algorithms: Algorithm[] = [
  {
    id: 'otsu',
    name: "Otsu's Method",
    year: '1979',
    method: otsuThreshold,
    description: 'A global thresholding technique that maximizes the between-class variance.',
    formula: '\\sigma^2_B(t) = \\omega_B(t)\\omega_F(t)[\\mu_B(t) - \\mu_F(t)]^2',
    mathExplanation: "Otsu's method calculates the optimal threshold by maximizing the between-class variance. The algorithm separates pixels into two classes (background and foreground) and finds the threshold that maximizes the variance between these classes.",
    pseudoCode: `function otsuThreshold(image):
  histogram = calculateHistogram(image)
  total = sum(histogram)
  
  maxVariance = 0
  bestThreshold = 0
  
  for t in 0 to 255:
    wB = sum(histogram[0:t])
    wF = total - wB
    
    if wB == 0 or wF == 0:
      continue
      
    mB = calculateMean(histogram, 0, t)
    mF = calculateMean(histogram, t, 255)
    
    variance = wB * wF * (mB - mF)²
    
    if variance > maxVariance:
      maxVariance = variance
      bestThreshold = t
      
  return bestThreshold`
  },
  {
    id: 'niblack',
    name: "Niblack's Method",
    year: '1986',
    method: niblackThreshold,
    description: "A local adaptive method using the pixel neighborhood's statistics.",
    formula: 'T(x,y) = m(x,y) + k \\cdot s(x,y)',
    mathExplanation: "Niblack's method calculates a threshold for each pixel based on the local mean and standard deviation in a sliding window. The k parameter controls the effect of standard deviation on the threshold.",
    pseudoCode: `function niblackThreshold(image, k):
  for each pixel (x,y) in image:
    window = getLocalWindow(image, x, y)
    mean = calculateMean(window)
    stdDev = calculateStdDev(window)
    
    threshold = mean + k * stdDev
    
    if pixel(x,y) > threshold:
      output(x,y) = white
    else:
      output(x,y) = black
      
  return output`,
    hasParameter: true,
    defaultParameter: -0.2
  },
  {
    id: 'sauvola',
    name: "Sauvola's Method",
    year: '1999',
    method: sauvolaThreshold,
    description: 'An improvement on Niblack that adapts to local contrast.',
    formula: 'T(x,y) = m(x,y) \\cdot \\left(1 + k \\cdot \\left(\\frac{s(x,y)}{R} - 1\\right)\\right)',
    mathExplanation: "Sauvola's method improves upon Niblack by normalizing the standard deviation with parameter R (typically 128) and using a multiplicative approach. This makes it more robust to background variations and noise.",
    pseudoCode: `function sauvolaThreshold(image, k, R):
  for each pixel (x,y) in image:
    window = getLocalWindow(image, x, y)
    mean = calculateMean(window)
    stdDev = calculateStdDev(window)
    
    threshold = mean * (1 + k * (stdDev/R - 1))
    
    if pixel(x,y) > threshold:
      output(x,y) = white
    else:
      output(x,y) = black
      
  return output`,
    hasParameter: true,
    defaultParameter: 0.5
  },
  {
    id: 'wolf',
    name: "Wolf's Method",
    year: '2003',
    method: wolfThreshold,
    description: 'Adapts to local contrast while considering global image characteristics.',
    formula: 'T(x,y) = m(x,y) - k \\cdot (1 - s(x,y)/s_{max}) \\cdot (m(x,y) - min_{val})',
    mathExplanation: "Wolf's method combines local and global image statistics. It uses the maximum standard deviation across the image (sMax) and the minimum intensity value to adapt the threshold calculation.",
    pseudoCode: `function wolfThreshold(image, k):
  minVal = findMinIntensity(image)
  sMax = findMaxStdDev(image)
  
  for each pixel (x,y) in image:
    window = getLocalWindow(image, x, y)
    mean = calculateMean(window)
    stdDev = calculateStdDev(window)
    
    threshold = mean - k * (1 - stdDev/sMax) * (mean - minVal)
    
    if pixel(x,y) > threshold:
      output(x,y) = white
    else:
      output(x,y) = black
      
  return output`,
    hasParameter: true,
    defaultParameter: 0.5
  },
  {
    id: 'nick',
    name: 'NICK Method',
    year: '2009',
    method: nickThreshold,
    description: 'Designed specifically for historical document binarization.',
    formula: 'T(x,y) = m(x,y) + k \\cdot \\sqrt{s^2(x,y) + m^2(x,y)}',
    mathExplanation: 'NICK (NI) combines the mean and standard deviation in a novel way, making it particularly effective for historical documents with varying background intensities.',
    pseudoCode: `function nickThreshold(image, k):
  for each pixel (x,y) in image:
    window = getLocalWindow(image, x, y)
    mean = calculateMean(window)
    variance = calculateVariance(window)
    
    threshold = mean + k * sqrt(variance + mean^2)
    
    if pixel(x,y) > threshold:
      output(x,y) = white
    else:
      output(x,y) = black
      
  return output`,
    hasParameter: true,
    defaultParameter: -0.2
  },
  {
    id: 'trsingh',
    name: 'T.R. Singh Method',
    year: '2011',
    method: trSinghThreshold,
    description: 'A local adaptive thresholding technique with bias parameter.',
    formula: 'T(x,y) = m(x,y) \\cdot \\left(1 + p \\cdot \\left(\\frac{s(x,y)}{R} - 1\\right)\\right)',
    mathExplanation: 'The T.R. Singh method introduces a bias parameter p that helps control the threshold adaptation based on local statistics, making it effective for documents with varying contrast.',
    pseudoCode: `function trSinghThreshold(image, p, R):
  for each pixel (x,y) in image:
    window = getLocalWindow(image, x, y)
    mean = calculateMean(window)
    stdDev = calculateStdDev(window)
    
    threshold = mean * (1 + p * (stdDev/R - 1))
    
    if pixel(x,y) > threshold:
      output(x,y) = white
    else:
      output(x,y) = black
      
  return output`,
    hasParameter: true,
    defaultParameter: 0.5
  },
  {
    id: 'isauvola',
    name: 'ISauvola Method',
    year: '2016',
    method: iSauvolaThreshold,
    description: 'Enhanced Sauvola with improved handling of light text on dark backgrounds.',
    formula: 'T(x,y) = m(x,y) \\cdot \\left(1 + k(1-\\alpha) \\cdot \\left(\\frac{s(x,y)}{R} - 1\\right)\\right)',
    mathExplanation: 'ISauvola enhances the original Sauvola method by introducing an adaptive contrast factor α that adjusts the threshold based on local-to-global contrast ratios.',
    pseudoCode: `function iSauvolaThreshold(image, k):
  globalStats = calculateGlobalStatistics(image)
  
  for each pixel (x,y) in image:
    window = getLocalWindow(image, x, y)
    mean = calculateMean(window)
    stdDev = calculateStdDev(window)
    
    alpha = min(1, stdDev/globalStats.stdDev)
    dynamicK = k * (1 - alpha)
    
    threshold = mean * (1 + dynamicK * (stdDev/R - 1))
    
    if pixel(x,y) > threshold:
      output(x,y) = white
    else:
      output(x,y) = black
      
  return output`,
    hasParameter: true,
    defaultParameter: 0.5
  },
  {
    id: 'wan',
    name: 'WAN Method',
    year: '2018',
    method: wanThreshold,
    description: 'Multi-stage approach with edge preservation and noise reduction.',
    formula: 'T(x,y) = m(x,y) \\cdot \\left(1 + k(1+E(x,y)) \\cdot \\left(\\frac{s(x,y)}{R} - 1\\right)\\right)',
    mathExplanation: 'The WAN method incorporates edge information E(x,y) into the threshold calculation, making it particularly effective at preserving text edges while reducing background noise.',
    pseudoCode: `function wanThreshold(image, k):
  edges = detectEdges(image)
  
  for each pixel (x,y) in image:
    window = getLocalWindow(image, x, y)
    mean = calculateMean(window)
    stdDev = calculateStdDev(window)
    
    edgeStrength = edges[x,y] / 255
    adaptiveK = k * (1 + edgeStrength)
    
    threshold = mean * (1 + adaptiveK * (stdDev/R - 1))
    
    if pixel(x,y) > threshold:
      output(x,y) = white
    else:
      output(x,y) = black
      
  return output`,
    hasParameter: true,
    defaultParameter: 0.5
  }
];

const MAX_CONCURRENT_ALGORITHMS = 3;

const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({ 
  originalImage, 
  isProcessing 
}) => {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<Set<string>>(
    new Set(['otsu', 'niblack', 'sauvola'])
  );

  const toggleAlgorithm = useCallback((algorithmId: string) => {
    setSelectedAlgorithms(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(algorithmId)) {
        newSelected.delete(algorithmId);
      } else if (newSelected.size < MAX_CONCURRENT_ALGORITHMS) {
        newSelected.add(algorithmId);
      } else {
        alert(`Maximum ${MAX_CONCURRENT_ALGORITHMS} algorithms can be selected at once to maintain performance.`);
      }
      return newSelected;
    });
  }, []);

  const handleDownload = async (algorithmId: string, result: ImageData) => {
    const canvas = document.createElement('canvas');
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.putImageData(result, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `binarized_${algorithmId}.png`);
      }
    });
  };

  return (
    <div>
      <div className="mb-6 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 p-4 rounded-lg shadow-md border border-stone-200 dark:border-stone-700">
        <h2 className="text-xl font-semibold mb-4 text-stone-800 dark:text-stone-100">Algorithm Selection</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
          Select up to {MAX_CONCURRENT_ALGORITHMS} algorithms to compare (for optimal performance)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {algorithms.map((algo) => (
            <label
              key={algo.id}
              className="flex items-center space-x-2 text-stone-700 dark:text-stone-300"
            >
              <input
                type="checkbox"
                checked={selectedAlgorithms.has(algo.id)}
                onChange={() => toggleAlgorithm(algo.id)}
                className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
              />
              <span>{algo.name} ({algo.year})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms
          .filter((algo) => selectedAlgorithms.has(algo.id))
          .map((algo) => (
            <BinarizedImage
              key={algo.id}
              originalImage={originalImage}
              algorithm={algo.id as any}
              title={algo.name}
              year={algo.year}
              description={algo.description}
              process={algo.method}
              isProcessing={isProcessing}
              formula={algo.formula}
              mathExplanation={algo.mathExplanation}
              pseudoCode={algo.pseudoCode}
              onDownload={handleDownload}
              hasParameter={algo.hasParameter}
              defaultParameter={algo.defaultParameter}
            />
          ))}
      </div>
    </div>
  );
};

export default AlgorithmComparison;