import { cn } from "../../libs/utils";

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn("w-full overflow-x-auto", className)}><table className="w-full border-collapse">{children}</table></div>;
  }
  export function TableHeader({ children }: { children: React.ReactNode }) {
    return <thead className="bg-muted text-muted-foreground">{children}</thead>;
  }
  export function TableHead({ className, children }: { className?: string; children: React.ReactNode }) {
    return <th className={cn("px-4 py-2 text-left font-medium uppercase", className)}>{children}</th>;
  }
  export function TableBody({ children }: { children: React.ReactNode }) {
    return <tbody className="divide-y">{children}</tbody>;
  }
  export function TableRow({ className, children }: { className?: string; children: React.ReactNode }) {
    return <tr className={cn("hover:bg-accent", className)}>{children}</tr>;
  }
  export function TableCell({ className, children }: { className?: string; children: React.ReactNode }) {
    return <td className={cn("px-4 py-2", className)}>{children}</td>;
  }
            