import Link from "next/link";
import { Clock3, Facebook, Instagram, Mail, MapPin, Phone, Scissors, Share2 } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-rose-100 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-700 text-white">
              <Scissors size={19} />
            </span>
            <span className="text-xl font-bold">Salon<span className="text-rose-600 dark:text-rose-400">Book</span></span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 muted-text">
            A calm, modern way to discover salon services, request appointments and manage your beauty routine.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { href: "https://www.instagram.com/", label: "Instagram", Icon: Instagram },
              { href: "https://www.facebook.com/", label: "Facebook", Icon: Facebook },
              { href: "https://www.pinterest.com/", label: "Pinterest", Icon: Share2 },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-600 hover:text-white dark:border-slate-700 dark:text-rose-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Explore</h3>
          <ul className="space-y-3 text-sm muted-text">
            <li><Link href="/" className="hover:text-rose-600">Home</Link></li>
            <li><Link href="/services" className="hover:text-rose-600">Browse Services</Link></li>
            <li><Link href="/auth/sign-in" className="hover:text-rose-600">Sign In</Link></li>
            <li><Link href="/auth/sign-up" className="hover:text-rose-600">Sign Up</Link></li>
            <li><Link href="/dashboard" className="hover:text-rose-600">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Contact</h3>
          <ul className="space-y-3 text-sm muted-text">
            <li className="flex items-start gap-2"><Phone size={16} className="mt-0.5 text-rose-500" />{CONTACT.phone}</li>
            <li className="flex items-start gap-2"><Mail size={16} className="mt-0.5 text-rose-500" />{CONTACT.email}</li>
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-rose-500" />{CONTACT.address}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Opening Hours</h3>
          <p className="flex items-start gap-2 text-sm muted-text"><Clock3 size={16} className="mt-0.5 text-rose-500" />{CONTACT.hours}</p>
          <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
            Walk-ins welcome, appointments recommended.
          </div>
        </div>
      </div>
      <div className="border-t border-rose-100 py-5 text-center text-xs muted-text dark:border-slate-800">
        © {new Date().getFullYear()} SalonBook. All rights reserved.
      </div>
    </footer>
  );
}
