import { TriangleAlert } from "lucide-react";

export function WarningList({ warnings }: { warnings: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">
        Risk Warnings
      </p>
      <div className="space-y-3">
        {warnings.length === 0 ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            No major warnings detected.
          </div>
        ) : (
          warnings.map((warning) => (
            <div
              key={warning}
              className="flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200"
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{warning}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
