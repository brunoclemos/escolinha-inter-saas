"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";

type SearchResult = {
  athletes: {
    id: string;
    fullName: string;
    nickname: string | null;
    photoUrl: string | null;
    positionMain: string | null;
    jerseyNumber: number | null;
  }[];
  categories: {
    id: string;
    name: string;
    ageMin: number;
    ageMax: number;
  }[];
};

const EMPTY: SearchResult = { athletes: [], categories: [] };

export function GlobalSearch({
  variant = "full",
}: {
  variant?: "full" | "icon";
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult>(EMPTY);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      setQ("");
      setResults(EMPTY);
    }
  }, [open]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults(EMPTY);
      return;
    }
    const t = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(q)}`
          );
          if (res.ok) {
            const data = (await res.json()) as SearchResult;
            setResults(data);
          }
        } catch {
          // ignore
        }
      });
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const empty =
    results.athletes.length === 0 && results.categories.length === 0;

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buscar"
          className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent sm:hidden"
        >
          <Search className="size-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative hidden h-8 w-full max-w-md items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent sm:flex"
        >
          <Search className="size-4 shrink-0" />
          <span className="flex-1 text-left">Buscar atleta, turma...</span>
          <kbd className="hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-full max-w-md p-0 sm:max-w-lg"
        >
          <SheetTitle className="sr-only">Busca rápida</SheetTitle>
          <SheetDescription className="sr-only">
            Busque atletas e turmas pelo nome.
          </SheetDescription>

          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar atleta, turma..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              ESC
            </kbd>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-2">
            {q.trim().length < 2 ? (
              <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                Digite pelo menos 2 caracteres pra buscar.
              </p>
            ) : empty ? (
              <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                Nada encontrado pra &quot;{q}&quot;.
              </p>
            ) : (
              <>
                {results.athletes.length > 0 && (
                  <div className="mb-2">
                    <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Atletas ({results.athletes.length})
                    </p>
                    {results.athletes.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => go(`/atletas/${a.id}`)}
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-accent"
                      >
                        <Avatar className="size-8 shrink-0">
                          {a.photoUrl ? (
                            <AvatarImage src={a.photoUrl} alt={a.fullName} />
                          ) : null}
                          <AvatarFallback className="bg-brand-soft text-brand-text text-xs">
                            {initials(a.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {a.fullName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {a.nickname && `"${a.nickname}" · `}
                            {a.positionMain ?? "Posição não definida"}
                          </p>
                        </div>
                        {a.jerseyNumber && (
                          <span className="font-mono text-sm font-semibold text-muted-foreground">
                            #{a.jerseyNumber}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {results.categories.length > 0 && (
                  <div className="mb-2">
                    <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Turmas ({results.categories.length})
                    </p>
                    {results.categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => go(`/turmas/${c.id}`)}
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-accent"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                          <Shield className="size-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {c.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {c.ageMin}-{c.ageMax} anos
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t bg-muted/30 px-4 py-2 text-[10px] text-muted-foreground">
            Use{" "}
            <kbd className="rounded border bg-card px-1 py-0.5 font-mono">
              ⌘K
            </kbd>{" "}
            ou{" "}
            <kbd className="rounded border bg-card px-1 py-0.5 font-mono">
              Ctrl K
            </kbd>{" "}
            pra abrir/fechar
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
