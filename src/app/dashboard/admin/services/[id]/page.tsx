"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/service-form";
import { AdminOnly } from "@/components/protected-route";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AdminOnly>
      <Link href="/dashboard/admin/services" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:underline dark:text-rose-400">
        <ArrowLeft size={16} /> Back to services
      </Link>
      <ServiceForm serviceId={id} />
    </AdminOnly>
  );
}
