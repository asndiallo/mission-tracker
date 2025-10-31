"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Metric {
  metric: string;
  target?: string;
  achieved?: boolean;
  current?: string;
}

interface Props {
  title: string;
  metrics: Metric[];
  className?: string;
  variant?: "default" | "success" | "warning";
}

export function MetricsCard({
  title,
  metrics,
  className,
  variant = "default",
}: Props) {
  const achievedCount = metrics.filter((m) => m.achieved).length;
  const totalCount = metrics.length;
  const progress =
    totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0;

  const bgColor = {
    default: "from-blue-50 to-cyan-50",
    success: "from-green-50 to-emerald-50",
    warning: "from-orange-50 to-amber-50",
  }[variant];

  const borderColor = {
    default: "border-blue-200",
    success: "border-green-200",
    warning: "border-orange-200",
  }[variant];

  const textColor = {
    default: "text-blue-900",
    success: "text-green-900",
    warning: "text-orange-900",
  }[variant];

  return (
    <Card
      className={cn(
        "bg-gradient-to-br",
        bgColor,
        borderColor,
        "border-2",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn("text-lg flex items-center gap-2", textColor)}
          >
            <span>📊</span>
            <span>{title}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">
              {achievedCount}/{totalCount}
            </span>
            <Badge
              className={cn(
                progress === 100 && "bg-green-600",
                progress > 0 && progress < 100 && "bg-blue-600",
              )}
              variant={progress === 0 ? "secondary" : "default"}
            >
              {progress}%
            </Badge>
          </div>
        </div>
        {totalCount > 0 && (
          <div className="w-full bg-white/50 rounded-full h-2 mt-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                progress === 100 && "bg-green-500",
                progress > 0 && progress < 100 && "bg-blue-500",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all",
                metric.achieved
                  ? "bg-white border-green-300 shadow-sm"
                  : "bg-white/70 border-slate-200",
              )}
            >
              {metric.achieved ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    metric.achieved ? "text-slate-700" : "text-slate-600",
                  )}
                >
                  {metric.metric}
                </p>
                {(metric.target || metric.current) && (
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {metric.target && (
                      <span className="text-xs text-slate-500">
                        Target: {metric.target}
                      </span>
                    )}
                    {metric.current && (
                      <Badge variant="outline" className="text-xs">
                        Current: {metric.current}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
