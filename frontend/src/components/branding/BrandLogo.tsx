import { ShieldCheck } from "lucide-react";

export function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/30 bg-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.12)]">
        <ShieldCheck className="h-5 w-5 text-amber-300" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
          Premium Legal-Tech
        </p>
        <h1 className="text-lg font-semibold text-white">
          Smart Contract Builder
        </h1>
      </div>
    </div>
  );
}
