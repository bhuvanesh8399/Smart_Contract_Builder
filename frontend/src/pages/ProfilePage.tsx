import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="page-stack">
      <div className="card profile-card">
        <span className="eyebrow">Account</span>
        <h2>Profile</h2>

        <div className="profile-grid">
          <div>
            <p className="muted">Full Name</p>
            <h4>{user?.full_name}</h4>
          </div>
          <div>
            <p className="muted">Email</p>
            <h4>{user?.email}</h4>
          </div>
          <div>
            <p className="muted">Provider</p>
            <h4>{user?.auth_provider}</h4>
          </div>
          <div>
            <p className="muted">Joined</p>
            <h4>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
