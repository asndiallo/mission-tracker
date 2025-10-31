"use client";

import { AlertCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DecisionBranch {
  title: string;
  scenario: string;
  outcome: string;
  actions: string[];
  recommendation?: string;
  probability?: string;
}

interface Props {
  title: string;
  description?: string;
  branches: DecisionBranch[];
  className?: string;
}

export function DecisionPoint({
  title,
  description,
  branches,
  className,
}: Props) {
  return (
    <Card className={className}>
      <CardHeader className="bg-linear-to-r from-orange-50 to-amber-50 border-b border-orange-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-orange-600 mt-1 shrink-0" />
          <div className="flex-1">
            <CardTitle className="text-xl text-orange-900">{title}</CardTitle>
            {description && (
              <p className="text-sm text-orange-700 mt-2">{description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="relative border-l-4 border-l-orange-500 pl-4"
            >
              {/* Branch Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-semibold text-lg text-slate-900">
                  {branch.title}
                </h4>
                {branch.probability && (
                  <Badge className="bg-orange-600 shrink-0">
                    {branch.probability}
                  </Badge>
                )}
              </div>

              {/* Scenario */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">
                  Scenario
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  {branch.scenario}
                </p>
              </div>

              {/* Outcome */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">
                  Outcome
                </p>
                <p className="text-sm text-slate-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  {branch.outcome}
                </p>
              </div>

              {/* Actions */}
              {branch.actions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                    Actions
                  </p>
                  <div className="space-y-2">
                    {branch.actions.map((action, actionIndex) => (
                      <div
                        key={actionIndex}
                        className="flex items-start gap-2 text-sm text-slate-700 bg-white p-2 rounded border border-slate-200"
                      >
                        <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {branch.recommendation && (
                <div className="p-3 bg-linear-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                  <p className="text-xs font-semibold text-green-900 uppercase mb-1 flex items-center gap-1">
                    <span>💡</span>
                    <span>Recommendation</span>
                  </p>
                  <p className="text-sm text-green-900 font-medium">
                    {branch.recommendation}
                  </p>
                </div>
              )}

              {/* Divider between branches */}
              {index < branches.length - 1 && (
                <div className="mt-6 mb-2 border-t border-dashed border-slate-300" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
