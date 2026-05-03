"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acceptInviteAction, type AcceptInviteState } from "./actions";

const initial: AcceptInviteState = { ok: false };

export function AcceptInviteForm() {
  const [state, formAction, pending] = useActionState(
    acceptInviteAction,
    initial
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Crie sua senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          disabled={pending}
          placeholder="Mínimo 8 caracteres"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="passwordConfirm">Confirme a senha</Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          disabled={pending}
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-err/10 px-3 py-2 text-sm text-err">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Salvando..." : "Definir senha e entrar"}
      </Button>
    </form>
  );
}
