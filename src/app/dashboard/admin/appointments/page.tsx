"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, CircleX, Search, X } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import type { Appointment } from "@/lib/types";
import { formatDate, formatDateTime, formatMoney, serviceOf } from "@/lib/utils";
import { AdminOnly } from "@/components/protected-route";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/service-card";
import { Loader } from "@/components/loader";
import { StatusBadge } from "@/components/status-badge";

type AdminAppointment = Appointment & {
  customer?: { name?: string; email?: string; image?: string | null } | null;
};

function ManageAppointments() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [busyId, setBusyId] = useState("");
  const [cancelTarget, setCancelTarget] = useState<AdminAppointment | null>(null);
  const [detail, setDetail] = useState<AdminAppointment | null>(null);

  const load = () => {
    setLoading(true);
    apiRequest<{ appointments: AdminAppointment[] }>("/api/appointments")
      .then((result) => setAppointments(result.appointments))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const idOf = (item: AdminAppointment) => item.id ?? item._id;

  const update = async (appointment: AdminAppointment, action: "confirm" | "admin-cancel") => {
    setBusyId(idOf(appointment));
    try {
      await apiRequest(`/api/appointments/${idOf(appointment)}/${action}`, { method: "PATCH" });
      toast.success(action === "confirm" ? "Appointment confirmed." : "Appointment cancelled.");
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusyId("");
    }
  };

  const visible = appointments.filter((appointment) => {
    const matchesStatus = status === "all" || appointment.status === status;
    const term = search.toLowerCase();
    const matchesSearch =
      (appointment.customer?.name || "").toLowerCase().includes(term) ||
      (appointment.customer?.email || "").toLowerCase().includes(term) ||
      (serviceOf(appointment.serviceId).serviceName || "").toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Manage appointments</h2>
          <p className="text-sm muted-text">Review requests, confirm slots and cancel when needed.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer or service" className="input-field !pl-10" aria-label="Search appointments" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="input-field" aria-label="Filter appointments">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading && <div className="surface"><Loader label="Loading appointment requests..." /></div>}
      {!loading && error && <EmptyState title="Could not load appointments" description={error} />}
      {!loading && !error && visible.length === 0 && <EmptyState icon={CalendarDays} title="No appointments found" description="Try another filter or wait for new requests." />}

      {!loading && visible.length > 0 && (
        <div className="surface overflow-x-auto p-4 sm:p-5">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-rose-100 text-xs uppercase tracking-wider muted-text dark:border-slate-800">
                <th className="pb-3">Customer</th><th className="pb-3">Service</th><th className="pb-3">Date & time</th><th className="pb-3">Price</th><th className="pb-3">Status</th><th className="pb-3">Payment</th><th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((appointment) => (
                <tr key={idOf(appointment)} className="border-b border-rose-50 last:border-0 dark:border-slate-800/70">
                  <td className="py-3">
                    <p className="font-semibold">{appointment.customer?.name || "Customer"}</p>
                    <p className="text-xs muted-text">{appointment.customer?.email || "-"}</p>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                        {serviceOf(appointment.serviceId).image && <Image src={serviceOf(appointment.serviceId).image!} alt="" fill unoptimized sizes="40px" className="object-cover" />}
                      </div>
                      <span className="muted-text">{serviceOf(appointment.serviceId).serviceName}</span>
                    </div>
                  </td>
                  <td className="py-3 muted-text">{formatDate(appointment.appointmentDate)} · {appointment.timeSlot}</td>
                  <td className="py-3 font-semibold">{formatMoney(appointment.servicePrice)}</td>
                  <td className="py-3"><StatusBadge status={appointment.status} /></td>
                  <td className="py-3"><StatusBadge status={appointment.paymentStatus} /></td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setDetail(appointment)} className="btn-secondary !px-3 !py-2 !text-xs">Details</button>
                      {appointment.status === "pending" && (
                        <button type="button" onClick={() => update(appointment, "confirm")} disabled={busyId === idOf(appointment)} className="btn-primary !px-3 !py-2 !text-xs"><CheckCircle2 size={14} /> Confirm</button>
                      )}
                      {["pending", "confirmed"].includes(appointment.status) && (
                        <button type="button" onClick={() => setCancelTarget(appointment)} disabled={busyId === idOf(appointment)} className="btn-secondary !px-3 !py-2 !text-xs !text-rose-600"><CircleX size={14} /> Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel this appointment?"
        description="The customer will no longer be able to pay for this appointment."
        confirmLabel="Cancel appointment"
        loading={Boolean(busyId)}
        onConfirm={() => cancelTarget && update(cancelTarget, "admin-cancel")}
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
                ["Customer", detail.customer?.name || "-"],
                ["Email", detail.customer?.email || "-"],
                ["Service", serviceOf(detail.serviceId).serviceName || "-"],
                ["Date", formatDate(detail.appointmentDate)],
                ["Time", detail.timeSlot],
                ["Price", formatMoney(detail.servicePrice)],
                ["Status", detail.status],
                ["Payment", detail.paymentStatus],
                ["Requested", formatDateTime(detail.createdAt)],
                ["Message", detail.message || "No message provided"],
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

export default function AdminAppointmentsPage() {
  return <AdminOnly><ManageAppointments /></AdminOnly>;
}
