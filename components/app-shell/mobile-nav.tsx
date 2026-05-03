"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Sidebar, type SidebarTenantInfo } from "./sidebar";
import { ParentSidebar } from "./parent-sidebar";

export function MobileNav({
  variant = "admin",
  tenant,
  tenantName,
}: {
  variant?: "admin" | "parent";
  tenant?: SidebarTenantInfo;
  tenantName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="md:hidden"
      >
        <Menu className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="p-0"
          onClick={(e) => {
            // Fecha quando clica num link dentro
            const target = e.target as HTMLElement;
            if (target.closest("a")) setOpen(false);
          }}
        >
          {/* Acessibilidade: Radix exige Title + Description */}
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <SheetDescription className="sr-only">
            Acesse as seções da plataforma Onze.
          </SheetDescription>

          {variant === "parent" ? (
            <ParentSidebar
              tenantName={tenantName ?? "Onze"}
              className="flex w-full"
            />
          ) : tenant ? (
            <Sidebar
              tenant={tenant}
              athleteCount={tenant.athleteCount}
              className="flex w-full"
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
