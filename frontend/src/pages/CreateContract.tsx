import { useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { RiskMeter } from "../components/risk/RiskMeter";
import { WarningList } from "../components/risk/WarningList";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input, TextArea } from "../components/ui/Input";
import { api } from "../lib/api";

type ContractPayload = {
  title: string;
  client_name: string;
  client_email: string;
  freelancer_name: string;
  project_scope: string;
  payment_terms: string;
  delivery_timeline: string;
  revisions: string;
  ownership_clause: string;
  confidentiality_clause: string;
  termination_clause: string;
  notes: string;
  status: string;
};

type PreviewResponse = { contract_text: string };
type RiskResponse = {
  risk_score: number;
  risk_level: string;
  warnings: string[];
  suggestions: string[];
  protection_breakdown: { name: string; score: number; status: string }[];
};

const initialForm: ContractPayload = {
  title: "",
  client_name: "",
  client_email: "",
  freelancer_name: "",
  project_scope: "",
  payment_terms: "",
  delivery_timeline: "",
  revisions: "",
  ownership_clause: "",
  confidentiality_clause: "",
  termination_clause: "",
  notes: "",
  status: "draft",
};

const stepLabels = [
  "Client",
  "Scope",
  "Payment",
  "Timeline",
  "Revisions",
  "Ownership",
  "Confidentiality",
  "Termination",
  "Review",
];

export default function CreateContract() {
  const [form, setForm] = useState<ContractPayload>(initialForm);
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState("");
  const [risk, setRisk] = useState<RiskResponse | null>(null);
  const [message, setMessage] = useState("");

  const progress = useMemo(() => ((step + 1) / stepLabels.length) * 100, [step]);

  const update = (key: keyof ContractPayload, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generatePreview = async () => {
    const data = await api.post<PreviewResponse>("/contracts/preview", form);
    setPreview(data.contract_text);
  };

  const analyzeRisk = async () => {
    const data = await api.post<RiskResponse>("/contracts/analyze-risk", {
      title: form.title,
      client_name: form.client_name,
      project_scope: form.project_scope,
      payment_terms: form.payment_terms,
      delivery_timeline: form.delivery_timeline,
      revisions: form.revisions,
      ownership_clause: form.ownership_clause,
      confidentiality_clause: form.confidentiality_clause,
      termination_clause: form.termination_clause,
    });
    setRisk(data);
  };

  const saveContract = async (status: "draft" | "finalized") => {
    setMessage("");
    await api.post("/contracts", { ...form, status });
    setMessage(status === "draft" ? "Draft saved successfully." : "Contract finalized successfully.");
  };

  return (
    <AppShell title="Create Contract">
      <div className="grid gap-6 xl:grid-cols-[280px,1.2fr,1fr]">
        <Card className="h-fit">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Wizard Steps
          </p>
          <div className="mt-6 space-y-2">
            {stepLabels.map((label, index) => (
              <button
                key={label}
                onClick={() => setStep(index)}
                className={[
                  "w-full rounded-2xl px-4 py-3 text-left text-sm transition",
                  step === index
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-950 text-slate-300 hover:bg-white/5",
                ].join(" ")}
              >
                {String(index + 1).padStart(2, "0")} {label}
              </button>
            ))}
          </div>
          <div className="mt-6 h-2 w-full rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-amber-300" style={{ width: `${progress}%` }} />
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Contract Details
          </p>

          <div className="mt-6 space-y-4">
            <Input
              placeholder="Contract title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Client name"
                value={form.client_name}
                onChange={(e) => update("client_name", e.target.value)}
              />
              <Input
                placeholder="Client email"
                value={form.client_email}
                onChange={(e) => update("client_email", e.target.value)}
              />
            </div>
            <Input
              placeholder="Freelancer name"
              value={form.freelancer_name}
              onChange={(e) => update("freelancer_name", e.target.value)}
            />
            <TextArea
              placeholder="Project scope"
              value={form.project_scope}
              onChange={(e) => update("project_scope", e.target.value)}
            />
            <TextArea
              placeholder="Payment terms"
              value={form.payment_terms}
              onChange={(e) => update("payment_terms", e.target.value)}
            />
            <TextArea
              placeholder="Delivery timeline"
              value={form.delivery_timeline}
              onChange={(e) => update("delivery_timeline", e.target.value)}
            />
            <TextArea
              placeholder="Revisions policy"
              value={form.revisions}
              onChange={(e) => update("revisions", e.target.value)}
            />
            <TextArea
              placeholder="Ownership / IP clause"
              value={form.ownership_clause}
              onChange={(e) => update("ownership_clause", e.target.value)}
            />
            <TextArea
              placeholder="Confidentiality clause"
              value={form.confidentiality_clause}
              onChange={(e) => update("confidentiality_clause", e.target.value)}
            />
            <TextArea
              placeholder="Termination clause"
              value={form.termination_clause}
              onChange={(e) => update("termination_clause", e.target.value)}
            />
            <TextArea
              placeholder="Additional notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={generatePreview}>
              Generate Preview
            </Button>
            <Button variant="secondary" onClick={analyzeRisk}>
              Analyze Risk
            </Button>
            <Button onClick={() => saveContract("draft")}>Save Draft</Button>
            <Button variant="primary" onClick={() => saveContract("finalized")}>
              Finalize
            </Button>
          </div>

          {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
        </Card>

        <div className="space-y-6">
          <Card>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Live Preview
            </p>
            <pre className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {preview || "Generate a preview to see the contract text here."}
            </pre>
          </Card>

          {risk ? (
            <>
              <RiskMeter riskScore={risk.risk_score} riskLevel={risk.risk_level} />
              <WarningList warnings={risk.warnings} />
              <Card>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Suggestions
                </p>
                <div className="mt-4 space-y-3">
                  {risk.suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
