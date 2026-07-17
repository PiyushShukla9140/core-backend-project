
import { Skeleton } from "@/components/ui/skeleton";

interface VideoSkeletonProps {
  count?: number;
}

const VideoSkeleton = ({
  count = 8,
}: VideoSkeletonProps) => {
  return (
    <section
      className="
        grid
        gap-6

        grid-cols-1

        sm:grid-cols-2

        lg:grid-cols-3

        xl:grid-cols-4
      "
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="space-y-3"
        >
          {/* Thumbnail */}
          <Skeleton className="aspect-video w-full rounded-xl" />

          {/* Content */}
          <div className="flex gap-3">
            {/* Avatar */}
            <Skeleton className="h-10 w-10 rounded-full" />

            {/* Text */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />

              <Skeleton className="h-4 w-3/4" />

              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default VideoSkeleton;