import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { api } from "../lib/api";

type Contract = {
  id: number;
  title: string;
  client_name: string;
  status: string;
  risk_score: number;
  risk_level: string;
  updated_at: string;
};

export default function MyContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);

  const loadContracts = async () => {
    const data = await api.get<Contract[]>("/contracts");
    setContracts(data);
  };

  const deleteContract = async (id: number) => {
    await api.delete(`/contracts/${id}`);
    await loadContracts();
  };

  useEffect(() => {
    loadContracts().catch(console.error);
  }, []);

  return (
    <AppShell title="My Contracts">
      <Card>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Contract Library
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-950">
              <tr className="text-sm text-slate-400">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id} className="border-t border-white/10 text-sm text-white">
                  <td className="px-4 py-4">{contract.title}</td>
                  <td className="px-4 py-4">{contract.client_name}</td>
                  <td className="px-4 py-4">
                    <Badge
                      text={contract.status}
                      tone={contract.status === "finalized" ? "success" : "default"}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span>{Math.round(contract.risk_score)}</span>
                      <Badge
                        text={contract.risk_level}
                        tone={
                          contract.risk_level === "HIGH"
                            ? "danger"
                            : contract.risk_level === "MEDIUM"
                              ? "warning"
                              : "success"
                        }
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {new Date(contract.updated_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      variant="danger"
                      className="gap-2"
                      onClick={() => deleteContract(contract.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!contracts.length ? (
            <div className="border-t border-white/10 p-6 text-slate-400">No contracts yet.</div>
          ) : null}
        </div>
      </Card>
    </AppShell>
  );
}
