import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import OpenCVLoader from "@/components/processing/OpenCVLoader";
import AnalysisWorkspace from "@/components/dashboard/AnalysisWorkspace";

export default function UploadPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-14 lg:py-18">
        <section className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200">Upload workspace</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
            Upload one image and review everything in one clean flow.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            The processing happens locally in the browser. After upload, you can inspect the stages, metrics, and report without leaving the page.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/analyzer"
              className="inline-flex min-w-60 items-center justify-center rounded-2xl border border-white/10 px-8 py-4 text-base font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
            >
              Back to analyzer
            </Link>

            <Link
              href="/"
              className="inline-flex min-w-60 items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-500"
            >
              Home page
            </Link>
          </div>
        </section>

        <OpenCVLoader>
          <AnalysisWorkspace />
        </OpenCVLoader>
      </main>

      <Footer />
    </>
  );
}