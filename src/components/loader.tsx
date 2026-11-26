import { Loader2 } from "lucide-react";

export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[18rem] flex-col items-center justify-center gap-3 text-center">
      <Loader2 className="animate-spin text-rose-600" size={30} />
      <p className="text-sm font-medium muted-text">{label}</p>
    </div>
  );
}
