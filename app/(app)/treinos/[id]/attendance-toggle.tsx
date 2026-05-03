"use client";

import { useState, useTransition } from "react";
import { Check, X, Clock, Heart, FileText } from "lucide-react";
import { setAttendanceAction } from "../actions";

const STATUSES = [
  { code: "present", label: "Pres", icon: Check, color: "text-ok bg-ok/15" },
  { code: "late", label: "Atra", icon: Clock, color: "text-warn bg-warn/15" },
  { code: "absent", label: "Falt", icon: X, color: "text-err bg-err/15" },
  {
    code: "excused",
    label: "Just",
    icon: FileText,
    color: "text-muted-foreground bg-muted",
  },
  {
    code: "injured",
    label: "Lesão",
    icon: Heart,
    color: "text-warn bg-warn/15",
  },
] as const;

type Status = (typeof STATUSES)[number]["code"];

export function AttendanceToggle({
  sessionId,
  athleteId,
  initial,
}: {
  sessionId: string;
  athleteId: string;
  initial: string | null;
}) {
  const [current, setCurrent] = useState<Status | null>(
    (initial as Status) ?? null
  );
  const [pending, startTransition] = useTransition();

  const update = (status: Status) => {
    setCurrent(status);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("sessionId", sessionId);
      fd.set("athleteId", athleteId);
      fd.set("status", status);
      const result = await setAttendanceAction({ ok: false }, fd);
      if (!result.ok) {
        // rollback
        setCurrent((initial as Status) ?? null);
      }
    });
  };

  return (
    <div className="flex shrink-0 items-center gap-1">
      {STATUSES.map((s) => {
        const Icon = s.icon;
        const active = current === s.code;
        return (
          <button
            key={s.code}
            type="button"
            onClick={() => update(s.code)}
            disabled={pending}
            className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
              active
                ? s.color
                : "text-muted-foreground hover:bg-muted"
            } disabled:opacity-50`}
            aria-pressed={active}
          >
            <Icon className="size-3" />
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}
