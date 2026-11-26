"use client";

import { useEffect, useState } from "react";
import { ReceiptText, Search, DollarSign, ListOrdered } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Transaction } from "@/lib/types";
import { formatDate, formatDateTime, formatMoney, shortId } from "@/lib/utils";
import { AdminOnly } from "@/components/protected-route";
import { EmptyState } from "@/components/service-card";
import { Loader } from "@/components/loader";
import { StatusBadge } from "@/components/status-badge";

function TransactionsContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiRequest<{ transactions: Transaction[] }>("/api/transactions")
      .then((result) => setTransactions(result.transactions))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Null Safety সহ info ফাংশন আপডেট করা হয়েছে
  const info = (item: Transaction) => {
    if (typeof item.appointmentId === "string" || !item.appointmentId) {
      return { appointmentDate: "", timeSlot: "", serviceName: "" };
    }
    
    return {
      appointmentDate: item.appointmentId.appointmentDate || "",
      timeSlot: item.appointmentId.timeSlot || "",
      serviceName: item.appointmentId.serviceId?.serviceName || "",
    };
  };

  const visible = transactions.filter((item) => {
    const term = search.toLowerCase();
    return (
      (item.customer?.name || "").toLowerCase().includes(term) ||
      (item.customer?.email || "").toLowerCase().includes(term) ||
      item.stripeSessionId.toLowerCase().includes(term)
    );
  });

  // ✅ Total Calculations
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* ✅ Statistics Cards (Total Transactions & Revenue) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="surface flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <ListOrdered size={24} />
          </div>
          <div>
            <p className="text-sm font-medium muted-text">Total Transactions</p>
            <h3 className="text-2xl font-bold">{totalTransactions}</h3>
          </div>
        </div>

        <div className="surface flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium muted-text">Total Revenue</p>
            <h3 className="text-2xl font-bold">
              {formatMoney(totalRevenue, "USD")} 
              <span className="text-sm muted-text ml-1">USD</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Header & Search */}
      <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Transactions</h2>
          <p className="text-sm muted-text">Payments recorded from verified Stripe webhook events only.</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer or session" className="input-field !pl-10" aria-label="Search transactions" />
        </div>
      </div>

      {/* Table Area */}
      {loading && <div className="surface"><Loader label="Loading transactions..." /></div>}
      {!loading && error && <EmptyState title="Could not load transactions" description={error} />}
      {!loading && !error && visible.length === 0 && <EmptyState icon={ReceiptText} title="No transactions yet" description="Successful payments will appear here after Stripe webhook verification." />}

      {!loading && visible.length > 0 && (
        <div className="surface overflow-x-auto p-4 sm:p-5">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-rose-100 text-xs uppercase tracking-wider muted-text dark:border-slate-800">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Appointment</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Session</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => {
                const appointment = info(item);
                return (
                  <tr key={item.id} className="border-b border-rose-50 last:border-0 dark:border-slate-800/70">
                    <td className="py-3">
                      <p className="font-semibold">{item.customer?.name || "Customer"}</p>
                      <p className="text-xs muted-text">{item.customer?.email || item.customerId}</p>
                    </td>
                    <td className="py-3 muted-text font-medium text-rose-500 dark:text-rose-400">
                      {appointment.serviceName || "-"}
                    </td>
                    <td className="py-3 muted-text">
                      {appointment.appointmentDate ? `${formatDate(appointment.appointmentDate)} · ${appointment.timeSlot}` : "-"}
                    </td>
                    <td className="py-3 font-semibold">
                      {formatMoney(item.amount, item.currency.toUpperCase())} <span className="text-xs muted-text">{item.currency.toUpperCase()}</span>
                    </td>
                    <td className="py-3 font-mono text-xs muted-text">{shortId(item.stripeSessionId)}</td>
                    <td className="py-3"><StatusBadge status={item.status} /></td>
                    <td className="py-3 muted-text">{formatDateTime(item.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function TransactionsPage() {
  return <AdminOnly><TransactionsContent /></AdminOnly>;
}