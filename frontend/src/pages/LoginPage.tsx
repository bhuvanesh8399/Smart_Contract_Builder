import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel hero-panel">
        <span className="eyebrow">Freelancer Protection Platform</span>
        <h1>Login to your workspace</h1>
        <p>
          Create stronger agreements, avoid risky clauses, and manage all your
          contracts from one premium dashboard.
        </p>
      </div>

      <form className="auth-panel form-panel" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="muted">Use your email and password to continue.</p>

        {error ? <div className="alert error">{error}</div> : null}

        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </label>

        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>

        <p className="auth-footer-text">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </div>
  );
}
