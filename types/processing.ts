export interface ProcessedImages {
  original: string;
  grayscale?: string;
  blurred?: string;
  edges?: string;
}

export interface ProcessingResult {
  success: boolean;
  images?: ProcessedImages;
  error?: string;
}