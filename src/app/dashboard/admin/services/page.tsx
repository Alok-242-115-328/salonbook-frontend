"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import type { Service } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { AdminOnly } from "@/components/protected-route";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/service-card";
import { Loader } from "@/components/loader";
import { StatusBadge } from "@/components/status-badge";

function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const load = () => {
    setLoading(true);
    apiRequest<{ services: Service[] }>("/api/services?all=true")
      .then((result) => setServices(result.services))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const idOf = (service: Service) => service.id ?? service._id;

  const toggle = async (service: Service) => {
    setBusyId(idOf(service));
    try {
      const result = await apiRequest<{ message: string }>(`/api/services/${idOf(service)}/status`, {
        method: "PATCH",
        body: { status: service.status === "active" ? "inactive" : "active" },
      });
      toast.success(result.message);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusyId("");
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setBusyId(idOf(deleteTarget));
    try {
      await apiRequest(`/api/services/${idOf(deleteTarget)}`, { method: "DELETE" });
      toast.success("Service deleted successfully.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusyId("");
    }
  };

  const visible = services.filter((service) =>
    service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
    service.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Manage services</h2>
          <p className="text-sm muted-text">Create, edit and control which services customers can see.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" className="input-field !pl-10" aria-label="Search services" />
          </div>
          <Link href="/dashboard/admin/services/new" className="btn-primary justify-center"><Plus size={16} /> Add service</Link>
        </div>
      </div>

      {loading && <div className="surface"><Loader label="Loading services..." /></div>}
      {!loading && error && <EmptyState title="Could not load services" description={error} />}
      {!loading && !error && visible.length === 0 && <EmptyState title="No services found" description="Add your first salon service to get started." />}

      {!loading && visible.length > 0 && (
        <div className="surface overflow-x-auto p-4 sm:p-5">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-rose-100 text-xs uppercase tracking-wider muted-text dark:border-slate-800">
                <th className="pb-3">Service</th><th className="pb-3">Category</th><th className="pb-3">Price</th><th className="pb-3">Duration</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((service) => (
                <tr key={idOf(service)} className="border-b border-rose-50 last:border-0 dark:border-slate-800/70">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                        <Image src={service.image} alt="" fill unoptimized sizes="48px" className="object-cover" />
                      </div>
                      <span className="font-semibold">{service.serviceName}</span>
                    </div>
                  </td>
                  <td className="py-3 muted-text">{service.category}</td>
                  <td className="py-3 font-semibold">{formatMoney(service.price)}</td>
                  <td className="py-3 muted-text">{service.duration} min</td>
                  <td className="py-3"><StatusBadge status={service.status} /></td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => toggle(service)} disabled={busyId === idOf(service)} className="btn-secondary !px-3 !py-2 !text-xs">
                        {busyId === idOf(service) ? "Working..." : service.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <Link href={`/dashboard/admin/services/${idOf(service)}`} className="btn-secondary !px-3 !py-2 !text-xs"><Pencil size={14} /></Link>
                      <button type="button" onClick={() => setDeleteTarget(service)} className="btn-secondary !px-3 !py-2 !text-xs !text-rose-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this service?"
        description={`"${deleteTarget?.serviceName || ""}" will be permanently removed from the catalog.`}
        confirmLabel="Delete service"
        loading={Boolean(busyId)}
        onConfirm={remove}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function ManageServicesPage() {
  return <AdminOnly><ManageServices /></AdminOnly>;
}
