"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CalendarDays, CreditCard, Search, X } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import type { Appointment } from "@/lib/types";
import { formatDate, formatDateTime, formatMoney, serviceOf } from "@/lib/utils";
import { CustomerOnly } from "@/components/protected-route";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/service-card";
import { Loader } from "@/components/loader";
import { StatusBadge } from "@/components/status-badge";

function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [detail, setDetail] = useState<Appointment | null>(null);

  const load = () => {
    setLoading(true);
    apiRequest<{ appointments: Appointment[] }>("/api/appointments/mine")
      .then((result) => setAppointments(result.appointments))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const idOf = (item: Appointment) => item.id ?? item._id;

  const cancel = async () => {
    if (!cancelTarget) return;
    setBusyId(idOf(cancelTarget));
    try {
      await apiRequest(`/api/appointments/${idOf(cancelTarget)}/cancel`, { method: "PATCH" });
      toast.success("Appointment request cancelled.");
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusyId("");
    }
  };

  const pay = async (appointment: Appointment) => {
    setBusyId(idOf(appointment));
    try {
      const result = await apiRequest<{ url: string }>("/api/payments/create-checkout", {
        method: "POST",
        body: { appointmentId: idOf(appointment) },
      });
      window.location.href = result.url;
    } catch (err) {
      toast.error((err as Error).message);
      setBusyId("");
    }
  };

  const visible = appointments.filter((appointment) => {
    const service = serviceOf(appointment.serviceId);
    return (service.serviceName || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">My appointments</h2>
          <p className="text-sm muted-text">Track, manage and pay for your salon bookings.</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by service" className="input-field !pl-10" aria-label="Search appointments" />
        </div>
      </div>

      {loading && <div className="surface"><Loader label="Loading appointments..." /></div>}
      {!loading && error && <EmptyState title="Could not load appointments" description={error} />}
      {!loading && !error && visible.length === 0 && (
        <EmptyState icon={CalendarDays} title="No appointments found" description="Your appointment requests will appear here after you submit one." />
      )}

      <div className="space-y-4">
        {!loading && visible.map((appointment) => {
          const service = serviceOf(appointment.serviceId);
          return (
            <div key={idOf(appointment)} className="surface p-5">
              <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                  {service.image && <Image src={service.image} alt="" fill unoptimized sizes="80px" className="object-cover" />}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{service.serviceName || "Salon service"}</h3>
                    <StatusBadge status={appointment.status} />
                    <StatusBadge status={appointment.paymentStatus} label={`Payment: ${appointment.paymentStatus}`} />
                  </div>
                  <p className="mt-1 text-sm muted-text">{service.category} · {formatDate(appointment.appointmentDate)} at {appointment.timeSlot}</p>
                  <p className="mt-1 text-xs muted-text">Requested {formatDateTime(appointment.createdAt)}</p>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{formatMoney(appointment.servicePrice)}</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setDetail(appointment)} className="btn-secondary !px-3 !py-2 !text-xs">View details</button>
                    {appointment.status === "pending" && (
                      <button type="button" onClick={() => setCancelTarget(appointment)} disabled={busyId === idOf(appointment)} className="btn-secondary !px-3 !py-2 !text-xs !text-rose-600">
                        {busyId === idOf(appointment) ? "Working..." : "Cancel request"}
                      </button>
                    )}
                    {appointment.status === "confirmed" && appointment.paymentStatus === "unpaid" && (
                      <button type="button" onClick={() => pay(appointment)} disabled={busyId === idOf(appointment)} className="btn-primary !px-3 !py-2 !text-xs">
                        <CreditCard size={14} /> {busyId === idOf(appointment) ? "Opening checkout..." : "Pay Now"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel this appointment request?"
        description="This action cannot be undone. Only pending requests can be cancelled."
        confirmLabel="Yes, cancel request"
        loading={Boolean(busyId)}
        onConfirm={cancel}
        onClose={() => setCancelTarget(null)}
      />

      {detail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div className="surface max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold">Appointment details</h3>
              <button type="button" onClick={() => setDetail(null)} aria-label="Close details"><X size={19} /></button>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["Service", serviceOf(detail.serviceId).serviceName || "-"],
                ["Category", serviceOf(detail.serviceId).category || "-"],
                ["Date", formatDate(detail.appointmentDate)],
                ["Time", detail.timeSlot],
                ["Duration", `${serviceOf(detail.serviceId).duration ?? "-"} min`],
                ["Price", formatMoney(detail.servicePrice)],
                ["Status", detail.status],
                ["Payment", detail.paymentStatus],
                ["Requested", formatDateTime(detail.createdAt)],
                ["Message", detail.message || "No additional message"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-rose-100 pb-2 dark:border-slate-800">
                  <dt className="muted-text">{label}</dt>
                  <dd className="text-right font-semibold capitalize">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerAppointmentsPage() {
  return <CustomerOnly><MyAppointments /></CustomerOnly>;
}
