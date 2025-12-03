"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function BatteryForm() {
  const [designCapacity, setDesignCapacity] = useState<string>("");
  const [currentCapacity, setCurrentCapacity] = useState<string>("");
  const [cycles, setCycles] = useState<string>("");
  const [avgTemp, setAvgTemp] = useState<string>("");

  const [soh, setSoh] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function parseNumber(value: string) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // simple required-field validation
    const newErrors: Record<string, string> = {};
    if (!designCapacity || designCapacity.toString().trim() === "") {
      newErrors.designCapacity = "Initial design capacity is required.";
    }
    if (!currentCapacity || currentCapacity.toString().trim() === "") {
      newErrors.currentCapacity = "Current capacity is required.";
    }
    if (!cycles || cycles.toString().trim() === "") {
      newErrors.cycles = "Number of cycles is required.";
    }
    if (!avgTemp || avgTemp.toString().trim() === "") {
      newErrors.avgTemp = "Average temperature is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSoh(null);
      setStatus(null);
      setMessages([]);
      return;
    }

    setErrors({});

    const design = parseNumber(designCapacity);
    const current = parseNumber(currentCapacity);
    const cyc = Math.round(parseNumber(cycles));
    const temp = parseNumber(avgTemp);

    const computedSoh = design > 0 ? (current / design) * 100 : 0;

    const outMessages: string[] = [];
    let computedStatus = "GOOD";

    if (computedSoh < 70) {
      computedStatus = "CRITICAL";
      outMessages.push(
        "Capacity is significantly degraded. Consider replacing the battery."
      );
    } else if (computedSoh < 85) {
      computedStatus = "WARNING";
      outMessages.push("Battery is aging. Consider power-saving mode.");
    } else {
      computedStatus = "GOOD";
      outMessages.push("Battery is in good condition.");
    }

    // 3. Context check
    if (cyc > 500) {
      outMessages.push(
        "The number of cycles has exceeded the typical lifespan."
      );
    }

    if (temp > 35) {
      outMessages.push(
        "Warning: High temperature damages the battery. Clean the ventilation."
      );
    }

    setSoh(Number(computedSoh.toFixed(1)));
    setStatus(computedStatus);
    setMessages(outMessages);
  }

  return (
    <div className="max-w-xl mx-auto p-6 rounded-lg border border-border bg-background">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Design capacity (mAh)
          </label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="5000"
            value={designCapacity}
            onChange={(e) => {
              setDesignCapacity(e.target.value);
              setErrors((prev) => {
                const copy = { ...prev };
                delete copy.designCapacity;
                return copy;
              });
            }}
            className="w-full rounded-md border px-3 py-2 bg-input text-sm"
            min={0}
          />
          {errors.designCapacity && (
            <p className="mt-1 text-sm text-destructive">
              {errors.designCapacity}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Current capacity (mAh)
          </label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="3200"
            value={currentCapacity}
            onChange={(e) => {
              setCurrentCapacity(e.target.value);
              setErrors((prev) => {
                const copy = { ...prev };
                delete copy.currentCapacity;
                return copy;
              });
            }}
            className="w-full rounded-md border px-3 py-2 bg-input text-sm"
            min={0}
          />
          {errors.currentCapacity && (
            <p className="mt-1 text-sm text-destructive">
              {errors.currentCapacity}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cycles</label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="450"
              value={cycles}
              onChange={(e) => {
                setCycles(e.target.value);
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.cycles;
                  return copy;
                });
              }}
              className="w-full rounded-md border px-3 py-2 bg-input text-sm"
              min={0}
            />
            {errors.cycles && (
              <p className="mt-1 text-sm text-destructive">{errors.cycles}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Avg temp (°C)
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="40"
              value={avgTemp}
              onChange={(e) => {
                setAvgTemp(e.target.value);
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.avgTemp;
                  return copy;
                });
              }}
              className="w-full rounded-md border px-3 py-2 bg-input text-sm"
            />
            {errors.avgTemp && (
              <p className="mt-1 text-sm text-destructive">{errors.avgTemp}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button type="submit">evaluate battery</Button>
        </div>
      </form>

      {soh !== null && (
        <div className="mt-6 rounded-md border border-border p-4 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                Health state (SoH)
              </div>
              <div className="text-2xl font-bold">{soh}%</div>
            </div>

            <div>
              <span
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-semibold",
                  status === "CRITICAL"
                    ? "bg-destructive/10 text-destructive"
                    : status === "WARNING"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                )}
              >
                {status}
              </span>
            </div>
          </div>

          <ul className="mt-4 list-disc list-inside space-y-1 text-sm">
            {messages.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
