import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/create-contract", label: "Create Contract" },
  { to: "/my-contracts", label: "My Contracts" },
  { to: "/risk-analysis", label: "Risk Analysis" },
  { to: "/profile", label: "Profile" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-badge">SC</div>
        <div>
          <h1>Smart Contract</h1>
          <p>Freelancer Protection Platform</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
