"use client";

import BatteryForm from "@/components/ui/battery-form";

export default function LaptopPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4">Laptop Battery Health</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your laptop&apos;s battery details below to check its health and get
        recommendations for maintenance or replacement.
      </p>

      <BatteryForm />
    </div>
  );
}
