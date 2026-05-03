import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ComingSoon({
  icon: Icon = Sparkles,
  title,
  description,
  features = [],
  phase,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  phase?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Icon className="size-6" />
        </div>
        <div className="max-w-md space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            {phase && <Badge variant="soft">{phase}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {features.length > 0 && (
          <ul className="grid gap-1.5 text-left text-sm text-muted-foreground">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-1.5 inline-block size-1 shrink-0 rounded-full bg-brand" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
