"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Chrome, CircleCheck, Loader2, Lock, Mail, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";
import { apiRequest, setToken, uploadImage } from "@/lib/api";
import { dashboardPath, signIn, signUp } from "@/lib/auth-client";
import type { AppUser } from "@/lib/types";
import { AuthFooter, AuthShell } from "@/components/auth-shell";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordValid = password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password);

  const pickFile = (selected: File | null) => {
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : "");
  };

  const finish = async () => {
    try {
      const result = await apiRequest<{ token: string; user: AppUser }>("/api/session/token", { method: "POST" });
      setToken(result.token);
      toast.success("Account created successfully. Welcome to SalonBook!");
      router.push(dashboardPath(result.user.role));
    } catch {
      toast.success("Account created successfully. Please sign in to continue.");
      router.push("/auth/sign-in");
    }
    router.refresh();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!passwordValid) {
      const message = "Password must be at least 6 characters with one uppercase and one lowercase letter.";
      setError(message);
      toast.error(message);
      return;
    }
    setLoading(true);
    try {
      let image = imageUrl.trim() || undefined;
      if (file) image = await uploadImage(file);
      const result = await signUp.email({ name, email, password, image, callbackURL: "/dashboard" });
      if (result.error) throw new Error(result.error.message || "Registration failed.");
      await finish();
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    setError("");
    try {
      //const result = await signIn.social({ provider: "google", callbackURL: "/dashboard" });
      const result = await signIn.social({ provider: "google", 
        
        callbackURL: `${origin}/dashboard` });// 👈 এখানে পরিবর্তন করুন

      if (result.error) throw new Error(result.error.message || "Google registration failed.");
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
      title="Create your account"
      subtitle="Book appointments, track requests and pay securely in one place."
      footer={<AuthFooter prompt="Already have an account?" href="/auth/sign-in" label="Sign in instead" />}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-field" htmlFor="name">Full name</label>
          <div className="relative">
            <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={17} />
            <input id="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Avery Morgan" className="input-field !pl-11" />
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={17} />
            <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="input-field !pl-11" />
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={17} />
            <input id="password" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a strong password" className="input-field !pl-11" />
          </div>
          <ul className="mt-2 space-y-1 text-xs muted-text">
            {[
              ["At least 6 characters", password.length >= 6],
              ["One uppercase letter", /[A-Z]/.test(password)],
              ["One lowercase letter", /[a-z]/.test(password)],
            ].map(([label, valid]) => (
              <li key={label as string} className={valid ? "flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400" : "flex items-center gap-1.5"}>
                <CircleCheck size={13} /> {label as string}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="label-field" htmlFor="image">Profile image (optional)</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="btn-secondary cursor-pointer !py-2.5">
              <Upload size={16} /> Upload image
              <input type="file" accept="image/*" className="hidden" onChange={(event) => pickFile(event.target.files?.[0] ?? null)} />
            </label>
            <input value={imageUrl} onChange={(event) => { setImageUrl(event.target.value); setFile(null); setPreview(""); }} placeholder="Or paste an image URL" className="input-field" />
          </div>
          {(preview || imageUrl) && (
            <div className="relative mt-3 h-20 w-20 overflow-hidden rounded-full border-2 border-rose-200">
              <Image src={preview || imageUrl} alt="Profile preview" fill unoptimized sizes="80px" className="object-cover" />
            </div>
          )}
        </div>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="animate-spin" size={17} /> : "Create account"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest muted-text">
        <span className="h-px flex-1 bg-rose-100 dark:bg-slate-800" /> or <span className="h-px flex-1 bg-rose-100 dark:bg-slate-800" />
      </div>
      <button type="button" onClick={google} disabled={loading} className="btn-secondary w-full">
        <Chrome size={17} /> Continue with Google
      </button>
      <p className="mt-5 text-center text-xs muted-text">
        Admin accounts are never created through public registration. The first user on a fresh database becomes admin; after that, use a configured admin PIN.
      </p>
    </AuthShell>
  );
}
