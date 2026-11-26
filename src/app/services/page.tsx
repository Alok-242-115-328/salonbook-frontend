"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { EmptyState, ServiceCard, ServiceCardSkeleton } from "@/components/service-card";

export default function BrowseServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") ?? "");
    setCategory(params.get("category") ?? "all");
    setSort(params.get("sort") ?? "newest");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category !== "all") params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/services?${query}` : "/services");

    setLoading(true);
    setError("");
    const timer = window.setTimeout(() => {
      apiRequest<{ success: boolean; services: Service[] }>(`/api/services${query ? `?${query}` : ""}`, { auth: false })
        .then((result) => setServices(result.services))
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }, 200);
    return () => window.clearTimeout(timer);
  }, [search, category, sort]);

  const reset = () => {
    setSearch("");
    setCategory("all");
    setSort("newest");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Our menu</p>
        <h1 className="section-title mt-2">Browse salon services</h1>
        <p className="mt-3 muted-text">
          Explore our active services, compare prices and find the perfect treatment. No account needed to browse.
        </p>
      </div>

      <div className="surface mt-9 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services by name"
              className="input-field !pl-11"
              aria-label="Search services by name"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={16} />
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="input-field !pl-10" aria-label="Filter by category">
              <option value="all">All categories</option>
              {SERVICE_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="input-field" aria-label="Sort services">
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
          <button type="button" onClick={reset} className="btn-secondary justify-center" title="Reset filters">
            <RotateCcw size={16} /> <span className="md:hidden">Reset</span>
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm muted-text">{loading ? "Finding services..." : `${services.length} service${services.length === 1 ? "" : "s"} found`}</p>
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, index) => <ServiceCardSkeleton key={index} />)}
        {!loading && error && (
          <div className="sm:col-span-2 lg:col-span-3"><EmptyState title="Could not load services" description={error} /></div>
        )}
        {!loading && !error && services.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState title="No services match your filters" description="Try a different name, category or price order." />
          </div>
        )}
        {!loading && services.map((service) => <ServiceCard key={service.id ?? service._id} service={service} />)}
      </div>
    </div>
  );
}
