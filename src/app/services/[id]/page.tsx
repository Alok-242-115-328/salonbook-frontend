"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Scissors, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { TIME_SLOTS } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { CustomerOnly } from "@/components/protected-route";
import { Loader } from "@/components/loader";

function ServiceDetails({ id }: { id: string }) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiRequest<{ success: boolean; service: Service }>(`/api/services/${id}`, { auth: false })
      .then((result) => setService(result.service))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await apiRequest("/api/appointments", {
        method: "POST",
        body: { serviceId: id, appointmentDate: date, timeSlot, message },
      });
      toast.success("Appointment request submitted. Your salon will review it shortly.");
      router.push("/dashboard/customer/appointments");
    } catch (err) {
      const text = (err as Error).message;
      setFormError(text);
      toast.error(text);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading service details..." />;
  if (error || !service) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 mx-auto">
          <Scissors size={24} />
        </span>
        <h1 className="mt-5 text-2xl font-bold">We could not open this service</h1>
        <p className="mt-2 muted-text">{error || "Invalid service id."}</p>
        <Link href="/services" className="btn-primary mt-6">Back to services</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/services" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:underline dark:text-rose-400">
        <ArrowLeft size={16} /> Back to services
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface overflow-hidden">
          <div className="relative h-80 sm:h-[26rem]">
            <Image src={service.image} alt={service.serviceName} fill unoptimized sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="w-fit rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            {service.category}
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">{service.serviceName}</h1>
          <p className="mt-4 leading-7 muted-text">{service.description}</p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-rose-50 p-4 dark:bg-slate-800/60">
              <p className="text-xs font-semibold muted-text">Price</p>
              <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{formatMoney(service.price)}</p>
            </div>
            <div className="rounded-2xl bg-rose-50 p-4 dark:bg-slate-800/60">
              <p className="text-xs font-semibold muted-text">Duration</p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-bold"><Clock3 size={20} className="text-rose-500" /> {service.duration} min</p>
            </div>
          </div>

          <div className="mt-7">
            {!showForm ? (
              <button type="button" onClick={() => setShowForm(true)} className="btn-primary w-full sm:w-auto">
                <CalendarDays size={17} /> Request an appointment
              </button>
            ) : (
              <form onSubmit={submit} className="surface space-y-4 p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-rose-600 dark:text-rose-400" size={18} />
                  <h2 className="font-bold">Choose your preferred slot</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-field" htmlFor="appointmentDate">Appointment date</label>
                    <input
                      id="appointmentDate"
                      type="date"
                      required
                      min={new Date().toISOString().slice(0, 10)}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field" htmlFor="timeSlot">Available time slot</label>
                    <select id="timeSlot" required value={timeSlot} onChange={(event) => setTimeSlot(event.target.value)} className="input-field">
                      <option value="">Select a time</option>
                      {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-field" htmlFor="message">Additional message (optional)</label>
                  <textarea id="message" rows={3} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} className="input-field resize-none" placeholder="Tell us anything the stylist should know..." />
                </div>
                {formError && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{formError}</p>}
                <div className="flex flex-wrap gap-2">
                  <button type="submit" disabled={submitting} className="btn-primary">
                    {submitting ? "Submitting request..." : "Submit request"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" disabled={submitting}>Cancel</button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-rose-100 p-4 text-sm muted-text dark:border-slate-800">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
            Your request starts as <strong className="text-slate-800 dark:text-slate-100">Pending</strong>. You can pay only after the salon confirms it.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CustomerOnly><ServiceDetails id={id} /></CustomerOnly>;
}
