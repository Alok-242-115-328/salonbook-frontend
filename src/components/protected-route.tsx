"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { clearToken } from "@/lib/api";
import { dashboardPath, sessionUser, signOut, useSession } from "@/lib/auth-client";
import type { Role } from "@/lib/types";
import { Loader } from "./loader";

const CUSTOMER_ONLY: Role[] = ["customer"];
const ADMIN_ONLY: Role[] = ["admin"];

export function CustomerOnly({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allow={CUSTOMER_ONLY}>{children}</ProtectedRoute>;
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allow={ADMIN_ONLY}>{children}</ProtectedRoute>;
}

export function ProtectedRoute({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Role[];
}) {
  const { data, isPending } = useSession();
  const user = sessionUser(data);
  const router = useRouter();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      const callback = typeof window === "undefined" ? "/" : window.location.pathname;
      router.replace(`/auth/sign-in?callbackUrl=${encodeURIComponent(callback)}`);
      return;
    }
    if (user.isBlocked) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
    if (allow && !allow.includes(user.role)) {
      router.replace(dashboardPath(user.role));
    }
  }, [user, isPending, router, allow]);

  if (isPending) return <Loader label="Checking your session..." />;
  if (blocked) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <div className="surface p-10 text-center">
          <ShieldAlert className="mx-auto text-rose-600" size={36} />
          <h1 className="mt-4 text-2xl font-bold">Account blocked</h1>
          <p className="mt-2 text-sm muted-text">Your account cannot access SalonBook features. Contact the salon administrator for help.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/" className="btn-secondary">Back to home</Link>
            <button type="button" className="btn-primary" onClick={async () => { await signOut(); clearToken(); router.push("/"); }}>Sign out</button>
          </div>
        </div>
      </div>
    );
  }
  if (!user) return <Loader label="Redirecting to sign in..." />;
  if (allow && !allow.includes(user.role)) return <Loader label="Redirecting to your dashboard..." />;
  return <>{children}</>;
}
