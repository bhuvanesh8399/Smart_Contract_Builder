import {
  FilePenLine,
  Files,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { BrandLogo } from "../branding/BrandLogo";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/create-contract", label: "Create Contract", icon: FilePenLine },
  { to: "/contracts", label: "My Contracts", icon: Files },
  { to: "/risk-analysis", label: "Risk Analysis", icon: ShieldAlert },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="flex w-full flex-col border-b border-white/10 bg-slate-950 p-5 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <BrandLogo />

      <div className="mt-10 grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  isActive
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-300 hover:bg-white/5",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-4 lg:mt-auto">
        <p className="text-sm font-medium text-white">{user?.full_name}</p>
        <p className="mt-1 text-xs text-slate-400">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
