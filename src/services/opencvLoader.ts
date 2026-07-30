import { OPENCV_SCRIPT_PATH } from "@/constants/processing";
import type { OpenCVRuntime } from "@/types/opencv.d";

let loadPromise: Promise<OpenCVRuntime> | null = null;

function waitForRuntime(): Promise<OpenCVRuntime> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("OpenCV initialization timed out"));
    }, 120_000);

    const checkReady = () => {
      if (window.cv?.Mat) {
        clearTimeout(timeout);
        resolve(window.cv);
      }
    };

    if (window.cv?.Mat) {
      clearTimeout(timeout);
      resolve(window.cv);
      return;
    }

    if (window.cv) {
      window.cv.onRuntimeInitialized = () => {
        checkReady();
      };
    }

    const interval = setInterval(() => {
      if (window.cv?.Mat) {
        clearInterval(interval);
        checkReady();
      }
    }, 100);
  });
}

export function loadOpenCV(): Promise<OpenCVRuntime> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("OpenCV can only load in the browser"));
  }

  if (window.cv?.Mat) {
    return Promise.resolve(window.cv);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${OPENCV_SCRIPT_PATH}"]`
    );

    if (existingScript) {
      waitForRuntime().then(resolve).catch(reject);
      return;
    }

    const script = document.createElement("script");
    script.src = OPENCV_SCRIPT_PATH;
    script.async = true;

    script.onload = () => {
      waitForRuntime().then(resolve).catch(reject);
    };

    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load OpenCV script"));
    };

    document.body.appendChild(script);
  });

  return loadPromise;
}

export function isOpenCVReady(): boolean {
  return typeof window !== "undefined" && Boolean(window.cv?.Mat);
}
