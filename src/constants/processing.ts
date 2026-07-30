export const OPENCV_SCRIPT_PATH = "/opencv/opencv.js";

export const CANNY_THRESHOLD_LOW = 50;
export const CANNY_THRESHOLD_HIGH = 150;
export const GAUSSIAN_KERNEL_SIZE = 5;
export const GAUSSIAN_SIGMA = 1.4;
export const MORPH_KERNEL_SIZE = 3;
export const HOUGH_THRESHOLD = 80;
export const HOUGH_MIN_LINE_LENGTH = 50;
export const HOUGH_MAX_LINE_GAP = 10;
export const MIN_SHOCK_LINE_LENGTH = 40;

export const PROCESSING_STAGES = [
  "Loading Image",
  "Grayscale Conversion",
  "Gaussian Blur",
  "Histogram Equalization",
  "Canny Edge Detection",
  "Morphological Operations",
  "Contour Detection",
  "Shock Wave Detection",
] as const;
