import { createAuthClient } from "better-auth/react";
import type { AppUser } from "./types";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: { credentials: "include" },
});

export const { signIn, signUp, signOut, useSession } = authClient;

export function sessionUser(session: unknown): AppUser | null {
  const data = session as { user?: Record<string, unknown> } | null;
  if (!data?.user) return null;
  const user = data.user;
  return {
    id: String(user.id ?? ""),
    name: String(user.name ?? ""),
    email: String(user.email ?? ""),
    image: (user.image as string | null | undefined) ?? null,
    role: user.role === "admin" ? "admin" : "customer",
    isBlocked: Boolean(user.isBlocked),
    phone: (user.phone as string | null | undefined) ?? null,
  };
}

export function dashboardPath(role: "admin" | "customer") {
  return role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
}
