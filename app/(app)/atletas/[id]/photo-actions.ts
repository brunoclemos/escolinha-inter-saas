"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { athletes } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import {
  createClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";

export type UploadPhotoState = {
  ok: boolean;
  error?: string;
  url?: string;
};

export async function uploadAthletePhotoAction(
  _prev: UploadPhotoState,
  formData: FormData
): Promise<UploadPhotoState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const athleteId = formData.get("athleteId") as string;
  const file = formData.get("file") as File | null;

  if (!athleteId || !file || file.size === 0) {
    return { ok: false, error: "Arquivo não enviado." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Arquivo muito grande (máx 5MB)." };
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { ok: false, error: "Use JPG, PNG ou WEBP." };
  }

  const tenant = await getCurrentTenant();

  const [exists] = await db
    .select({ id: athletes.id })
    .from(athletes)
    .where(and(eq(athletes.id, athleteId), eq(athletes.tenantId, tenant.id)))
    .limit(1);
  if (!exists) return { ok: false, error: "Atleta não encontrado." };

  // Path determinístico — substitui foto anterior se houver
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${tenant.id}/${athleteId}.${ext}`;

  const admin = createServiceRoleClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await admin.storage
    .from("athlete-photos")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadErr) {
    return { ok: false, error: `Erro upload: ${uploadErr.message}` };
  }

  const { data: pub } = admin.storage
    .from("athlete-photos")
    .getPublicUrl(path);

  const url = `${pub.publicUrl}?v=${Date.now()}`;

  try {
    await db
      .update(athletes)
      .set({ photoUrl: url, updatedAt: new Date() })
      .where(eq(athletes.id, athleteId));
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? `Erro DB: ${e.message}` : "Erro ao salvar.",
    };
  }

  revalidatePath(`/atletas/${athleteId}`);
  revalidatePath("/atletas");
  return { ok: true, url };
}
