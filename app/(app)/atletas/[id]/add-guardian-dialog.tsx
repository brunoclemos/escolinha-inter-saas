"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addGuardianAction, type AddGuardianState } from "./guardian-actions";

const initialState: AddGuardianState = { ok: false };

export function AddGuardianDialog({ athleteId }: { athleteId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    addGuardianAction,
    initialState
  );

  useEffect(() => {
    if (state.ok) {
      setOpen(false);
    }
  }, [state.ok]);

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        Adicionar responsável
      </Button>
    );
  }

  const err = (field: string) => state.fieldErrors?.[field];

  return (
    <div className="space-y-3 rounded-md border bg-muted/30 p-3">
      <p className="text-sm font-medium">Novo responsável</p>
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="athleteId" value={athleteId} />

        <div className="space-y-1.5">
          <Label htmlFor="g-fullName" className="text-xs">
            Nome completo
          </Label>
          <Input
            id="g-fullName"
            name="fullName"
            required
            disabled={pending}
            placeholder="Ex: Maria Silva"
            className="h-8 text-sm"
          />
          {err("fullName") && (
            <p className="text-[11px] text-err">{err("fullName")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="g-relationship" className="text-xs">
            Parentesco
          </Label>
          <select
            id="g-relationship"
            name="relationship"
            required
            disabled={pending}
            className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue=""
          >
            <option value="" disabled>
              Selecione...
            </option>
            <option value="mother">Mãe</option>
            <option value="father">Pai</option>
            <option value="stepmother">Madrasta</option>
            <option value="stepfather">Padrasto</option>
            <option value="grandmother">Avó</option>
            <option value="grandfather">Avô</option>
            <option value="aunt">Tia</option>
            <option value="uncle">Tio</option>
            <option value="tutor">Tutor(a) legal</option>
            <option value="sibling">Irmão/Irmã</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="g-whatsapp" className="text-xs">
            WhatsApp
          </Label>
          <Input
            id="g-whatsapp"
            name="whatsapp"
            type="tel"
            disabled={pending}
            placeholder="(51) 99999-9999"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="g-email" className="text-xs">
            E-mail
          </Label>
          <Input
            id="g-email"
            name="email"
            type="email"
            disabled={pending}
            placeholder="responsavel@email.com"
            className="h-8 text-sm"
          />
          {err("email") && (
            <p className="text-[11px] text-err">{err("email")}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            name="isPrimary"
            className="size-3.5"
            disabled={pending}
          />
          <span>Responsável principal</span>
        </label>

        {state.error && (
          <p className="rounded bg-err/10 p-2 text-xs text-err">
            {state.error}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1" disabled={pending}>
            {pending ? "Salvando..." : "Adicionar"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
