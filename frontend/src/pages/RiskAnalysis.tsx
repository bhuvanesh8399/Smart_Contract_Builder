import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";

export default function RiskAnalysis() {
  return (
    <AppShell title="Risk Analysis">
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Protection Intelligence
          </p>
          <h3 className="mt-4 text-3xl font-semibold text-white">
            This page is ready for deeper visual analytics.
          </h3>
          <p className="mt-4 max-w-2xl text-slate-400">
            Next upgrade: add risk trend history, before vs after protection comparison, clause strength charts, and what-if simulation to show how a contract improves when the user adds stronger terms.
          </p>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Planned Widgets
          </p>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Before vs After Fixes
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Clause Strength Meter
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Risk Distribution by Category
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Payment Safety Simulator
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
