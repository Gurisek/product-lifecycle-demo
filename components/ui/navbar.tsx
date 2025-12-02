"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname() ?? "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkBase = "text-sm hover:underline";

  return (
    <nav className="w-full border-b border-border bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold antialiased"
          >
            Product Lifecycle
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/laptop"
              className={cn(
                linkBase,
                "font-medium",
                isActive("/laptop")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              Laptop
            </Link>

            <Link
              href="/server"
              className={cn(
                linkBase,
                "font-medium",
                isActive("/server")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              Server
            </Link>

            <Link
              href="/smartphone"
              className={cn(
                linkBase,
                "font-medium",
                isActive("/smartphone")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              Smartphone
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
