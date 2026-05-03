"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import {
  updateAthleteAction,
  type UpdateAthleteState,
} from "./actions";

const initialState: UpdateAthleteState = { ok: false };

type Category = { id: string; name: string; ageMin: number; ageMax: number };

type AthleteDefaults = {
  id: string;
  fullName: string;
  nickname: string | null;
  dob: string;
  positionMain: string | null;
  dominantFoot: "right" | "left" | "both" | null;
  jerseyNumber: number | null;
  categoryId: string | null;
};

export function EditAthleteForm({
  athlete,
  categories,
}: {
  athlete: AthleteDefaults;
  categories: Category[];
}) {
  const [state, formAction, pending] = useActionState(
    updateAthleteAction,
    initialState
  );

  const err = (field: string) => state.fieldErrors?.[field];
  const errClass = (field: string) =>
    err(field) ? "border-err focus-visible:ring-err" : "";

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="athleteId" value={athlete.id} />

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/atletas/${athlete.id}`}>
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          <Save className="size-4" />
          {pending ? "Salvando..." : "Salvar alterações"}
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
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">
                Nome completo <span className="text-err">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                required
                disabled={pending}
                defaultValue={athlete.fullName}
                className={errClass("fullName")}
              />
              {err("fullName") && (
                <p className="text-xs text-err">{err("fullName")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">Apelido</Label>
              <Input
                id="nickname"
                name="nickname"
                disabled={pending}
                defaultValue={athlete.nickname ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">
                Data de nascimento <span className="text-err">*</span>
              </Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                required
                disabled={pending}
                defaultValue={athlete.dob}
                max={new Date().toISOString().split("T")[0]}
                className={errClass("dob")}
              />
              {err("dob") && (
                <p className="text-xs text-err">{err("dob")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <select
                id="categoryId"
                name="categoryId"
                disabled={pending}
                defaultValue={athlete.categoryId ?? ""}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              >
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.ageMin}-{c.ageMax} anos)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionMain">Posição principal</Label>
              <select
                id="positionMain"
                name="positionMain"
                disabled={pending}
                defaultValue={athlete.positionMain ?? ""}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              >
                <option value="">Não definida</option>
                <option value="Goleiro">Goleiro</option>
                <option value="Zagueiro">Zagueiro</option>
                <option value="Lateral Direito">Lateral Direito</option>
                <option value="Lateral Esquerdo">Lateral Esquerdo</option>
                <option value="Volante">Volante</option>
                <option value="Meia">Meia</option>
                <option value="Meia-Atacante">Meia-Atacante</option>
                <option value="Ponta Direita">Ponta Direita</option>
                <option value="Ponta Esquerda">Ponta Esquerda</option>
                <option value="Atacante">Atacante</option>
                <option value="Centroavante">Centroavante</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Pé dominante</Label>
              <div className="flex gap-2">
                {(
                  [
                    { v: "right", l: "Direito" },
                    { v: "left", l: "Esquerdo" },
                    { v: "both", l: "Ambos" },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.v}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-brand-text"
                  >
                    <input
                      type="radio"
                      name="dominantFoot"
                      value={opt.v}
                      defaultChecked={athlete.dominantFoot === opt.v}
                      className="sr-only"
                      disabled={pending}
                    />
                    {opt.l}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jerseyNumber">Número da camisa</Label>
              <Input
                id="jerseyNumber"
                name="jerseyNumber"
                type="number"
                min={1}
                max={99}
                disabled={pending}
                defaultValue={athlete.jerseyNumber ?? ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
