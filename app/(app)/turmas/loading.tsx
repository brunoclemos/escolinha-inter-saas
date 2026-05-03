import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <Skeleton className="h-1.5 w-full" />
            <CardContent className="space-y-2 pt-5">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
