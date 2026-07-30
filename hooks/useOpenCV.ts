"use client";

import { OPENCV_SCRIPT_PATH } from "@/constants/processing";
import { useEffect, useState } from "react";

export function useOpenCV() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cv = window.cv as any;

    if (cv?.Mat) {
      queueMicrotask(() => setIsReady(true));
      return;
    }

    if (cv?.then) {
      cv.then((cvRuntime: any) => {
        if (cvRuntime?.Mat) {
          queueMicrotask(() => setIsReady(true));
        }
      });
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${OPENCV_SCRIPT_PATH}"]`
    ) as HTMLScriptElement | null;

    if (existingScript) {
      const check = setInterval(() => {
        const cv = window.cv as any;

        if (cv?.then) {
          cv.then((cvRuntime: any) => {
            if (cvRuntime?.Mat) {
              queueMicrotask(() => setIsReady(true));
              clearInterval(check);
            }
          });
        }
      }, 100);

      return () => clearInterval(check);
    }

    const script = document.createElement("script");
    script.src = OPENCV_SCRIPT_PATH;
    script.async = true;

    script.onload = () => {
      const cv = window.cv as any;

      if (cv?.then) {
        cv.then((cvRuntime: any) => {
          if (cvRuntime?.Mat) {
            queueMicrotask(() => setIsReady(true));
          }
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  return isReady;
}