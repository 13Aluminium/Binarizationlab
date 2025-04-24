import React from 'react';
import BinarizedImage from './BinarizedImage';
import { otsuThreshold, niblackThreshold, sauvolaThreshold } from '../utils/binarizationAlgorithms';
import 'katex/dist/katex.min.css';

interface AlgorithmComparisonProps {
  originalImage: HTMLImageElement | null;
  isProcessing: boolean;
}

const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({ 
  originalImage, 
  isProcessing 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-stone-800">Binarization Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BinarizedImage
          originalImage={originalImage}
          algorithm="otsu"
          title="Otsu's Method"
          year="1979"
          description="A global thresholding technique that maximizes the between-class variance."
          process={otsuThreshold}
          isProcessing={isProcessing}
          formula="\sigma^2_B(t) = \omega_B(t)\omega_F(t)[\mu_B(t) - \mu_F(t)]^2"
          mathExplanation="Otsu's method calculates the optimal threshold by maximizing the between-class variance. The algorithm separates pixels into two classes (background and foreground) and finds the threshold that maximizes the variance between these classes."
          pseudoCode={`function otsuThreshold(image):
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
      
  return bestThreshold`}
        />
        
        <BinarizedImage
          originalImage={originalImage}
          algorithm="niblack"
          title="Niblack's Method"
          year="1986"
          description="A local adaptive method using the pixel neighborhood's statistics."
          process={niblackThreshold}
          isProcessing={isProcessing}
          formula="T(x,y) = m(x,y) + k \cdot s(x,y)"
          mathExplanation="Niblack's method calculates a threshold for each pixel based on the local mean and standard deviation in a sliding window. The k parameter controls the effect of standard deviation on the threshold."
          pseudoCode={`function niblackThreshold(image, k):
  for each pixel (x,y) in image:
    window = getLocalWindow(image, x, y)
    mean = calculateMean(window)
    stdDev = calculateStdDev(window)
    
    threshold = mean + k * stdDev
    
    if pixel(x,y) > threshold:
      output(x,y) = white
    else:
      output(x,y) = black
      
  return output`}
        />
        
        <BinarizedImage
          originalImage={originalImage}
          algorithm="sauvola"
          title="Sauvola's Method"
          year="1999"
          description="An improvement on Niblack that adapts to local contrast."
          process={sauvolaThreshold}
          isProcessing={isProcessing}
          formula="T(x,y) = m(x,y) \cdot \left(1 + k \cdot \left(\frac{s(x,y)}{R} - 1\right)\right)"
          mathExplanation="Sauvola's method improves upon Niblack by normalizing the standard deviation with parameter R (typically 128) and using a multiplicative approach. This makes it more robust to background variations and noise."
          pseudoCode={`function sauvolaThreshold(image, k, R):
  for each pixel (x,y) in image:
    window = getLocalWindow(image, x, y)
    mean = calculateMean(window)
    stdDev = calculateStdDev(window)
    
    threshold = mean * (1 + k * (stdDev/R - 1))
    
    if pixel(x,y) > threshold:
      output(x,y) = white
    else:
      output(x,y) = black
      
  return output`}
        />
      </div>
    </div>
  );
};

export default AlgorithmComparison;