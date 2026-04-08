import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    freelancer_type: "Designer",
  });
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(to_bottom,_#020617,_#0f172a)] p-6">
      <Card className="w-full max-w-xl p-8">
        <h2 className="text-3xl font-semibold text-white">Create account</h2>
        <p className="mt-2 text-sm text-slate-400">
          Start building safer client agreements.
        </p>

        <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="md:col-span-2">
            <Input
              placeholder="Full name"
              value={form.full_name}
              onChange={(e) => onChange("full_name", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => onChange("password", e.target.value)}
          />
          <Input
            placeholder="Freelancer type"
            value={form.freelancer_type}
            onChange={(e) => onChange("freelancer_type", e.target.value)}
          />

          {error ? <p className="text-sm text-red-300 md:col-span-2">{error}</p> : null}

          <div className="md:col-span-2">
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-5 text-sm text-amber-300"
        >
          Already have an account? Log in
        </button>
      </Card>
    </div>
  );
}
