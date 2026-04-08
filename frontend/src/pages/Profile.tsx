import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <AppShell title="Profile">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Account Details
          </p>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div>
              <p className="text-slate-500">Full Name</p>
              <p className="mt-1 text-white">{user?.full_name}</p>
            </div>
            <div>
              <p className="text-slate-500">Email</p>
              <p className="mt-1 text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-slate-500">Freelancer Type</p>
              <p className="mt-1 text-white">{user?.freelancer_type || "Not set"}</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Future Settings
          </p>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Default advance payment %
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Default revision policy
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Default confidentiality clause
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              Default termination notice period
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
