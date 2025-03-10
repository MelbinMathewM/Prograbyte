import { cn } from "../../libs/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-lg bg-card text-card-foreground shadow-lg p-4", className)}>
      {children}
    </div>
  );
}
