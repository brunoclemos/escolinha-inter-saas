import Link from "next/link";
import { redirect } from "next/navigation";
import { OnzeMark } from "@/components/onze-mark";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { AcceptInviteForm } from "./form";

export const dynamic = "force-dynamic";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams; // consumida apenas pra evitar warning de unused

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não tem sessão, o link do e-mail expirou ou já foi usado
  if (!user) {
    return (
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <OnzeMark size="lg" />
          <p className="text-center text-sm text-muted-foreground">
            Convite inválido ou expirado.
          </p>
        </div>
        <Card>
          <CardContent className="space-y-3 pt-6 text-sm">
            <p>O link do convite pode ter expirado ou já ter sido usado.</p>
            <p className="text-muted-foreground">
              Se você já definiu sua senha, basta entrar.
            </p>
            <Link
              href="/login"
              className="block text-center text-brand hover:underline"
            >
              Ir pro login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se ja tem senha definida (status active), redireciona pro dashboard
  // O Supabase considera senha definida quando confirmed_at existe e
  // password foi setado pelo usuario (não pelo invite)

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center gap-3">
        <OnzeMark size="lg" />
        <p className="text-center text-sm text-muted-foreground text-balance">
          Você foi convidado para usar a Onze. Defina sua senha para começar.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-4 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-text">
            Convite para: <strong>{user.email}</strong>
          </p>
          <AcceptInviteForm />
        </CardContent>
      </Card>
    </div>
  );
}
