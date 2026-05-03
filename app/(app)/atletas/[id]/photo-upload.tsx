"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { uploadAthletePhotoAction } from "./photo-actions";

export function PhotoUpload({
  athleteId,
  fullName,
  initialUrl,
}: {
  athleteId: string;
  fullName: string;
  initialUrl: string | null;
}) {
  const [photoUrl, setPhotoUrl] = useState(initialUrl);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("athleteId", athleteId);
      fd.set("file", file);
      const result = await uploadAthletePhotoAction({ ok: false }, fd);
      if (result.ok && result.url) {
        setPhotoUrl(result.url);
      } else {
        setError(result.error ?? "Erro ao enviar foto.");
      }
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={pending}
        className="group relative size-20 overflow-hidden rounded-full disabled:opacity-50"
        aria-label="Trocar foto"
      >
        <Avatar className="size-20">
          {photoUrl ? <AvatarImage src={photoUrl} alt={fullName} /> : null}
          <AvatarFallback className="bg-brand-soft text-brand-text text-xl">
            {initials(fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
          {pending ? (
            <Loader2 className="size-5 animate-spin text-white" />
          ) : (
            <Camera className="size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error && <p className="text-[11px] text-err">{error}</p>}
    </div>
  );
}
