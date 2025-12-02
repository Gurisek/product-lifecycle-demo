import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-6 text-center transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("mt-4 text-lg font-semibold", className)}>{children}</h3>
  );
}

export default Card;
