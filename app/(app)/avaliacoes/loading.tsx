import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Card>
        <div className="space-y-3 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
