import { FaCloudUploadAlt, FaFilePdf, FaShieldAlt, FaWaveSquare } from "react-icons/fa";

const features = [
  {
    title: "Browser only",
    description: "All processing happens locally in the browser with OpenCV.js.",
    icon: FaCloudUploadAlt,
  },
  {
    title: "Simple flow",
    description: "Home, analyzer, and upload pages keep the workflow easy to follow.",
    icon: FaWaveSquare,
  },
  {
    title: "Report export",
    description: "Review the measurements and download a PDF summary when ready.",
    icon: FaFilePdf,
  },
  {
    title: "Private by design",
    description: "Images stay in the browser, so there is no backend upload step.",
    icon: FaShieldAlt,
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 pb-18 pt-4 lg:pt-8">
      <div className="mx-auto mb-8 max-w-4xl text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold text-white md:text-4xl">What the website does</h2>
        </div>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          The site starts with a short overview, moves to the analyzer page for guidance,
          and then opens the upload page where the image pipeline runs entirely in the browser.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group rounded-3xl border border-white/10 bg-white/3 p-5 text-center transition hover:-translate-y-1 hover:border-blue-400/25 hover:bg-blue-500/6"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-xl text-blue-300 ring-1 ring-blue-400/20">
                <Icon />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>

              <p className="text-sm leading-7 text-slate-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}