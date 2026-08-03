import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const steps = [
  {
    title: "1. Open the upload page",
    description: "Use the upload page when you are ready to process a Schlieren image in the browser.",
  },
  {
    title: "2. Review the stages",
    description: "The analyzer shows the upload, processing progress, image stages, and metrics in one place.",
  },
  {
    title: "3. Export the summary",
    description: "When the image is processed, download the PDF report for review or sharing.",
  },
];

export default function AnalyzerPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-14 lg:py-18">
        <section className="mx-auto max-w-5xl text-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200">Analyzer overview</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
              Understand the workflow before you upload an image.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg lg:mx-0">
              This page explains the flow in plain terms so the upload page stays focused on the image processing tools.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/analyzer/upload"
                className="inline-flex min-w-60 items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-500"
              >
                Open upload page
              </Link>

              <Link
                href="/"
                className="inline-flex min-w-60 items-center justify-center rounded-2xl border border-white/10 px-8 py-4 text-base font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
              >
                Back home
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="rounded-4xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-slate-950/20">
                <h2 className="text-sm font-semibold text-white">{step.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}