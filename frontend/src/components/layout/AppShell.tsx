import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.10),_transparent_22%),linear-gradient(to_bottom,_#020617,_#0f172a)]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <main className="min-h-screen flex-1 p-5 md:p-8">
          <Topbar title={title} />
          <div className="mt-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
