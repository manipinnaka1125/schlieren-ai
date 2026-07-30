import type { OpenCVMat, OpenCVRuntime } from "@/types/opencv.d";

export function matToDataUrl(
  cv: OpenCVRuntime,
  mat: OpenCVMat,
  canvas: HTMLCanvasElement
): string {
  cv.imshow(canvas, mat);
  return canvas.toDataURL("image/png");
}

export function getCv(): OpenCVRuntime {
  if (typeof window === "undefined" || !window.cv?.Mat) {
    throw new Error("OpenCV is not loaded");
  }
  return window.cv;
}
