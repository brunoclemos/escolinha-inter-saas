import Link from "next/link";
import { Heart, FileText, MessageCircle, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ageFromDob, initials } from "@/lib/utils";
import { getCurrentUser } from "@/lib/queries/current-user";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listChildrenByGuardianUser } from "@/lib/queries/parent";

export const dynamic = "force-dynamic";

export default async function PortalInicioPage() {
  const profile = await getCurrentUser();
  if (!profile?.appUserId) return null;
  const tenant = await getCurrentTenant();
  const children = await listChildrenByGuardianUser(
    tenant.id,
    profile.appUserId
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {profile.fullName.split(" ")[0]}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe a evolução {children.length === 1 ? "do seu filho" : "dos seus filhos"} na {tenant.name}.
        </p>
      </div>

      {children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Heart className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">
                Nenhum atleta vinculado à sua conta ainda.
              </p>
              <p className="text-sm text-muted-foreground">
                Entre em contato com a coordenação da escolinha para vincular
                o seu filho ao seu acesso.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {children.map((c) => (
            <Link key={c.id} href={`/portal/filhos/${c.id}` as never}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 pt-6">
                  <Avatar className="size-16">
                    {c.photoUrl ? (
                      <AvatarImage src={c.photoUrl} alt={c.fullName} />
                    ) : null}
                    <AvatarFallback className="bg-brand-soft text-brand-text">
                      {initials(c.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{c.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {ageFromDob(c.dob)} anos
                      {c.positionMain && ` · ${c.positionMain}`}
                    </p>
                    {c.categoryName && (
                      <Badge variant="soft" className="mt-2 text-[10px]">
                        {c.categoryName}
                      </Badge>
                    )}
                  </div>
                  {c.jerseyNumber && (
                    <span className="font-mono text-2xl font-bold text-brand">
                      #{c.jerseyNumber}
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 pt-6 text-center">
            <FileText className="mx-auto size-8 text-brand" />
            <p className="text-sm font-medium">Relatórios</p>
            <p className="text-xs text-muted-foreground">
              Em breve — relatórios mensais por e-mail.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 pt-6 text-center">
            <Trophy className="mx-auto size-8 text-brand" />
            <p className="text-sm font-medium">Próximos jogos</p>
            <p className="text-xs text-muted-foreground">
              Calendário das categorias do seu filho.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 pt-6 text-center">
            <MessageCircle className="mx-auto size-8 text-brand" />
            <p className="text-sm font-medium">Mensagens</p>
            <p className="text-xs text-muted-foreground">
              Em breve — fale direto com a coordenação.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
