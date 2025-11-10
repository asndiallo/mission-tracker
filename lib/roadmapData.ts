// MISSION PLAN: ASSANE DIALLO
// Core Goal: Financial Independence through Real Estate + Cybersecurity Degree
// Bonus: Cyber Cross-Training → Officer Commission (if it works out)

import type { Phase } from "./supabase";

// Extended phase type with UI-only fields
type RoadmapPhase = Omit<Phase, "created_at" | "user_id"> & {
  objective?: string;
  sections?: Array<{
    title: string;
    items: string[];
  }>;
};

export const phases: RoadmapPhase[] = [
  {
    id: "phase-0",
    name: "Phase 0 — Preparation",
    description:
      "Ship ready: physically, administratively, mentally. Marry fiancée (Cape Verdean, in Dakar), start I-130 process.",
    objective:
      "Ship to BMT in peak condition. Complete civil marriage and begin immigration process for spouse.",
    start_date: "2024-11-01",
    end_date: "2026-02-03",
    status: "active",
    position: 0,
    sections: [
      {
        title: "🎯 Physical & Mental Prep",
        items: [
          "Maintain peak fitness — aim to exceed Air Force PT standards before BMT",
          "Target: 1.5 mile run under 10:30, max pushups/situps",
          "Goal: Arrive at BMT in top 25% physically (sets tone for entire career)",
          "Study Air Force culture — read AFI 36-2618 (enlisted evaluation system), watch BMT prep videos",
          "Mental resilience training — BMT is 90% mental; practice stress inoculation",
        ],
      },
      {
        title: "🎯 Administrative Prep",
        items: [
          "Gather valid passport",
          "Gather Green card (I-551)",
          "Gather birth certificate and immigration paperwork",
          "Store digital + physical copies (you'll need these Week 1 of BMT)",
          "Pay off any high-interest debt before shipping",
          "Set up direct deposit for military pay",
          "Open high-yield savings account (Ally, Marcus, USAA)",
          "Save $2-3k emergency fund (leave with fiancée/family)",
        ],
      },
      {
        title: "🎯 Marriage & Immigration (CRITICAL)",
        items: [
          "🔥 CIVIL MARRIAGE: December 2025 (your 28th birthday) — ceremony in Dakar or US",
          "Fiancée is Cape Verdean, currently resides in Dakar, Senegal",
          "File I-130 Petition for Alien Relative immediately after marriage (January 2026)",
          "Processing time: 6-12 months for Cape Verdean nationals",
          "Goal: Wife arrives in US by late 2026 or early 2027",
          "Set expectations: She may not join immediately (6-12 month separation during BMT/tech school)",
          "Command sponsorship paperwork: Start as soon as you arrive at first duty station",
        ],
      },
      {
        title: "🎯 Relationship Prep",
        items: [
          "Explain BMT reality: 8 weeks limited contact (letters only, 1-2 phone calls)",
          "Explain tech school: 4-5 months at Fort Sam Houston, TX",
          "Discuss military life: PCSing every 3-4 years, possible OCONUS assignments, deployments",
          "Explain the 10-15 year plan: cyber career path + real estate + business building",
          "Confirm she's okay with potential separation during immigration processing",
        ],
      },
      {
        title: "🎯 Start Security+ Preparation (Get Ahead)",
        items: [
          "Security+ is MANDATORY for cyber cross-training (application in 2028-2029)",
          "Study resources: Professor Messer (YouTube, free), CompTIA official guide",
          "Practice exams: Udemy, ExamCompass",
          "Goal: Take exam before BMT if possible (saves time later)",
          "Cost: $400 exam fee (can use TA after enlisting)",
        ],
      },
    ],
  },
  {
    id: "phase-1",
    name: "Phase 1 — BMT & Citizenship",
    description:
      "Graduate BMT, apply for U.S. citizenship, build leadership foundation",
    objective:
      "Graduate BMT with strong evaluations. Initiate citizenship process Week 1.",
    start_date: "2026-02-03",
    end_date: "2026-03-31",
    status: "upcoming",
    position: 1,
    sections: [
      {
        title: "🎯 Citizenship (Priority #1)",
        items: [
          "🔥 WEEK 1 OF BMT: Inform Training Instructor (TI) you want to apply for citizenship",
          "Request meeting with USCIS liaison on base (every BMT base has one)",
          "Fill out Form N-400 (Application for Naturalization)",
          "Fill out Form N-426 (Request for Certification of Military Service)",
          "Submit fingerprints + all citizenship documents",
          "Get USCIS case number and track it",
          "Timeline: Citizenship typically granted 3-8 months after application",
          "Goal: U.S. citizen by June-December 2026",
        ],
      },
      {
        title: "🎯 BMT Excellence",
        items: [
          "Mindset: BMT is an 8-week interview for your entire Air Force career",
          "Volunteer for leadership roles (dorm chief, element leader, chow runner)",
          "Help struggling trainees (builds reputation as future leader)",
          "Ace written tests (EOC exam, drill tests)",
          "Goal: Graduate as Honor Graduate or Warhawk if possible",
          "Your BMT performance goes in records — sets tone for cross-training application",
        ],
      },
      {
        title: "📋 Phase 1 Checklist",
        items: [
          "[ ] File N-400 and N-426 (Week 1)",
          "[ ] Track citizenship case number",
          "[ ] Volunteer for leadership roles",
          "[ ] Graduate BMT (ideally with honors)",
        ],
      },
    ],
  },
  {
    id: "phase-2",
    name: "Phase 2 — Tech School (4N0 Aerospace Medical Service)",
    description:
      "Graduate 4N0 tech school, earn CCAF credits, assess tolerance for clinical work",
    objective:
      "Graduate tech school in top 25%. Confirm you can tolerate clinical medicine. Earn CCAF credits.",
    start_date: "2026-04-01",
    end_date: "2026-08-31",
    status: "upcoming",
    position: 2,
    sections: [
      {
        title: "🎯 Academic Excellence",
        items: [
          "Location: Fort Sam Houston (Joint Base San Antonio), Texas",
          "Duration: 16-20 weeks",
          "Goal: Graduate in top 25% of class",
          "Coursework: patient care, medical terminology, pharmacology basics, emergency procedures",
          "Why this matters: Strong tech school performance helps future cross-training application",
        ],
      },
      {
        title: "🎯 Clinical Reality Check (Decision Point #1)",
        items: [
          "During tech school clinicals, you'll experience: bedpans, catheters, wound care, taking vitals, giving injections, blood/bodily fluids",
          "Ask yourself: Can I tolerate this for 3-6 years? (Until you finish cybersecurity degree)",
          "Decision: ✅ If tolerating it okay → Continue with plan",
          "Decision: ⚠️ If struggling but not hating it → Remind yourself this is temporary",
          "Decision: 🚨 If you absolutely hate it → Consider cross-training earlier or pivoting career path",
        ],
      },
      {
        title: "🎯 CCAF Credits",
        items: [
          "Tech school = ~20-30 credits toward CCAF (Associate in Health Science)",
          "Request official transcript at graduation",
          "Check which credits transfer to WGU B.S. Cybersecurity program",
          "Medical terminology/anatomy credits may transfer as general education electives",
        ],
      },
      {
        title: "🎯 Marriage & Immigration Update",
        items: [
          "Update DEERS (military benefits system) with marriage info",
          "Add spouse to TRICARE (health insurance)",
          "Update BAH to 'with dependents' rate (higher pay)",
          "Check I-130 status (should be processing)",
          "Goal: Wife approved to join by end of 2026 or early 2027",
        ],
      },
      {
        title: "📋 Phase 2 Checklist",
        items: [
          "[ ] Graduate 4N0 tech school (90+ GPA if possible)",
          "[ ] Obtain CCAF transcript",
          "[ ] Confirm interest in continuing (or identify need to pivot)",
          "[ ] Update DEERS/TRICARE/BAH for marriage",
          "[ ] Track citizenship (should be approved by now or soon)",
        ],
      },
    ],
  },
  {
    id: "phase-3",
    name: "Phase 3 — First Duty Station (Build Phase)",
    description:
      "Excel at 4N0, get Security+/CySA+/CEH, start WGU cybersecurity bachelor, buy property, build wealth",
    objective:
      "This is THE critical phase. Build foundation for: (1) Cyber cross-training, (2) Real estate wealth, (3) Side business. Finish bachelor's degree.",
    start_date: "2026-09-01",
    end_date: "2029-08-31",
    status: "upcoming",
    position: 3,
    sections: [
      {
        title: "🎯 Year 1 (Sep 2026 - Aug 2027): Foundation",
        items: [
          "🔥 PRIORITY: Wife arrives in US (late 2026 or early 2027 once I-130 processed)",
          "Complete 4N0 CDCs within 4 months (Career Development Courses — faster = better EPR)",
          "Volunteer for extra duties, build rapport with leadership",
          "Goal: First EPR should be strong ('Exceeds' or better)",
          "Promote to SrA (E-4) automatically at ~20 months TIS (May 2027)",
        ],
      },
      {
        title: "🎯 CYBERSECURITY CERTIFICATIONS (CRITICAL PATH)",
        items: [
          "🔥🔥 SECURITY+ (MANDATORY for cyber cross-training) — Target: Jun 2027",
          "Study: Professor Messer (YouTube), CompTIA guide, practice exams",
          "Cost: $400 (TA covers this)",
          "Study time: 2-3 hours/day for 8-12 weeks",
          "CySA+ (Cybersecurity Analyst+) — Target: Dec 2027",
          "Cost: $400 (TA covers)",
          "Adds credits at WGU + strengthens resume",
          "CEH (Certified Ethical Hacker) — Target: Jun 2028",
          "Cost: $1,200 (TA covers)",
          "Strengthens cyber cross-training package significantly",
        ],
      },
      {
        title: "🎯 BACHELOR'S IN CYBERSECURITY (WGU)",
        items: [
          "Contact WGU admissions (Mar 2027): Submit SpanTran evaluation, ask about credit transfer",
          "Your French diploma (Level 7 in CS/AI/Data) may get you 20-40 credits of 'advanced standing'",
          "Enroll at WGU: Sep 2027",
          "Program: B.S. Cybersecurity and Information Assurance",
          "Cost: ~$3,800 per 6-month term (TA covers $4,500/year = fully funded)",
          "Self-paced, competency-based = finish courses as fast as you can prove competency",
          "Goal: Finish in 12-24 months (by Jun 2029)",
          "Strategy: Security+/CySA+/CEH certs = automatic credits at WGU (saves time)",
        ],
      },
      {
        title: "🎯 EDPT Preparation (Cyber Aptitude Test)",
        items: [
          "EDPT = Electronic Data Processing Test (required for 1B4X1 cyber cross-training)",
          "Format: 120 questions in 90 minutes (math, logic, sequences, patterns)",
          "Passing score: 60+ (aim for 70+)",
          "Study: Practice tests online (Peterson's, APEX Test Prep)",
          "Take official EDPT on base: Jun 2028 (before cross-training application)",
        ],
      },
      {
        title: "🎯 REAL ESTATE: First Property (Year 2)",
        items: [
          "Timeline: Q4 2027 or Q1 2028 (after 18-24 months at duty station)",
          "VA Loan Strategy:",
          "- Eligibility: 181 days active duty (you qualify ~Aug 2026)",
          "- Lenders prefer 12-24 months employment history → wait until late 2027",
          "- 0% down payment with VA loan",
          "Property type: Duplex, triplex, or fourplex (2-4 units)",
          "Purchase price: $300-400k (depends on local market)",
          "House-hacking strategy: Live in one unit, rent the others",
          "Example: Buy triplex for $400k, rent 2 units for $1,800/mo, your BAH covers your portion",
          "IF STATIONED OCONUS (Germany/Japan/Korea):",
          "- Cannot buy property overseas with VA loan",
          "- Instead: SAVE AGGRESSIVELY ($3,000+/month possible)",
          "- Goal: $50k saved by 2029 (for property when you PCS back to CONUS)",
        ],
      },
      {
        title: "🎯 SIDE BUSINESS Launch (Critical for Financial Independence)",
        items: [
          "Start: Jun 2027 (once wife arrives and you're settled)",
          "Options: E-commerce (dropshipping, Amazon FBA), real estate wholesaling, freelance consulting (web dev, data analysis), content creation",
          "Goal Year 1: $500-1,000/month",
          "Goal Year 2: $1,500-2,500/month",
          "Goal Year 3: $3,000-5,000/month (by 2030)",
          "Mindset: This is your PATH TO FINANCIAL INDEPENDENCE (not military career)",
          "Time investment: 10-20 hours/week (nights/weekends)",
        ],
      },
      {
        title: "🎯 PROMOTION to SSgt (E-5)",
        items: [
          "Eligible to test: ~3 years TIS (Feb 2029)",
          "Study: PDG (Professional Development Guide) + 4N0 SKT (Specialty Knowledge Test)",
          "Goal: Make SSgt by Summer 2029",
          "Why this matters: E-5 rank strengthens cross-training application (shows sustained excellence)",
        ],
      },
      {
        title: "🎯 CROSS-TRAINING APPLICATION (Critical Decision Point)",
        items: [
          "Application window: Jul-Sep 2028 (6 months before FTA window opens)",
          "FTA (First-Term Airman) window: 35-43 months TIS = Jan-Sep 2029",
          "Target AFSCs:",
          "1. 1B4X1 (Cyber Warfare Operations) — offensive/defensive cyber, requires TS clearance",
          "2. 1D7X1 (Cyber Defense Operations) — network defense, requires Secret clearance",
          "Required for application:",
          "- Security+ certification ✅",
          "- EDPT score 60+ (aim for 70+) ✅",
          "- U.S. citizenship ✅",
          "- Strong EPRs ✅",
          "- Commander recommendation ✅",
          "- No disciplinary issues ✅",
          "Approval probability: 60-80% (cyber is critically manned, Air Force wants you)",
          "Processing time: 2-6 months (results by Jan 2029)",
        ],
      },
      {
        title: "📋 Phase 3 Success Metrics (End of Year 3)",
        items: [
          "✅ Married with wife at duty station",
          "✅ Security+ certified (Jun 2027)",
          "✅ CySA+ certified (Dec 2027)",
          "✅ CEH certified (Jun 2028)",
          "✅ Bachelor's in Cybersecurity completed or nearly done (Jun 2029)",
          "✅ SSgt rank (E-5)",
          "✅ First property purchased (if CONUS) OR $50k saved (if OCONUS)",
          "✅ Side business generating $2-3k/month",
          "✅ Cross-training application submitted",
          "✅ EDPT passed",
        ],
      },
    ],
  },
  {
    id: "phase-4a",
    name: "Phase 4A — Cyber Track (If Cross-Train Approved)",
    description:
      "Cyber tech school → work as cyber operator → apply for 17D commission (optional)",
    objective:
      "Build hands-on cyber experience. Continue real estate + business. Apply for officer commission if desired.",
    start_date: "2029-02-01",
    end_date: "2033-02-01",
    status: "upcoming",
    position: 4,
    sections: [
      {
        title: "🎯 Cyber Tech School (2029)",
        items: [
          "Location: Keesler AFB (Mississippi) or Goodfellow AFB (Texas)",
          "Duration: 1B4X1 = ~6 months, 1D7X1 = 4-6 months",
          "Training: Offensive/defensive cyber operations, network exploitation, incident response",
          "You'll need to extend enlistment by 6-12 months (standard for cross-training)",
          "New contract end: Aug 2032 - Feb 2033 (6.5-7 years total)",
        ],
      },
      {
        title: "🎯 Work as Cyber Operator (2029-2032)",
        items: [
          "Possible assignments: NSA (Fort Meade, MD), Cyber Command units, Base comm squadron, Offensive Cyber Operations units",
          "Get more certifications: CISSP, OSCP, GIAC certs (Air Force will fund these)",
          "Build hands-on experience: penetration testing, threat hunting, incident response",
          "Continue working on bachelor's degree if not finished (WGU online)",
          "KEEP BUILDING: Real estate + side business (don't let cyber job consume you)",
        ],
      },
      {
        title: "🎯 Real Estate: Property #2",
        items: [
          "Timeline: 2030 (at cyber assignment)",
          "Use VA loan again (or conventional if VA entitlement used up)",
          "Continue house-hacking strategy",
          "Property manager: Hire one if needed (8-10% of rent)",
        ],
      },
      {
        title: "🎯 Apply for 17D Cyber Warfare Officer (OPTIONAL)",
        items: [
          "Timeline: 2031-2032 (after 2-3 years as cyber enlisted)",
          "Requirements:",
          "- Bachelor's in Cybersecurity ✅",
          "- U.S. Citizenship ✅",
          "- TS clearance ✅",
          "- 2+ years cyber experience ✅",
          "- Strong performance as cyber operator ✅",
          "Acceptance rate: 40-60% (competitive but doable)",
          "IF SELECTED: Commission as O-1, new 4-year commitment",
          "IF NOT SELECTED: Stay enlisted cyber E-6/E-7 — still excellent civilian exit value ($120-180k)",
          "NOTE: Officer is OPTIONAL. You can achieve financial independence as enlisted + business.",
        ],
      },
    ],
  },
  {
    id: "phase-4b",
    name: "Phase 4B — Wealth Builder Track (If Cross-Train Denied)",
    description:
      "Stay 4N0, finish bachelor, focus on real estate + business empire",
    objective:
      "Achieve financial independence by age 37-38 through aggressive real estate + business building.",
    start_date: "2029-09-01",
    end_date: "2036-09-01",
    status: "upcoming",
    position: 5,
    sections: [
      {
        title: "🎯 Stay 4N0, Promote to E-6 (TSgt)",
        items: [
          "Cross-training denied? No problem. Stay 4N0 and focus on wealth building.",
          "Reenlist: 4-6 years (2029-2033 or 2029-2035)",
          "Promote to TSgt (E-6): Test at ~5 years TIS (2031)",
          "Mindset: Treat 4N0 as your 'paid stability' while you build wealth on the side",
          "Work-life balance: Do your job well, but don't overextend (save energy for business)",
        ],
      },
      {
        title: "🎯 Real Estate: Properties #2, #3, #4",
        items: [
          "Buy property at EVERY PCS (every 3-4 years)",
          "Timeline:",
          "- Property #2: 2030 (second duty station)",
          "- Property #3: 2033 (third duty station)",
          "- Property #4: 2036 (fourth duty station)",
          "Strategy: Live in one unit, rent others, then rent your unit when you PCS",
          "By 2036: 4 properties generating $500-800/mo cashflow EACH = $2,000-3,200/mo total",
          "This is $24k-38k/year PASSIVE INCOME just from real estate",
        ],
      },
      {
        title: "🎯 Scale Side Business Aggressively",
        items: [
          "You have bachelor's in cybersecurity = freelance consulting opportunities",
          "Options: Cybersecurity consulting, web development, data analysis, e-commerce, real estate wholesaling",
          "Timeline:",
          "- 2029-2030: $3-4k/month ($36-48k/year)",
          "- 2031-2032: $4-5k/month ($48-60k/year)",
          "- 2033-2035: $5-7k/month ($60-84k/year)",
          "Goal by 2036: $5k+/month business income",
        ],
      },
      {
        title: "🎯 Financial Independence Math",
        items: [
          "By age 37-38 (2036-2037):",
          "Rental income: 4 properties × $600/mo avg = $2,400/mo ($28,800/year)",
          "Business income: $5,000/mo ($60,000/year)",
          "Total passive income: $7,400/mo ($88,800/year)",
          "Your expenses: ~$5,000/mo ($60,000/year)",
          "YOU ARE FINANCIALLY INDEPENDENT ✅",
          "You no longer NEED military paycheck (but you can keep it for 20-year retirement)",
        ],
      },
      {
        title: "🎯 Options at Financial Independence",
        items: [
          "Option 1: Stay military, coast to 20 years (2046) for pension + healthcare",
          "Option 2: Separate early (2036), use bachelor's in cybersecurity to get $100-150k civilian job",
          "Option 3: Go full-time entrepreneur (manage properties + scale business)",
          "Option 4: Take a 'passion job' (work because you WANT to, not because you NEED to)",
        ],
      },
    ],
  },
  {
    id: "phase-5",
    name: "Phase 5 — Financial Independence & Maximum Flexibility",
    description:
      "Achieve $60-90k/year passive income. Live life on YOUR terms.",
    objective:
      "You've reached financial independence. Decide what fulfills you.",
    start_date: "2036-01-01",
    end_date: "2040-12-31",
    status: "upcoming",
    position: 6,
    sections: [
      {
        title: "🎯 Financial Independence Achieved",
        items: [
          "Passive income: $60-90k/year (rentals + business)",
          "Net worth: $1.2-1.5M (real estate equity + investments + TSP)",
          "Debt: Rental mortgages (but assets exceed liabilities)",
          "You don't NEED to work anymore (but you can if you want)",
        ],
      },
      {
        title: "🎯 Life Decisions",
        items: [
          "Stay in military? (Coast to 20 for pension, or continue to enjoy the structure)",
          "Separate for high-paying civilian job? (Cybersecurity: $100-250k with clearance)",
          "Full-time entrepreneur? (Scale business, manage properties, new ventures)",
          "Semi-retire? (Work part-time, travel, spend time with family)",
          "The choice is YOURS.",
        ],
      },
      {
        title: "🎯 Family & Legacy",
        items: [
          "Transfer GI Bill to kids (after 10 years service) — worth $100k+ per child",
          "Teach kids about: investing, real estate, financial independence, entrepreneurship",
          "Your rental properties become generational wealth (can pass to children)",
          "You've built a life with OPTIONS — that's the ultimate success",
        ],
      },
    ],
  },
];

export const tasks = [
  // PHASE 0: PREPARATION
  {
    id: "task-0-1",
    phaseId: "phase-0",
    title: "Civil marriage with fiancée (Dec 2025)",
    completed: false,
    dueDate: "2025-12-06",
    notes:
      "Civil ceremony in Dakar or US. Start I-130 petition immediately after. Fiancée is Cape Verdean, currently in Dakar.",
    position: 0,
  },
  {
    id: "task-0-2",
    phaseId: "phase-0",
    title: "File I-130 Petition for Alien Relative",
    completed: false,
    dueDate: "2026-01-15",
    notes:
      "Start immigration process ASAP after marriage. Processing: 6-12 months. Goal: spouse joins by late 2026/early 2027.",
    position: 1,
  },
  {
    id: "task-0-3",
    phaseId: "phase-0",
    title: "Achieve peak fitness (1.5 mile run <10:30)",
    completed: false,
    dueDate: "2026-02-02",
    notes: "Arrive at BMT in top 25% physically. Sets tone for entire career.",
    position: 2,
  },
  {
    id: "task-0-4",
    phaseId: "phase-0",
    title: "Gather citizenship documents (passport, green card, birth cert)",
    completed: false,
    notes: "Store digital + physical copies. Bring to BMT Week 1.",
    position: 3,
  },
  {
    id: "task-0-5",
    phaseId: "phase-0",
    title: "Start studying for Security+ certification",
    completed: false,
    notes:
      "Use Professor Messer (YouTube, free). Security+ is MANDATORY for cyber cross-training.",
    position: 4,
  },
  {
    id: "task-0-6",
    phaseId: "phase-0",
    title: "Save $2-3k emergency fund",
    completed: false,
    notes: "Leave with spouse/family for emergencies during BMT.",
    position: 5,
  },

  // PHASE 1: BMT & CITIZENSHIP
  {
    id: "task-1-1",
    phaseId: "phase-1",
    title: "Apply for U.S. Citizenship (Week 1 of BMT)",
    completed: false,
    notes:
      "File N-400 and N-426. Track case number. Goal: citizenship by Jun-Dec 2026.",
    position: 0,
  },
  {
    id: "task-1-2",
    phaseId: "phase-1",
    title: "Volunteer for leadership roles (dorm chief, element leader)",
    completed: false,
    notes:
      "BMT performance goes in records. Sets foundation for cross-training application.",
    position: 1,
  },
  {
    id: "task-1-3",
    phaseId: "phase-1",
    title: "Graduate BMT",
    completed: false,
    dueDate: "2026-03-31",
    position: 2,
  },

  // PHASE 2: TECH SCHOOL
  {
    id: "task-2-1",
    phaseId: "phase-2",
    title: "Graduate 4N0 tech school (top 25% if possible)",
    completed: false,
    dueDate: "2026-08-31",
    notes: "Strong tech school performance helps cross-training application.",
    position: 0,
  },
  {
    id: "task-2-2",
    phaseId: "phase-2",
    title: "Obtain CCAF transcript",
    completed: false,
    notes:
      "~20-30 credits toward CCAF. Check which credits transfer to bachelor programs.",
    position: 1,
  },
  {
    id: "task-2-3",
    phaseId: "phase-2",
    title: "Reality check: Can I tolerate clinical work?",
    completed: false,
    notes:
      "During clinicals, assess: bedpans, IVs, patient care. If you hate it, pivot plan.",
    position: 2,
  },
  {
    id: "task-2-4",
    phaseId: "phase-2",
    title: "Update DEERS with marriage info",
    completed: false,
    notes: 'Add spouse to TRICARE, update BAH to "with dependents" rate.',
    position: 3,
  },

  // PHASE 3: FIRST DUTY STATION (BUILD PHASE)
  {
    id: "task-3-1",
    phaseId: "phase-3",
    title: "Wife arrives in US (command sponsorship approved)",
    completed: false,
    dueDate: "2027-03-01",
    notes:
      "I-130 processing: 6-12 months. She should arrive by late 2026 or early 2027.",
    position: 0,
  },
  {
    id: "task-3-2",
    phaseId: "phase-3",
    title: "GET SECURITY+ CERTIFICATION (CRITICAL)",
    completed: false,
    dueDate: "2027-06-01",
    notes:
      "MANDATORY for cyber cross-training. Study: Professor Messer, CompTIA guide. Exam: $400 (TA covers).",
    position: 1,
  },
  {
    id: "task-3-3",
    phaseId: "phase-3",
    title: "Complete 4N0 CDCs within 4 months",
    completed: false,
    dueDate: "2027-01-01",
    notes: "Faster = better EPR. Shows initiative.",
    position: 2,
  },
  {
    id: "task-3-4",
    phaseId: "phase-3",
    title: "Contact WGU: Get preliminary credit evaluation",
    completed: false,
    dueDate: "2027-03-01",
    notes:
      'Submit SpanTran evaluation. Ask: "How many credits from my French diploma can transfer?"',
    position: 3,
  },
  {
    id: "task-3-5",
    phaseId: "phase-3",
    title: "Enroll at WGU - B.S. Cybersecurity",
    completed: false,
    dueDate: "2027-09-01",
    notes:
      "Self-paced, competency-based. Goal: finish in 12-24 months. Use TA ($4,500/year).",
    position: 4,
  },
  {
    id: "task-3-6",
    phaseId: "phase-3",
    title: "Get CySA+ certification",
    completed: false,
    dueDate: "2027-12-01",
    notes:
      "Cybersecurity Analyst+. Adds credits at WGU + strengthens resume. Cost: $400 (TA covers).",
    position: 5,
  },
  {
    id: "task-3-7",
    phaseId: "phase-3",
    title: "Get CEH certification",
    completed: false,
    dueDate: "2028-06-01",
    notes:
      "Certified Ethical Hacker. Strengthens cyber cross-training package. Cost: $1,200 (TA covers).",
    position: 6,
  },
  {
    id: "task-3-8",
    phaseId: "phase-3",
    title: "Study for EDPT (cyber aptitude test)",
    completed: false,
    dueDate: "2028-06-01",
    notes:
      "Required for 1B4X1 cross-training. Practice online. Goal: score 70+.",
    position: 7,
  },
  {
    id: "task-3-9",
    phaseId: "phase-3",
    title: "Buy first property (if CONUS) OR save $50k (if OCONUS)",
    completed: false,
    dueDate: "2028-03-01",
    notes:
      "VA loan (0% down). Target: duplex/triplex. Live in 1 unit, rent others. If OCONUS: save aggressively.",
    position: 8,
  },
  {
    id: "task-3-10",
    phaseId: "phase-3",
    title: "Launch side business (e-commerce, consulting, freelance)",
    completed: false,
    dueDate: "2027-06-01",
    notes:
      "Start small: $500-1,000/month. Scale to $3-5k/month by 2032. This is KEY to financial independence.",
    position: 9,
  },
  {
    id: "task-3-11",
    phaseId: "phase-3",
    title: "Promote to SSgt (E-5)",
    completed: false,
    dueDate: "2028-09-01",
    notes:
      "Test for SSgt at ~3 years TIS. Making E-5 strengthens cross-training package.",
    position: 10,
  },
  {
    id: "task-3-12",
    phaseId: "phase-3",
    title: "Submit cross-training application (1B4X1 or 1D7X1)",
    completed: false,
    dueDate: "2028-09-01",
    notes:
      "FTA window: 35-43 months TIS (Jan-Sep 2029). Apply 6 months early (Jul-Sep 2028). Requires: Security+, EDPT, commander rec.",
    position: 11,
  },
  {
    id: "task-3-13",
    phaseId: "phase-3",
    title: "Finish Bachelor in Cybersecurity",
    completed: false,
    dueDate: "2029-06-01",
    notes:
      "WGU self-paced. If you hustle, finish in 12-18 months. This is CRITICAL regardless of cross-training outcome.",
    position: 12,
  },

  // PHASE 4A: CYBER TRACK (IF CROSS-TRAIN APPROVED)
  {
    id: "task-4a-1",
    phaseId: "phase-4a",
    title: "Attend cyber tech school (Keesler AFB or Goodfellow AFB)",
    completed: false,
    dueDate: "2029-08-01",
    notes:
      "1B4X1: 6 months. 1D7X1: 4-6 months. Training: offensive/defensive cyber ops.",
    position: 0,
  },
  {
    id: "task-4a-2",
    phaseId: "phase-4a",
    title: "Work as cyber operator (NSA, Cyber Command, base comm)",
    completed: false,
    notes:
      "Build hands-on experience. Get more certs (CISSP, OSCP). Continue real estate + business.",
    position: 1,
  },
  {
    id: "task-4a-3",
    phaseId: "phase-4a",
    title: "Buy property #2 at next duty station",
    completed: false,
    dueDate: "2030-06-01",
    notes: "Continue house-hacking strategy. VA loan or conventional.",
    position: 2,
  },
  {
    id: "task-4a-4",
    phaseId: "phase-4a",
    title: "Apply for 17D Cyber Warfare Officer commission",
    completed: false,
    dueDate: "2031-06-01",
    notes:
      "Requirements: Bachelor in cyber ✅, citizenship ✅, TS clearance ✅, cyber experience ✅. Acceptance: 40-60%.",
    position: 3,
  },
  {
    id: "task-4a-5",
    phaseId: "phase-4a",
    title: "Commission as O-1 (if 17D approved) OR stay enlisted E-6/E-7",
    completed: false,
    notes:
      "Either way: continue building wealth. Officer = higher income. Enlisted = more time for business.",
    position: 4,
  },

  // PHASE 4B: WEALTH BUILDER TRACK (IF CROSS-TRAIN DENIED)
  {
    id: "task-4b-1",
    phaseId: "phase-4b",
    title: "Stay 4N0, promote to E-6 (TSgt)",
    completed: false,
    dueDate: "2031-01-01",
    notes:
      "Focus on work-life balance. Minimize stress. Maximize time for business.",
    position: 0,
  },
  {
    id: "task-4b-2",
    phaseId: "phase-4b",
    title: "Buy property #2, #3, #4 at each PCS",
    completed: false,
    notes:
      "Every 3-4 years = new base = new property. Goal: 4 properties by 2036.",
    position: 1,
  },
  {
    id: "task-4b-3",
    phaseId: "phase-4b",
    title: "Scale side business to $3-5k/month",
    completed: false,
    dueDate: "2033-01-01",
    notes:
      "E-commerce, real estate wholesaling, consulting, freelance - whatever works. This is your path to FI.",
    position: 2,
  },
  {
    id: "task-4b-4",
    phaseId: "phase-4b",
    title: "Promote to E-7 (MSgt)",
    completed: false,
    dueDate: "2035-01-01",
    notes: "Steady income, good benefits, low stress. Keep building wealth.",
    position: 3,
  },
  {
    id: "task-4b-5",
    phaseId: "phase-4b",
    title: "Optional: Apply for 17D without cyber experience",
    completed: false,
    notes:
      "You have bachelor in cybersecurity. Can apply for direct commission. Acceptance: 20-40% (lower without experience).",
    position: 4,
  },

  // PHASE 5: FINANCIAL INDEPENDENCE
  {
    id: "task-5-1",
    phaseId: "phase-5",
    title: "Achieve $60-90k/year passive income",
    completed: false,
    notes:
      "Rentals: $30-50k/year. Business: $30-50k/year. Total: $60-100k/year. You are financially independent.",
    position: 0,
  },
  {
    id: "task-5-2",
    phaseId: "phase-5",
    title: "Decide: Stay military OR separate",
    completed: false,
    notes:
      "At FI, you have OPTIONS. Stay for pension? Separate for civilian tech job ($100-250k)? Full-time entrepreneur?",
    position: 1,
  },
  {
    id: "task-5-3",
    phaseId: "phase-5",
    title: "Transfer GI Bill to kids (if you have them)",
    completed: false,
    notes:
      "After 10 years service, can transfer benefits. Worth $100k+ per child.",
    position: 2,
  },
  {
    id: "task-5-4",
    phaseId: "phase-5",
    title: "Live the life YOU choose",
    completed: false,
    notes: "Financial freedom = life freedom. You built this. Enjoy it.",
    position: 3,
  },
];

export const milestones = [
  {
    id: "milestone-1",
    title: "Civil Marriage with Fiancée",
    date: "2025-12-06",
    completed: false,
    phaseId: "phase-0",
  },
  {
    id: "milestone-2",
    title: "Ship Date - BMT Begins",
    date: "2026-02-03",
    completed: false,
    phaseId: "phase-1",
  },
  {
    id: "milestone-3",
    title: "U.S. Citizenship Granted",
    date: "2026-08-01",
    completed: false,
    phaseId: "phase-2",
  },
  {
    id: "milestone-4",
    title: "Wife Arrives in US",
    date: "2027-03-01",
    completed: false,
    phaseId: "phase-3",
  },
  {
    id: "milestone-5",
    title: "Security+ Certification Earned",
    date: "2027-06-01",
    completed: false,
    phaseId: "phase-3",
  },
  {
    id: "milestone-6",
    title: "First Property Purchased",
    date: "2028-03-01",
    completed: false,
    phaseId: "phase-3",
  },
  {
    id: "milestone-7",
    title: "Bachelor in Cybersecurity Completed",
    date: "2029-06-01",
    completed: false,
    phaseId: "phase-3",
  },
  {
    id: "milestone-8",
    title: "Cross-Training Decision (Cyber Approved or Denied)",
    date: "2029-01-01",
    completed: false,
    phaseId: "phase-3",
  },
  {
    id: "milestone-9",
    title: "28th Birthday",
    date: "2025-12-06",
    completed: false,
  },
  {
    id: "milestone-10",
    title: "30th Birthday",
    date: "2028-12-06",
    completed: false,
  },
  {
    id: "milestone-11",
    title: "35th Birthday",
    date: "2033-12-06",
    completed: false,
  },
  {
    id: "milestone-12",
    title: "Financial Independence Achieved (Age 37-38)",
    date: "2036-01-01",
    completed: false,
    phaseId: "phase-5",
  },
];

// Export aliases for compatibility
export const roadmapPhases = phases;

// Helper function to get roadmap statistics
export function getRoadmapStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.completed).length;

  const activePhases = phases.filter((p) => p.status === "active").length;
  const upcomingPhases = phases.filter((p) => p.status === "upcoming").length;
  const completedPhases = phases.filter((p) => p.status === "complete").length;

  // Find next upcoming milestone
  const today = new Date();
  const upcomingMilestones = milestones
    .filter((m) => !m.completed && new Date(m.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextMilestone = upcomingMilestones[0]
    ? { title: upcomingMilestones[0].title, date: upcomingMilestones[0].date }
    : undefined;

  return {
    totalTasks,
    completedTasks,
    completionPercentage,
    totalMilestones,
    completedMilestones,
    activePhases,
    upcomingPhases,
    completedPhases,
    totalPhases: phases.length,
    nextMilestone,
  };
}
