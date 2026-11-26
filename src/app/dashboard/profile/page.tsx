"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";
import { apiRequest, uploadImage } from "@/lib/api";
import type { AppUser } from "@/lib/types";
import { ProtectedRoute } from "@/components/protected-route";
import { Loader } from "@/components/loader";
import { StatusBadge } from "@/components/status-badge";

function ProfileContent() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    apiRequest<{ user: AppUser }>("/api/profile")
      .then((result) => {
        setUser(result.user);
        setName(result.user.name);
        setPhone(result.user.phone ?? "");
        setImage(result.user.image ?? "");
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const imageUrl = file ? await uploadImage(file) : image;
      const result = await apiRequest<{ user: AppUser }>("/api/profile", {
        method: "PATCH",
        body: { name, phone, image: imageUrl || undefined },
      });
      setUser(result.user);
      setFile(null);
      toast.success("Profile updated successfully.");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading profile..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="surface flex flex-wrap items-center gap-5 p-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-rose-100 dark:border-slate-700">
          {user?.image ? (
            <Image src={user.image} alt={user.name} fill unoptimized sizes="80px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300"><UserRound size={30} /></span>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-sm muted-text">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={user?.role ?? "customer"} />
          <StatusBadge status={user?.isBlocked ? "cancelled" : "active"} label={user?.isBlocked ? "Blocked" : "Active"} />
        </div>
      </div>

      <form onSubmit={save} className="surface space-y-5 p-6">
        <div>
          <h2 className="text-lg font-bold">Edit profile</h2>
          <p className="text-sm muted-text">Update your name, contact number and photo. Role and block status cannot be changed here.</p>
        </div>
        <div>
          <label className="label-field" htmlFor="profileName">Full name</label>
          <input id="profileName" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="profilePhone">Phone number</label>
          <input id="profilePhone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+1 555 000 0000" className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="profileImage">Profile image</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="btn-secondary cursor-pointer !py-2.5">
              <Upload size={16} /> Upload image
              <input id="profileImage" type="file" accept="image/*" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </label>
            <input value={image} onChange={(event) => { setImage(event.target.value); setFile(null); }} placeholder="Or paste an image URL" className="input-field" />
          </div>
          {file && <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">{file.name} will be uploaded on save.</p>}
        </div>
        <div className="flex items-start gap-2 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          <ShieldCheck size={18} className="mt-0.5 shrink-0" /> Your role and blocked status are managed only by the salon administrator.
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="animate-spin" size={16} /> : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return <ProtectedRoute><ProfileContent /></ProtectedRoute>;
}
