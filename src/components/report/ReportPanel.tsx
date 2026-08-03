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
        scrollX: 0,
        scrollY: 0,
        windowWidth: exportRef.current.scrollWidth,
        windowHeight: exportRef.current.scrollHeight,
      });

      // Initialize A4 PDF (Portrait, mm)
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imageData = canvas.toDataURL("image/png");

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Additional pages if the content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`schlieren-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section id="report" className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/25">
      {/* Visible Controls Header */}
      <div className="mb-5 flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="mx-auto max-w-2xl sm:mx-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-blue-200">Report</p>
          <h2 className="mt-2 text-lg font-semibold text-white md:text-xl">Download a clean summary</h2>
          <p className="mt-1 text-sm text-slate-400">
            Download the summary report after processing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={!result?.success || isExporting}
          className="mx-auto rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 sm:mx-0"
        >
          {isExporting ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {/* Visible On-Screen UI */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
          <p className="text-[11px] uppercase tracking-[0.35em] text-blue-300">
            Schlieren analysis report
          </p>
          <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
            <p className="text-slate-300">Date: <span className="text-white">{summaryDate}</span></p>
            <p className="text-slate-300">Source: <span className="text-white">{image?.name ?? "No image loaded"}</span></p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Image Size</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {metrics ? `${metrics.width} × ${metrics.height}` : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Processing Time</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {metrics ? `${metrics.processingTimeMs} ms` : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Shock Length</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {metrics ? `${metrics.estimatedShockLength} px` : "—"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mach</p>
            <p className="mt-2 text-lg font-semibold text-white">{outputs.machNumber.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Density</p>
            <p className="mt-2 text-lg font-semibold text-white">{outputs.density.toFixed(3)} kg/m³</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Dynamic Pressure</p>
            <p className="mt-2 text-lg font-semibold text-white">{outputs.dynamicPressure.toFixed(0)} Pa</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          {images ? (
            Object.entries(images).map(([title, src]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">{title}</p>
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
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-slate-400">
              Process an image to populate the report.
            </div>
          )}
        </div>
      </div>

      {/* Dedicated Clean Off-Screen PDF Template Target */}
      <div
        ref={exportRef}
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: "800px",
          padding: "32px",
          backgroundColor: "#020617",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* PDF Header */}
        <div style={{ border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 16, background: "#0f172a" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "#93c5fd", fontWeight: 700 }}>
            Schlieren Analysis Report
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10, fontSize: 13, color: "#94a3b8" }}>
            <div>Date: <span style={{ color: "#ffffff", fontWeight: 600 }}>{summaryDate}</span></div>
            <div>Source: <span style={{ color: "#ffffff", fontWeight: 600 }}>{image?.name ?? "No image loaded"}</span></div>
          </div>
        </div>

        {/* Processing Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            ["Image Size", metrics ? `${metrics.width} × ${metrics.height}` : "—"],
            ["Processing Time", metrics ? `${metrics.processingTimeMs} ms` : "—"],
            ["Shock Length", metrics ? `${metrics.estimatedShockLength} px` : "—"],
          ].map(([label, value]) => (
            <div key={label} style={{ border: "1px solid #1e293b", borderRadius: 12, padding: 14, background: "#090d16" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b" }}>{label}</div>
              <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700, color: "#ffffff" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Engineering Outputs Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            ["Mach Number", outputs.machNumber.toFixed(2)],
            ["Density", `${outputs.density.toFixed(3)} kg/m³`],
            ["Dynamic Pressure", `${outputs.dynamicPressure.toFixed(0)} Pa`],
          ].map(([label, value]) => (
            <div key={label} style={{ border: "1px solid #1e293b", borderRadius: 12, padding: 14, background: "#090d16" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b" }}>{label}</div>
              <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700, color: "#60a5fa" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Dynamic Processed Images Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {images &&
            Object.entries(images).map(([title, src]) => (
              <div key={title} style={{ border: "1px solid #1e293b", borderRadius: 12, padding: 10, background: "#090d16" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", marginBottom: 6 }}>
                  {title}
                </div>
                <img
                  src={src}
                  alt={title}
                  style={{ width: "100%", height: "130px", objectFit: "contain", borderRadius: 8, background: "#020617" }}
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}