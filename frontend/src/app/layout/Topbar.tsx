import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div>
        <h2>Welcome back{user ? `, ${user.full_name}` : ""}</h2>
        <p>Build safer freelance agreements with clarity and confidence.</p>
      </div>

      <div className="topbar-actions">
        <div className="user-pill">{user?.email}</div>
        <button className="button secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
