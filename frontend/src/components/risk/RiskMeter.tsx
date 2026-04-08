export function RiskMeter({
  riskScore,
  riskLevel,
}: {
  riskScore: number;
  riskLevel: string;
}) {
  const angle = Math.min(100, Math.max(0, riskScore)) * 1.8;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <p className="mb-1 text-xs uppercase tracking-[0.3em] text-slate-400">
        Contract Risk
      </p>
      <div className="relative mx-auto mt-4 flex h-44 w-44 items-center justify-center rounded-full border border-white/10 bg-slate-950">
        <div
          className="absolute h-1 w-16 origin-left rounded-full bg-amber-300"
          style={{ transform: `rotate(${angle - 90}deg)` }}
        />
        <div className="text-center">
          <div className="text-4xl font-semibold text-white">
            {Math.round(riskScore)}
          </div>
          <div className="mt-1 text-sm text-slate-400">{riskLevel}</div>
        </div>
      </div>
    </div>
  );
}
