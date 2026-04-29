import Link from "next/link";
import { OnzeMark } from "@/components/onze-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center gap-3">
        <OnzeMark size="lg" />
        <p className="text-center text-sm text-muted-foreground text-balance">
          Acesse a plataforma da sua escolinha.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@escola.com.br"
                required
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
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <Button asChild className="w-full">
              <Link href="/dashboard">Entrar</Link>
            </Button>

            <div className="relative my-2">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-[11px] uppercase text-muted-foreground">
                ou
              </span>
            </div>

            <Button variant="outline" className="w-full" type="button" disabled>
              Entrar com Google
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Sua escolinha ainda não tem Onze?{" "}
        <Link href="/cadastrar-escola" className="text-brand hover:underline">
          Conhecer planos
        </Link>
      </p>
    </div>
  );
}
