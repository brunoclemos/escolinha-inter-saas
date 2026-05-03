"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  createAnthropometryAction,
  type CreateAnthropometryState,
} from "./actions";

const initial: CreateAnthropometryState = { ok: false };

export function AnthropometryForm({
  athleteId,
  athleteName,
}: {
  athleteId: string;
  athleteName: string;
}) {
  const [state, formAction, pending] = useActionState(
    createAnthropometryAction,
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
          {pending ? "Salvando..." : "Salvar medição"}
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
              <Label htmlFor="recordedAt">
                Data da medição <span className="text-err">*</span>
              </Label>
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
              <Label htmlFor="heightCm">Altura (cm)</Label>
              <Input
                id="heightCm"
                name="heightCm"
                type="number"
                min={50}
                max={250}
                step={1}
                placeholder="Ex: 142"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weightKg">Peso (kg)</Label>
              <Input
                id="weightKg"
                name="weightKg"
                type="number"
                min={10}
                max={200}
                step="0.1"
                placeholder="Ex: 38.5"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wingspanCm">Envergadura (cm)</Label>
              <Input
                id="wingspanCm"
                name="wingspanCm"
                type="number"
                min={50}
                max={250}
                step={1}
                placeholder="Ex: 145"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bodyFatPct">% gordura corporal</Label>
              <Input
                id="bodyFatPct"
                name="bodyFatPct"
                type="number"
                min={2}
                max={60}
                step="0.1"
                placeholder="Ex: 15.2"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Notas do preparador físico, condições, etc."
                disabled={pending}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            O IMC é calculado automaticamente a partir de altura e peso.
            Para {athleteName}, recomenda-se medições a cada 60-90 dias
            conforme protocolo da CBF Academy.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
