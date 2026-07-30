import { processFileWithOpenCV, type StageCallback } from "@/services/opencvEngine";
import type { ProcessingResult } from "@/types/processing";
import type { OpenCVRuntime } from "@/types/opencv.d";
import { loadImageElement } from "@/utils/canvas";

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);

  try {
    return await loadImageElement(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function processImage(
  input: File | HTMLImageElement,
  onStage?: StageCallback
): Promise<ProcessingResult> {
  try {
    if (typeof window === "undefined") {
      return {
        success: false,
        error: "Image processing only runs in the browser.",
      };
    }

    const cv = (await Promise.resolve(window.cv)) as OpenCVRuntime | undefined;

    if (!cv?.Mat) {
      return {
        success: false,
        error: "OpenCV not loaded.",
      };
    }

    const image =
      input instanceof HTMLImageElement ? input : await loadImageFromFile(input);

    return processFileWithOpenCV(cv, image, onStage);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown processing error",
    };
  }
}