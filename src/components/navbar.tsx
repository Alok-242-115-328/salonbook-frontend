"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Scissors, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { clearToken } from "@/lib/api";
import { dashboardPath, sessionUser, signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export function Navbar() {
  const { data, isPending } = useSession();
  const user = sessionUser(data);
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    await signOut();
    clearToken();
    setProfileOpen(false);
    toast.success("You have been signed out.");
    router.push("/");
    router.refresh();
  };

  const links = user ? [...publicLinks, { href: "/dashboard", label: "Dashboard" }] : publicLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="SalonBook home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-700 text-white shadow-lg shadow-rose-500/25 transition group-hover:rotate-6">
            <Scissors size={20} />
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Salon<span className="text-rose-600 dark:text-rose-400">Book</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                pathname === link.href && "bg-rose-50 text-rose-700 dark:bg-slate-800 dark:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isPending && !user && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/auth/sign-in" className="btn-secondary !px-4 !py-2.5">
                Sign In
              </Link>
              <Link href="/auth/sign-up" className="btn-primary !px-4 !py-2.5">
                Get Started
              </Link>
            </div>
          )}

          {user && (
            <div className="relative hidden sm:block" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 py-1 pl-1 pr-3 text-sm font-semibold text-slate-700 transition hover:border-rose-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                {user.image ? (
                  <Image src={user.image} alt={user.name} width={32} height={32} unoptimized className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    {user.name.charAt(0).toUpperCase() || <UserRound size={16} />}
                  </span>
                )}
                <span className="max-w-[110px] truncate">{user.name}</span>
                <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="surface absolute right-0 top-12 w-60 overflow-hidden p-2">
                  <div className="border-b border-rose-100 px-3 py-2 dark:border-slate-700">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs muted-text">{user.email}</p>
                  </div>
                  <Link
                    href={dashboardPath(user.role)}
                    className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-rose-50 dark:hover:bg-slate-800"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-slate-800"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 md:hidden"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-rose-100 bg-white/95 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-rose-50 dark:hover:bg-slate-800">
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link href={dashboardPath(user.role)} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-rose-50 dark:hover:bg-slate-800">
                  My Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-slate-800">
                  Logout
                </button>
              </>
            )}
            {!user && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/auth/sign-in" className="btn-secondary justify-center">Sign In</Link>
                <Link href="/auth/sign-up" className="btn-primary justify-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
