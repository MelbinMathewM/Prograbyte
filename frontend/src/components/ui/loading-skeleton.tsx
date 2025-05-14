import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/libs/utils";

const LoadingSkeletonCards = ({ isDark = false }: { isDark?: boolean }) => {
    return (
        <div className={`p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${isDark ? "bg-black/99" : "bg-white"}`}>
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "rounded-sm border p-4 shadow-sm space-y-4",
                        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <Skeleton isDark={isDark} className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton isDark={isDark} className="h-4 w-3/4" />
                            <Skeleton isDark={isDark} className="h-3 w-1/2" />
                        </div>
                    </div>

                    {/* Static Text Label */}
                    <p className={cn("text-lg font-semibold", isDark ? "text-gray-700" : "text-gray-300")}>
                        Prograbyte
                    </p>

                    {/* Button row */}
                    <div className="flex gap-2">
                        <Skeleton isDark={isDark} className="h-8 w-20" />
                        <Skeleton isDark={isDark} className="h-8 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeletonCards;
