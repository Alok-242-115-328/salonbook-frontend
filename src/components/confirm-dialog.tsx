"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  loading = false,
  tone = "danger",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="surface w-full max-w-md p-6" role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
            <AlertTriangle size={20} />
          </span>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-full p-1 muted-text hover:bg-rose-50 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>
        <h3 className="mt-4 text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm leading-6 muted-text">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary !px-4 !py-2.5" disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={tone === "danger" ? "btn-primary !bg-rose-600 !px-4 !py-2.5" : "btn-primary !px-4 !py-2.5"}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
