"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { apiRequest, clearToken, setToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

function AuthTokenSync() {
  const { data, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    if (!data) {
      clearToken();
      return;
    }
    apiRequest<{ success: boolean; token: string }>("/api/session/token", { method: "POST" })
      .then((result) => setToken(result.token))
      .catch(() => clearToken());
  }, [data, isPending]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
      <AuthTokenSync />
      <Toaster richColors closeButton position="top-right" theme="system" />
      {children}
    </ThemeProvider>
  );
}
