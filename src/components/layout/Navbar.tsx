export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-sm font-semibold text-blue-300 ring-1 ring-blue-400/30">
            SA
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Schlieren AI</h1>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Browser-only engineering analysis
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#analyzer" className="transition hover:text-white">
            Analyzer
          </a>

          <a href="#report" className="transition hover:text-white">
            Report
          </a>
        </div>

        <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-200">
          Client demo ready
        </div>
      </div>
    </nav>
  );
}