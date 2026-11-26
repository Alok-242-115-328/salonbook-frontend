"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sessionUser, dashboardPath, useSession } from "@/lib/auth-client";
import { Loader } from "@/components/loader";
import { ProtectedRoute } from "@/components/protected-route";

function RedirectToRole() {
  const { data } = useSession();
  const user = sessionUser(data);
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(dashboardPath(user.role));
  }, [user, router]);

  return <Loader label="Opening your dashboard..." />;
}

export default function DashboardIndexPage() {
  return <ProtectedRoute><RedirectToRole /></ProtectedRoute>;
}
