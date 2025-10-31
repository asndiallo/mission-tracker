"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ChecklistItem {
  text: string;
  completed: boolean;
}

interface Props {
  title: string;
  items: ChecklistItem[];
  onToggle?: (itemIndex: number) => void;
  className?: string;
}

export function ChecklistSection({ title, items, onToggle, className }: Props) {
  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">
              {completedCount}/{totalCount}
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
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                progress === 100 && "bg-green-500",
                progress > 0 && progress < 100 && "bg-blue-500",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, index) => (
            <label
              key={index}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all",
                onToggle ? "cursor-pointer" : "cursor-default",
                item.completed
                  ? "bg-green-50 border-green-200 hover:bg-green-100"
                  : "bg-white border-slate-200 hover:bg-slate-50",
              )}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle?.(index)}
                disabled={!onToggle}
                className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-default"
              />
              <span
                className={cn(
                  "flex-1 text-sm",
                  item.completed
                    ? "line-through text-slate-500"
                    : "text-slate-700",
                )}
              >
                {item.text}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
