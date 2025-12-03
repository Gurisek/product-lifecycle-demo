import Link from "next/link";
import { Laptop, Server, Smartphone } from "lucide-react";
import Card, { CardTitle } from "@/components/ui/card";

export default function Home() {
  const items = [
    { href: "/laptop", title: "Laptop battery health", Icon: Laptop },
    { href: "/server", title: "Server — Cooling & Maintenance", Icon: Server },
    { href: "/smartphone", title: "Smartphone - storage & performance", Icon: Smartphone },
  ];

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <h3 className="text-muted-foreground mb-4">
        Choose what you need help with
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items.map(({ href, title, Icon }) => (
          <Link key={href} href={href} className="block">
            <Card className="hover:scale-[1.05] transform-gpu bg-sidebar-accent">
              <div className="flex items-center justify-center">
                <Icon size={48} className="text-primary" />
              </div>
              <CardTitle>{title}</CardTitle>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
