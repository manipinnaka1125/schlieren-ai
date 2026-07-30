"use client";

import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useMemo, useRef, useState } from "react";
import type { EngineeringInputs, EngineeringOutputs } from "@/types/engineering";
import type { UploadedImage } from "../../../types/image";
import type { ProcessingResult } from "@/types/processing";

interface Props {
  image: UploadedImage | null;
  result: ProcessingResult | null;
  inputs: EngineeringInputs;
  outputs: EngineeringOutputs;
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default function ReportPanel({
  image,
  result,
  inputs,
  outputs,
}: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const metrics = result?.success ? result.metrics : undefined;
  const images = result?.success ? result.images : undefined;

  const summaryDate = useMemo(() => formatDateTime(new Date()), []);

  const handleExport = async () => {
    if (!exportRef.current || !result?.success) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: "#020617",
        scale: 2,
        useCORS: true,
        onclone: (document) => {
          const exportNode = document.querySelector("[data-pdf-export='true']") as HTMLElement | null;

          if (!exportNode) return;

          exportNode.style.display = "block";
        },
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      const imageData = canvas.toDataURL("image/png");

      let heightLeft = imageHeight;
      let offsetY = 0;

      pdf.addImage(imageData, "PNG", 0, offsetY, imageWidth, imageHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        offsetY = heightLeft - imageHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, offsetY, imageWidth, imageHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`schlieren-ai-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section id="report" className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/30">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Report</h2>
          <p className="mt-1 text-sm text-slate-400">
            Download the summary after processing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={!result?.success || isExporting}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isExporting ? "Generating..." : "Download PDF"}
        </button>
      </div>

      <div ref={reportRef} className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300">
            Schlieren AI Analyzer
          </p>
          <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
            <p className="text-slate-300">Date: <span className="text-white">{summaryDate}</span></p>
            <p className="text-slate-300">Source: <span className="text-white">{image?.name ?? "No image loaded"}</span></p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm text-slate-400">Image Size</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {metrics ? `${metrics.width} × ${metrics.height}` : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm text-slate-400">Processing Time</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {metrics ? `${metrics.processingTimeMs} ms` : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm text-slate-400">Shock Length</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {metrics ? `${metrics.estimatedShockLength} px` : "—"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mach</p>
            <p className="mt-2 text-lg font-semibold text-white">{outputs.machNumber.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Density</p>
            <p className="mt-2 text-lg font-semibold text-white">{outputs.density.toFixed(3)} kg/m³</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Dynamic Pressure</p>
            <p className="mt-2 text-lg font-semibold text-white">{outputs.dynamicPressure.toFixed(0)} Pa</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          {images ? (
            Object.entries(images).map(([title, src]) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500">{title}</p>
                <div className="relative h-28 overflow-hidden rounded-xl bg-slate-900">
                  <Image
                    src={src}
                    alt={title}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-slate-400">
              Process an image to populate the report.
            </div>
          )}
        </div>
      </div>

      <div
        ref={exportRef}
        data-pdf-export="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: 0,
          width: "900px",
          padding: "24px",
          background: "#020617",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ border: "1px solid #1f2937", borderRadius: 18, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "#93c5fd" }}>
            Schlieren AI Analyzer
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, fontSize: 14, color: "#d1d5db" }}>
            <div>Date: <span style={{ color: "#ffffff" }}>{summaryDate}</span></div>
            <div>Source: <span style={{ color: "#ffffff" }}>{image?.name ?? "No image loaded"}</span></div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            ["Image Size", metrics ? `${metrics.width} × ${metrics.height}` : "—"],
            ["Processing Time", metrics ? `${metrics.processingTimeMs} ms` : "—"],
            ["Shock Length", metrics ? `${metrics.estimatedShockLength} px` : "—"],
          ].map(([label, value]) => (
            <div key={label} style={{ border: "1px solid #1f2937", borderRadius: 18, padding: 16, background: "#030712" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#94a3b8" }}>{label}</div>
              <div style={{ marginTop: 10, fontSize: 22, fontWeight: 700, color: "#ffffff" }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            ["Mach", outputs.machNumber.toFixed(2)],
            ["Density", `${outputs.density.toFixed(3)} kg/m³`],
            ["Dynamic Pressure", `${outputs.dynamicPressure.toFixed(0)} Pa`],
          ].map(([label, value]) => (
            <div key={label} style={{ border: "1px solid #1f2937", borderRadius: 18, padding: 16, background: "#030712" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#94a3b8" }}>{label}</div>
              <div style={{ marginTop: 10, fontSize: 20, fontWeight: 700, color: "#ffffff" }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {images ? (
            Object.entries(images).slice(0, 4).map(([title, src]) => (
              <div key={title} style={{ border: "1px solid #1f2937", borderRadius: 18, padding: 12, background: "#030712" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 8 }}>{title}</div>
                <img src={src} alt={title} style={{ width: "100%", height: 150, objectFit: "contain", borderRadius: 12, background: "#0f172a" }} />
              </div>
            ))
          ) : (
            <div style={{ border: "1px solid #1f2937", borderRadius: 18, padding: 16, background: "#030712", color: "#cbd5e1" }}>
              Process an image to populate the report.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}