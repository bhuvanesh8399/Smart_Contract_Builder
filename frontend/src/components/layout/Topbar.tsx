import { Bell, Search } from "lucide-react";

export function Topbar({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Workspace
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 md:flex">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            placeholder="Search contracts"
            className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
        <button className="rounded-2xl border border-white/10 bg-slate-900 p-3 text-slate-300 hover:bg-white/5">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
