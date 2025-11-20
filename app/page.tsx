"use client";

import {
  DollarSign,
  Map as MapIcon,
  Plus,
  Target,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { FinancialDashboard } from "@/components/FinancialDashboard";
import { Header } from "@/components/Header";
import { KeyMetrics } from "@/components/KeyMetrics";
import { MilestoneDialog } from "@/components/MilestoneDialog";
import { MilestoneList } from "@/components/MilestoneList";
import { PhaseDialog } from "@/components/PhaseDialog";
import { PhaseTimeline } from "@/components/PhaseTimeline";
import { RoadmapDashboard } from "@/components/RoadmapDashboard";
import { SeedDataButton } from "@/components/SeedDataButton";
import { ShipDateCountdown } from "@/components/ShipDateCountdown";
import { TaskDialog } from "@/components/TaskDialog";
import { TaskList } from "@/components/TaskList";
import { TodayNextStep } from "@/components/TodayNextStep";
import { Button } from "@/components/ui/button";
import { getRoadmapStats, roadmapPhases } from "@/lib/roadmapData";
import { registerServiceWorker } from "@/lib/serviceWorker";
import { networkStatus, storage } from "@/lib/storage";
import {
  type Milestone,
  type Phase,
  supabase,
  type Task,
} from "@/lib/supabase";

export default function Home() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "mission" | "roadmap" | "finances"
  >("mission");
  const [todayNextStepOpen, setTodayNextStepOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [_lastSync, setLastSync] = useState<Date | null>(null);

  const loadData = useCallback(async (openTodayNextStep = false) => {
    // If offline, use cached data
    if (!networkStatus.isOnline()) {
      if (storage.hasOfflineData()) {
        setPhases(storage.getPhases());
        setTasks(storage.getTasks());
        setMilestones(storage.getMilestones());
        setLastSync(storage.getLastSync());
      }
      setLoading(false);
      if (openTodayNextStep) {
        setTodayNextStepOpen(true);
      }
      return;
    }

    setLoading(true);

    try {
      const [phasesRes, tasksRes, milestonesRes] = await Promise.all([
        supabase.from("phases").select("*").order("position"),
        supabase
          .from("tasks")
          .select("*")
          .order("due_date", { ascending: true, nullsFirst: false }),
        supabase.from("milestones").select("*").order("date"),
      ]);

      if (phasesRes.data) {
        setPhases(phasesRes.data);
        storage.setPhases(phasesRes.data);
      }
      if (tasksRes.data) {
        setTasks(tasksRes.data);
        storage.setTasks(tasksRes.data);
      }
      if (milestonesRes.data) {
        setMilestones(milestonesRes.data);
        storage.setMilestones(milestonesRes.data);
      }

      setLastSync(new Date());
    } catch (error) {
      console.error("Failed to load data:", error);
      // Fall back to cached data on error
      if (storage.hasOfflineData()) {
        setPhases(storage.getPhases());
        setTasks(storage.getTasks());
        setMilestones(storage.getMilestones());
        setLastSync(storage.getLastSync());
      }
    }

    setLoading(false);

    // Open "Today → Next Step" widget on login if requested
    if (openTodayNextStep) {
      setTodayNextStepOpen(true);
    }
  }, []);

  const checkUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      // Try to load from cache first for faster initial render
      if (storage.hasOfflineData()) {
        setPhases(storage.getPhases());
        setTasks(storage.getTasks());
        setMilestones(storage.getMilestones());
        setLastSync(storage.getLastSync());
        setLoading(false);
      }

      // Load data but don't auto-open dialog (only on explicit login)
      loadData(false);
    } else {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    checkUser();

    // Register service worker for offline support
    registerServiceWorker();

    // Load focus mode preference from localStorage
    setFocusMode(storage.getFocusMode());

    // Set up network status listeners
    setIsOnline(networkStatus.isOnline());
    const unsubOnline = networkStatus.onOnline(() => {
      setIsOnline(true);
      // Sync data when coming back online
      loadData();
    });
    const unsubOffline = networkStatus.onOffline(() => {
      setIsOnline(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Only open dialog on SIGNED_IN event, not on TOKEN_REFRESHED or other events
        const shouldOpenDialog = event === "SIGNED_IN";
        loadData(shouldOpenDialog);
      }
    });

    return () => {
      subscription.unsubscribe();
      unsubOnline();
      unsubOffline();
    };
  }, [checkUser, loadData]);

  if (!user && !loading) {
    return <AuthForm onAuthSuccess={() => loadData(true)} />;
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const selectedPhaseTasks = selectedPhaseId
    ? tasks.filter((t) => t.phase_id === selectedPhaseId)
    : tasks;

  const handleTaskComplete = async (taskId: string) => {
    await supabase.from("tasks").update({ completed: true }).eq("id", taskId);
    loadData();
  };

  const handleMilestoneComplete = async (milestoneId: string) => {
    await supabase
      .from("milestones")
      .update({ completed: true })
      .eq("id", milestoneId);
    loadData();
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <TodayNextStep
        isOpen={todayNextStepOpen}
        onClose={() => setTodayNextStepOpen(false)}
        tasks={tasks}
        milestones={milestones}
        phases={phases}
        onTaskComplete={handleTaskComplete}
        onMilestoneComplete={handleMilestoneComplete}
      />

      <Header
        onSignOut={() => setUser(null)}
        phases={phases}
        tasks={tasks}
        milestones={milestones}
        activeTab={activeTab}
        user={user}
      />

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b items-center flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab("mission")}
          className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "mission"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Target className="h-4 w-4" />
          Mission Plan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("roadmap")}
          className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "roadmap"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <MapIcon className="h-4 w-4" />
          Roadmap
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("finances")}
          className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "finances"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Finances
        </button>
        <div className="ml-auto flex gap-2 items-center flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-500" />
            )}
            <span className="hidden sm:inline">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <Button
            onClick={() => setTodayNextStepOpen(true)}
            variant="outline"
            size="sm"
          >
            <Target className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Today's Focus</span>
            <span className="sm:hidden">Focus</span>
          </Button>
          <Button
            onClick={() => {
              const newFocusMode = !focusMode;
              setFocusMode(newFocusMode);
              storage.setFocusMode(newFocusMode);
            }}
            variant={focusMode ? "default" : "outline"}
            size="sm"
          >
            {focusMode ? "Show All" : "Focus Mode"}
          </Button>
        </div>
      </div>

      {/* Mission Plan Tab */}
      {activeTab === "mission" && (
        <>
          {!focusMode && <ShipDateCountdown shipDate="2026-02-03" />}
          <KeyMetrics tasks={tasks} />

          {phases.length === 0 && (
            <div className="mb-6">
              <SeedDataButton onComplete={loadData} userId={user.id} />
            </div>
          )}

          {!focusMode && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Mission Phases</h2>
                <Button onClick={() => setPhaseDialogOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Phase
                </Button>
              </div>
              <PhaseTimeline
                phases={phases}
                selectedPhaseId={selectedPhaseId}
                onSelectPhase={setSelectedPhaseId}
                userId={user.id}
                onUpdate={loadData}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  {focusMode
                    ? "Active Tasks"
                    : selectedPhaseId
                      ? `Tasks - ${
                          phases.find((p) => p.id === selectedPhaseId)?.name
                        }`
                      : "All Tasks"}
                </h2>
                <Button onClick={() => setTaskDialogOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </div>
              <TaskList
                tasks={
                  focusMode
                    ? tasks.filter((t) => !t.completed && t.due_date)
                    : selectedPhaseTasks
                }
                phases={phases}
                onUpdate={loadData}
                userId={user.id}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  {focusMode ? "Upcoming Milestones" : "Key Milestones"}
                </h2>
                <Button onClick={() => setMilestoneDialogOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Milestone
                </Button>
              </div>
              <MilestoneList
                milestones={
                  focusMode
                    ? milestones.filter((m) => !m.completed)
                    : milestones
                }
                phases={phases}
                onUpdate={loadData}
                userId={user.id}
              />
            </div>
          </div>

          <TaskDialog
            open={taskDialogOpen}
            onOpenChange={setTaskDialogOpen}
            onSuccess={loadData}
            phases={phases}
            userId={user.id}
          />

          <PhaseDialog
            open={phaseDialogOpen}
            onOpenChange={setPhaseDialogOpen}
            onSuccess={loadData}
            userId={user.id}
          />

          <MilestoneDialog
            open={milestoneDialogOpen}
            onOpenChange={setMilestoneDialogOpen}
            onSuccess={loadData}
            phases={phases}
            userId={user.id}
          />
        </>
      )}

      {/* Roadmap Tab */}
      {activeTab === "roadmap" && (
        <RoadmapDashboard
          phases={roadmapPhases}
          stats={getRoadmapStats()}
          defaultView="timeline"
        />
      )}

      {/* Finances Tab */}
      {activeTab === "finances" && <FinancialDashboard userId={user.id} />}
    </main>
  );
}
