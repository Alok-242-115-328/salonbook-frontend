"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiRequest, uploadImage } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { Loader } from "./loader";

export function ServiceForm({ serviceId }: { serviceId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [saving, setSaving] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState<string>(SERVICE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [existingImage, setExistingImage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    apiRequest<{ service: Service }>(`/api/services/${serviceId}`).then((result) => {
      const found = result.service;
      setServiceName(found.serviceName);
      setCategory(found.category);
      setDescription(found.description);
      setPrice(String(found.price));
      setDuration(String(found.duration));
      setStatus(found.status);
      setExistingImage(found.image);
    }).catch((err: Error) => {
      toast.error(err.message);
      router.push("/dashboard/admin/services");
    }).finally(() => setLoading(false));
  }, [serviceId, router]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file && !existingImage) {
      const message = "Please choose a service image.";
      toast.error(message);
      return;
    }
    setSaving(true);
    try {
      const image = file ? await uploadImage(file) : existingImage;
      const payload = {
        serviceName,
        category,
        description,
        price: Number(price),
        duration: Number(duration),
        image,
        status,
      };
      if (serviceId) {
        await apiRequest(`/api/services/${serviceId}`, { method: "PATCH", body: payload });
        toast.success("Service updated successfully.");
      } else {
        await apiRequest("/api/services", { method: "POST", body: payload });
        toast.success("Service created successfully.");
      }
      router.push("/dashboard/admin/services");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading service..." />;

  return (
    <form onSubmit={submit} className="surface space-y-5 p-6 sm:p-8">
      <div>
        <h2 className="text-lg font-bold">{serviceId ? "Update service" : "Add new service"}</h2>
        <p className="text-sm muted-text">Fill in the service details and upload a clear salon image.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="serviceName">Service name</label>
          <input id="serviceName" required minLength={2} value={serviceName} onChange={(event) => setServiceName(event.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className="input-field">
            {SERVICE_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label-field" htmlFor="description">Description</label>
        <textarea id="description" required minLength={10} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className="input-field resize-none" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="price">Price</label>
          <input id="price" type="number" required min="0.01" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="duration">Estimated duration (minutes)</label>
          <input id="duration" type="number" required min="1" step="1" value={duration} onChange={(event) => setDuration(event.target.value)} className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-field" htmlFor="status">Service status</label>
        <select id="status" value={status} onChange={(event) => setStatus(event.target.value as "active" | "inactive")} className="input-field">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className="label-field" htmlFor="serviceImage">Service image (upload)</label>
        <label className="btn-secondary cursor-pointer !py-2.5" htmlFor="serviceImage">
          <Upload size={16} /> {file ? file.name : "Choose image"}
          <input id="serviceImage" type="file" accept="image/*" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </label>
        {(file || existingImage) && (
          <div className="relative mt-4 h-40 w-full max-w-md overflow-hidden rounded-2xl">
            <Image src={file ? URL.createObjectURL(file) : existingImage} alt="Service preview" fill unoptimized sizes="400px" className="object-cover" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="animate-spin" size={16} /> : serviceId ? "Save changes" : "Create service"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary" disabled={saving}>Cancel</button>
      </div>
    </form>
  );
}
