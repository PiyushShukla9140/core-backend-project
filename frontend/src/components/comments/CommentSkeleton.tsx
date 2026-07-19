import { Skeleton } from "@/components/ui/skeleton";

const CommentSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSkeleton;