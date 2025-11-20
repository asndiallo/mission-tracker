"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ParsedTransaction, parseCSVFile } from "@/lib/csv-parser";
import type { Envelope } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userId: string;
  envelopes: Envelope[];
}

export function TransactionImport({
  open,
  onOpenChange,
  onSuccess,
  userId,
  envelopes,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<"upload" | "review" | "assign">("upload");
  const [parsedTransactions, setParsedTransactions] = useState<
    ParsedTransaction[]
  >([]);
  const [bankSources, setBankSources] = useState<string[]>([]);
  const [_csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEnvelopes, setSelectedEnvelopes] = useState<
    Record<string, string>
  >({});

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    setLoading(true);

    try {
      const allTransactions: ParsedTransaction[] = [];
      const detectedBanks: string[] = [];

      // Process each file
      for (const file of selectedFiles) {
        const text = await file.text();
        const result = parseCSVFile(text, userId);

        if (result.detectedBank) {
          allTransactions.push(...result.transactions);
          detectedBanks.push(result.detectedBank);
        } else {
          alert(
            `Could not auto-detect bank for file: ${file.name}. Manual mapping not yet implemented.`,
          );
        }
      }

      setParsedTransactions(allTransactions);
      setBankSources(detectedBanks);

      if (allTransactions.length > 0) {
        setStep("review");
      }
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Error parsing CSV file(s). Please check the format.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to create unique transaction key
  const getTransactionKey = (t: ParsedTransaction, index: number) =>
    `${index}-${t.transaction_date}-${t.description}-${t.amount}`;

  const handleImport = async () => {
    setLoading(true);

    try {
      // Prepare transactions for insertion
      const transactionsToInsert = parsedTransactions.map((t, idx) => {
        const envelopeId = selectedEnvelopes[getTransactionKey(t, idx)];
        return {
          user_id: userId,
          transaction_date: t.transaction_date,
          clearing_date: t.clearing_date,
          description: t.description,
          merchant: t.merchant,
          category: t.category,
          transaction_type: t.transaction_type,
          amount: t.amount,
          envelope_id: envelopeId === "none" ? null : envelopeId || null,
          imported_from: t.imported_from,
        };
      });

      // Insert all transactions
      const { error } = await supabase
        .from("transactions")
        .insert(transactionsToInsert);

      if (error) throw error;

      onSuccess();
      onOpenChange(false);
      resetState();
    } catch (error) {
      console.error("Error importing transactions:", error);
      alert("Error importing transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setFiles([]);
    setStep("upload");
    setParsedTransactions([]);
    setBankSources([]);
    setCsvHeaders([]);
    setSelectedEnvelopes({});
  };

  const handleClose = () => {
    onOpenChange(false);
    resetState();
  };

  const totalExpenses = parsedTransactions
    .filter((t) => t.transaction_type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = parsedTransactions
    .filter((t) => t.transaction_type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayments = parsedTransactions
    .filter((t) => t.transaction_type === "payment")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload CSV file(s) from your bank(s) to import transactions. You can
            select multiple files at once.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
                disabled={loading}
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="h-12 w-12 text-slate-400" />
                <div>
                  <p className="text-sm font-medium">
                    {loading ? "Parsing..." : "Click to upload CSV file(s)"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports: Apple Card, Chase, Capital One, Navy Federal
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    You can select multiple files from different banks
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === "review" && (
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">
                Detected:{" "}
                {bankSources.length > 1
                  ? `${bankSources.length} banks (${[...new Set(bankSources)].join(", ")})`
                  : bankSources[0]}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Found {parsedTransactions.length} transactions from{" "}
                {files.length} file(s)
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-slate-600">Total Expenses</p>
                <p className="text-lg font-bold text-red-600">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-slate-600">Total Income</p>
                <p className="text-lg font-bold text-green-600">
                  ${totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-slate-600">Payments</p>
                <p className="text-lg font-bold text-blue-600">
                  ${totalPayments.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Informational</p>
              </div>
            </div>

            {/* Preview Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Description</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTransactions.slice(0, 10).map((t, idx) => {
                      const typeColor =
                        t.transaction_type === "expense"
                          ? "text-red-600"
                          : t.transaction_type === "income"
                            ? "text-green-600"
                            : t.transaction_type === "payment"
                              ? "text-blue-600"
                              : "text-slate-600";

                      return (
                        <tr
                          key={getTransactionKey(t, idx)}
                          className="border-t"
                        >
                          <td className="px-3 py-2 whitespace-nowrap">
                            {t.transaction_date}
                          </td>
                          <td className="px-3 py-2 truncate max-w-[200px]">
                            {t.description}
                          </td>
                          <td className="px-3 py-2 capitalize text-xs">
                            {t.transaction_type}
                          </td>
                          <td className={`px-3 py-2 text-right ${typeColor}`}>
                            ${t.amount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {parsedTransactions.length > 10 && (
                <div className="bg-slate-50 px-3 py-2 text-xs text-slate-600 text-center">
                  Showing 10 of {parsedTransactions.length} transactions
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep("assign")}>
                Next: Assign Envelopes
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Assign Envelopes */}
        {step === "assign" && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-slate-600">
              Optionally assign expense transactions to budget envelopes.
              Payments and income are excluded from envelope tracking.
            </p>

            <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-left">Envelope</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedTransactions
                    .map((t, idx) => ({ transaction: t, originalIndex: idx }))
                    .filter(
                      ({ transaction: t }) => t.transaction_type === "expense",
                    ) // Only show expenses
                    .map(({ transaction: t, originalIndex: idx }) => (
                      <tr key={getTransactionKey(t, idx)} className="border-t">
                        <td className="px-3 py-2 whitespace-nowrap">
                          {t.transaction_date}
                        </td>
                        <td className="px-3 py-2 truncate max-w-[200px]">
                          {t.description}
                        </td>
                        <td className="px-3 py-2 text-right text-red-600">
                          ${t.amount.toFixed(2)}
                        </td>
                        <td className="px-3 py-2">
                          <Select
                            value={
                              selectedEnvelopes[getTransactionKey(t, idx)] ||
                              "none"
                            }
                            onValueChange={(value) =>
                              setSelectedEnvelopes((prev) => ({
                                ...prev,
                                [getTransactionKey(t, idx)]: value,
                              }))
                            }
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {envelopes.map((env) => (
                                <SelectItem key={env.id} value={env.id}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: env.color }}
                                    />
                                    {env.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep("review")}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={loading}>
                {loading ? "Importing..." : "Import Transactions"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
