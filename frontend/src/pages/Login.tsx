import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/branding/BrandLogo";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="grid min-h-screen bg-[linear-gradient(to_bottom,_#020617,_#0f172a)] md:grid-cols-2">
      <div className="hidden flex-col justify-between p-12 md:flex">
        <BrandLogo />
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
            Create • Protect • Customize
          </p>
          <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight text-white">
            Build safer freelancer contracts with premium protection.
          </h1>
          <p className="mt-5 max-w-lg text-slate-400">
            Log in to create contracts, detect risk, preview legal text, and manage your full agreement workspace.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Smart Contract Builder for Freelancers
        </p>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue to your workspace.
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <Input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>

          <button
            onClick={() => navigate("/signup")}
            className="mt-5 text-sm text-amber-300"
          >
            Need an account? Create one
          </button>
        </Card>
      </div>
    </div>
  );
}
