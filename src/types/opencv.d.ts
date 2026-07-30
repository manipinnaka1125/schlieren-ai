export {};

declare global {
  interface Window {
    cv: OpenCVRuntime;
  }
}

export interface OpenCVMat {
  delete(): void;
  clone(): OpenCVMat;
  copyTo(dst: OpenCVMat): void;
  rows: number;
  cols: number;
  data: Uint8Array;
  data32S: Int32Array;
}

export interface OpenCVRuntime {
  Mat: new (...args: unknown[]) => OpenCVMat;
  MatVector: new () => {
    size(): number;
    get(index: number): OpenCVMat;
    delete(): void;
  };
  Size: new (width: number, height: number) => {
    width: number;
    height: number;
  };
  Point: new (x: number, y: number) => {
    x: number;
    y: number;
  };
  Scalar: new (
    v0: number,
    v1?: number,
    v2?: number,
    v3?: number
  ) => unknown;
  imread: (source: HTMLImageElement | HTMLCanvasElement) => OpenCVMat;
  imshow: (canvas: HTMLCanvasElement, mat: OpenCVMat) => void;
  cvtColor: (src: OpenCVMat, dst: OpenCVMat, code: number) => void;
  GaussianBlur: (
    src: OpenCVMat,
    dst: OpenCVMat,
    ksize: { width: number; height: number },
    sigmaX: number,
    sigmaY?: number
  ) => void;
  equalizeHist: (src: OpenCVMat, dst: OpenCVMat) => void;
  Canny: (
    src: OpenCVMat,
    dst: OpenCVMat,
    threshold1: number,
    threshold2: number
  ) => void;
  morphologyEx: (
    src: OpenCVMat,
    dst: OpenCVMat,
    op: number,
    kernel: OpenCVMat
  ) => void;
  getStructuringElement: (
    shape: number,
    ksize: { width: number; height: number }
  ) => OpenCVMat;
  findContours: (
    src: OpenCVMat,
    contours: {
      size(): number;
      get(index: number): OpenCVMat;
      delete(): void;
    },
    hierarchy: OpenCVMat,
    mode: number,
    method: number
  ) => void;
  drawContours: (
    image: OpenCVMat,
    contours: {
      size(): number;
      get(index: number): OpenCVMat;
      delete(): void;
    },
    contourIdx: number,
    color: unknown,
    thickness: number
  ) => void;
  HoughLinesP: (
    src: OpenCVMat,
    lines: OpenCVMat,
    rho: number,
    theta: number,
    threshold: number,
    minLineLength: number,
    maxLineGap: number
  ) => void;
  countNonZero: (src: OpenCVMat) => number;
  line: (
    img: OpenCVMat,
    pt1: { x: number; y: number },
    pt2: { x: number; y: number },
    color: unknown,
    thickness: number
  ) => void;
  COLOR_RGBA2GRAY: number;
  COLOR_GRAY2RGBA: number;
  COLOR_RGBA2RGB: number;
  MORPH_CLOSE: number;
  MORPH_RECT: number;
  RETR_EXTERNAL: number;
  CHAIN_APPROX_SIMPLE: number;
  CV_32SC2: number;
  CV_32SC4: number;
  onRuntimeInitialized?: () => void;
}
