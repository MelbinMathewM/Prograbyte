// components/ui/skeleton.tsx
import { cn } from "@/libs/utils";

interface SkeletonProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
}

function Skeleton({ className, isDark = false, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md",
        isDark ? "bg-gray-700" : "bg-gray-300",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
