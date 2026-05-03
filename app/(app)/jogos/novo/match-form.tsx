"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMatchAction, type CreateMatchState } from "../actions";

const initial: CreateMatchState = { ok: false };

export function MatchForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    createMatchAction,
    initial
  );
  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/jogos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          <Save className="size-4" />
          {pending ? "Salvando..." : "Salvar jogo"}
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
              <Label htmlFor="kind">
                Tipo <span className="text-err">*</span>
              </Label>
              <select
                id="kind"
                name="kind"
                required
                disabled={pending}
                defaultValue="friendly"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="friendly">Amistoso</option>
                <option value="official">Oficial</option>
                <option value="training">Treino-jogo</option>
                <option value="tournament">Torneio</option>
              </select>
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
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="opponent">
                Adversário <span className="text-err">*</span>
              </Label>
              <Input
                id="opponent"
                name="opponent"
                placeholder="Ex: Escola Cruzeiro / SC Internacional Sub-13"
                required
                disabled={pending}
              />
            </div>

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
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ex: CT do Inter"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Mando de campo</Label>
              <div className="flex gap-2">
                {[
                  { v: true, l: "Casa" },
                  { v: false, l: "Fora" },
                ].map((opt) => (
                  <label
                    key={String(opt.v)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-brand-text"
                  >
                    <input
                      type="radio"
                      name="isHome"
                      value={String(opt.v)}
                      defaultChecked={opt.v === true}
                      className="sr-only"
                      disabled={pending}
                    />
                    {opt.l}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scoreUs">Placar nós</Label>
              <Input
                id="scoreUs"
                name="scoreUs"
                type="number"
                min={0}
                max={50}
                placeholder="—"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scoreThem">Placar adversário</Label>
              <Input
                id="scoreThem"
                name="scoreThem"
                type="number"
                min={0}
                max={50}
                placeholder="—"
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Resumo do jogo, momentos chave..."
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
