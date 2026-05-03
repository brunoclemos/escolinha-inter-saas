import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <Card>
        <div className="divide-y">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="size-10 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
