"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Phase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dates";

interface RoadmapPhase extends Phase {
  objective?: string;
  sections?: Array<{
    title: string;
    icon?: string;
    items: string[];
  }>;
  checklists?: Array<{
    title: string;
    items: Array<{ text: string; completed: boolean }>;
  }>;
  successMetrics?: Array<{
    metric: string;
    target?: string;
  }>;
}

interface Props {
  phases: RoadmapPhase[];
  onPhaseClick?: (phaseId: string) => void;
  expandedPhaseId?: string | null;
}

export function RoadmapTimeline({
  phases,
  onPhaseClick,
  expandedPhaseId,
}: Props) {
  const [localExpandedId, setLocalExpandedId] = useState<string | null>(null);

  const expandedId = expandedPhaseId ?? localExpandedId;
  const handlePhaseClick = (phaseId: string) => {
    if (onPhaseClick) {
      onPhaseClick(phaseId);
    } else {
      setLocalExpandedId(expandedId === phaseId ? null : phaseId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-500 text-white";
      case "active":
        return "bg-blue-500 text-white";
      default:
        return "bg-slate-300 text-slate-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-600">Complete</Badge>;
      case "active":
        return <Badge className="bg-blue-600">Active</Badge>;
      default:
        return <Badge variant="secondary">Upcoming</Badge>;
    }
  };

  const getProgressPercentage = (phase: RoadmapPhase) => {
    if (phase.status === "complete") return 100;
    if (phase.status === "upcoming") return 0;

    // Calculate based on checklists if available
    if (phase.checklists && phase.checklists.length > 0) {
      const totalItems = phase.checklists.reduce(
        (sum, list) => sum + list.items.length,
        0
      );
      const completedItems = phase.checklists.reduce(
        (sum, list) =>
          sum + list.items.filter((item) => item.completed).length,
        0
      );
      return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    }

    // Default for active phases without checklists
    return 50;
  };

  return (
    <div className="space-y-4">
      {phases.map((phase, index) => {
        const isExpanded = expandedId === phase.id;
        const progress = getProgressPercentage(phase);

        return (
          <Card
            key={phase.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg border-l-4",
              phase.status === "complete" && "border-l-green-500",
              phase.status === "active" && "border-l-blue-500",
              phase.status === "upcoming" && "border-l-slate-300",
              isExpanded && "ring-2 ring-blue-400 shadow-xl"
            )}
            onClick={() => handlePhaseClick(phase.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                {/* Phase Number */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shrink-0 shadow-md",
                    getStatusColor(phase.status)
                  )}
                >
                  {index}
                </div>

                {/* Phase Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <CardTitle className="text-xl">{phase.name}</CardTitle>
                    {getStatusBadge(phase.status)}
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-600">
                        {progress}%
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        phase.status === "complete" && "bg-green-500",
                        phase.status === "active" && "bg-blue-500",
                        phase.status === "upcoming" && "bg-slate-400"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium">
                      {formatDate(phase.start_date)}
                    </span>
                    <span>→</span>
                    <span className="font-medium">
                      {formatDate(phase.end_date)}
                    </span>
                  </div>

                  {/* Objective (always visible) */}
                  {phase.objective && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm font-medium text-blue-900">
                        <span className="font-semibold">Objective: </span>
                        {phase.objective}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  {phase.description && !isExpanded && (
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                      {phase.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>

            {/* Expanded Content */}
            {isExpanded && (
              <CardContent className="pt-0 border-t">
                {phase.description && (
                  <div className="mt-4 mb-4">
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {phase.description}
                    </p>
                  </div>
                )}

                {/* Sections Preview */}
                {phase.sections && phase.sections.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-slate-700 mb-2">
                      Key Areas:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.sections.map((section, idx) => (
                        <div
                          key={idx}
                          className="text-sm flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200"
                        >
                          {section.icon && <span>{section.icon}</span>}
                          <span className="font-medium">{section.title}</span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {section.items.length}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Metrics Preview */}
                {phase.successMetrics && phase.successMetrics.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-slate-700 mb-2">
                      Success Metrics:
                    </h4>
                    <div className="space-y-1">
                      {phase.successMetrics.slice(0, 3).map((metric, idx) => (
                        <div
                          key={idx}
                          className="text-sm flex items-start gap-2 p-2 bg-green-50 rounded border border-green-200"
                        >
                          <span className="text-green-600">✓</span>
                          <span className="text-slate-700">{metric.metric}</span>
                          {metric.target && (
                            <Badge className="ml-auto bg-green-600 text-xs">
                              {metric.target}
                            </Badge>
                          )}
                        </div>
                      ))}
                      {phase.successMetrics.length > 3 && (
                        <p className="text-xs text-slate-500 pl-2">
                          +{phase.successMetrics.length - 3} more metrics
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
