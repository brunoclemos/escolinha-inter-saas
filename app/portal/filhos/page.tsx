import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { ageFromDob, initials } from "@/lib/utils";
import { getCurrentUser } from "@/lib/queries/current-user";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listChildrenByGuardianUser } from "@/lib/queries/parent";

export const dynamic = "force-dynamic";

export default async function PortalFilhosPage() {
  const profile = await getCurrentUser();
  if (!profile?.appUserId) return null;
  const tenant = await getCurrentTenant();
  const children = await listChildrenByGuardianUser(
    tenant.id,
    profile.appUserId
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <PageHeader
        title="Meus filhos"
        description={`${children.length} ${children.length === 1 ? "atleta vinculado" : "atletas vinculados"} à sua conta.`}
      />

      {children.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhum atleta vinculado.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="divide-y">
            {children.map((c) => (
              <Link
                key={c.id}
                href={`/portal/filhos/${c.id}` as never}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/40"
              >
                <Avatar className="size-12">
                  {c.photoUrl ? (
                    <AvatarImage src={c.photoUrl} alt={c.fullName} />
                  ) : null}
                  <AvatarFallback className="bg-brand-soft text-brand-text">
                    {initials(c.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {ageFromDob(c.dob)} anos
                    {c.positionMain && ` · ${c.positionMain}`}
                  </p>
                </div>
                {c.categoryName && (
                  <Badge variant="soft">{c.categoryName}</Badge>
                )}
                {c.jerseyNumber && (
                  <span className="font-mono text-lg font-semibold text-brand">
                    #{c.jerseyNumber}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
