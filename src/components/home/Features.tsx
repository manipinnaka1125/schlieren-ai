import { FaCloudUploadAlt, FaBrain, FaFilePdf, FaWaveSquare } from "react-icons/fa";

const features = [
  {
    title: "Upload Images",
    description:
      "Upload Schlieren images in JPG, PNG, TIFF or BMP format.",
    icon: FaCloudUploadAlt,
  },
  {
    title: "AI Detection",
    description:
      "Detect shock waves and estimate aerodynamic parameters.",
    icon: FaBrain,
  },
  {
    title: "PDF Report",
    description:
      "Generate a professional engineering report instantly.",
    icon: FaFilePdf,
  },
  {
    title: "Workflow Clarity",
    description:
      "A guided client-friendly flow keeps the experience easy to follow.",
    icon: FaWaveSquare,
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 pb-24 pt-8">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
            Built for review
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            What the application delivers
          </h2>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-slate-400 md:text-right">
          The UI is intentionally structured for a final-year demo: clear entry points,
          legible metrics, stage-by-stage outputs, and a report export path.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-blue-400/30 hover:bg-blue-500/[0.06]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-blue-300 ring-1 ring-blue-400/20">
                <Icon />
              </div>

              <h3 className="mb-3 text-xl font-semibold text-white">
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