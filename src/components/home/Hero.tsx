"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-7xl px-6 py-14 lg:py-18">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl text-center"
      >
        <div className="inline-flex items-center justify-center rounded-full border border-blue-500/15 bg-blue-500/8 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-blue-100">
          Browser-only Schlieren workflow
        </div>

        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
          Clean pages for overview, guidance, and image processing.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
          Start on the home page, open the analyzer for context, and then use the upload page to inspect stages,
          metrics, and exportable results locally in the browser.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/analyzer"
            className="inline-flex min-w-44 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-500"
          >
            Explore analyzer
            <FaArrowRight />
          </Link>
          <Link
            href="/analyzer/upload"
            className="inline-flex min-w-44 items-center justify-center rounded-2xl border border-white/10 px-8 py-4 text-base font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
          >
            Go to upload
          </Link>
        </div>
      </motion.div>
    </section>
  );
}