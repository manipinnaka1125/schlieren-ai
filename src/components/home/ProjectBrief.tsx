import { FaCheckCircle, FaClipboardList, FaFilePdf } from "react-icons/fa";

const requirements = [
  "Next.js 15 App Router frontend",
  "React 19 and TypeScript",
  "Browser-only OpenCV.js processing",
  "No backend, database, or auth",
  "Upload, process, charts, and PDF export",
  "Professional engineering dashboard UI",
];

const completed = [
  "Landing page, navbar, and footer",
  "Drag-and-drop image upload with preview",
  "OpenCV.js loader and browser runtime wiring",
  "Multi-stage image processing pipeline",
  "Dashboard cards, charts, and engineering panel",
  "PDF report generation in the browser",
];

function SectionList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/3 p-6">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-300">
            <FaCheckCircle className="mt-1 shrink-0 text-emerald-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectBrief() {
  return (
    <section id="brief" className="mx-auto max-w-7xl px-6 py-4 lg:py-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
            Requirements and status
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            What the client needs to know
          </h2>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-slate-400 md:text-right">
          This summary keeps the scope visible and shows what is already built without
          adding extra UI clutter.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionList title="Project requirements" items={requirements} />
        <SectionList title="Completed work" items={completed} />
      </div>
    </section>
  );
}