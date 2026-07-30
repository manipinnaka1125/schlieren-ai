"use client";

import type { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";
import OpenCVStatus from "./OpenCVStatus";
import { useOpenCV } from "../../../hooks/useOpenCV";

interface Props {
  children: ReactNode;
}

export default function OpenCVLoader({ children }: Props) {
  const loaded = useOpenCV();

  if (!loaded) {
    return <OpenCVStatus icon={FaSpinner} title="Preparing analysis engine" description="Loading the browser OpenCV runtime. This happens locally and only once per session." />;
  }

  return <>{children}</>;
}