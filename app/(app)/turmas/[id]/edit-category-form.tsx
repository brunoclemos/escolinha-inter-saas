"use client";

import { useActionState, useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateCategoryAction,
  type UpdateCategoryState,
} from "./actions";

const initial: UpdateCategoryState = { ok: false };

const PRESET_COLORS = [
  "#C8102E",
  "#E76F51",
  "#F4A261",
  "#E9C46A",
  "#2A9D8F",
  "#264653",
  "#118AB2",
  "#9B5DE5",
];

type Coach = { id: string; fullName: string; role: string };

const ROLE_LABEL: Record<string, string> = {
  coach: "Professor(a)",
  coordinator: "Coordenação",
  school_owner: "Dono(a)",
};

export function EditCategoryForm({
  category,
  coaches,
}: {
  category: {
    id: string;
    name: string;
    ageMin: number;
    ageMax: number;
    color: string | null;
    headCoachId: string | null;
  };
  coaches: Coach[];
}) {
  const [state, formAction, pending] = useActionState(
    updateCategoryAction,
    initial
  );
  const [color, setColor] = useState(category.color ?? "#C8102E");

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="categoryId" value={category.id} />
      <input type="hidden" name="color" value={color} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            defaultValue={category.name}
            required
            disabled={pending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ageMin">Idade mínima</Label>
          <Input
            id="ageMin"
            name="ageMin"
            type="number"
            min={3}
            max={20}
            defaultValue={category.ageMin}
            required
            disabled={pending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ageMax">Idade máxima</Label>
          <Input
            id="ageMax"
            name="ageMax"
            type="number"
            min={3}
            max={20}
            defaultValue={category.ageMax}
            required
            disabled={pending}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>Cor</Label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`size-8 rounded-md border-2 transition-all ${
                  color === c
                    ? "border-foreground scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Cor ${c}`}
                disabled={pending}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="size-8 cursor-pointer rounded-md border"
              disabled={pending}
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="headCoachId">Professor responsável</Label>
          <select
            id="headCoachId"
            name="headCoachId"
            defaultValue={category.headCoachId ?? ""}
            disabled={pending}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Sem professor responsável</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({ROLE_LABEL[c.role] ?? c.role})
              </option>
            ))}
          </select>
          {coaches.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Nenhum professor cadastrado. Convide um em /usuarios.
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <p className="rounded-md bg-err/10 px-3 py-2 text-sm text-err">
          {state.error}
        </p>
      )}

      {state.ok && (
        <p className="flex items-center gap-2 rounded-md bg-ok/10 px-3 py-2 text-sm text-ok">
          <CheckCircle2 className="size-4" />
          Turma atualizada.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        <Save className="size-4" />
        {pending ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
