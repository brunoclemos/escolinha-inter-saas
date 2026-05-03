"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ScoreRow({
  name,
  label,
  pending,
}: {
  name: string;
  label: string;
  pending: boolean;
}) {
  const [score, setScore] = useState<string>("");
  const [showComment, setShowComment] = useState(false);
  const num = Number.parseInt(score, 10);
  const valid = Number.isFinite(num) && num >= 1 && num <= 10;

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center gap-3">
        <label
          htmlFor={name}
          className="flex-1 text-sm font-medium leading-tight"
        >
          {label}
        </label>

        <div className="flex items-center gap-2">
          <Input
            id={name}
            name={name}
            type="number"
            min={1}
            max={10}
            placeholder="—"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            disabled={pending}
            className="h-8 w-14 text-center font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowComment((v) => !v)}
            className="text-[11px] text-muted-foreground hover:text-foreground"
            disabled={pending}
            aria-label="Adicionar comentário"
          >
            {showComment ? "−" : "+"} obs
          </button>
        </div>
      </div>

      {valid && (
        <div className="mt-2">
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={
                num >= 8
                  ? "bg-ok"
                  : num >= 5
                    ? "bg-warn"
                    : "bg-err"
              }
              style={{ width: `${num * 10}%` }}
            />
          </div>
        </div>
      )}

      {showComment && (
        <textarea
          name={`${name}_comment`}
          placeholder="Observação (opcional)"
          rows={2}
          disabled={pending}
          className="mt-2 w-full rounded-md border border-input bg-transparent px-2 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      )}
    </div>
  );
}
