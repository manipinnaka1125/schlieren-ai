import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 md:h-18 md:flex-row md:items-center md:justify-between md:py-0">
        <Link href="/" className="flex items-center gap-3 self-center md:self-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-sm font-semibold text-blue-300 ring-1 ring-blue-400/25">
            SA
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-base font-semibold text-white md:text-lg">Schlieren Analyzer</h1>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Browser-only workflow</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>

          <Link href="/analyzer" className="transition hover:text-white">
            Analyzer
          </Link>

          <Link href="/analyzer/upload" className="transition hover:text-white">
            Upload
          </Link>
        </div>

        <Link
          href="/analyzer/upload"
          className="self-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-blue-200 transition hover:border-blue-400/40 hover:bg-blue-500/15 md:self-auto"
        >
          Open upload
        </Link>
      </div>
    </nav>
  );
}