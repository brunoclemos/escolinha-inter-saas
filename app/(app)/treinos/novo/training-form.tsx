"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createTrainingAction,
  type CreateTrainingState,
} from "../actions";

const initial: CreateTrainingState = { ok: false };

export function TrainingForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    createTrainingAction,
    initial
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/treinos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          <Save className="size-4" />
          {pending ? "Salvando..." : "Salvar treino"}
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
            <div className="space-y-1.5">
              <Label htmlFor="date">
                Data <span className="text-err">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={today}
                required
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="startTime">Horário</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                defaultValue="18:00"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="categoryId">Turma</Label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue=""
                disabled={pending}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Sem turma específica</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="durationMin">Duração (min)</Label>
              <Input
                id="durationMin"
                name="durationMin"
                type="number"
                min={15}
                max={300}
                placeholder="60"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="field">Local / campo</Label>
              <Input
                id="field"
                name="field"
                placeholder="Ex: Campo principal"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weather">Clima</Label>
              <Input
                id="weather"
                name="weather"
                placeholder="Ex: ensolarado"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="focus">Foco do treino</Label>
              <Input
                id="focus"
                name="focus"
                placeholder="Ex: Posicionamento defensivo + finalização"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Plano de aula, materiais, etc."
                disabled={pending}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
