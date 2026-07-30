"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartDataPoint } from "@/types/processing";

interface Props {
  histogram: ChartDataPoint[];
  edgeDistribution: ChartDataPoint[];
}

const edgeColors = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444"];

export default function ProcessingCharts({
  histogram,
  edgeDistribution,
}: Props) {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/30">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Intensity Histogram
            </h3>
            <p className="text-sm text-slate-400">
              Grayscale distribution across 16 bins.
            </p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogram}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#94a3b8" interval={2} />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderColor: "#334155",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/30">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Edge Distribution
            </h3>
            <p className="text-sm text-slate-400">
              Edge density by image quadrant.
            </p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={edgeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderColor: "#334155",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {edgeDistribution.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={edgeColors[index % edgeColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}