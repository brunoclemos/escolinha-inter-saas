"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Save, Edit3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initials } from "@/lib/utils";
import { setMatchStatsAction } from "../actions";

type Stats = {
  minutesPlayed: number | null;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number | null;
  positionPlayed: string | null;
};

export function StatRow({
  matchId,
  athlete,
  initial,
}: {
  matchId: string;
  athlete: {
    id: string;
    fullName: string;
    jerseyNumber: number | null;
    photoUrl: string | null;
  };
  initial: Stats;
}) {
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState<Stats>(initial);
  const [pending, startTransition] = useTransition();

  const save = (data: FormData) => {
    startTransition(async () => {
      data.set("matchId", matchId);
      data.set("athleteId", athlete.id);
      const result = await setMatchStatsAction({ ok: false }, data);
      if (result.ok) {
        setEditing(false);
        // Optimistic update já foi aplicado via state
      }
    });
  };

  if (!editing) {
    const hasStats =
      stats.minutesPlayed != null ||
      stats.goals > 0 ||
      stats.assists > 0 ||
      stats.yellowCards > 0 ||
      stats.redCards > 0 ||
      stats.rating != null;
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border p-3">
        <Link
          href={`/atletas/${athlete.id}`}
          className="flex items-center gap-3 hover:underline min-w-0 flex-1"
        >
          <Avatar className="size-9 shrink-0">
            {athlete.photoUrl ? (
              <AvatarImage src={athlete.photoUrl} alt={athlete.fullName} />
            ) : null}
            <AvatarFallback className="bg-brand-soft text-brand-text text-xs">
              {initials(athlete.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{athlete.fullName}</p>
            {athlete.jerseyNumber && (
              <p className="text-xs text-muted-foreground">
                #{athlete.jerseyNumber}
                {stats.positionPlayed && ` · ${stats.positionPlayed}`}
              </p>
            )}
          </div>
        </Link>
        {hasStats && (
          <div className="hidden gap-3 text-xs sm:flex">
            {stats.minutesPlayed != null && (
              <Stat label="min" v={stats.minutesPlayed} />
            )}
            {stats.goals > 0 && <Stat label="gols" v={stats.goals} accent />}
            {stats.assists > 0 && <Stat label="ass" v={stats.assists} />}
            {stats.yellowCards > 0 && (
              <Stat label="amar" v={stats.yellowCards} />
            )}
            {stats.redCards > 0 && (
              <Stat label="verm" v={stats.redCards} />
            )}
            {stats.rating != null && (
              <Stat label="nota" v={stats.rating} accent />
            )}
          </div>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditing(true)}
          disabled={pending}
        >
          <Edit3 className="size-3" />
          {hasStats ? "Editar" : "Lançar"}
        </Button>
      </div>
    );
  }

  return (
    <form
      action={save}
      className="space-y-2 rounded-md border bg-muted/20 p-3"
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-brand-soft text-brand-text text-xs">
            {initials(athlete.fullName)}
          </AvatarFallback>
        </Avatar>
        <p className="flex-1 text-sm font-medium">{athlete.fullName}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
        <NumField
          label="Min"
          name="minutesPlayed"
          defaultValue={stats.minutesPlayed ?? ""}
          max={150}
          onChange={(v) => setStats((s) => ({ ...s, minutesPlayed: v }))}
        />
        <NumField
          label="Gols"
          name="goals"
          defaultValue={stats.goals}
          max={20}
          onChange={(v) => setStats((s) => ({ ...s, goals: v ?? 0 }))}
        />
        <NumField
          label="Ass"
          name="assists"
          defaultValue={stats.assists}
          max={20}
          onChange={(v) => setStats((s) => ({ ...s, assists: v ?? 0 }))}
        />
        <NumField
          label="Amar"
          name="yellowCards"
          defaultValue={stats.yellowCards}
          max={2}
          onChange={(v) => setStats((s) => ({ ...s, yellowCards: v ?? 0 }))}
        />
        <NumField
          label="Verm"
          name="redCards"
          defaultValue={stats.redCards}
          max={1}
          onChange={(v) => setStats((s) => ({ ...s, redCards: v ?? 0 }))}
        />
        <NumField
          label="Nota"
          name="rating"
          defaultValue={stats.rating ?? ""}
          min={1}
          max={10}
          onChange={(v) => setStats((s) => ({ ...s, rating: v }))}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor={`pos-${athlete.id}`}
          className="text-[10px] uppercase tracking-wider text-muted-foreground"
        >
          Posição que jogou
        </label>
        <Input
          id={`pos-${athlete.id}`}
          name="positionPlayed"
          defaultValue={stats.positionPlayed ?? ""}
          placeholder="Ex: Atacante"
          className="h-8 text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          <Save className="size-3" />
          {pending ? "..." : "Salvar"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setStats(initial);
            setEditing(false);
          }}
          disabled={pending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function NumField({
  label,
  name,
  defaultValue,
  min = 0,
  max,
  onChange,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  min?: number;
  max?: number;
  onChange: (v: number | null) => void;
}) {
  return (
    <div className="space-y-0.5">
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        type="number"
        name={name}
        defaultValue={defaultValue}
        min={min}
        max={max}
        onChange={(e) => {
          const v = e.target.value === "" ? null : Number(e.target.value);
          onChange(v);
        }}
        className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
}

function Stat({
  label,
  v,
  accent = false,
}: {
  label: string;
  v: number;
  accent?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`font-mono text-sm font-semibold tabular-nums ${
          accent ? "text-brand" : ""
        }`}
      >
        {v}
      </p>
    </div>
  );
}
