"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Brush,
  CalendarCheck2,
  Flower2,
  Hand,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { HERO_IMAGE, SERVICE_CATEGORIES } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { EmptyState, ServiceCard, ServiceCardSkeleton } from "@/components/service-card";

const categoryIcons = [Sparkles, Palette, Waves, Flower2, Brush, Hand, BadgeCheck];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiRequest<{ success: boolean; services: Service[] }>("/api/services", { auth: false })
      .then((result) => setServices(result.services.slice(0, 6)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-rose-700 dark:border-rose-900 dark:bg-slate-900/70 dark:text-rose-300">
              <Sparkles size={14} /> Your salon, beautifully organized
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Look your best,
              <span className="block bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                book with ease.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 muted-text sm:text-lg">
              Discover expert salon services, compare prices and durations, and request your appointment in minutes. Your next great look starts here.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/services" className="btn-primary">
                Explore Salon Services <ArrowRight size={17} />
              </Link>
              <form
                className="flex w-full max-w-sm items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  window.location.href = `/services?search=${encodeURIComponent(search)}`;
                }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" size={17} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search a service"
                    className="input-field !pl-10"
                    aria-label="Search services"
                  />
                </div>
                <button type="submit" className="btn-secondary !px-4 !py-3">Go</button>
              </form>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm">
              {[
                ["20+", "Signature services"],
                ["7", "Beauty categories"],
                ["4.9/5", "Client satisfaction"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{value}</p>
                  <p className="muted-text">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-rose-300/40 to-amber-200/30 blur-2xl dark:from-rose-900/40 dark:to-amber-900/10" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-white/70 shadow-2xl dark:border-white/10">
              <Image
                src={HERO_IMAGE}
                alt="Salon stylist working with a client"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover animate-kenburns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="surface absolute bottom-5 left-5 right-5 flex items-center gap-3 !bg-white/90 p-4 dark:!bg-slate-900/85">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <CalendarCheck2 size={21} />
                </span>
                <div>
                  <p className="text-sm font-bold">Appointments, simplified</p>
                  <p className="text-xs muted-text">Request, confirm and pay in one place</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Handpicked for you</p>
            <h2 className="section-title mt-2">Featured salon services</h2>
            <p className="mt-2 max-w-2xl muted-text">A few favorites from our active menu, ready for your next visit.</p>
          </div>
          <Link href="/services" className="btn-secondary">View all services <ArrowRight size={16} /></Link>
        </div>

        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => <ServiceCardSkeleton key={index} />)}
          {!loading && error && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState title="Services could not be loaded" description={error} />
            </div>
          )}
          {!loading && !error && services.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState title="No services yet" description="Run the server seed script to add sample salon services." />
            </div>
          )}
          {!loading && services.map((service) => <ServiceCard key={service.id ?? service._id} service={service} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Explore by category</p>
          <h2 className="section-title mt-2">Find your next treatment</h2>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SERVICE_CATEGORIES.map((category, index) => {
            const Icon = categoryIcons[index];
            return (
              <Link
                key={category}
                href={`/services?category=${encodeURIComponent(category)}`}
                className="surface group flex min-h-32 flex-col justify-between p-5 transition hover:-translate-y-1 hover:border-rose-300"
              >
                <Icon className="text-rose-600 transition group-hover:scale-110 dark:text-rose-400" size={24} />
                <div>
                  <p className="mt-5 text-sm font-bold leading-5">{category}</p>
                  <p className="mt-1 text-xs muted-text">Explore services</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="surface overflow-hidden">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Why SalonBook</p>
              <h2 className="section-title mt-2">A better way to care for yourself</h2>
              <p className="mt-4 muted-text">
                We bring browsing, booking and payment together so you can focus on feeling confident instead of juggling messages.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { Icon: Search, title: "Easy discovery", text: "Search, filter and compare every service." },
                { Icon: ShieldCheck, title: "Clear status", text: "Track requests from pending to paid." },
                { Icon: Sparkles, title: "Curated menu", text: "Thoughtful services for every beauty goal." },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="rounded-2xl bg-rose-50/80 p-5 dark:bg-slate-800/60">
                  <Icon className="text-rose-600 dark:text-rose-400" size={22} />
                  <h3 className="mt-3 text-sm font-bold">{title}</h3>
                  <p className="mt-1 text-xs leading-5 muted-text">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
