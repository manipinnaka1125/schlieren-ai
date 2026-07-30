"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { computeEngineeringOutputs } from "@/utils/engineering";
import { DEFAULT_ENGINEERING_INPUTS } from "@/constants/engineering";
import { processImage } from "@/services/imageProcessor";
import type { EngineeringInputs, EngineeringOutputs } from "@/types/engineering";
import type { ProcessingResult } from "@/types/processing";
import type { UploadedImage } from "../../../types/image";
import ImageUploader from "../upload/ImageUploader";
import ImageGallery from "../processing/ImageGallery";
import ProcessingDashboard from "./ProcessingDashboard";
import EngineeringPanel from "./EngineeringPanel";
import ReportPanel from "../report/ReportPanel";

const defaultInputs: EngineeringInputs = {
  temperature: DEFAULT_ENGINEERING_INPUTS.temperature,
  pressure: DEFAULT_ENGINEERING_INPUTS.pressure,
  gasConstant: DEFAULT_ENGINEERING_INPUTS.gasConstant,
  gamma: DEFAULT_ENGINEERING_INPUTS.gamma,
};

export default function AnalysisWorkspace() {
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStage, setActiveStage] = useState("Waiting for image");
  const [inputs, setInputs] = useState<EngineeringInputs>(defaultInputs);

  const handleImageSelected = (image: UploadedImage | null) => {
    setSelectedImage(image);

    if (!image) {
      setResult(null);
      setIsProcessing(false);
      setActiveStage("Waiting for image");
    }
  };

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    let cancelled = false;

    const runProcessing = async () => {
      setIsProcessing(true);
      setActiveStage("Loading image");

      const processingResult = await processImage(selectedImage.file, (stage) => {
        if (!cancelled) {
          setActiveStage(stage);
        }
      });

      if (cancelled) {
        return;
      }

      setResult(processingResult);
      setIsProcessing(false);
      setActiveStage(processingResult.success ? "Processing complete" : "Processing failed");
    };

    void runProcessing();

    return () => {
      cancelled = true;
    };
  }, [selectedImage]);

  const engineeringOutputs: EngineeringOutputs = useMemo(() => {
    const shockAngle = result?.success && result.metrics ? result.metrics.shockAngleDeg : 45;
    return computeEngineeringOutputs(inputs, shockAngle);
  }, [inputs, result]);

  const stageImages = result?.success && result.images
    ? [
        { title: "Original", src: result.images.original },
        { title: "Grayscale", src: result.images.grayscale },
        { title: "Blurred", src: result.images.blurred },
        { title: "Equalized", src: result.images.equalized },
        { title: "Edges", src: result.images.edges },
        { title: "Morphology", src: result.images.morphed },
        { title: "Contours", src: result.images.contours },
        { title: "Shock Wave", src: result.images.shockWave },
      ]
    : [];

  const statusTone = result?.success
    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
    : result?.error
      ? "border-rose-400/20 bg-rose-500/10 text-rose-200"
      : isProcessing
        ? "border-amber-400/20 bg-amber-500/10 text-amber-200"
        : "border-blue-400/20 bg-blue-500/10 text-blue-200";

  return (
    <section id="analyzer" className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200">
              Browser-only OpenCV pipeline
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
              Analysis workspace
            </h2>
          </div>

          <div className={`rounded-2xl border px-4 py-3 text-sm ${statusTone}`}>
            <p className="text-xs uppercase tracking-[0.3em] text-current/75">
              Status
            </p>
            <p className="mt-1 font-semibold text-white">{activeStage}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        <div className="space-y-8">
          <ImageUploader onImageSelected={handleImageSelected} />

          <ProcessingDashboard result={result} />

          {stageImages.length > 0 ? <ImageGallery images={stageImages} /> : null}
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <EngineeringPanel
            inputs={inputs}
            outputs={engineeringOutputs}
            onChange={(key, value) => {
              setInputs((current) => ({ ...current, [key]: value }));
            }}
          />

          <ReportPanel
            image={selectedImage}
            result={result}
            inputs={inputs}
            outputs={engineeringOutputs}
          />
        </div>
      </div>
    </section>
  );
}