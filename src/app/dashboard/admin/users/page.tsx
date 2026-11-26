"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CircleX, Search, ShieldCheck, UserCheck, X } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import type { CustomerSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { AdminOnly } from "@/components/protected-route";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/service-card";
import { Loader } from "@/components/loader";
import { StatusBadge } from "@/components/status-badge";

function ManageUsers() {
  const [users, setUsers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState("");
  const [blockTarget, setBlockTarget] = useState<CustomerSummary | null>(null);
  const [detail, setDetail] = useState<CustomerSummary | null>(null);

  const load = () => {
    setLoading(true);
    apiRequest<{ users: CustomerSummary[] }>("/api/users")
      .then((result) => setUsers(result.users))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setBlocked = async (user: CustomerSummary, blocked: boolean) => {
    setBusyId(user.id);
    try {
      await apiRequest(`/api/users/${user.id}/${blocked ? "block" : "unblock"}`, { method: "PATCH" });
      toast.success(blocked ? "User blocked successfully." : "User unblocked successfully.");
      setBlockTarget(null);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusyId("");
    }
  };

  const visible = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Manage users</h2>
          <p className="text-sm muted-text">View registered customers and control platform access.</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users" className="input-field !pl-10" aria-label="Search users" />
        </div>
      </div>

      {loading && <div className="surface"><Loader label="Loading users..." /></div>}
      {!loading && error && <EmptyState title="Could not load users" description={error} />}
      {!loading && !error && visible.length === 0 && <EmptyState title="No users found" description="Registered customers will appear here." />}

      {!loading && visible.length > 0 && (
        <div className="surface overflow-x-auto p-4 sm:p-5">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-rose-100 text-xs uppercase tracking-wider muted-text dark:border-slate-800">
                <th className="pb-3">User</th><th className="pb-3">Role</th><th className="pb-3">Status</th><th className="pb-3">Joined</th><th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => (
                <tr key={user.id} className="border-b border-rose-50 last:border-0 dark:border-slate-800/70">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        {user.image ? <Image src={user.image} alt="" fill unoptimized sizes="40px" className="object-cover" /> : (
                          <span className="flex h-full w-full items-center justify-center bg-rose-100 text-sm font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs muted-text">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><StatusBadge status={user.role} /></td>
                  <td className="py-3"><StatusBadge status={user.isBlocked ? "cancelled" : "active"} label={user.isBlocked ? "Blocked" : "Active"} /></td>
                  <td className="py-3 muted-text">{user.createdAt ? formatDate(user.createdAt) : "-"}</td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setDetail(user)} className="btn-secondary !px-3 !py-2 !text-xs">Details</button>
                      {user.role === "customer" && !user.isBlocked && (
                        <button type="button" onClick={() => setBlockTarget(user)} disabled={busyId === user.id} className="btn-secondary !px-3 !py-2 !text-xs !text-rose-600"><CircleX size={14} /> Block</button>
                      )}
                      {user.isBlocked && (
                        <button type="button" onClick={() => setBlocked(user, false)} disabled={busyId === user.id} className="btn-primary !px-3 !py-2 !text-xs"><UserCheck size={14} /> Unblock</button>
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
        open={Boolean(blockTarget)}
        title="Block this user?"
        description={`${blockTarget?.name || "This user"} will lose access to protected SalonBook features until unblocked.`}
        confirmLabel="Block user"
        loading={Boolean(busyId)}
        onConfirm={() => blockTarget && setBlocked(blockTarget, true)}
        onClose={() => setBlockTarget(null)}
      />

      {detail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div className="surface w-full max-w-md p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold">User details</h3>
              <button type="button" onClick={() => setDetail(null)} aria-label="Close details"><X size={19} /></button>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["Name", detail.name],
                ["Email", detail.email],
                ["Phone", detail.phone || "Not provided"],
                ["Role", detail.role],
                ["Status", detail.isBlocked ? "Blocked" : "Active"],
                ["Joined", detail.createdAt ? formatDate(detail.createdAt) : "-"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-rose-100 pb-2 dark:border-slate-800">
                  <dt className="muted-text">{label}</dt><dd className="text-right font-semibold capitalize">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-start gap-2 rounded-2xl bg-rose-50 p-4 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
              <ShieldCheck size={16} className="shrink-0" /> Roles cannot be changed from the admin user list.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return <AdminOnly><ManageUsers /></AdminOnly>;
}
