"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  createCategoryAction,
  type CreateCategoryState,
} from "./actions";

const initialState: CreateCategoryState = { ok: false };

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

export function NewCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createCategoryAction,
    initialState
  );
  const [color, setColor] = useState("#C8102E");

  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Nova turma
      </Button>
    );
  }

  const err = (field: string) => state.fieldErrors?.[field];

  return (
    <Card className="mb-4">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <p className="font-medium">Nova turma</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            disabled={pending}
            aria-label="Fechar"
          >
            <X className="size-4" />
          </Button>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Nome da turma</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Sub-19, Iniciantes A"
                required
                disabled={pending}
              />
              {err("name") && (
                <p className="text-xs text-err">{err("name")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ageMin">Idade mínima</Label>
              <Input
                id="ageMin"
                name="ageMin"
                type="number"
                min={3}
                max={20}
                placeholder="Ex: 5"
                required
                disabled={pending}
              />
              {err("ageMin") && (
                <p className="text-xs text-err">{err("ageMin")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ageMax">Idade máxima</Label>
              <Input
                id="ageMax"
                name="ageMax"
                type="number"
                min={3}
                max={20}
                placeholder="Ex: 7"
                required
                disabled={pending}
              />
              {err("ageMax") && (
                <p className="text-xs text-err">{err("ageMax")}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Cor da turma</Label>
              <input type="hidden" name="color" value={color} />
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
          </div>

          {state.error && (
            <p className="rounded-md bg-err/10 px-3 py-2 text-sm text-err">
              {state.error}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Criar turma"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
