"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface Props {
  onComplete: () => void;
  userId: string;
}

export function SeedDataButton({ onComplete, userId }: Props) {
  const [loading, setLoading] = useState(false);

  async function seedData() {
    setLoading(true);

    // REVISED MISSION PLAN: WEALTH BUILDING + CYBERSECURITY DEGREE + OPTIONAL CYBER TRACK
    // Core Goal: Financial Independence by age 37-38 through real estate + business
    // Bonus: Cross-train to cyber → Officer commission (if it works out)

    const phases = [
      {
        name: "Phase 0: Preparation",
        description:
          "Ship ready: physically, admin, mentally. Marry fiancée (Cape Verdean, in Dakar) before BMT. Start I-130.",
        start_date: "2024-11-01",
        end_date: "2026-02-02",
        status: "active",
        position: 0,
        user_id: userId,
      },
      {
        name: "Phase 1: BMT & Citizenship",
        description:
          "Graduate BMT, apply for U.S. citizenship (Week 1), build leadership foundation",
        start_date: "2026-02-03",
        end_date: "2026-03-31",
        status: "upcoming",
        position: 1,
        user_id: userId,
      },
      {
        name: "Phase 2: Tech School (4N0)",
        description:
          "Graduate 4N0 tech school, earn CCAF credits, assess tolerance for clinical work",
        start_date: "2026-04-01",
        end_date: "2026-08-31",
        status: "upcoming",
        position: 2,
        user_id: userId,
      },
      {
        name: "Phase 3: First Duty Station (Build Phase)",
        description:
          "Excel at 4N0, get Security+/CySA+/CEH, start WGU cybersecurity bachelor, buy property, build business",
        start_date: "2026-09-01",
        end_date: "2029-08-31",
        status: "upcoming",
        position: 3,
        user_id: userId,
      },
      {
        name: "Phase 4A: Cyber Track (If Cross-Train Approved)",
        description:
          "Cyber tech school → work as cyber operator → apply for 17D commission (optional)",
        start_date: "2029-02-01",
        end_date: "2033-02-01",
        status: "upcoming",
        position: 4,
        user_id: userId,
      },
      {
        name: "Phase 4B: Wealth Builder Track (If Cross-Train Denied)",
        description:
          "Stay 4N0 E-6/E-7, focus on real estate empire + side business. Financial independence by 37-38.",
        start_date: "2029-09-01",
        end_date: "2036-09-01",
        status: "upcoming",
        position: 5,
        user_id: userId,
      },
      {
        name: "Phase 5: Financial Independence",
        description:
          "Achieve $60-90k/year passive income (rentals + business). Maximum flexibility.",
        start_date: "2036-01-01",
        end_date: "2040-12-31",
        status: "upcoming",
        position: 6,
        user_id: userId,
      },
    ];

    const { data: insertedPhases } = await supabase
      .from("phases")
      .insert(phases)
      .select();

    if (!insertedPhases) {
      setLoading(false);
      return;
    }

    const phase0 = insertedPhases[0];
    const phase1 = insertedPhases[1];
    const phase2 = insertedPhases[2];
    const phase3 = insertedPhases[3];
    const phase4a = insertedPhases[4];
    const phase4b = insertedPhases[5];
    const phase5 = insertedPhases[6];

    // CRITICAL TASKS
    const tasks = [
      // PHASE 0: PREPARATION
      {
        phase_id: phase0.id,
        title: "Civil marriage with fiancée (Dec 2025)",
        completed: false,
        due_date: "2025-12-06",
        notes:
          "Civil ceremony in Dakar or US. Fiancée is Cape Verdean, currently in Dakar. File I-130 immediately after.",
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title: "File I-130 Petition for Alien Relative",
        completed: false,
        due_date: "2026-01-15",
        notes:
          "Start immigration ASAP. Processing: 6-12 months. Goal: wife joins by late 2026/early 2027.",
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title: "Achieve peak fitness (1.5 mile run <10:30)",
        completed: false,
        due_date: "2026-02-02",
        notes: "Arrive at BMT in top 25% physically.",
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title: "Start studying for Security+ certification",
        completed: false,
        due_date: "2025-12-01",
        notes:
          "Use Professor Messer (YouTube, free). MANDATORY for cyber cross-training.",
        position: 3,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title: "Gather citizenship documents",
        completed: false,
        due_date: "2026-01-15",
        notes: "Passport, green card, birth certificate. Bring to BMT Week 1.",
        position: 4,
        user_id: userId,
      },

      // PHASE 1: BMT & CITIZENSHIP
      {
        phase_id: phase1.id,
        title: "Apply for U.S. Citizenship (Week 1 of BMT)",
        completed: false,
        due_date: "2026-02-10",
        notes: "File N-400 and N-426. Track case number.",
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase1.id,
        title: "Graduate BMT",
        completed: false,
        due_date: "2026-03-31",
        position: 1,
        user_id: userId,
      },

      // PHASE 2: TECH SCHOOL
      {
        phase_id: phase2.id,
        title: "Graduate 4N0 tech school (top 25%)",
        completed: false,
        due_date: "2026-08-31",
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase2.id,
        title: "Obtain CCAF transcript",
        completed: false,
        due_date: "2026-09-01",
        notes: "~20-30 credits. Check transfer to WGU.",
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase2.id,
        title: "Update DEERS with marriage info",
        completed: false,
        due_date: "2026-09-15",
        notes: "Add spouse to TRICARE, update BAH.",
        position: 2,
        user_id: userId,
      },

      // PHASE 3: FIRST DUTY STATION (CRITICAL PHASE)
      {
        phase_id: phase3.id,
        title: "Wife arrives in US (I-130 approved)",
        completed: false,
        due_date: "2027-03-01",
        notes: "Command sponsorship + CR-1 visa.",
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "🔥 GET SECURITY+ CERTIFICATION (CRITICAL)",
        completed: false,
        due_date: "2027-06-01",
        notes:
          "MANDATORY for cyber cross-training. Study: Professor Messer. Exam: $400 (TA covers).",
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Complete 4N0 CDCs within 4 months",
        completed: false,
        due_date: "2027-01-01",
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Contact WGU: Get preliminary credit evaluation",
        completed: false,
        due_date: "2027-03-01",
        notes: "Submit SpanTran evaluation. Ask about credit transfer.",
        position: 3,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Enroll at WGU - B.S. Cybersecurity",
        completed: false,
        due_date: "2027-09-01",
        notes: "Self-paced, competency-based. Goal: finish in 12-24 months.",
        position: 4,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Get CySA+ certification",
        completed: false,
        due_date: "2027-12-01",
        notes: "Cybersecurity Analyst+. Adds WGU credits + resume strength.",
        position: 5,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Get CEH certification",
        completed: false,
        due_date: "2028-06-01",
        notes: "Certified Ethical Hacker. Strengthens cross-training package.",
        position: 6,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Study for EDPT (cyber aptitude test)",
        completed: false,
        due_date: "2028-06-01",
        notes: "Required for 1B4X1. Goal: score 70+.",
        position: 7,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Buy first property (CONUS) OR save $50k (OCONUS)",
        completed: false,
        due_date: "2028-03-01",
        notes: "VA loan 0% down. Duplex/triplex. Live in 1, rent others.",
        position: 8,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Launch side business",
        completed: false,
        due_date: "2027-06-01",
        notes:
          "E-commerce, consulting, freelance. Start: $500-1k/mo. Scale to $3-5k/mo by 2032.",
        position: 9,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Promote to SSgt (E-5)",
        completed: false,
        due_date: "2028-09-01",
        notes: "Test at ~3 years TIS.",
        position: 10,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Submit cross-training application",
        completed: false,
        due_date: "2028-09-01",
        notes:
          "Apply for 1B4X1 or 1D7X1. Window: Jan-Sep 2029. Apply 6 months early.",
        position: 11,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "🎓 Finish Bachelor in Cybersecurity",
        completed: false,
        due_date: "2029-06-01",
        notes: "WGU self-paced. CRITICAL regardless of cross-training outcome.",
        position: 12,
        user_id: userId,
      },

      // PHASE 4A: CYBER TRACK
      {
        phase_id: phase4a.id,
        title: "Attend cyber tech school",
        completed: false,
        due_date: "2029-08-01",
        notes: "1B4X1: 6 months. Training: offensive/defensive cyber.",
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase4a.id,
        title: "Work as cyber operator",
        completed: false,
        due_date: "2030-09-01",
        notes: "NSA, Cyber Command, base comm. Get CISSP, OSCP.",
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase4a.id,
        title: "Buy property #2",
        completed: false,
        due_date: "2030-06-01",
        notes: "Continue house-hacking.",
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase4a.id,
        title: "Apply for 17D Cyber Warfare Officer (OPTIONAL)",
        completed: false,
        due_date: "2031-06-01",
        notes:
          "Acceptance: 40-60%. If rejected, stay enlisted cyber - still win.",
        position: 3,
        user_id: userId,
      },

      // PHASE 4B: WEALTH BUILDER TRACK
      {
        phase_id: phase4b.id,
        title: "Stay 4N0, promote to E-6 (TSgt)",
        completed: false,
        due_date: "2031-01-01",
        notes: "Focus: work-life balance, maximize time for business.",
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase4b.id,
        title: "Buy properties #2, #3, #4 at each PCS",
        completed: false,
        due_date: "2036-01-01",
        notes: "Every 3-4 years = new base = new property. Goal: 4 by 2036.",
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase4b.id,
        title: "Scale side business to $3-5k/month",
        completed: false,
        due_date: "2033-01-01",
        notes: "This is your path to financial independence.",
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase4b.id,
        title: "Promote to E-7 (MSgt)",
        completed: false,
        due_date: "2035-01-01",
        position: 3,
        user_id: userId,
      },

      // PHASE 5: FINANCIAL INDEPENDENCE
      {
        phase_id: phase5.id,
        title: "🏆 Achieve $60-90k/year passive income",
        completed: false,
        due_date: "2036-12-31",
        notes:
          "Rentals: $30-50k/yr. Business: $30-50k/yr. You are financially independent.",
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase5.id,
        title: "Decide: Stay military OR separate",
        completed: false,
        due_date: "2037-06-01",
        notes:
          "You have OPTIONS. Stay for pension? Separate for tech job? Full-time entrepreneur?",
        position: 1,
        user_id: userId,
      },
    ];

    await supabase.from("tasks").insert(tasks);

    // KEY MILESTONES (Chronologically Ordered)
    const milestones = [
      {
        title: "Civil Marriage (28th Birthday)",
        date: "2025-12-06",
        completed: false,
        phase_id: phase0.id,
        user_id: userId,
      },
      {
        title: "Ship Date - BMT Begins",
        date: "2026-02-03",
        completed: false,
        phase_id: phase1.id,
        user_id: userId,
      },
      {
        title: "U.S. Citizenship Granted",
        date: "2026-08-01",
        completed: false,
        phase_id: phase2.id,
        user_id: userId,
      },
      {
        title: "Wife Arrives in US",
        date: "2027-03-01",
        completed: false,
        phase_id: phase3.id,
        user_id: userId,
      },
      {
        title: "Security+ Earned (CRITICAL)",
        date: "2027-06-01",
        completed: false,
        phase_id: phase3.id,
        user_id: userId,
      },
      {
        title: "First Property Purchased",
        date: "2028-03-01",
        completed: false,
        phase_id: phase3.id,
        user_id: userId,
      },
      {
        title: "30th Birthday",
        date: "2028-12-06",
        completed: false,
        user_id: userId,
      },
      {
        title: "Cross-Training Decision Point",
        date: "2029-01-01",
        completed: false,
        phase_id: phase3.id,
        user_id: userId,
      },
      {
        title: "Bachelor in Cybersecurity Completed",
        date: "2029-06-01",
        completed: false,
        phase_id: phase3.id,
        user_id: userId,
      },
      {
        title: "35th Birthday",
        date: "2033-12-06",
        completed: false,
        user_id: userId,
      },
      {
        title: "Financial Independence (Age 37-38)",
        date: "2036-01-01",
        completed: false,
        phase_id: phase5.id,
        user_id: userId,
      },
    ];

    await supabase.from("milestones").insert(milestones);

    setLoading(false);
    onComplete();
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Mission Plan Overview
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            ✅ Core Goal: Financial Independence via real estate + business
          </li>
          <li>✅ Education: Bachelor in Cybersecurity (WGU, 12-24 months)</li>
          <li>
            ✅ Certifications: Security+, CySA+, CEH (free via Air Force TA)
          </li>
          <li>✅ Optional: Cross-train to cyber → 17D officer (if approved)</li>
          <li>✅ Target: $60-90k/year passive income by age 37-38</li>
        </ul>
      </div>

      <Button
        onClick={seedData}
        disabled={loading}
        size="lg"
        className="w-full"
      >
        {loading ? "Loading Mission Plan..." : "Load My Mission Plan"}
      </Button>
    </div>
  );
}
