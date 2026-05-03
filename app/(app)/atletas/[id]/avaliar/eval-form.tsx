"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  TECHNICAL_FUNDAMENTALS,
  TACTICAL_DIMENSIONS,
  PSYCH_DIMENSIONS,
} from "@/lib/eval/fundamentos";
import { ScoreRow } from "./score-row";
import { createEvaluationAction, type CreateEvalState } from "./actions";

const initial: CreateEvalState = { ok: false };

export function EvalForm({
  athleteId,
  athleteName,
}: {
  athleteId: string;
  athleteName: string;
}) {
  const [state, formAction, pending] = useActionState(
    createEvaluationAction,
    initial
  );
  const [statusToSubmit, setStatusToSubmit] = useState<"draft" | "published">(
    "draft"
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="athleteId" value={athleteId} />
      <input type="hidden" name="status" value={statusToSubmit} />

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/atletas/${athleteId}`}>
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="outline"
            disabled={pending}
            onClick={() => setStatusToSubmit("draft")}
          >
            <Save className="size-4" />
            Salvar rascunho
          </Button>
          <Button
            type="submit"
            disabled={pending}
            onClick={() => setStatusToSubmit("published")}
          >
            <Send className="size-4" />
            {pending ? "Salvando..." : "Publicar"}
          </Button>
        </div>
      </div>

      {state.error && (
        <div className="rounded-md border border-err/30 bg-err/10 px-4 py-3 text-sm text-err">
          {state.error}
        </div>
      )}

      <Card>
        <CardContent className="space-y-3 pt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="periodLabel">Período</Label>
              <Input
                id="periodLabel"
                name="periodLabel"
                placeholder="Ex: 1º trimestre 2026"
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="invisible">Atleta</Label>
              <p className="flex h-9 items-center px-2 text-sm text-muted-foreground">
                Atleta: <span className="ml-1 font-medium text-foreground">{athleteName}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Técnica */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Técnica</CardTitle>
          <Badge variant="soft">
            {TECHNICAL_FUNDAMENTALS.length} fundamentos
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="mb-3 text-xs text-muted-foreground">
            Notas de 1 a 10. Deixe em branco fundamentos não avaliados nessa
            sessão.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {TECHNICAL_FUNDAMENTALS.map((f) => (
              <ScoreRow
                key={f.key}
                name={`tech_${f.key}`}
                label={f.label}
                pending={pending}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tática */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Tática</CardTitle>
          <Badge variant="soft">{TACTICAL_DIMENSIONS.length} dimensões</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {TACTICAL_DIMENSIONS.map((d) => (
              <ScoreRow
                key={d.key}
                name={`tact_${d.key}`}
                label={d.label}
                pending={pending}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Psicológica */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Psicológica / Socioemocional</CardTitle>
          <Badge variant="soft">{PSYCH_DIMENSIONS.length} dimensões</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {PSYCH_DIMENSIONS.map((d) => (
              <ScoreRow
                key={d.key}
                name={`psych_${d.key}`}
                label={d.label}
                pending={pending}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Parecer geral</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            name="summaryText"
            rows={4}
            placeholder="Resumo da avaliação. Pontos fortes, pontos a desenvolver, metas para o próximo período. Tom positivo e formativo."
            disabled={pending}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Lembre-se: tom positivo, formativo, nunca comparativo entre crianças.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
