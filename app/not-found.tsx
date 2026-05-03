import Link from "next/link";
import { OnzeMark } from "@/components/onze-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <OnzeMark size="lg" />
      <div className="space-y-2">
        <p className="font-mono text-6xl font-bold text-brand">404</p>
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <p className="text-sm text-muted-foreground">
          Essa página não existe ou foi removida.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Voltar ao início</Link>
      </Button>
    </div>
  );
}
