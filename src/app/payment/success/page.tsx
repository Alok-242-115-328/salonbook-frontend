"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { shortId } from "@/lib/utils";
import { CustomerOnly } from "@/components/protected-route";

function SuccessContent() {
  const [sessionId, setSessionId] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session_id") ?? "";
    setSessionId(id);
    if (!id) return;

    let active = true;
    let attempts = 0;
    const check = async () => {
      try {
        const result = await apiRequest<{ paid: boolean }>(
          `/api/payments/verify-session?session_id=${encodeURIComponent(id)}`,
        );
        if (result.paid) {
          if (active) setConfirmed(true);
          return;
        }
      } catch {
        if (active) setConfirmed(false);
      }
      if (active && attempts < 15) {
        attempts += 1;
        setTimeout(check, 2000);
      }
    };

    check();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <div className="surface px-7 py-12 text-center sm:px-12">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CheckCircle2 size={40} />
        </span>
        <h1 className="mt-7 text-3xl font-black">
          {confirmed ? "Payment confirmed" : "Payment successful"}
        </h1>
        <p className="mt-3 leading-7 muted-text">
          {confirmed
            ? "Stripe has confirmed your payment. Your appointment now shows as paid."
            : "Thank you. Your payment is being verified securely. Your appointment will show as paid once Stripe confirms the webhook."}
        </p>
        {sessionId && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium dark:bg-slate-800">
            {confirmed ? (
              <CheckCircle2 size={14} className="text-emerald-600" />
            ) : (
              <Loader2 size={14} className="animate-spin text-emerald-600" />
            )}{" "}
            Session {shortId(sessionId)}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/customer/appointments" className="btn-primary">View my appointments</Link>
          <Link href="/" className="btn-secondary">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <CustomerOnly><SuccessContent /></CustomerOnly>;
}
