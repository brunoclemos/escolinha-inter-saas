"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  PHYSICAL_TESTS,
  PHYSICAL_CATEGORY_LABELS,
  type PhysicalTestSpec,
} from "@/lib/eval/physical-tests";
import {
  createPhysicalTestAction,
  type CreatePhysicalTestState,
} from "./actions";

const initial: CreatePhysicalTestState = { ok: false };

export function PhysicalForm({
  athleteId,
  athleteName,
  athleteAge,
}: {
  athleteId: string;
  athleteName: string;
  athleteAge: number;
}) {
  const [state, formAction, pending] = useActionState(
    createPhysicalTestAction,
    initial
  );
  const recommended = PHYSICAL_TESTS.filter(
    (t) => athleteAge >= t.ageMin && athleteAge <= t.ageMax
  );
  const [selectedCode, setSelectedCode] = useState<string>(
    recommended[0]?.code ?? PHYSICAL_TESTS[0].code
  );
  const selected = PHYSICAL_TESTS.find((t) => t.code === selectedCode);

  // Agrupa por categoria
  const byCategory = recommended.reduce<Record<string, PhysicalTestSpec[]>>(
    (acc, t) => {
      (acc[t.category] = acc[t.category] ?? []).push(t);
      return acc;
    },
    {}
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="athleteId" value={athleteId} />
      <input type="hidden" name="testCode" value={selectedCode} />

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/atletas/${athleteId}`}>
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          <Save className="size-4" />
          {pending ? "Salvando..." : "Salvar resultado"}
        </Button>
      </div>

      {state.error && (
        <div className="rounded-md border border-err/30 bg-err/10 px-4 py-3 text-sm text-err">
          {state.error}
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>
              Selecione o teste{" "}
              <span className="text-xs font-normal text-muted-foreground">
                ({recommended.length} recomendados pra Sub-{athleteAge})
              </span>
            </Label>
            <div className="space-y-3">
              {Object.entries(byCategory).map(([cat, tests]) => (
                <div key={cat}>
                  <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {
                      PHYSICAL_CATEGORY_LABELS[
                        cat as PhysicalTestSpec["category"]
                      ]
                    }
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tests.map((t) => (
                      <button
                        key={t.code}
                        type="button"
                        onClick={() => setSelectedCode(t.code)}
                        disabled={pending}
                        className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                          selectedCode === t.code
                            ? "border-brand bg-brand-soft text-brand-text"
                            : "border-input hover:bg-accent"
                        }`}
                      >
                        {t.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selected && (
            <div className="rounded-md bg-muted/40 p-3 text-sm">
              <div className="mb-1 flex items-center gap-2">
                <Timer className="size-4 text-brand" />
                <p className="font-medium">{selected.label}</p>
                <Badge variant="soft" className="text-[10px]">
                  {selected.improvement === "lower"
                    ? "Menor é melhor"
                    : "Maior é melhor"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {selected.description}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="value">
                Resultado{" "}
                <span className="text-xs text-muted-foreground">
                  ({selected?.unit ?? ""})
                </span>{" "}
                <span className="text-err">*</span>
              </Label>
              <Input
                id="value"
                name="value"
                type="number"
                step={selected?.unit === "s" ? "0.01" : "0.1"}
                placeholder={
                  selected?.unit === "s"
                    ? "Ex: 3.62"
                    : selected?.unit === "cm"
                      ? "Ex: 32.5"
                      : selected?.unit === "m"
                        ? "Ex: 1240"
                        : "Ex: 14"
                }
                required
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="recordedAt">Data</Label>
              <Input
                id="recordedAt"
                name="recordedAt"
                type="date"
                defaultValue={today}
                max={today}
                required
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="field">Local / campo</Label>
              <Input
                id="field"
                name="field"
                placeholder="Ex: Campo 2"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shift">Turno</Label>
              <select
                id="shift"
                name="shift"
                defaultValue=""
                disabled={pending}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">—</option>
                <option value="morning">Manhã</option>
                <option value="afternoon">Tarde</option>
                <option value="evening">Noite</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weather">Condição</Label>
              <select
                id="weather"
                name="weather"
                defaultValue=""
                disabled={pending}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">—</option>
                <option value="dry">Campo seco</option>
                <option value="wet">Campo molhado</option>
                <option value="indoor">Indoor</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="observation">Observação</Label>
              <textarea
                id="observation"
                name="observation"
                rows={2}
                placeholder="Ex: vento contra, cansado, etc"
                disabled={pending}
                className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Resultado de <span className="font-medium">{athleteName}</span>{" "}
            (Sub-{athleteAge}). Você pode fazer várias medições do mesmo teste
            ao longo do tempo — cada uma fica gravada com a data.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
