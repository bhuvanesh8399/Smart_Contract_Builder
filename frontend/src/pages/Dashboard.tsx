import { useEffect, useState } from "react";
import { Activity, FileText, ShieldAlert, Wallet } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { api } from "../lib/api";

type Contract = {
  id: number;
  title: string;
  client_name: string;
  status: string;
  risk_level: string;
  updated_at: string;
};

type DashboardSummary = {
  total_contracts: number;
  drafts_count: number;
  finalized_count: number;
  risky_contracts_count: number;
  recent_contracts: Contract[];
};

const statConfig = [
  { key: "total_contracts", label: "Total Contracts", icon: FileText },
  { key: "drafts_count", label: "Drafts", icon: Activity },
  { key: "finalized_count", label: "Finalized", icon: Wallet },
  { key: "risky_contracts_count", label: "High Risk", icon: ShieldAlert },
] as const;

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api.get<DashboardSummary>("/dashboard/summary").then(setData).catch(console.error);
  }, []);

  return (
    <AppShell title="Dashboard">
      <section className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
        <Card className="overflow-hidden p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
            Freelancer Protection Workspace
          </p>
          <h3 className="mt-4 max-w-2xl text-4xl font-semibold text-white">
            Create safer contracts, detect risk early, and manage every client agreement in one place.
          </h3>
          <p className="mt-4 max-w-2xl text-slate-400">
            A premium contract command center for freelancers who want stronger payment protection, clearer scope, and cleaner legal structure.
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Workspace Health
          </p>
          <div className="mt-6 text-6xl font-semibold text-white">
            {data ? Math.max(0, 100 - data.risky_contracts_count * 15) : "--"}
          </div>
          <p className="mt-2 text-sm text-slate-400">Protection readiness score</p>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statConfig.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.key}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{item.label}</p>
                <Icon className="h-5 w-5 text-amber-300" />
              </div>
              <div className="mt-4 text-4xl font-semibold text-white">
                {data ? data[item.key] : "--"}
              </div>
            </Card>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr,1fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Recent Contracts
          </p>
          <div className="mt-5 space-y-3">
            {data?.recent_contracts?.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.client_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    text={item.status}
                    tone={item.status === "finalized" ? "success" : "default"}
                  />
                  <Badge
                    text={item.risk_level}
                    tone={
                      item.risk_level === "HIGH"
                        ? "danger"
                        : item.risk_level === "MEDIUM"
                          ? "warning"
                          : "success"
                    }
                  />
                </div>
              </div>
            ))}

            {!data?.recent_contracts?.length ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-6 text-slate-400">
                No contracts yet. Start by creating your first protected contract.
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Protection Notes
          </p>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Use advance payment terms to reduce payment risk.
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Define exact deliverables to avoid vague scope disputes.
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Add termination terms before sending any final agreement.
            </div>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
