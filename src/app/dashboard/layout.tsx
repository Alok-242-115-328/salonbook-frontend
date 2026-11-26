"use client";

import { sessionUser, useSession } from "@/lib/auth-client";
import { DashboardShell } from "@/components/dashboard-shell";
import { Loader } from "@/components/loader";
import { ProtectedRoute } from "@/components/protected-route";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useSession();
  const user = sessionUser(data);

  if (isPending) return <Loader label="Preparing your dashboard..." />;

  return (
    <ProtectedRoute>
      <DashboardShell role={user?.role ?? "customer"}>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
