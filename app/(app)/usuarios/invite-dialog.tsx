"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { inviteUserAction, type InviteUserState } from "./actions";

const initialState: InviteUserState = { ok: false };

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    inviteUserAction,
    initialState
  );
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.ok) {
      setShowSuccess(true);
      const t = setTimeout(() => {
        setShowSuccess(false);
        setOpen(false);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Convidar usuário
      </Button>
    );
  }

  const err = (field: string) => state.fieldErrors?.[field];

  return (
    <Card className="mb-4">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <p className="font-medium">Convidar usuário</p>
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

        {showSuccess ? (
          <div className="flex items-center gap-2 rounded-md border border-ok/30 bg-ok/10 p-3 text-sm text-ok">
            <CheckCircle2 className="size-4" />
            Convite enviado! O usuário vai receber um e-mail para definir a
            senha.
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="invite-fullName">Nome completo</Label>
                <Input
                  id="invite-fullName"
                  name="fullName"
                  required
                  disabled={pending}
                  placeholder="Ex: Ricardo Almeida"
                />
                {err("fullName") && (
                  <p className="text-xs text-err">{err("fullName")}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="invite-email">E-mail</Label>
                <Input
                  id="invite-email"
                  name="email"
                  type="email"
                  required
                  disabled={pending}
                  placeholder="ricardo@escola.com.br"
                />
                {err("email") && (
                  <p className="text-xs text-err">{err("email")}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="invite-role">Papel</Label>
                <select
                  id="invite-role"
                  name="role"
                  defaultValue="coach"
                  required
                  disabled={pending}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="coach">Professor(a)</option>
                  <option value="coordinator">Coordenação</option>
                  <option value="school_owner">Dona(o) da escolinha</option>
                </select>
              </div>
            </div>

            {state.error && (
              <p className="rounded-md bg-err/10 px-3 py-2 text-sm text-err">
                {state.error}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Enviando..." : "Enviar convite"}
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

            <p className="text-xs text-muted-foreground">
              O usuário recebe um e-mail com link para definir a senha. Vai
              ter acesso à plataforma da {" "}
              <span className="font-medium">sua escolinha</span> com o papel
              selecionado.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
