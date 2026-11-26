"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/service-form";
import { AdminOnly } from "@/components/protected-route";

export default function NewServicePage() {
  return (
    <AdminOnly>
      <Link href="/dashboard/admin/services" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:underline dark:text-rose-400">
        <ArrowLeft size={16} /> Back to services
      </Link>
      <ServiceForm />
    </AdminOnly>
  );
}
