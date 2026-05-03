import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <div className="mb-6 flex items-center gap-4">
        <Skeleton className="size-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
