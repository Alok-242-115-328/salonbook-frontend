import Image from "next/image";
import Link from "next/link";
import { Scissors, Sparkles } from "lucide-react";
import { HERO_IMAGE } from "@/lib/constants";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
      <div className="surface p-7 sm:p-10">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-700 text-white">
          <Scissors size={20} />
        </span>
        <h1 className="mt-6 text-3xl font-black">{title}</h1>
        <p className="mt-2 text-sm muted-text">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-7 border-t border-rose-100 pt-6 text-sm dark:border-slate-800">{footer}</div>
      </div>

      <div className="relative hidden min-h-[34rem] overflow-hidden rounded-[2rem] lg:block">
        <Image src={HERO_IMAGE} alt="Salon interior" fill priority sizes="45vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
        <div className="absolute inset-x-8 bottom-8">
          <Sparkles className="text-rose-300" size={22} />
          <p className="mt-3 text-3xl font-bold text-white">Your best look starts with one simple booking.</p>
          <p className="mt-2 max-w-sm text-sm text-rose-100/80">
            Join SalonBook to request appointments, track confirmations and pay securely online.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthFooter({ prompt, href, label }: { prompt: string; href: string; label: string }) {
  return (
    <p className="muted-text">
      {prompt}{" "}
      <Link href={href} className="font-bold text-rose-600 hover:underline dark:text-rose-400">{label}</Link>
    </p>
  );
}
