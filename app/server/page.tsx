"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button";
import Card from "../../components/ui/card";

export default function ServerPage() {
  const [cpuTemp, setCpuTemp] = useState<string>("");
  const [fanSpeed, setFanSpeed] = useState<string>("");

  const [status, setStatus] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function parseNumber(value: string) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!cpuTemp || cpuTemp.toString().trim() === "") {
      newErrors.cpuTemp = "Current CPU temperature is required.";
    }
    if (!fanSpeed || fanSpeed.toString().trim() === "") {
      newErrors.fanSpeed = "Current fan speed is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessages([]);
      setStatus(null);
      return;
    }

    setErrors({});

    const cpu = parseNumber(cpuTemp);
    const fan = Math.round(parseNumber(fanSpeed));

    const out: string[] = [];
    let computedStatus = "GOOD";

    if (cpu >= 85 || (cpu >= 80 && fan < 1200)) {
      computedStatus = "CRITICAL";
      out.push(
        "High temperature detected — immediate maintenance recommended: clean fans/filters and replace thermal paste."
      );
    } else if (cpu >= 75) {
      computedStatus = "WARNING";
      out.push(
        "CPU temperature is above optimal (>=75°C). Consider cleaning the case and checking thermal paste."
      );
    }
    if (fan < 1500) {
      if (computedStatus !== "CRITICAL") computedStatus = "WARNING";
      out.push(
        "Fan speed is lower than expected (<1500 RPM). Fan cleaning or bearing check recommended."
      );
    }
    if (cpu < 75 && fan >= 1500) {
      out.push(
        "Readings are within optimal ranges. Schedule routine cleaning every 6-12 months."
      );
    }
    if (cpu >= 80) {
      out.push(
        "Risk: sustained temperatures >=80°C increase throttling and hardware wear. Perform maintenance soon."
      );
    }

    setStatus(computedStatus);
    setMessages(out);
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-2">
        Server — Cooling & Maintenance
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the current CPU temperature and fan speed. The demo compares
        values to optimal ranges and suggests targeted maintenance actions.
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              CPU Temp (°C)
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g. 68"
              value={cpuTemp}
              onChange={(e) => {
                setCpuTemp(e.target.value);
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.cpuTemp;
                  return copy;
                });
              }}
              className="w-full rounded-md border px-3 py-2 bg-input text-sm"
              min={0}
            />
            {errors.cpuTemp && (
              <p className="mt-1 text-sm text-destructive">{errors.cpuTemp}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fan Speed (RPM)
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g. 2200"
              value={fanSpeed}
              onChange={(e) => {
                setFanSpeed(e.target.value);
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.fanSpeed;
                  return copy;
                });
              }}
              className="w-full rounded-md border px-3 py-2 bg-input text-sm"
              min={0}
            />
            {errors.fanSpeed && (
              <p className="mt-1 text-sm text-destructive">{errors.fanSpeed}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Button type="submit">evaluate battery</Button>
          </div>
        </form>

        {status && (
          <div className="mt-6 rounded-md border border-border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Recommendations
                </div>
                <div className="text-lg font-semibold">{status}</div>
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
      </Card>
    </div>
  );
}
