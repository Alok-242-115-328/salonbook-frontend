"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, CalendarDays, CircleX, Clock3, ListChecks } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Appointment } from "@/lib/types";
import { formatDate, formatMoney, serviceOf } from "@/lib/utils";
import { CustomerOnly } from "@/components/protected-route";
import { EmptyState } from "@/components/service-card";
import { StatsCard } from "@/components/dashboard-shell";
import { Loader } from "@/components/loader";
import { StatusBadge } from "@/components/status-badge";

function CustomerOverview() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ appointments: Appointment[] }>("/api/appointments/mine")
      .then((result) => setAppointments(result.appointments))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((item) => item.status === "pending").length,
      confirmed: appointments.filter((item) => item.status === "confirmed").length,
      cancelled: appointments.filter((item) => item.status === "cancelled").length,
    }),
    [appointments],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total appointment requests" value={stats.total} icon={ListChecks} />
        <StatsCard label="Pending appointments" value={stats.pending} icon={Clock3} tone="amber" />
        <StatsCard label="Confirmed appointments" value={stats.confirmed} icon={CalendarCheck2} tone="emerald" />
        <StatsCard label="Cancelled appointments" value={stats.cancelled} icon={CircleX} tone="slate" />
      </div>

      <div className="surface p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Recent appointments</h2>
            <p className="text-sm muted-text">Your latest requests and their current status.</p>
          </div>
          <Link href="/dashboard/customer/appointments" className="btn-secondary !px-4 !py-2.5">View all</Link>
        </div>

        {loading && <Loader label="Loading your appointments..." />}
        {!loading && error && <EmptyState title="Could not load appointments" description={error} />}
        {!loading && !error && appointments.length === 0 && (
          <EmptyState icon={CalendarDays} title="No appointments yet" description="Browse services and submit your first appointment request." />
        )}
        {!loading && appointments.slice(0, 5).map((appointment) => {
          const service = serviceOf(appointment.serviceId);
          return (
            <div key={appointment.id ?? appointment._id} className="flex flex-wrap items-center gap-4 border-t border-rose-100 py-4 first:border-0 dark:border-slate-800">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                {service.image && <Image src={service.image} alt="" fill unoptimized sizes="56px" className="object-cover" />}
              </div>
              <div className="min-w-[160px] flex-1">
                <p className="font-semibold">{service.serviceName || "Service"}</p>
                <p className="text-xs muted-text">{formatDate(appointment.appointmentDate)} at {appointment.timeSlot}</p>
              </div>
              <p className="font-bold text-rose-600 dark:text-rose-400">{formatMoney(appointment.servicePrice)}</p>
              <StatusBadge status={appointment.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CustomerDashboardPage() {
  return <CustomerOnly><CustomerOverview /></CustomerOnly>;
}
