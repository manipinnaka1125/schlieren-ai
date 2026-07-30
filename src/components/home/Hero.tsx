"use client";

import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-blue-200">
          Browser-only engineering analysis
        </p>

        <h2 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
          Upload, process, and review Schlieren results.
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
          The app keeps the workflow simple: choose an image, view the processed
          output, check the metrics, and export the report.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#analyzer"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500"
          >
            Open Analyzer
            <FaArrowRight />
          </a>
        </div>
      </motion.div>
    </section>
  );
}