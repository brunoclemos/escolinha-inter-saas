"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { ok: false };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@escola.com.br"
          required
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Link
            href="/recuperar-senha"
            className="text-xs text-brand hover:underline"
          >
            Esqueci a senha
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          minLength={6}
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-err/10 px-3 py-2 text-sm text-err">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </Button>

      <div className="relative my-2">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-[11px] uppercase text-muted-foreground">
          ou
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full"
        type="button"
        disabled
        title="Em breve"
      >
        Entrar com Google
      </Button>
    </form>
  );
}
