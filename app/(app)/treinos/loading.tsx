import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="space-y-6">
        {[1, 2].map((m) => (
          <div key={m}>
            <Skeleton className="mb-2 h-3 w-24" />
            <Card>
              <div className="divide-y">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <Skeleton className="size-10 rounded-md" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
