"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Mail, Lock, Chrome } from "lucide-react";
import { toast } from "sonner";
import { apiRequest, setToken } from "@/lib/api";
import { dashboardPath, signIn, signOut } from "@/lib/auth-client";
import type { AppUser } from "@/lib/types";
import { AuthFooter, AuthShell } from "@/components/auth-shell";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finish = async () => {
    const result = await apiRequest<{ token: string; user: AppUser }>("/api/session/token", { method: "POST" });
    setToken(result.token);
    toast.success(`Welcome back, ${result.user.name.split(" ")[0]}.`);
    router.push(dashboardPath(result.user.role));
    router.refresh();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message || "Sign in failed.");
      await finish();
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error(message);
      if (message.toLowerCase().includes("blocked")) await signOut();
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    setError("");
    try {
      //const result = await signIn.social({ provider: "google", callbackURL: "/dashboard" });
      const result = await signIn.social({ provider: "google", callbackURL: "http://localhost:3000/dashboard" });
      if (result.error) throw new Error(result.error.message || "Google sign in failed.");
      const url = (result.data as { url?: string } | null)?.url;
      if (url) window.location.href = url;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your salon appointments and payments."
      footer={<AuthFooter prompt="New to SalonBook?" href="/auth/sign-up" label="Create an account" />}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-field" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={17} />
            <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="input-field !pl-11" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label-field" htmlFor="password">Password</label>
            <Link href="/auth/sign-up" className="mb-1.5 text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={17} />
            <input id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="input-field !pl-11" />
          </div>
        </div>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="animate-spin" size={17} /> : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest muted-text">
        <span className="h-px flex-1 bg-rose-100 dark:bg-slate-800" /> or <span className="h-px flex-1 bg-rose-100 dark:bg-slate-800" />
      </div>

      <button type="button" onClick={google} disabled={loading} className="btn-secondary w-full">
        <Chrome size={17} /> Continue with Google
      </button>
      <p className="mt-5 text-center text-xs muted-text">
        The first account created on a fresh database becomes the salon administrator.
      </p>
    </AuthShell>
  );
}
