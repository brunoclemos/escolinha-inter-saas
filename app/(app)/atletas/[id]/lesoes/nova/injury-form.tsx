"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInjuryAction, type CreateInjuryState } from "./actions";

const initial: CreateInjuryState = { ok: false };

export function InjuryForm({
  athleteId,
  athleteName,
}: {
  athleteId: string;
  athleteName: string;
}) {
  const [state, formAction, pending] = useActionState(
    createInjuryAction,
    initial
  );
  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="athleteId" value={athleteId} />

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/atletas/${athleteId}`}>
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          <Save className="size-4" />
          {pending ? "Salvando..." : "Registrar lesão"}
        </Button>
      </div>

      {state.error && (
        <div className="rounded-md border border-err/30 bg-err/10 px-4 py-3 text-sm text-err">
          {state.error}
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="type">
                Tipo da lesão <span className="text-err">*</span>
              </Label>
              <Input
                id="type"
                name="type"
                required
                placeholder="Ex: Entorse de tornozelo, Estiramento muscular"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bodyPart">Parte do corpo</Label>
              <Input
                id="bodyPart"
                name="bodyPart"
                placeholder="Ex: tornozelo direito, joelho esquerdo"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Severidade</Label>
              <div className="flex gap-2">
                {(
                  [
                    { v: "minor", l: "Leve", color: "ok" },
                    { v: "moderate", l: "Moderada", color: "warn" },
                    { v: "severe", l: "Severa", color: "err" },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.v}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-brand-text"
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={opt.v}
                      defaultChecked={opt.v === "minor"}
                      className="sr-only"
                      disabled={pending}
                      required
                    />
                    {opt.l}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="occurredAt">
                Data da lesão <span className="text-err">*</span>
              </Label>
              <Input
                id="occurredAt"
                name="occurredAt"
                type="date"
                defaultValue={today}
                max={today}
                required
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="daysOut">Dias afastado (estimativa)</Label>
              <Input
                id="daysOut"
                name="daysOut"
                type="number"
                min={0}
                max={365}
                placeholder="Ex: 14"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="returnedAt">
                Data de retorno (se já retornou)
              </Label>
              <Input
                id="returnedAt"
                name="returnedAt"
                type="date"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Como aconteceu, sintomas, exame médico..."
                disabled={pending}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="treatment">Tratamento</Label>
              <textarea
                id="treatment"
                name="treatment"
                rows={2}
                placeholder="Fisioterapia, medicação, repouso..."
                disabled={pending}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Registro médico de <span className="font-medium">{athleteName}</span>.
            Dados sensíveis — visíveis apenas para coordenação e responsáveis.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
