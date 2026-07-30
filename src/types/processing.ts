export interface ProcessedImages {
  original: string;
  grayscale: string;
  blurred: string;
  equalized: string;
  edges: string;
  morphed: string;
  contours: string;
  shockWave: string;
}

export interface ProcessingMetrics {
  width: number;
  height: number;
  edgeCount: number;
  contourCount: number;
  processingTimeMs: number;
  estimatedShockLength: number;
  shockAngleDeg: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ProcessingResult {
  success: boolean;
  images?: ProcessedImages;
  metrics?: ProcessingMetrics;
  histogram?: ChartDataPoint[];
  edgeDistribution?: ChartDataPoint[];
  error?: string;
}
