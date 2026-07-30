import {
  CANNY_THRESHOLD_HIGH,
  CANNY_THRESHOLD_LOW,
  GAUSSIAN_KERNEL_SIZE,
  GAUSSIAN_SIGMA,
  HOUGH_MAX_LINE_GAP,
  HOUGH_MIN_LINE_LENGTH,
  HOUGH_THRESHOLD,
  MIN_SHOCK_LINE_LENGTH,
  MORPH_KERNEL_SIZE,
  PROCESSING_STAGES,
} from "@/constants/processing";
import { createCanvas } from "@/utils/canvas";
import { matToDataUrl } from "@/utils/opencv";
import type { OpenCVMat, OpenCVRuntime } from "@/types/opencv.d";
import type {
  ChartDataPoint,
  ProcessedImages,
  ProcessingMetrics,
  ProcessingResult,
} from "@/types/processing";

export interface EngineResult {
  images: ProcessedImages;
  metrics: ProcessingMetrics;
  histogram: ChartDataPoint[];
  edgeDistribution: ChartDataPoint[];
}

export type StageCallback = (stage: string, index: number) => void;

function buildHistogram(gray: OpenCVMat): ChartDataPoint[] {
  const bins = Array.from({ length: 16 }, () => 0);

  for (let index = 0; index < gray.data.length; index += 1) {
    const binIndex = Math.min(15, Math.floor(gray.data[index] / 16));
    bins[binIndex] += 1;
  }

  return bins.map((value, index) => ({
    name: `${index * 16}-${index * 16 + 15}`,
    value,
  }));
}

function buildEdgeDistribution(edges: OpenCVMat): ChartDataPoint[] {
  const quadrants = [
    { name: "Top-Left", value: 0 },
    { name: "Top-Right", value: 0 },
    { name: "Bottom-Left", value: 0 },
    { name: "Bottom-Right", value: 0 },
  ];

  const halfRows = Math.floor(edges.rows / 2);
  const halfCols = Math.floor(edges.cols / 2);

  for (let row = 0; row < edges.rows; row += 1) {
    for (let col = 0; col < edges.cols; col += 1) {
      const index = row * edges.cols + col;
      if (edges.data[index] === 0) continue;

      const top = row < halfRows;
      const left = col < halfCols;

      if (top && left) {
        quadrants[0].value += 1;
      } else if (top && !left) {
        quadrants[1].value += 1;
      } else if (!top && left) {
        quadrants[2].value += 1;
      } else {
        quadrants[3].value += 1;
      }
    }
  }

  return quadrants;
}

function detectShockWaves(
  cv: OpenCVRuntime,
  original: OpenCVMat,
  edges: OpenCVMat
): { image: OpenCVMat; shockLength: number; shockAngleDeg: number } {
  const overlay = original.clone();
  const lines = new cv.Mat();

  cv.HoughLinesP(
    edges,
    lines,
    1,
    Math.PI / 180,
    HOUGH_THRESHOLD,
    HOUGH_MIN_LINE_LENGTH,
    HOUGH_MAX_LINE_GAP
  );

  let totalLength = 0;
  let dominantAngle = 45;
  let longestLine = 0;
  const lineColor = new cv.Scalar(0, 255, 0, 255);

  for (let index = 0; index < lines.rows; index += 1) {
    const x1 = lines.data32S[index * 4];
    const y1 = lines.data32S[index * 4 + 1];
    const x2 = lines.data32S[index * 4 + 2];
    const y2 = lines.data32S[index * 4 + 3];

    const length = Math.hypot(x2 - x1, y2 - y1);
    if (length < MIN_SHOCK_LINE_LENGTH) continue;

    totalLength += length;

    const angle = Math.abs((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI);
    if (length > longestLine) {
      longestLine = length;
      dominantAngle = Math.max(5, Math.min(85, angle));
    }

    cv.line(overlay, new cv.Point(x1, y1), new cv.Point(x2, y2), lineColor, 2);
  }

  lines.delete();

  return {
    image: overlay,
    shockLength: totalLength,
    shockAngleDeg: dominantAngle,
  };
}

export function runOpenCVEngine(
  cv: OpenCVRuntime,
  image: HTMLImageElement,
  onStage?: StageCallback
): EngineResult {
  const startTime = performance.now();
  const canvas = createCanvas(
    Math.max(1, image.naturalWidth),
    Math.max(1, image.naturalHeight)
  );

  const reportStage = (index: number) => {
    onStage?.(PROCESSING_STAGES[index], index);
  };

  reportStage(0);
  const src = cv.imread(image);
  const width = src.cols;
  const height = src.rows;

  const images: Partial<ProcessedImages> = {
    original: image.src,
  };

  reportStage(1);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  images.grayscale = matToDataUrl(cv, gray, canvas);

  reportStage(2);
  const blurred = new cv.Mat();
  cv.GaussianBlur(
    gray,
    blurred,
    new cv.Size(GAUSSIAN_KERNEL_SIZE, GAUSSIAN_KERNEL_SIZE),
    GAUSSIAN_SIGMA
  );
  images.blurred = matToDataUrl(cv, blurred, canvas);

  reportStage(3);
  const equalized = new cv.Mat();
  cv.equalizeHist(blurred, equalized);
  images.equalized = matToDataUrl(cv, equalized, canvas);

  reportStage(4);
  const edges = new cv.Mat();
  cv.Canny(equalized, edges, CANNY_THRESHOLD_LOW, CANNY_THRESHOLD_HIGH);
  images.edges = matToDataUrl(cv, edges, canvas);

  reportStage(5);
  const morphed = new cv.Mat();
  const morphKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(MORPH_KERNEL_SIZE, MORPH_KERNEL_SIZE)
  );
  cv.morphologyEx(edges, morphed, cv.MORPH_CLOSE, morphKernel);
  morphKernel.delete();
  images.morphed = matToDataUrl(cv, morphed, canvas);

  reportStage(6);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    morphed,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  const contourOverlay = src.clone();
  cv.drawContours(
    contourOverlay,
    contours,
    -1,
    new cv.Scalar(255, 160, 0, 255),
    2
  );
  images.contours = matToDataUrl(cv, contourOverlay, canvas);

  const contourCount = contours.size();

  reportStage(7);
  const shockResult = detectShockWaves(cv, src, morphed);
  images.shockWave = matToDataUrl(cv, shockResult.image, canvas);

  const edgeCount = cv.countNonZero(morphed);
  const histogram = buildHistogram(gray);
  const edgeDistribution = buildEdgeDistribution(morphed);
  const processingTimeMs = Math.round(performance.now() - startTime);

  const metrics: ProcessingMetrics = {
    width,
    height,
    edgeCount,
    contourCount,
    processingTimeMs,
    estimatedShockLength: Math.round(shockResult.shockLength),
    shockAngleDeg: Math.round(shockResult.shockAngleDeg * 10) / 10,
  };

  src.delete();
  gray.delete();
  blurred.delete();
  equalized.delete();
  edges.delete();
  morphed.delete();
  contourOverlay.delete();
  contours.delete();
  hierarchy.delete();
  shockResult.image.delete();

  return {
    images: images as ProcessedImages,
    metrics,
    histogram,
    edgeDistribution,
  };
}

export function processFileWithOpenCV(
  cv: OpenCVRuntime,
  image: HTMLImageElement,
  onStage?: StageCallback
): ProcessingResult {
  try {
    const engineResult = runOpenCVEngine(cv, image, onStage);

    return {
      success: true,
      images: engineResult.images,
      metrics: engineResult.metrics,
      histogram: engineResult.histogram,
      edgeDistribution: engineResult.edgeDistribution,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "OpenCV processing failed.",
    };
  }
}
