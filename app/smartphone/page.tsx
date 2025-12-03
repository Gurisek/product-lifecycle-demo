"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle } from "lucide-react";

export default function SmartphonePage() {
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [used, setUsed] = useState<number | undefined>(undefined);
  const [responseMs, setResponseMs] = useState<number | undefined>(undefined);
  const [cacheGb, setCacheGb] = useState<number | undefined>(undefined);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const totalNum = Number(total) || 0;
  const usedNum = Number(used) || 0;

  const usedPercent = totalNum > 0 ? (usedNum / totalNum) * 100 : 0;

  let status: "critical" | "warning" | "ok" = "ok";
  if (usedPercent >= 90) status = "critical";
  else if (usedPercent >= 80) status = "warning";

  const spaceToFreeTo90 = Math.max(0, usedNum - totalNum * 0.9);
  const recommendedFreePercent = 10;
  const spaceToFreeToRecommended = Math.max(
    0,
    usedNum - totalNum * (1 - recommendedFreePercent / 100)
  );

  function evaluate() {
    setIsEvaluated(true);
  }

  function reset() {
    setTotal(undefined);
    setUsed(undefined);
    setResponseMs(undefined);
    setCacheGb(undefined);
    setIsEvaluated(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Smartphone Storage & Performance
      </h1>

      <p className="text-sm text-muted-foreground mb-6">
        Enter your smartphone storage values to see whether storage saturation
        could be causing slow performance and get actionable recommendations to
        restore responsiveness.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Device Information</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="total">Total storage (GB)</Label>
              <Input
                id="total"
                type="number"
                min={1}
                value={total ?? ""}
                onChange={(e) =>
                  setTotal(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                placeholder="e.g. 128"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="used">Used storage (GB)</Label>
              <Input
                id="used"
                type="number"
                min={0}
                max={total}
                value={used ?? ""}
                onChange={(e) =>
                  setUsed(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                placeholder="e.g. 115"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="response">
                Approx. system response (ms, optional)
              </Label>
              <Input
                id="response"
                type="number"
                min={0}
                value={responseMs ?? ""}
                onChange={(e) =>
                  setResponseMs(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                placeholder="e.g. 800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cache">Total app cache (GB, optional)</Label>
              <Input
                id="cache"
                type="number"
                min={0}
                step="0.1"
                value={cacheGb ?? ""}
                onChange={(e) =>
                  setCacheGb(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                placeholder="e.g. 4.2"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={evaluate}>Evaluate</Button>
              <Button variant="outline" onClick={reset}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
          {!isEvaluated ? (
            <p className="text-sm text-muted-foreground">
              Enter device information and click Evaluate to see the analysis.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Storage used</div>
                  <div className="text-sm text-muted-foreground">
                    {usedNum} / {totalNum} GB ({usedPercent.toFixed(1)}%)
                  </div>
                </div>

                <div className="w-full bg-secondary h-3 rounded overflow-hidden">
                  <div
                    className={`h-3 transition-all ${
                      status === "critical"
                        ? "bg-destructive"
                        : status === "warning"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, usedPercent))}%`,
                    }}
                  />
                </div>
              </div>

              {totalNum <= 0 ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Invalid Input</AlertTitle>
                  <AlertDescription>
                    Please enter a valid total storage value.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {status === "critical" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Critical: Storage Nearly Full</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">
                          Your smartphone storage is nearly full. When storage
                          exceeds ~90%, the operating system may not have enough
                          space for temporary files and caches, causing
                          slowdowns even when hardware is fine.
                        </p>
                        <p className="font-medium">
                          Space to free to reach 90%:{" "}
                          {spaceToFreeTo90.toFixed(2)} GB
                        </p>
                        <p>
                          Recommended target (≥{recommendedFreePercent}% free):
                          free {spaceToFreeToRecommended.toFixed(2)} GB
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {status === "warning" && (
                    <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-100">
                      <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <AlertTitle>
                        Warning: Approaching Critical Capacity
                      </AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">
                          You&apos;re using a large portion of your storage.
                          Performance may degrade as space becomes scarce.
                        </p>
                        <p>
                          Space to free to reach 90%:{" "}
                          {spaceToFreeTo90.toFixed(2)} GB
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {status === "ok" && (
                    <Alert>
                      <AlertTitle>OK: Sufficient Free Space</AlertTitle>
                      <AlertDescription>
                        Storage state looks healthy — low available space is
                        unlikely to be causing slowdowns.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Recommendations</h3>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>
                    Clear app caches (browsers, social apps) to quickly free
                    space.
                  </li>
                  <li>
                    Uninstall unused applications and delete old downloads.
                  </li>
                  <li>
                    Move photos, videos, and attachments to cloud storage or
                    external backup.
                  </li>
                  <li>
                    Keep at least 10–20% free storage for stable performance.
                  </li>
                </ul>

                {cacheGb && (
                  <p className="text-sm mt-3 text-muted-foreground">
                    Estimated cache: {cacheGb} GB — clearing caches could
                    reclaim part of the required space.
                  </p>
                )}

                {responseMs && (
                  <p className="text-sm mt-2 text-muted-foreground">
                    Reported response time: {responseMs} ms — high values are
                    consistent with IO bottlenecks.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
