import { Skeleton } from "@/components/ui/skeleton";

export const SurahSkeleton = () => {
  return (
    <div className="min-h-screen pattern-bg">
      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        <div className="glass-card rounded-xl p-8 animate-pulse">
          <div className="flex justify-center mb-6">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        {[1, 2, 3].map((index) => (
          <div key={index} className="glass-card rounded-xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};