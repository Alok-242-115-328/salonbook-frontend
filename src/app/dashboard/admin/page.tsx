"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, CircleX, Clock3, Scissors, Users } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Appointment, CustomerSummary, Service, Transaction } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";
import { AdminOnly } from "@/components/protected-route";
import { EmptyState } from "@/components/service-card";
import { Loader } from "@/components/loader";
import { StatsCard } from "@/components/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";

type AdminAppointment = Appointment & { customer?: Pick<CustomerSummary, "name" | "email"> | null };

function AdminOverview() {
  const [users, setUsers] = useState<CustomerSummary[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiRequest<{ users: CustomerSummary[] }>("/api/users"),
      apiRequest<{ services: Service[] }>("/api/services?all=true"),
      apiRequest<{ appointments: AdminAppointment[] }>("/api/appointments"),
      apiRequest<{ transactions: Transaction[] }>("/api/transactions"),
    ])
      .then(([userData, serviceData, appointmentData, transactionData]) => {
        setUsers(userData.users);
        setServices(serviceData.services);
        setAppointments(appointmentData.appointments);
        setTransactions(transactionData.transactions);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard data..." />;
  if (error) return <EmptyState title="Dashboard data unavailable" description={error} />;

  const count = (status: string) => appointments.filter((item) => item.status === status).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard label="Registered customers" value={users.filter((user) => user.role === "customer").length} icon={Users} />
        <StatsCard label="Active services" value={services.filter((service) => service.status === "active").length} icon={Scissors} tone="emerald" />
        <StatsCard label="Appointment requests" value={appointments.length} icon={CalendarDays} tone="amber" />
        <StatsCard label="Pending appointments" value={count("pending")} icon={Clock3} tone="amber" />
        <StatsCard label="Confirmed appointments" value={count("confirmed")} icon={CheckCircle2} tone="emerald" />
        <StatsCard label="Successful payments" value={transactions.filter((item) => item.status === "paid").length} icon={CircleX} />
      </div>

      <div className="surface p-5 sm:p-6">
        <h2 className="text-lg font-bold">Latest appointment requests</h2>
        <p className="mt-1 text-sm muted-text">Review and manage incoming bookings.</p>
        {appointments.length === 0 ? (
          <div className="mt-4"><EmptyState icon={CalendarDays} title="No requests yet" description="New customer appointments will appear here." /></div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-rose-100 text-xs uppercase tracking-wider muted-text dark:border-slate-800">
                  <th className="pb-3">Customer</th><th className="pb-3">Service</th><th className="pb-3">Date</th><th className="pb-3">Price</th><th className="pb-3">Status</th><th className="pb-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 8).map((appointment) => (
                  <tr key={appointment.id ?? appointment._id} className="border-b border-rose-50 last:border-0 dark:border-slate-800/70">
                    <td className="py-3 font-semibold">{appointment.customer?.name || "Customer"}</td>
                    <td className="py-3 muted-text">{(appointment.serviceId as { serviceName?: string })?.serviceName || "Service"}</td>
                    <td className="py-3 muted-text">{formatDate(appointment.appointmentDate)} · {appointment.timeSlot}</td>
                    <td className="py-3 font-semibold">{formatMoney(appointment.servicePrice)}</td>
                    <td className="py-3"><StatusBadge status={appointment.status} /></td>
                    <td className="py-3"><StatusBadge status={appointment.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return <AdminOnly><AdminOverview /></AdminOnly>;
}
