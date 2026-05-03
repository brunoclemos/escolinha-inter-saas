"use client";

import { useEffect } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({
  athleteName,
  period,
}: {
  athleteName: string;
  period: string;
}) {
  useEffect(() => {
    // Define o título da janela pra que o nome do PDF fique bom no "Salvar como"
    const slug = `${athleteName} - ${period}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    document.title = `relatorio-${slug}`;
    return () => {
      document.title = "Onze";
    };
  }, [athleteName, period]);

  return (
    <Button onClick={() => window.print()}>
      <Printer className="size-4" />
      Salvar como PDF
    </Button>
  );
}
