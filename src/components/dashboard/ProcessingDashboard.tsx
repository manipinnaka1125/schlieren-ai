"use client";

import { motion } from "framer-motion";
import type { ProcessingResult } from "@/types/processing";
import ProcessingCharts from "@/components/charts/ProcessingCharts";

interface Props {
  result: ProcessingResult | null;
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/20">
      <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function ProcessingDashboard({ result }: Props) {
  if (!result?.success || !result.metrics) {
    return (
      <section
        className="border border-dashed border-white/10 p-6 text-center text-slate-300 sm:text-left"
        style={{ borderRadius: "1.75rem", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-blue-200">
          Dashboard preview
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white md:text-xl">
          Metrics will show after upload.
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-400">
          Upload an image to view the measurements and charts.
        </p>
      </section>
    );
  }

  const { metrics, histogram = [], edgeDistribution = [] } = result;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div
        className="border border-white/10 p-5 text-center backdrop-blur sm:text-left"
        style={{ borderRadius: "1.75rem", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-blue-200">
          Live dashboard
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          Analysis summary
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Image Width" value={`${metrics.width}px`} />
        <MetricCard label="Image Height" value={`${metrics.height}px`} />
        <MetricCard label="Number of Edges" value={`${metrics.edgeCount}`} />
        <MetricCard label="Number of Contours" value={`${metrics.contourCount}`} />
        <MetricCard label="Processing Time" value={`${metrics.processingTimeMs} ms`} />
        <MetricCard label="Estimated Shock Length" value={`${metrics.estimatedShockLength}px`} />
      </div>

      <ProcessingCharts histogram={histogram} edgeDistribution={edgeDistribution} />
    </motion.section>
  );
}