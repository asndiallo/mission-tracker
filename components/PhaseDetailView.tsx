"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Phase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dates";

export interface PhaseSection {
  title: string;
  icon?: string;
  items: string[];
  collapsible?: boolean;
}

export interface ChecklistItem {
  text: string;
  completed: boolean;
}

export interface Checklist {
  title: string;
  items: ChecklistItem[];
}

export interface SuccessMetric {
  metric: string;
  target?: string;
  achieved?: boolean;
}

export interface DecisionBranch {
  title: string;
  scenario: string;
  outcome: string;
  actions: string[];
  recommendation?: string;
}

export interface DetailedPhase
  extends Omit<Phase, "position" | "created_at" | "user_id"> {
  position?: number;
  created_at?: string;
  user_id?: string;
  objective?: string;
  sections?: PhaseSection[];
  checklists?: Checklist[];
  successMetrics?: SuccessMetric[];
  decisionPoints?: DecisionBranch[];
}

interface Props {
  phase: DetailedPhase;
  onChecklistToggle?: (checklistIndex: number, itemIndex: number) => void;
}

export function PhaseDetailView({ phase, onChecklistToggle }: Props) {
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(
    new Set(),
  );

  const toggleSection = (index: number) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index);
    } else {
      newCollapsed.add(index);
    }
    setCollapsedSections(newCollapsed);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "text-green-600 bg-green-50 border-green-200";
      case "active":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <Card className={cn("border-l-4", getStatusColor(phase.status))}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{phase.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                <span className="font-medium">
                  {formatDate(phase.start_date)}
                </span>
                <span>→</span>
                <span className="font-medium">
                  {formatDate(phase.end_date)}
                </span>
              </div>
              {phase.objective && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    🎯 Objective
                  </p>
                  <p className="text-blue-800">{phase.objective}</p>
                </div>
              )}
            </div>
            <Badge
              className={cn(
                phase.status === "complete" && "bg-green-600",
                phase.status === "active" && "bg-blue-600",
              )}
              variant={phase.status === "upcoming" ? "secondary" : "default"}
            >
              {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        {phase.description && (
          <CardContent>
            <p className="text-slate-700 whitespace-pre-wrap">
              {phase.description}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Sections */}
      {phase.sections && phase.sections.length > 0 && (
        <div className="space-y-4">
          {phase.sections.map((section, index) => {
            const isCollapsed = collapsedSections.has(index);
            const canCollapse = section.collapsible !== false;

            return (
              <Card key={section.title}>
                <CardHeader
                  className={cn(
                    "pb-3",
                    canCollapse && "cursor-pointer hover:bg-slate-50",
                  )}
                  onClick={() => canCollapse && toggleSection(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {section.icon && <span>{section.icon}</span>}
                      {section.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{section.items.length}</Badge>
                      {canCollapse &&
                        (isCollapsed ? (
                          <ChevronDown className="h-5 w-5 text-slate-500" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-slate-500" />
                        ))}
                    </div>
                  </div>
                </CardHeader>
                {!isCollapsed && (
                  <CardContent>
                    <ul className="space-y-2">
                      {section.items.map((item, _itemIndex) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-slate-700"
                        >
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Checklists */}
      {phase.checklists && phase.checklists.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Checklists
          </h3>
          {phase.checklists.map((checklist, checklistIndex) => {
            const completedCount = checklist.items.filter(
              (item) => item.completed,
            ).length;
            const totalCount = checklist.items.length;
            const progress = Math.round((completedCount / totalCount) * 100);

            return (
              <Card key={checklist.title}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{checklist.title}</CardTitle>
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {checklist.items.map((item, itemIndex) => (
                      <label
                        key={item.text}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                          item.completed
                            ? "bg-green-50 border-green-200 hover:bg-green-100"
                            : "bg-white border-slate-200 hover:bg-slate-50",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() =>
                            onChecklistToggle?.(checklistIndex, itemIndex)
                          }
                          className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
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
          })}
        </div>
      )}

      {/* Success Metrics */}
      {phase.successMetrics && phase.successMetrics.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-900">
              📊 Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {phase.successMetrics.map((metric, _index) => (
                <div
                  key={metric.metric}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200"
                >
                  <span
                    className={cn(
                      "mt-0.5",
                      metric.achieved ? "text-green-600" : "text-slate-400",
                    )}
                  >
                    {metric.achieved ? "✓" : "○"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{metric.metric}</p>
                    {metric.target && (
                      <p className="text-xs text-slate-500 mt-1">
                        Target: {metric.target}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decision Points */}
      {phase.decisionPoints && phase.decisionPoints.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Decision Points
          </h3>
          {phase.decisionPoints.map((decision, index) => (
            <Card
              key={`${index}-${decision.title}`}
              className="border-l-4 border-l-orange-500 bg-orange-50"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-orange-900">
                  {decision.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-orange-900 mb-1">
                    Scenario:
                  </p>
                  <p className="text-sm text-orange-800">{decision.scenario}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-900 mb-1">
                    Outcome:
                  </p>
                  <p className="text-sm text-orange-800">{decision.outcome}</p>
                </div>
                {decision.actions.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-orange-900 mb-2">
                      Actions:
                    </p>
                    <ul className="space-y-1">
                      {decision.actions.map((action, actionIndex) => (
                        <li
                          key={`${actionIndex}-${action}`}
                          className="flex items-start gap-2 text-sm text-orange-800"
                        >
                          <span className="text-orange-600">→</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {decision.recommendation && (
                  <div className="p-3 bg-orange-100 rounded-lg border border-orange-300">
                    <p className="text-sm font-semibold text-orange-900 mb-1">
                      💡 Recommendation:
                    </p>
                    <p className="text-sm text-orange-900">
                      {decision.recommendation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
