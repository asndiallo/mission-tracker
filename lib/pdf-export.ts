import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";
import type {
  Asset,
  FinancialAccount,
  Milestone,
  Phase,
  Task,
} from "./supabase";
import { formatDate } from "./utils/dates";

export async function generateMissionPlanPDF(
  phases: Phase[],
  tasks: Task[],
  milestones: Milestone[],
  accounts?: FinancialAccount[],
  assets?: Asset[],
) {
  const pdf = new jsPDF();
  let yPosition = 20;

  // Title
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("MISSION PLAN: ASSANE DIALLO", 105, yPosition, { align: "center" });

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Air Force Aerospace Medic → Nurse Corps Officer → CRNA",
    105,
    yPosition,
    { align: "center" },
  );

  yPosition += 15;
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 105, yPosition, {
    align: "center",
  });

  // Summary Stats
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("MISSION SUMMARY", 20, yPosition);

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedMilestones = milestones.filter((m) => m.completed).length;
  const totalMilestones = milestones.length;

  pdf.text(`• Total Phases: ${phases.length}`, 20, yPosition);
  yPosition += 6;
  pdf.text(
    `• Tasks: ${completedTasks} of ${totalTasks} complete (${completionRate}%)`,
    20,
    yPosition,
  );
  yPosition += 6;
  pdf.text(
    `• Milestones: ${completedMilestones} of ${totalMilestones} complete`,
    20,
    yPosition,
  );
  yPosition += 6;
  pdf.text(`• Ship Date: February 3, 2026`, 20, yPosition);

  // Phases Section
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("PHASES", 20, yPosition);
  yPosition += 5;

  phases.forEach((phase, index) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${index}. ${phase.name}`, 20, yPosition);

    yPosition += 6;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `${formatDate(phase.start_date)} → ${formatDate(phase.end_date)}`,
      25,
      yPosition,
    );

    yPosition += 5;
    pdf.setFontSize(9);
    const statusColor =
      phase.status === "complete"
        ? [34, 197, 94]
        : phase.status === "active"
          ? [59, 130, 246]
          : [148, 163, 184];
    pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    pdf.text(`Status: ${phase.status.toUpperCase()}`, 25, yPosition);
    pdf.setTextColor(0, 0, 0);

    if (phase.description) {
      yPosition += 5;
      pdf.setFontSize(9);
      const descLines = pdf.splitTextToSize(phase.description, 160);
      pdf.text(descLines, 25, yPosition);
      yPosition += descLines.length * 5;
    }

    // Tasks for this phase
    const phaseTasks = tasks.filter((t) => t.phase_id === phase.id);
    if (phaseTasks.length > 0) {
      yPosition += 5;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Tasks:", 25, yPosition);
      yPosition += 5;

      phaseTasks.forEach((task) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        const checkbox = task.completed ? "☑" : "☐";
        const taskText = `  ${checkbox} ${task.title}`;
        const taskLines = pdf.splitTextToSize(taskText, 155);
        pdf.text(taskLines, 30, yPosition);
        yPosition += taskLines.length * 4;

        if (task.notes) {
          pdf.setTextColor(100, 100, 100);
          const noteLines = pdf.splitTextToSize(
            `     Note: ${task.notes}`,
            150,
          );
          pdf.text(noteLines, 30, yPosition);
          yPosition += noteLines.length * 4;
          pdf.setTextColor(0, 0, 0);
        }
      });
    }
  });

  // Milestones Section
  pdf.addPage();
  yPosition = 20;
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("KEY MILESTONES", 20, yPosition);
  yPosition += 10;

  // Sort milestones by date
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  sortedMilestones.forEach((milestone) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(10);
    pdf.setFont("helvetica", milestone.completed ? "normal" : "bold");
    const checkbox = milestone.completed ? "✓" : "○";
    pdf.text(`${checkbox} ${milestone.title}`, 20, yPosition);

    yPosition += 5;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Date: ${formatDate(milestone.date)}`, 25, yPosition);
    yPosition += 8;
  });

  // Financial Summary (if provided)
  if (accounts && assets) {
    pdf.addPage();
    yPosition = 20;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("FINANCIAL SNAPSHOT", 20, yPosition);
    yPosition += 10;

    // Calculate totals
    const checking = accounts
      .filter((a) => a.account_type === "checking")
      .reduce((sum, a) => sum + Number(a.current_balance), 0);
    const savings = accounts
      .filter((a) => a.account_type === "savings")
      .reduce((sum, a) => sum + Number(a.current_balance), 0);
    const investments = accounts
      .filter((a) => ["roth_ira", "brokerage"].includes(a.account_type))
      .reduce((sum, a) => sum + Number(a.current_balance), 0);
    const creditCardDebt = accounts
      .filter((a) => a.account_type === "credit_card")
      .reduce((sum, a) => sum + Math.abs(Number(a.current_balance)), 0);
    const loans = accounts
      .filter((a) => a.account_type === "loan")
      .reduce((sum, a) => sum + Math.abs(Number(a.current_balance)), 0);
    const assetValue = assets.reduce(
      (sum, a) => sum + Number(a.current_value),
      0,
    );

    const totalAssets = checking + savings + investments + assetValue;
    const totalLiabilities = creditCardDebt + loans;
    const netWorth = totalAssets - totalLiabilities;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    };

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    pdf.text(`Net Worth: ${formatCurrency(netWorth)}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Total Assets: ${formatCurrency(totalAssets)}`, 20, yPosition);
    yPosition += 6;
    pdf.text(
      `  • Cash (Checking + Savings): ${formatCurrency(checking + savings)}`,
      25,
      yPosition,
    );
    yPosition += 6;
    pdf.text(`  • Investments: ${formatCurrency(investments)}`, 25, yPosition);
    yPosition += 6;
    pdf.text(
      `  • Physical Assets: ${formatCurrency(assetValue)}`,
      25,
      yPosition,
    );
    yPosition += 8;
    pdf.text(
      `Total Liabilities: ${formatCurrency(totalLiabilities)}`,
      20,
      yPosition,
    );
    yPosition += 6;
    pdf.text(
      `  • Credit Cards: ${formatCurrency(creditCardDebt)}`,
      25,
      yPosition,
    );
    yPosition += 6;
    pdf.text(`  • Loans: ${formatCurrency(loans)}`, 25, yPosition);

    // Accounts Table
    if (accounts.length > 0) {
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Accounts", 20, yPosition);
      yPosition += 5;

      const accountData = accounts.map((acc) => [
        acc.account_name,
        acc.institution,
        acc.account_type.replace("_", " ").toUpperCase(),
        formatCurrency(acc.current_balance),
      ]);

      autoTable(pdf, {
        startY: yPosition,
        head: [["Account", "Institution", "Type", "Balance"]],
        body: accountData,
        theme: "striped",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 10;
    }

    // Assets Table
    if (assets.length > 0 && yPosition < 250) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Assets", 20, yPosition);
      yPosition += 5;

      const assetData = assets.map((asset) => [
        asset.name,
        asset.asset_type.toUpperCase(),
        formatCurrency(asset.purchase_price),
        formatCurrency(asset.current_value),
      ]);

      autoTable(pdf, {
        startY: yPosition,
        head: [["Asset", "Type", "Purchase Price", "Current Value"]],
        body: assetData,
        theme: "striped",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [34, 197, 94] },
      });
    }
  }

  // Save PDF
  pdf.save("Mission_Plan_Assane_Diallo.pdf");
}
