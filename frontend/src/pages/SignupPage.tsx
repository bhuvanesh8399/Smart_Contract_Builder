import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await signup({
        full_name: fullName,
        email,
        password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel hero-panel">
        <span className="eyebrow">Build safer freelance deals</span>
        <h1>Create your account</h1>
        <p>
          Start creating contracts with guided structure, risk detection, and a
          cleaner way to protect your scope and payments.
        </p>
      </div>

      <form className="auth-panel form-panel" onSubmit={handleSubmit}>
        <h2>Get started</h2>
        <p className="muted">Create your account in a minute.</p>

        {error ? <div className="alert error">{error}</div> : null}

        <label>
          <span>Full Name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Bhuvi"
            required
          />
        </label>

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
            placeholder="Minimum 6 characters"
            required
          />
        </label>

        <label>
          <span>Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
          />
        </label>

        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Create Account"}
        </button>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
