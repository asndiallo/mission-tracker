import type { DetailedPhase } from "@/components/PhaseDetailView";

// Detailed roadmap data based on the comprehensive military nursing plan
export const roadmapPhases: DetailedPhase[] = [
  {
    id: "phase-0",
    name: "Phase 0 — Preparation",
    description:
      "Ship mentally, physically, and administratively ready. Understand the nursing pathway before you commit.",
    objective:
      "Ship mentally, physically, and administratively ready. Understand the nursing pathway before you commit.",
    start_date: "2024-11-01",
    end_date: "2026-02-03",
    status: "active",
    sections: [
      {
        title: "🎯 Physical & Mental Prep",
        items: [
          "Maintain peak fitness — aim to exceed Air Force PT standards before BMT",
          "Target: 1.5 mile run under 10:30, max pushups/situps",
          "Goal: Arrive at BMT in the top 10% physically (sets tone for entire career)",
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
          "Open a high-yield savings account (Ally, Marcus) for emergency fund",
          "Brief fiancée on military pay schedule, allotments, and SGLI (life insurance)",
        ],
      },
      {
        title: "🎯 Relationship Prep (Critical)",
        items: [
          "Set expectations with fiancée about BMT (2 months limited contact)",
          "Explain tech school timeline (4-5 months, may or may not have off-base privileges)",
          "Discuss first duty station and when she can join",
          "Explain AECP timeline and nursing school intensity (60+ hrs/week)",
          "Discuss military life: PCSing every 3-4 years, deployments, TDYs",
        ],
      },
      {
        title: "🎯 Research Nursing Career",
        items: [
          "Shadow a nurse (if possible before shipping)",
          "Volunteer at a hospital or clinic",
          "Ask about daily reality: bedpans, IVs, emotional toll, shift work",
          "Read nursing subreddits: r/nursing, r/StudentNurse",
          "Research AECP: Read AFI 36-2013",
          "Join Air Force Nursing Facebook groups",
          "Connect with AECP alumni on LinkedIn",
        ],
      },
    ],
    checklists: [
      {
        title: "Phase 0 Checklist",
        items: [
          { text: "Run 1.5 miles under 10:30 consistently", completed: false },
          {
            text: "Gather all citizenship documents (digital + physical)",
            completed: false,
          },
          { text: "Pay off high-interest debt", completed: false },
          {
            text: "Set up direct deposit + high-yield savings",
            completed: false,
          },
          {
            text: "Have 'real talk' with fiancée about military life + nursing school",
            completed: false,
          },
          {
            text: "Shadow a nurse or volunteer in healthcare setting",
            completed: false,
          },
          { text: "Read AFI 36-2013 (AECP requirements)", completed: false },
          { text: "Join Air Force Nursing community online", completed: false },
        ],
      },
    ],
    successMetrics: [],
  },
  {
    id: "phase-1",
    name: "Phase 1 — BMT",
    description: "Basic Military Training at Lackland AFB, Texas",
    objective:
      "Graduate BMT with strong evaluations. Initiate citizenship process. Build reputation as a leader.",
    start_date: "2026-02-03",
    end_date: "2026-03-31",
    status: "upcoming",
    sections: [
      {
        title: "🎯 Citizenship (Priority #1)",
        items: [
          "Week 1 of BMT: Inform Training Instructor (TI) you want to apply for citizenship",
          "Request meeting with USCIS liaison on base",
          "Fill out Form N-400 (Application for Naturalization)",
          "Fill out Form N-426 (Request for Certification of Military Service)",
          "Submit fingerprints + documents",
          "Get case number, check status online when possible",
          "Goal: Citizenship approved by graduation or shortly after",
        ],
      },
      {
        title: "🎯 BMT Excellence",
        items: [
          "Volunteer for leadership roles (dorm chief, element leader, chow runner)",
          "Help struggling trainees (builds reputation as future NCO/officer)",
          "Ace written tests (EOC exam, drill tests)",
          "Goal: Graduate as Honor Graduate or Warhawk (if you're top performer)",
          "Your BMT performance shows up in records and builds confidence",
        ],
      },
      {
        title: "🎯 Network Building",
        items: [
          "Connect with instructors who are former 4N0s",
          "Ask about tech school, first duty stations, AECP",
          "Make friends with future nurses or med trainees",
        ],
      },
    ],
    checklists: [
      {
        title: "Phase 1 Checklist",
        items: [
          { text: "File N-400 and N-426 (Week 1)", completed: false },
          { text: "Track citizenship case number", completed: false },
          { text: "Volunteer for leadership roles", completed: false },
          { text: "Graduate BMT (ideally with honors)", completed: false },
          { text: "Network with 4N0 instructors", completed: false },
        ],
      },
    ],
    successMetrics: [
      { metric: "Citizenship application submitted", achieved: false },
      { metric: "BMT graduation (with strong eval)", achieved: false },
      { metric: "Leadership recognition (any awards/honors)", achieved: false },
    ],
  },
  {
    id: "phase-2",
    name: "Phase 2 — Tech School: 4N0 Aerospace Medical Service",
    description:
      "Medical training at Fort Sam Houston, Texas (Joint Base San Antonio)",
    objective:
      "Graduate top of class. Earn CCAF credits. Begin nursing prerequisites research. Confirm you like clinical medicine.",
    start_date: "2026-04-01",
    end_date: "2026-08-31",
    status: "upcoming",
    sections: [
      {
        title: "🎯 Academic Excellence",
        items: [
          "Goal: Graduate in top 10% of class",
          "4N0 tech school covers: patient care, medical terminology, pharmacology basics, emergency procedures",
          "This is your audition for nursing — if you struggle here, nursing school will be harder",
          "Request official transcript at graduation",
          "Identify which credits transfer to BSN prerequisites",
        ],
      },
      {
        title: "🎯 Clinical Reality Check",
        items: [
          "Do you like direct patient care?",
          "Can you handle bodily fluids, emotional patients, life-or-death situations?",
          "Do you prefer hands-on care or would you rather be at a desk?",
          "Shadow different roles: RNs, physicians, admin staff",
          "Figure out which role excites you most",
        ],
      },
      {
        title: "🎯 AECP Preparation Begins",
        items: [
          "Research BSN prerequisites: Anatomy & Physiology I & II (8 credits)",
          "Research: Microbiology (4 credits), Chemistry (4 credits)",
          "Research: Nutrition (3 credits), Psychology (3 credits)",
          "Research: Statistics (3 credits), English Composition (3 credits)",
          "Total: ~28-30 credits (can be done in 1.5-2 years part-time)",
          "Research which BSN programs are AECP-approved",
          "Connect with AECP alumni on Facebook groups, LinkedIn",
        ],
      },
    ],
    checklists: [
      {
        title: "Phase 2 Checklist",
        items: [
          {
            text: "Graduate 4N0 tech school (top 10% if possible)",
            completed: false,
          },
          { text: "Obtain official CCAF transcript", completed: false },
          {
            text: "Confirm which tech school credits transfer to BSN prerequisites",
            completed: false,
          },
          {
            text: "Shadow nurses during clinicals (confirm you like patient care)",
            completed: false,
          },
          { text: "Research AECP-approved BSN programs", completed: false },
          { text: "Connect with 2-3 AECP alumni for advice", completed: false },
          { text: "Stay in top physical condition", completed: false },
        ],
      },
    ],
    successMetrics: [
      { metric: "Tech school graduation (90+ GPA)", achieved: false },
      { metric: "CCAF transcript in hand", achieved: false },
      {
        metric: "Confirmed interest in nursing (vs. HIM or other fields)",
        achieved: false,
      },
      { metric: "List of 5-10 AECP-approved BSN programs", achieved: false },
    ],
  },
  {
    id: "phase-3-year1",
    name: "Phase 3 Year 1 — First Duty Station: Stability & Foundation",
    description:
      "Marry, excel at work, start prerequisites, build credit and emergency fund",
    objective:
      "Marry. Excel at duty station. Complete 21 credits of nursing prerequisites. Build financial foundation.",
    start_date: "2026-09-01",
    end_date: "2027-08-31",
    status: "upcoming",
    sections: [
      {
        title: "🎯 Priority 1: Marriage (Dec 2026)",
        items: [
          "Target date: December 6, 2026 (your 28th birthday — symbolic)",
          "File I-130 immediately after marriage (Petition for Alien Relative)",
          "Fiancée arrives: 3-6 months later (Mar-Jun 2027)",
          "Update DEERS (military dependents database)",
          "Add spouse to health insurance (TRICARE)",
          "Update BAH (you'll now get BAH with dependents = higher rate)",
        ],
      },
      {
        title: "🎯 Priority 2: Excel at Duty Station",
        items: [
          "First 90 days: Learn your clinic/hospital inside-out",
          "Volunteer for extra duties (show initiative)",
          "Build rapport with NCOIs, NCOs, and leadership",
          "Complete CDCs in 3-4 months (faster = better EPR)",
          "Get qualified on as many tasks as possible (IVs, phlebotomy, EKGs)",
          "Volunteer for deployments/TDYs if opportunities arise",
        ],
      },
      {
        title: "🎯 Priority 3: Nursing Prerequisites",
        items: [
          "Fall 2026: Anatomy & Physiology I (4 credits) + English Comp (3 credits)",
          "Spring 2027: Anatomy & Physiology II (4 credits) + Psychology (3 credits)",
          "Summer 2027: Microbiology (4 credits) + Nutrition (3 credits)",
          "Total after Year 1: 21 credits completed",
          "GPA Goal: 3.5+ (AECP is competitive)",
          "Use Tuition Assistance: $250/credit hour, up to $4,500/year",
        ],
      },
      {
        title: "🎯 Priority 4: Build Credit & Financial Foundation",
        items: [
          "Get a credit card (USAA, Navy Federal)",
          "Use it for groceries, gas — pay off in full every month",
          "Goal: 700+ credit score by 2027",
          "Save $5,000 minimum emergency fund",
          "Keep in high-yield savings (Ally, Marcus = 4-5% APY)",
          "Contribute at least 5% to TSP (Thrift Savings Plan)",
          "Air Force matches 5% — this is free money",
          "Use Roth TSP (tax-free growth)",
        ],
      },
    ],
    checklists: [
      {
        title: "Year 1 Checklist",
        items: [
          { text: "Get married (Dec 2026)", completed: false },
          { text: "File I-130 for spouse (if needed)", completed: false },
          { text: "Update DEERS, TRICARE, BAH", completed: false },
          { text: "Complete 4N0 CDCs (within 4 months)", completed: false },
          {
            text: "Finish 21 credits of nursing prerequisites (GPA 3.5+)",
            completed: false,
          },
          { text: "Build credit to 700+", completed: false },
          { text: "Save $5,000 emergency fund", completed: false },
          {
            text: "Volunteer for extra duties (build EPR bullets)",
            completed: false,
          },
        ],
      },
    ],
    successMetrics: [
      {
        metric: "Married with spouse at duty station",
        target: "Jun 2027",
        achieved: false,
      },
      { metric: "21 credits completed", target: "GPA 3.5+", achieved: false },
      { metric: "Credit score", target: "700+", achieved: false },
      { metric: "Emergency fund", target: "$5,000", achieved: false },
      { metric: "CDCs completed", achieved: false },
    ],
  },
  {
    id: "phase-3-year2",
    name: "Phase 3 Year 2 — AECP Application & Real Estate",
    description:
      "Complete prerequisites, apply for AECP, promote to SSgt, buy first property",
    objective:
      "Complete all nursing prerequisites. Submit AECP application. Promote to SSgt. Buy first property.",
    start_date: "2027-09-01",
    end_date: "2028-08-31",
    status: "upcoming",
    sections: [
      {
        title: "🎯 Priority 1: Complete Remaining Prerequisites",
        items: [
          "Fall 2027: Chemistry (4 credits) + Statistics (3 credits)",
          "Spring 2028: Elective (3 credits) — pick something easy to boost GPA",
          "Total after Year 2: 31 credits completed (all prerequisites done)",
          "Calculate science GPA (A&P, micro, chem)",
          "If below 3.3, consider retaking lowest grade",
        ],
      },
      {
        title: "🎯 Priority 2: AECP Application (Feb-Apr 2028)",
        items: [
          "Application opens: Typically Feb-Mar each year",
          "Complete AF Form 56 (application)",
          "Gather official transcripts (all prerequisites)",
          "Get Commander's recommendation letter",
          "Write personal statement (why nursing, why you, career goals)",
          "Ensure physical fitness test scores are current + passing",
          "Gather all EPRs",
          "Get 3-5 letters of recommendation",
        ],
      },
      {
        title: "🎯 Priority 3: Promote to SSgt (E-5)",
        items: [
          "Become eligible for BTZ (Below-The-Zone) for SrA",
          "Requires: Top EPRs, strong package, commander endorsement",
          "If you make BTZ → huge boost to AECP application",
          "If not BTZ, test for SSgt",
          "Study for promotion test (PDG + SKT)",
          "Goal: Make SSgt by 2028 (before AECP board)",
        ],
      },
      {
        title: "🎯 Priority 4: Buy First Property (Mid-2027)",
        items: [
          "Q3 2027: Get pre-approved for VA loan",
          "Q4 2027: House hunting (weekends)",
          "Q1 2028: Close on property, move in",
          "Q2 2028: Get tenants in other units, stabilize income",
          "Property type: 2-4 unit multifamily (duplex, triplex, or fourplex)",
          "Strategy: Live in one unit, rent the others (house hacking)",
          "Down payment: 0% with VA loan",
        ],
      },
    ],
    checklists: [
      {
        title: "Year 2 Checklist",
        items: [
          {
            text: "Complete final 10 credits of prerequisites (GPA 3.5+)",
            completed: false,
          },
          { text: "Submit AECP application (Feb-Apr 2028)", completed: false },
          { text: "Promote to SSgt (or test for it)", completed: false },
          {
            text: "Buy first property using VA loan (Q4 2027 - Q1 2028)",
            completed: false,
          },
          { text: "Get tenants in place (Q2 2028)", completed: false },
          { text: "Maintain excellent EPRs", completed: false },
          {
            text: "Build relationship with commander (strong rec letter)",
            completed: false,
          },
        ],
      },
    ],
    successMetrics: [
      {
        metric: "All nursing prerequisites completed",
        target: "31 credits, GPA 3.5+",
        achieved: false,
      },
      { metric: "AECP application submitted", achieved: false },
      { metric: "SSgt rank achieved (E-5)", achieved: false },
      {
        metric: "First property purchased + tenants in place",
        achieved: false,
      },
      { metric: "Credit score", target: "720+", achieved: false },
      { metric: "Emergency fund", target: "$10k+", achieved: false },
      { metric: "TSP balance", target: "$10-15k", achieved: false },
    ],
    decisionPoints: [
      {
        title: "AECP Results Decision Point (Jun-Jul 2028)",
        scenario: "AECP application results are announced",
        outcome: "Two possible outcomes determine your path forward",
        actions: [],
        recommendation: "Prepare for both outcomes. Have a backup plan ready.",
      },
    ],
  },
  {
    id: "phase-4a",
    name: "Phase 4A — AECP Nursing School (If Accepted)",
    description:
      "Accelerated BSN program as AECP selectee, receiving full E-5 pay + tuition covered",
    objective:
      "Graduate BSN. Pass NCLEX. Commission as Nurse Corps Officer (O-1).",
    start_date: "2028-09-01",
    end_date: "2030-06-30",
    status: "upcoming",
    sections: [
      {
        title: "🎯 Year 1: Nursing School Foundations",
        items: [
          "Fall 2028: Fundamentals of Nursing, Pathophysiology, Pharmacology I",
          "Spring 2029: Med-Surg Nursing I, Pharmacology II, Health Assessment",
          "Summer 2029: Med-Surg Nursing II, Mental Health Nursing",
          "Form study groups (your cohort is your lifeline)",
          "Use NCLEX prep resources from Day 1 (UWorld, Saunders, Mark Klimek lectures)",
          "Average 50-60 hrs/week (class + clinical + study time)",
        ],
      },
      {
        title: "🎯 Year 2: Clinical Mastery & Commissioning Prep",
        items: [
          "Fall 2029: Pediatric Nursing, OB Nursing, Community Health",
          "Spring 2030: Critical Care Nursing, Leadership/Management, Capstone",
          "Jan-May 2030: Do 100-150 NCLEX practice questions per day",
          "Focus on weak areas (pharm, prioritization, delegation)",
          "Take 2-3 full-length practice exams",
          "Goal: Graduate → take NCLEX within 1 month → pass on first attempt",
        ],
      },
      {
        title: "🎯 Clinical Rotations",
        items: [
          "Hours required: ~500-600 clinical hours over 2 years",
          "Settings: Med-surg floors, ICU, ER, pediatrics, OB, psych",
          "Treat every clinical like a job interview",
          "Ask questions, volunteer for procedures (IVs, catheters, wound care)",
          "Get contact info from preceptors (future job references)",
        ],
      },
      {
        title: "🎯 Life Management",
        items: [
          "You're still getting E-5 pay (~$3,500/month base + BAH)",
          "Budget carefully (books, supplies, fees add up)",
          "Continue TSP contributions (don't stop investing)",
          "Schedule weekly date nights with spouse (protect relationship)",
          "You still need to pass PT tests (Air Force will test you 1-2x during AECP)",
          "Schedule gym time like a class (3-4x/week, early morning)",
        ],
      },
    ],
    checklists: [
      {
        title: "AECP Year 1 Checklist",
        items: [
          {
            text: "Complete Fall, Spring, Summer semesters (GPA 3.0+ required)",
            completed: false,
          },
          { text: "Log 250+ clinical hours", completed: false },
          {
            text: "Pass all nursing exams (75%+ to pass each course)",
            completed: false,
          },
          { text: "Pass Air Force PT test (if tested)", completed: false },
          { text: "Maintain relationship with spouse", completed: false },
          {
            text: "Keep property cashflowing (if applicable)",
            completed: false,
          },
        ],
      },
      {
        title: "AECP Year 2 Checklist",
        items: [
          { text: "Complete final semesters (GPA 3.0+)", completed: false },
          { text: "Graduate with BSN (Jun 2030)", completed: false },
          { text: "Pass NCLEX on first attempt (Jul 2030)", completed: false },
          {
            text: "Commission as Nurse Corps Officer, O-1 (Aug 2030)",
            completed: false,
          },
          { text: "Receive first assignment orders", completed: false },
          { text: "PCS to first officer duty station", completed: false },
        ],
      },
    ],
    successMetrics: [
      { metric: "BSN degree earned", achieved: false },
      { metric: "NCLEX passed (Registered Nurse license)", achieved: false },
      { metric: "Commissioned as Nurse Corps Officer (O-1)", achieved: false },
      { metric: "First officer assignment received", achieved: false },
      { metric: "Marriage still strong", achieved: false },
      { metric: "Property #1 still cashflowing (if kept)", achieved: false },
    ],
  },
  {
    id: "phase-4b",
    name: "Phase 4B — Alternative Path: Reenlist & Pursue BSN (If AECP Rejected)",
    description:
      "Part-time BSN while working full-time, leading to direct commission",
    objective:
      "Finish BSN using TA + GI Bill. Pass NCLEX. Apply for direct commission.",
    start_date: "2028-09-01",
    end_date: "2031-12-31",
    status: "upcoming",
    sections: [
      {
        title: "🎯 Reenlistment (Aug 2028)",
        items: [
          "Reenlist for 4 years (you'll be at ~4 years TIS in 2028)",
          "Check for reenlistment bonus ($5-15k depending on manning)",
          "If offered, take it — invest in TSP or rental property",
          "You need time to finish BSN (can't do it in 1 year while working full-time)",
        ],
      },
      {
        title: "🎯 Finish BSN (Sep 2028 - Dec 2031)",
        items: [
          "Enroll in online BSN program (WGU, Chamberlain, Capella)",
          "Most programs = 2-3 years part-time",
          "Year 1 (2028-2029): Fundamentals, Pathophysiology, Pharmacology (15 credits)",
          "Year 2 (2029-2030): Med-Surg, Health Assessment, Mental Health (15 credits)",
          "Year 3 (2030-2031): Critical Care, OB, Peds, Leadership, Capstone (30 credits)",
          "Total: 60 credits (you already have 30 from prerequisites)",
          "Use TA for first $4,500/year, Use GI Bill for remainder",
          "Total cost: $0 out-of-pocket",
        ],
      },
      {
        title: "🎯 Work Performance (Continue Excelling)",
        items: [
          "Promote to TSgt (E-6): Test for TSgt in 2029-2030",
          "Goal: Make E-6 by 2031 (shows sustained excellence)",
          "Volunteer for flight chief, training monitor, deployment",
          "Build strong EPRs (you'll need them for direct commission package)",
          "If deployment opportunities arise, take them",
        ],
      },
      {
        title: "🎯 Real Estate (Continue Building)",
        items: [
          "Buy second property at next duty station (if you PCS)",
          "Use VA loan again or conventional loan",
          "Goal: 2 properties by 2031",
        ],
      },
      {
        title: "🎯 Direct Commission Application (2031)",
        items: [
          "Graduate BSN: Dec 2031",
          "Pass NCLEX: Jan 2032",
          "Apply for direct commission: Feb 2032",
          "Get selected: Apr-May 2032",
          "Commission as O-1: Jun 2032",
          "Acceptance rate: ~80-90% (way higher than OTS)",
        ],
      },
    ],
    checklists: [
      {
        title: "Phase 4B Checklist",
        items: [
          { text: "Reenlist for 4 years (Aug 2028)", completed: false },
          { text: "Enroll in online BSN program", completed: false },
          { text: "Complete Year 1 courses (15 credits)", completed: false },
          { text: "Complete Year 2 courses (15 credits)", completed: false },
          { text: "Complete Year 3 courses (30 credits)", completed: false },
          { text: "Graduate with BSN (Dec 2031)", completed: false },
          { text: "Pass NCLEX (Jan 2032)", completed: false },
          { text: "Promote to TSgt (E-6)", completed: false },
          { text: "Buy Property #2", completed: false },
          { text: "Apply for direct commission (Feb 2032)", completed: false },
        ],
      },
    ],
    successMetrics: [
      {
        metric: "BSN degree earned (part-time while working)",
        achieved: false,
      },
      { metric: "NCLEX passed", achieved: false },
      { metric: "Promoted to TSgt (E-6)", achieved: false },
      { metric: "Property #2 purchased", achieved: false },
      { metric: "Direct commission application submitted", achieved: false },
      {
        metric: "10 years of service (eligible for retirement at 20)",
        achieved: false,
      },
    ],
  },
  {
    id: "phase-5",
    name: "Phase 5 — Officer Life: Nurse Corps",
    description:
      "Build officer career, specialize, expand real estate, prepare for retirement or separation",
    objective:
      "Build officer career. Specialize. Expand real estate. Prepare for retirement or separation.",
    start_date: "2030-08-01",
    end_date: "2035-12-31",
    status: "upcoming",
    sections: [
      {
        title: "🎯 First Officer Assignment (O-1 → O-2)",
        items: [
          "Typical assignments: Medical-surgical floor nurse, Emergency room, ICU, Flight medicine",
          "Duration: 2-3 years at first assignment",
          "Promotion to O-2 (1st Lt): Automatic after 18 months as O-1",
          "Pay jump: ~$45k → $52k base pay",
        ],
      },
      {
        title: "🎯 Clinical Specialization",
        items: [
          "Flight nurse (if you want to deploy, do aeromedical evacuations)",
          "Critical care (ICU, ER — high-demand, high-stress)",
          "Nurse anesthetist (CRNA) — requires master's, pays $150-250k civilian",
          "Nurse practitioner (NP) — advanced practice, can diagnose/prescribe",
          "Air Force will pay for your master's using TA or AFIT",
          "Goal: Finish MSN (Master of Science in Nursing) by 2035",
        ],
      },
      {
        title: "🎯 Real Estate Expansion (Property #2, #3)",
        items: [
          "Buy property at each PCS (every 3-4 years)",
          "By 2035, you could have 3-4 properties",
          "Example: Property #1 (2027), Property #2 (2030), Property #3 (2033)",
          "Total equity target: $350k by 2035",
          "Total passive income target: $1,200/month by 2035",
        ],
      },
      {
        title: "🎯 Family Planning",
        items: [
          "By 2035, you'll be 37 years old",
          "If you want kids, discuss timeline with spouse",
          "TRICARE covers maternity",
          "Officer life is more stable than enlisted",
          "After 6 years commissioned service, transfer GI Bill to spouse/kids",
          "This is worth $100k+ in education benefits",
        ],
      },
    ],
    checklists: [
      {
        title: "Phase 5 Checklist",
        items: [
          { text: "Complete first officer assignment", completed: false },
          {
            text: "Promote to O-2 (automatic after 18 months)",
            completed: false,
          },
          { text: "Choose clinical specialization", completed: false },
          {
            text: "Apply for MSN program (CRNA, NP, or other)",
            completed: false,
          },
          { text: "Buy Property #2", completed: false },
          { text: "Buy Property #3", completed: false },
          {
            text: "Transfer GI Bill to dependents (if applicable)",
            completed: false,
          },
          { text: "Promote to O-3 (Captain)", completed: false },
        ],
      },
    ],
    successMetrics: [
      {
        metric: "Promoted to O-3 (Captain)",
        target: "After 4 years as O-2",
        achieved: false,
      },
      { metric: "MSN degree (or in progress)", achieved: false },
      {
        metric: "Specialty certification (flight nurse, ICU, NP, or CRNA)",
        achieved: false,
      },
      {
        metric: "3-4 rental properties",
        target: "Equity $300k+, cashflow $1,000+/month",
        achieved: false,
      },
      { metric: "TSP balance", target: "$100k+", achieved: false },
      { metric: "GI Bill transferred to dependents", achieved: false },
      { metric: "Family stable and thriving", achieved: false },
    ],
  },
  {
    id: "phase-6",
    name: "Phase 6 — Family, Legacy & Financial Independence",
    description:
      "Decide on retirement/separation, achieve financial independence, set up next chapter",
    objective:
      "Decide on retirement/separation. Achieve financial independence. Set up next chapter.",
    start_date: "2036-01-01",
    end_date: "2040-12-31",
    status: "upcoming",
    sections: [
      {
        title: "🎯 Decision Point: Stay or Separate?",
        items: [
          "At 20 years of service (2046), you're eligible for military retirement",
          "By 2035 (17 years of service), you'll need to decide your path",
          "Option A: Stay Until Retirement (20 years)",
          "Option B: Separate at 17-18 Years",
          "Option C: Guard/Reserve (best of both worlds)",
        ],
      },
      {
        title: "🎯 Financial Independence Analysis (2035)",
        items: [
          "Real estate portfolio: 3-4 properties, equity $300-400k",
          "Passive income: $12-18k/year ($1,000-1,500/month)",
          "TSP balance: ~$100-150k (17 years of contributions)",
          "Officer pay (O-3 with 17 years): ~$95-105k/year total comp",
          "Civilian nursing market value: $80-250k depending on specialty",
          "Net worth target by 2035: $400-500k",
        ],
      },
      {
        title: "🎯 Legacy Planning",
        items: [
          "Transfer GI Bill to kids (covers 4 years of college per child)",
          "Or: Save in 529 plan (tax-advantaged education savings)",
          "Your real estate portfolio becomes inheritance",
          "Teach kids about investing, real estate, financial independence",
          "Mentor young airmen interested in nursing/commissioning",
          "Volunteer in your community",
          "Stay connected to Air Force (alumni networks)",
        ],
      },
    ],
    successMetrics: [
      { metric: "Net worth", target: "$400-500k+", achieved: false },
      {
        metric: "Passive income from real estate",
        target: "$12-18k/year",
        achieved: false,
      },
      { metric: "MSN degree completed", achieved: false },
      {
        metric: "Decision made on 20-year retirement vs separation",
        achieved: false,
      },
      {
        metric: "Legacy plan in place for children's education",
        achieved: false,
      },
    ],
    decisionPoints: [
      {
        title: "Retirement Decision (Age 37-42)",
        scenario:
          "After 17+ years of service, you must decide your next chapter",
        outcome: "Three paths available based on your goals and circumstances",
        actions: [
          "Option A: Stay until 20-year retirement (military pension for life)",
          "Option B: Separate and pursue civilian nursing career ($100-250k/year)",
          "Option C: Transfer to Guard/Reserve (flexibility + eventual retirement)",
        ],
        recommendation:
          "You'll have OPTIONS. You're not trapped. Choose based on your family's needs and financial goals.",
      },
    ],
  },
];

// Calculate overall roadmap statistics
export function getRoadmapStats() {
  const totalPhases = roadmapPhases.length;
  const activePhases = roadmapPhases.filter(
    (p) => p.status === "active",
  ).length;
  const completedPhases = roadmapPhases.filter(
    (p) => p.status === "complete",
  ).length;
  const upcomingPhases = roadmapPhases.filter(
    (p) => p.status === "upcoming",
  ).length;

  // Find next milestone (first upcoming phase)
  const nextPhase = roadmapPhases.find(
    (p) => p.status === "upcoming" || p.status === "active",
  );

  return {
    totalPhases,
    activePhases,
    completedPhases,
    upcomingPhases,
    nextMilestone: nextPhase
      ? {
          title: nextPhase.name,
          date: nextPhase.start_date,
        }
      : undefined,
  };
}
