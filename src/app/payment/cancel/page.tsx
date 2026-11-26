"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { shortId } from "@/lib/utils";
import { CustomerOnly } from "@/components/protected-route";

function CancelContent() {
  const [sessionId, setSessionId] = useState("");
  useEffect(() => {
    setSessionId(new URLSearchParams(window.location.search).get("session_id") ?? "");
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <div className="surface px-7 py-12 text-center sm:px-12">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
          <XCircle size={40} />
        </span>
        <h1 className="mt-7 text-3xl font-black">Payment cancelled</h1>
        <p className="mt-3 leading-7 muted-text">
          No charge was made. Your appointment is still confirmed and unpaid, so you can try again whenever you are ready.
        </p>
        {sessionId && <p className="mt-5 text-xs muted-text">Session {shortId(sessionId)}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/customer/appointments" className="btn-primary">Back to appointments</Link>
          <Link href="/services" className="btn-secondary">Explore more services</Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return <CustomerOnly><CancelContent /></CustomerOnly>;
}
