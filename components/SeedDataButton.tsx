'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface Props {
  onComplete: () => void;
  userId: string;
}

export function SeedDataButton({ onComplete, userId }: Props) {
  const [loading, setLoading] = useState(false);

  async function seedData() {
    setLoading(true);

    // My ACTUAL mission plan data - NURSING PATH
    const phases = [
      {
        name: 'Phase 0: Preparation',
        description:
          'Ship mentally, physically, and administratively ready. Research nursing pathway.',
        start_date: '2024-11-01',
        end_date: '2026-02-02',
        status: 'active',
        position: 0,
        user_id: userId,
      },
      {
        name: 'Phase 1: BMT',
        description:
          'Graduate BMT, apply for citizenship, build leadership reputation',
        start_date: '2026-02-03',
        end_date: '2026-03-31',
        status: 'upcoming',
        position: 1,
        user_id: userId,
      },
      {
        name: 'Phase 2: Tech School (4N0)',
        description:
          'Graduate top of class, earn CCAF credits, confirm interest in nursing',
        start_date: '2026-04-01',
        end_date: '2026-08-31',
        status: 'upcoming',
        position: 2,
        user_id: userId,
      },
      {
        name: 'Phase 3: First Duty Station (Year 1)',
        description:
          'Marry, excel at work, start nursing prerequisites, build credit',
        start_date: '2026-09-01',
        end_date: '2027-08-31',
        status: 'upcoming',
        position: 3,
        user_id: userId,
      },
      {
        name: 'Phase 3: First Duty Station (Year 2)',
        description:
          'Complete prerequisites, apply for AECP, buy first property, promote to SSgt',
        start_date: '2027-09-01',
        end_date: '2028-08-31',
        status: 'upcoming',
        position: 4,
        user_id: userId,
      },
      {
        name: 'Phase 4A: AECP Nursing School',
        description:
          'Complete BSN (24 months), pass NCLEX, commission as Nurse Corps Officer',
        start_date: '2028-09-01',
        end_date: '2030-06-30',
        status: 'upcoming',
        position: 5,
        user_id: userId,
      },
      {
        name: 'Phase 4B: Alternative Path (If AECP Rejected)',
        description:
          'Reenlist, finish BSN part-time, apply for direct commission',
        start_date: '2028-09-01',
        end_date: '2031-12-31',
        status: 'upcoming',
        position: 6,
        user_id: userId,
      },
      {
        name: 'Phase 5: Officer Life (O-1 to O-3)',
        description:
          'Build ICU experience, buy properties, prepare for CRNA program',
        start_date: '2030-07-01',
        end_date: '2033-08-31',
        status: 'upcoming',
        position: 7,
        user_id: userId,
      },
      {
        name: 'Phase 6: CRNA School',
        description: "Master's in Nurse Anesthesia (Air Force funded)",
        start_date: '2033-09-01',
        end_date: '2035-08-31',
        status: 'upcoming',
        position: 8,
        user_id: userId,
      },
      {
        name: 'Phase 7: CRNA Officer & Financial Independence',
        description:
          'Work as CRNA, expand real estate, achieve financial freedom',
        start_date: '2035-09-01',
        end_date: '2040-12-31',
        status: 'upcoming',
        position: 9,
        user_id: userId,
      },
    ];

    const { data: insertedPhases } = await supabase
      .from('phases')
      .insert(phases)
      .select();

    if (!insertedPhases) return;

    const phase0 = insertedPhases[0];
    const phase1 = insertedPhases[1];
    const phase2 = insertedPhases[2];
    const phase3Year1 = insertedPhases[3];
    const phase3Year2 = insertedPhases[4];
    const phase4A = insertedPhases[5];
    const phase4B = insertedPhases[6];
    const phase5 = insertedPhases[7];
    const phase6 = insertedPhases[8];

    // Sample tasks with NURSING focus
    const tasks = [
      // Phase 0
      {
        phase_id: phase0.id,
        title: 'Maintain peak fitness - arrive at BMT in top 10%',
        completed: false,
        due_date: '2026-02-02',
        notes: 'Target: 1.5mi run <10:30, max pushups/situps',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title:
          'Gather citizenship documents (passport, green card, birth cert)',
        completed: false,
        notes: 'Store digital + physical copies',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title: 'Shadow a nurse or volunteer in healthcare',
        completed: false,
        notes: 'Confirm I like direct patient care',
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title: 'Research AECP requirements (AFI 36-2013)',
        completed: false,
        notes: 'Join Air Force Nursing Facebook groups',
        position: 3,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title:
          'Have "real talk" with fiancée about military life + nursing school',
        completed: false,
        notes: 'AECP = 2 years of intense school, possible relocation',
        position: 4,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title: 'Ask recruiter: Is there a 6-year enlistment bonus for 4N0?',
        completed: false,
        notes: 'If yes, sign 6 years. If no, still consider 6 for stability.',
        position: 5,
        user_id: userId,
      },

      // Phase 1
      {
        phase_id: phase1.id,
        title: 'File N-400 and N-426 for citizenship (Week 1 of BMT)',
        completed: false,
        notes: 'Inform TI immediately, request USCIS liaison meeting',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase1.id,
        title: 'Volunteer for leadership roles (dorm chief, element leader)',
        completed: false,
        notes: 'BMT is an 8-week interview for my entire career',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase1.id,
        title: 'Graduate BMT with honors (if possible)',
        completed: false,
        notes: 'Target: Honor Graduate or Warhawk',
        position: 2,
        user_id: userId,
      },

      // Phase 2
      {
        phase_id: phase2.id,
        title: 'Graduate 4N0 tech school in top 10%',
        completed: false,
        notes: 'This is my audition for nursing',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase2.id,
        title: 'Obtain official CCAF transcript',
        completed: false,
        notes: 'Confirm which credits transfer to BSN prerequisites',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase2.id,
        title: 'Shadow nurses during clinicals - confirm I like patient care',
        completed: false,
        notes: 'Ask myself: Can I handle bedpans, IVs, emotional situations?',
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase2.id,
        title: 'Research AECP-approved BSN programs',
        completed: false,
        notes: 'Look at schools near potential first duty stations',
        position: 3,
        user_id: userId,
      },
      {
        phase_id: phase2.id,
        title: 'Connect with 2-3 AECP alumni on Facebook/LinkedIn',
        completed: false,
        notes: 'Ask: What GPA do I need? How hard is the application?',
        position: 4,
        user_id: userId,
      },

      // Phase 3 Year 1
      {
        phase_id: phase3Year1.id,
        title: 'Get married',
        completed: false,
        due_date: '2026-12-06',
        notes: 'My 28th birthday - symbolic date',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase3Year1.id,
        title: 'File I-130 for spouse (if needed)',
        completed: false,
        notes: 'Immediately after marriage',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase3Year1.id,
        title: 'Update DEERS, TRICARE, BAH for married status',
        completed: false,
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase3Year1.id,
        title: 'Complete 4N0 CDCs within 4 months',
        completed: false,
        notes: 'Faster = better EPR',
        position: 3,
        user_id: userId,
      },
      {
        phase_id: phase3Year1.id,
        title: 'Take nursing prerequisites: A&P I, English Comp (Fall 2026)',
        completed: false,
        notes: 'Use Tuition Assistance',
        position: 4,
        user_id: userId,
      },
      {
        phase_id: phase3Year1.id,
        title: 'Take nursing prerequisites: A&P II, Psychology (Spring 2027)',
        completed: false,
        notes: 'Target GPA: 3.5+',
        position: 5,
        user_id: userId,
      },
      {
        phase_id: phase3Year1.id,
        title:
          'Take nursing prerequisites: Microbiology, Nutrition (Summer 2027)',
        completed: false,
        notes: '21 credits completed after Year 1',
        position: 6,
        user_id: userId,
      },
      {
        phase_id: phase3Year1.id,
        title: 'Build credit to 700+ (get credit card, pay in full monthly)',
        completed: false,
        notes: 'Needed for VA loan',
        position: 7,
        user_id: userId,
      },
      {
        phase_id: phase3Year1.id,
        title: 'Save $5,000 emergency fund',
        completed: false,
        notes: 'Keep in high-yield savings (Ally, Marcus)',
        position: 8,
        user_id: userId,
      },

      // Phase 3 Year 2
      {
        phase_id: phase3Year2.id,
        title: 'Take nursing prerequisites: Chemistry, Statistics (Fall 2027)',
        completed: false,
        notes: 'Science GPA is critical for AECP',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase3Year2.id,
        title: 'Complete final prerequisite course (Spring 2028)',
        completed: false,
        notes: 'All 31 credits done - ready for AECP application',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase3Year2.id,
        title: 'Submit AECP application',
        completed: false,
        due_date: '2028-03-15',
        notes:
          'Includes: transcripts, commander rec, personal statement, 3-5 LORs',
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase3Year2.id,
        title: 'Get pre-approved for VA loan',
        completed: false,
        due_date: '2027-09-01',
        notes: 'Need 2 years service + honorable service',
        position: 3,
        user_id: userId,
      },
      {
        phase_id: phase3Year2.id,
        title: 'Buy first property (duplex/triplex/fourplex)',
        completed: false,
        due_date: '2028-03-01',
        notes: '0% down with VA loan, live in one unit, rent the rest',
        position: 4,
        user_id: userId,
      },
      {
        phase_id: phase3Year2.id,
        title: 'Promote to SSgt (E-5)',
        completed: false,
        notes: 'Test for it or make BTZ - critical for AECP application',
        position: 5,
        user_id: userId,
      },

      // Phase 4A (AECP)
      {
        phase_id: phase4A.id,
        title: 'Accept AECP slot and PCS to nursing school',
        completed: false,
        notes: 'Aug-Sep 2028 - I have 2 weeks to confirm',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase4A.id,
        title: 'Complete Year 1 nursing school (Fundamentals, Patho, Pharm)',
        completed: false,
        notes: 'GPA 3.0+ required to stay in AECP',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase4A.id,
        title: 'Log 250+ clinical hours (Year 1)',
        completed: false,
        notes: 'Med-surg floors, ICU, ER',
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase4A.id,
        title:
          'Complete Year 2 nursing school (Critical Care, Leadership, Capstone)',
        completed: false,
        position: 3,
        user_id: userId,
      },
      {
        phase_id: phase4A.id,
        title: 'Graduate with BSN',
        completed: false,
        due_date: '2030-06-15',
        position: 4,
        user_id: userId,
      },
      {
        phase_id: phase4A.id,
        title: 'Pass NCLEX on first attempt',
        completed: false,
        due_date: '2030-07-15',
        notes: 'Do 100-150 practice questions/day starting Jan 2030',
        position: 5,
        user_id: userId,
      },
      {
        phase_id: phase4A.id,
        title: 'Commission as Nurse Corps Officer (O-1)',
        completed: false,
        due_date: '2030-08-01',
        notes: 'I made it - guaranteed commission!',
        position: 6,
        user_id: userId,
      },

      // Phase 4B (Alternative)
      {
        phase_id: phase4B.id,
        title: 'Reenlist for 4 years',
        completed: false,
        notes: 'If AECP rejected - still have options',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase4B.id,
        title: 'Enroll in online BSN program (WGU, Chamberlain, etc)',
        completed: false,
        notes: 'Use TA + GI Bill - $0 cost',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase4B.id,
        title: 'Complete BSN part-time (2-3 years)',
        completed: false,
        notes: '1-2 classes per semester while working full-time',
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase4B.id,
        title: 'Pass NCLEX',
        completed: false,
        position: 3,
        user_id: userId,
      },
      {
        phase_id: phase4B.id,
        title: 'Apply for direct commission as Nurse Corps Officer',
        completed: false,
        notes: '80-90% acceptance rate - way better than OTS',
        position: 4,
        user_id: userId,
      },

      // Phase 5 (Officer)
      {
        phase_id: phase5.id,
        title: 'Report to first officer duty station',
        completed: false,
        notes: 'Likely med-surg floor or ICU',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase5.id,
        title: 'Get 2 years ICU experience',
        completed: false,
        notes: 'Required for CRNA program application',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase5.id,
        title: 'Promote to O-2 (automatic after 18 months)',
        completed: false,
        notes: 'Pay jump: ~$45k → $52k base',
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase5.id,
        title: 'Buy property #2 at next PCS',
        completed: false,
        notes: 'VA loan or conventional (if I have 20% down from property #1)',
        position: 3,
        user_id: userId,
      },
      {
        phase_id: phase5.id,
        title: 'Apply for Air Force CRNA program',
        completed: false,
        due_date: '2033-03-01',
        notes: 'Need: BSN, RN license, 2yrs ICU, GRE scores, strong OPRs',
        position: 4,
        user_id: userId,
      },

      // Phase 6 (CRNA School)
      {
        phase_id: phase6.id,
        title: 'Complete CRNA school (24-36 months)',
        completed: false,
        notes: "Air Force pays 100% tuition - Master's in Nurse Anesthesia",
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase6.id,
        title: 'Pass national certification exam (NCE)',
        completed: false,
        notes: 'Become Certified Registered Nurse Anesthetist',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase6.id,
        title: 'Graduate as CRNA (O-3/O-4)',
        completed: false,
        due_date: '2035-08-31',
        notes: 'I now have one of the highest-paying nursing specialties',
        position: 2,
        user_id: userId,
      },
    ];

    await supabase.from('tasks').insert(tasks);

    // Key milestones
    const milestones = [
      {
        title: '🎂 27th Birthday',
        date: '2025-12-06',
        completed: false,
        user_id: userId,
      },
      {
        title: '✈️ Ship Date - BMT Begins',
        date: '2026-02-03',
        completed: false,
        phase_id: phase1.id,
        user_id: userId,
      },
      {
        title: '💍 Wedding Day (28th Birthday)',
        date: '2026-12-06',
        completed: false,
        phase_id: phase3Year1.id,
        user_id: userId,
      },
      {
        title: '🏠 Buy First Property',
        date: '2028-03-01',
        completed: false,
        phase_id: phase3Year2.id,
        user_id: userId,
      },
      {
        title: '📋 AECP Application Due',
        date: '2028-03-15',
        completed: false,
        phase_id: phase3Year2.id,
        user_id: userId,
      },
      {
        title: '🎓 BSN Graduation',
        date: '2030-06-15',
        completed: false,
        phase_id: phase4A.id,
        user_id: userId,
      },
      {
        title: '⚕️ Commission as Nurse Corps Officer (O-1)',
        date: '2030-08-01',
        completed: false,
        phase_id: phase4A.id,
        user_id: userId,
      },
      {
        title: '🎂 35th Birthday',
        date: '2033-12-06',
        completed: false,
        user_id: userId,
      },
      {
        title: '💉 Graduate CRNA School',
        date: '2035-08-31',
        completed: false,
        phase_id: phase6.id,
        user_id: userId,
      },
      {
        title: '🎂 37th Birthday - 9 Years of Service',
        date: '2035-12-06',
        completed: false,
        user_id: userId,
      },
    ];

    await supabase.from('milestones').insert(milestones);

    setLoading(false);
    onComplete();
  }

  return (
    <div className="text-center">
      <Button onClick={seedData} disabled={loading} size="lg" className="mb-4">
        {loading
          ? 'Loading my mission plan...'
          : 'Load Mission Plan (Nursing Path)'}
      </Button>
      <p className="text-sm text-slate-600">
        This will load my complete mission plan: BMT → AECP → BSN → Commission →
        CRNA
      </p>
    </div>
  );
}
