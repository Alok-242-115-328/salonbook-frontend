import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Scissors, type LucideIcon } from "lucide-react";
import type { Service } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  const id = service.id ?? service._id;
  return (
    <article className="surface group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-700 backdrop-blur dark:bg-slate-900/85 dark:text-rose-300">
          {service.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.serviceName}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 muted-text">{service.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-rose-100 pt-4 dark:border-slate-800">
          <div>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{formatMoney(service.price)}</p>
            <p className="flex items-center gap-1 text-xs muted-text"><Clock3 size={13} /> {service.duration} min</p>
          </div>
          <Link href={`/services/${id}`} className="btn-primary !rounded-full !px-4 !py-2.5">
            View Details <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="surface animate-pulse overflow-hidden">
      <div className="h-52 bg-rose-100 dark:bg-slate-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 rounded bg-rose-100 dark:bg-slate-800" />
        <div className="h-4 w-full rounded bg-rose-50 dark:bg-slate-800" />
        <div className="h-4 w-4/5 rounded bg-rose-50 dark:bg-slate-800" />
        <div className="h-10 w-full rounded-full bg-rose-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon = Scissors }: { title: string; description: string; icon?: LucideIcon }) {
  return (
    <div className="surface flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
        <Icon size={24} />
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-md text-sm muted-text">{description}</p>
    </div>
  );
}
