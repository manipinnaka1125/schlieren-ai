"use client";

import type { IconType } from "react-icons";
import { motion } from "framer-motion";
import { useOpenCV } from "../../../hooks/useOpenCV";

interface Props {
  icon?: IconType;
  title?: string;
  description?: string;
}

export default function OpenCVStatus({
  icon: Icon,
  title = "OpenCV runtime loading",
  description = "The browser is preparing the image engine. This only appears during the first load.",
}: Props) {
  const loaded = useOpenCV();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-200 ring-1 ring-blue-400/20">
            {Icon ? <Icon className="animate-spin" /> : <span className="h-3 w-3 rounded-full bg-blue-300" />}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200">
              OpenCV loader
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{loaded ? "Runtime ready" : title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{loaded ? "The browser OpenCV engine is ready and the analyzer can be used immediately." : description}</p>
          </div>
        </div>

        {!loaded ? (
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-400/80" />
          </div>
        ) : (
          <div className="mt-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200">
            Browser engine loaded
          </div>
        )}
      </motion.div>
    </section>
  );
}