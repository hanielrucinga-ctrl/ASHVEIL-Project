import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { setAdminToken } from "@/lib/admin-client";
import { adminLogin } from "@/lib/admin-guard";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    try {
      const res = await adminLogin({ data: { email, password } });
      setAdminToken(res.token);
      navigate({ to: "/admin" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not sign in";
      setError(msg.includes("Unauthorized") ? "Invalid email or password" : msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-fg">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
        <img src="/logo.png" alt="Ashveil" className="mx-auto h-auto w-full max-w-[220px] outline-none" />
        <h1 className="text-center text-xl uppercase tracking-[0.22em]">Studio</h1>
        <p className="text-center text-sm text-muted">Products, stock, and money. Staff only.</p>
        <div>
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="admin-pass">Password</Label>
          <Input
            id="admin-pass"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            defaultValue={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Checking…" : "Enter studio"}
        </Button>
        <Link to="/" className="block text-center text-[11px] uppercase tracking-[0.16em] underline underline-offset-4">
          Back to store
        </Link>
      </form>
    </main>
  );
}
