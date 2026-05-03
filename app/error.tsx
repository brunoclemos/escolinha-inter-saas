"use client";

import Link from "next/link";
import { OnzeMark } from "@/components/onze-mark";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <OnzeMark size="lg" />
      <div className="flex flex-col items-center gap-3">
        <AlertTriangle className="size-12 text-warn" />
        <h1 className="text-2xl font-semibold">Algo deu errado</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Encontramos um erro inesperado. Tente novamente ou volte ao início.
          Se o problema persistir, entre em contato com o suporte.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => reset()}>Tentar novamente</Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}
