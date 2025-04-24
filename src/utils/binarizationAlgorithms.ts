/**
 * Utility functions for image binarization
 */

// Convert image data to grayscale
export const toGrayscale = (imgData: ImageData): Uint8ClampedArray => {
  const data = imgData.data;
  const grayscale = new Uint8ClampedArray(imgData.width * imgData.height);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    grayscale[i / 4] = gray;
  }
  
  return grayscale;
};

// Apply threshold to grayscale image
export const applyThreshold = (
  grayscale: Uint8ClampedArray,
  threshold: number,
  width: number,
  height: number
): ImageData => {
  const result = new ImageData(width, height);
  const data = result.data;
  
  for (let i = 0; i < grayscale.length; i++) {
    const gray = grayscale[i];
    const value = gray > threshold ? 255 : 0;
    const pixelIndex = i * 4;
    data[pixelIndex] = value;     // R
    data[pixelIndex + 1] = value; // G
    data[pixelIndex + 2] = value; // B
    data[pixelIndex + 3] = 255;   // A
  }
  
  return result;
};

export const otsuThreshold = async (
  imgData: ImageData,
  canvas: HTMLCanvasElement
): Promise<ImageData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const grayscale = toGrayscale(imgData);
      
      const histogram = new Array(256).fill(0);
      for (let i = 0; i < grayscale.length; i++) {
        histogram[Math.round(grayscale[i])]++;
      }
      
      const total = grayscale.length;
      let sumB = 0;
      let wB = 0;
      let wF = 0;
      let maxVariance = 0;
      let threshold = 0;
      
      const sum = histogram.reduce((acc, val, idx) => acc + idx * val, 0);
      
      for (let t = 0; t < 256; t++) {
        wB += histogram[t];
        if (wB === 0) continue;
        
        wF = total - wB;
        if (wF === 0) break;
        
        sumB += t * histogram[t];
        
        const mB = sumB / wB;
        const mF = (sum - sumB) / wF;
        
        const variance = wB * wF * (mB - mF) * (mB - mF);
        
        if (variance > maxVariance) {
          maxVariance = variance;
          threshold = t;
        }
      }
      
      const result = applyThreshold(grayscale, threshold, imgData.width, imgData.height);
      resolve(result);
    }, 100);
  });
};

export const niblackThreshold = async (
  imgData: ImageData,
  canvas: HTMLCanvasElement,
  k: number = -0.2
): Promise<ImageData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const grayscale = toGrayscale(imgData);
      const width = imgData.width;
      const height = imgData.height;
      
      const result = new ImageData(width, height);
      const data = result.data;
      
      const windowSize = Math.max(3, Math.ceil(Math.min(width, height) / 30));
      const halfWindow = Math.floor(windowSize / 2);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const startX = Math.max(0, x - halfWindow);
          const endX = Math.min(width - 1, x + halfWindow);
          const startY = Math.max(0, y - halfWindow);
          const endY = Math.min(height - 1, y + halfWindow);
          
          let sum = 0;
          let squaredSum = 0;
          let count = 0;
          
          for (let wy = startY; wy <= endY; wy++) {
            for (let wx = startX; wx <= endX; wx++) {
              const pixel = grayscale[wy * width + wx];
              sum += pixel;
              squaredSum += pixel * pixel;
              count++;
            }
          }
          
          const mean = sum / count;
          const variance = squaredSum / count - mean * mean;
          const stdDev = Math.sqrt(variance);
          
          const threshold = mean + k * stdDev;
          
          const pixelIndex = (y * width + x) * 4;
          const pixelValue = grayscale[y * width + x] > threshold ? 255 : 0;
          
          data[pixelIndex] = pixelValue;
          data[pixelIndex + 1] = pixelValue;
          data[pixelIndex + 2] = pixelValue;
          data[pixelIndex + 3] = 255;
        }
      }
      
      resolve(result);
    }, 100);
  });
};

export const sauvolaThreshold = async (
  imgData: ImageData,
  canvas: HTMLCanvasElement,
  k: number = 0.5
): Promise<ImageData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const grayscale = toGrayscale(imgData);
      const width = imgData.width;
      const height = imgData.height;
      
      const result = new ImageData(width, height);
      const data = result.data;
      
      const windowSize = Math.max(3, Math.ceil(Math.min(width, height) / 30));
      const halfWindow = Math.floor(windowSize / 2);
      const R = 128;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const startX = Math.max(0, x - halfWindow);
          const endX = Math.min(width - 1, x + halfWindow);
          const startY = Math.max(0, y - halfWindow);
          const endY = Math.min(height - 1, y + halfWindow);
          
          let sum = 0;
          let squaredSum = 0;
          let count = 0;
          
          for (let wy = startY; wy <= endY; wy++) {
            for (let wx = startX; wx <= endX; wx++) {
              const pixel = grayscale[wy * width + wx];
              sum += pixel;
              squaredSum += pixel * pixel;
              count++;
            }
          }
          
          const mean = sum / count;
          const variance = squaredSum / count - mean * mean;
          const stdDev = Math.sqrt(variance);
          
          const threshold = mean * (1 + k * (stdDev / R - 1));
          
          const pixelIndex = (y * width + x) * 4;
          const pixelValue = grayscale[y * width + x] > threshold ? 255 : 0;
          
          data[pixelIndex] = pixelValue;
          data[pixelIndex + 1] = pixelValue;
          data[pixelIndex + 2] = pixelValue;
          data[pixelIndex + 3] = 255;
        }
      }
      
      resolve(result);
    }, 100);
  });
};