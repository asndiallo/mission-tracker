"use client";

import { Calendar, Layout, List, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type DetailedPhase, PhaseDetailView } from "./PhaseDetailView";
import { RoadmapTimeline } from "./RoadmapTimeline";

type ViewMode = "timeline" | "detailed" | "overview";

interface RoadmapStats {
  totalPhases: number;
  activePhases: number;
  completedPhases: number;
  upcomingPhases: number;
  totalTasks?: number;
  completedTasks?: number;
  nextMilestone?: {
    title: string;
    date: string;
  };
}

interface Props {
  phases: DetailedPhase[];
  stats?: RoadmapStats;
  onChecklistToggle?: (
    phaseId: string,
    checklistIndex: number,
    itemIndex: number,
  ) => void;
  defaultView?: ViewMode;
}

export function RoadmapDashboard({
  phases,
  stats,
  onChecklistToggle,
  defaultView = "timeline",
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);

  // Calculate stats if not provided
  const calculatedStats: RoadmapStats = stats || {
    totalPhases: phases.length,
    activePhases: phases.filter((p) => p.status === "active").length,
    completedPhases: phases.filter((p) => p.status === "complete").length,
    upcomingPhases: phases.filter((p) => p.status === "upcoming").length,
  };

  const selectedPhase = selectedPhaseId
    ? phases.find((p) => p.id === selectedPhaseId)
    : null;

  const handlePhaseClick = (phaseId: string) => {
    if (viewMode === "timeline") {
      setSelectedPhaseId(selectedPhaseId === phaseId ? null : phaseId);
    } else {
      setSelectedPhaseId(phaseId);
      setViewMode("detailed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats and View Toggle */}
      <div className="flex flex-col gap-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Phases</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {calculatedStats.totalPhases}
                  </p>
                </div>
                <Layout className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {calculatedStats.activePhases}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {calculatedStats.completedPhases}
                  </p>
                </div>
                <div className="text-4xl">✓</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Upcoming</p>
                  <p className="text-3xl font-bold text-slate-600">
                    {calculatedStats.upcomingPhases}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-slate-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Milestone (if available) */}
        {calculatedStats.nextMilestone && (
          <Card className="bg-linear-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Next Milestone
                  </p>
                  <p className="text-lg font-semibold text-blue-900">
                    {calculatedStats.nextMilestone.title}
                  </p>
                  <p className="text-sm text-blue-700">
                    {calculatedStats.nextMilestone.date}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Toggle */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              {viewMode === "timeline" && "Roadmap Timeline"}
              {viewMode === "detailed" &&
                (selectedPhase
                  ? `Phase Details: ${selectedPhase.name}`
                  : "Select a Phase")}
              {viewMode === "overview" && "Roadmap Overview"}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {viewMode === "timeline" &&
                "Click on any phase to expand and see details"}
              {viewMode === "detailed" &&
                "Detailed view with all sections and checklists"}
              {viewMode === "overview" &&
                "High-level view of all phases and milestones"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              className="gap-2"
            >
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </Button>
            <Button
              variant={viewMode === "detailed" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("detailed")}
              className="gap-2"
              disabled={!selectedPhaseId}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Details</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {/* Timeline View */}
        {viewMode === "timeline" && (
          <RoadmapTimeline
            phases={phases}
            onPhaseClick={handlePhaseClick}
            expandedPhaseId={selectedPhaseId}
          />
        )}

        {/* Detailed View */}
        {viewMode === "detailed" && (
          <div>
            {selectedPhase ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("timeline")}
                  className="mb-4"
                >
                  ← Back to Timeline
                </Button>
                <PhaseDetailView
                  phase={selectedPhase}
                  onChecklistToggle={
                    onChecklistToggle
                      ? (checklistIndex, itemIndex) =>
                          onChecklistToggle(
                            selectedPhase.id,
                            checklistIndex,
                            itemIndex,
                          )
                      : undefined
                  }
                />
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Layout className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">No phase selected</p>
                    <p className="text-sm text-slate-500 mb-4">
                      Select a phase from the timeline to view details
                    </p>
                    <Button onClick={() => setViewMode("timeline")}>
                      View Timeline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Overview Mode (optional - shows all phases in a condensed format) */}
        {viewMode === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phases.map((phase, index) => (
              <Card
                key={phase.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg border-l-4",
                  phase.status === "complete" && "border-l-green-500",
                  phase.status === "active" && "border-l-blue-500",
                  phase.status === "upcoming" && "border-l-slate-300",
                )}
                onClick={() => handlePhaseClick(phase.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0",
                        phase.status === "complete" && "bg-green-500",
                        phase.status === "active" && "bg-blue-500",
                        phase.status === "upcoming" && "bg-slate-300",
                      )}
                    >
                      {index}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                        {phase.name}
                      </h3>
                      <Badge
                        className={cn(
                          phase.status === "complete" && "bg-green-600",
                          phase.status === "active" && "bg-blue-600",
                        )}
                        variant={
                          phase.status === "upcoming" ? "secondary" : "default"
                        }
                      >
                        {phase.status}
                      </Badge>
                    </div>
                  </div>
                  {phase.objective && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {phase.objective}
                    </p>
                  )}
                  {phase.checklists && phase.checklists.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <span>{phase.checklists.length} checklists</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
