"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, LayoutDashboard, LogOut, ReceiptText, Scissors, UserRound, Users, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { clearToken } from "@/lib/api";
import { sessionUser, signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { ThemeToggle } from "./theme-toggle";

const customerNav = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/appointments", label: "My Appointments", icon: CalendarDays },
  { href: "/dashboard/profile", label: "My Profile", icon: UserRound },
];

const adminNav = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/services", label: "Manage Services", icon: Scissors },
  { href: "/dashboard/admin/appointments", label: "Manage Appointments", icon: CalendarDays },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/dashboard/profile", label: "My Profile", icon: UserRound },
];

export function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const nav = role === "admin" ? adminNav : customerNav;
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const user = sessionUser(data);

  const logout = async () => {
    await signOut();
    clearToken();
    toast.success("Signed out successfully.");
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="surface h-fit p-3 lg:sticky lg:top-24">
          <p className="px-3 pb-2 pt-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            {role === "admin" ? "Admin panel" : "My space"}
          </p>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = href === "/dashboard/customer" || href === "/dashboard/admin"
                ? pathname === href
                : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                      : "text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  <Icon size={17} /> {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="flex shrink-0 items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-slate-800 lg:mt-2 lg:border-t lg:border-rose-100 lg:pt-4 dark:lg:border-slate-800"
            >
              <LogOut size={17} /> Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">SalonBook Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome back, {user?.name?.split(" ")[0] || "there"}</h1>
            </div>
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  tone = "rose",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "rose" | "amber" | "emerald" | "slate";
}) {
  const tones = {
    rose: "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    slate: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  };
  return (
    <div className="surface flex items-center gap-4 p-5">
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", tones[tone])}>
        <Icon size={21} />
      </span>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs font-medium muted-text">{label}</p>
      </div>
    </div>
  );
}
