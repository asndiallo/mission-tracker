"use client";

import { Edit2, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Envelope, Transaction } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

interface Props {
  transactions: Transaction[];
  envelopes: Envelope[];
  onUpdate: () => void;
  userId: string;
}

export function TransactionTable({
  transactions,
  envelopes,
  onUpdate,
  userId: _userId,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [envelopeFilter, setEnvelopeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [envelopeAssignment, setEnvelopeAssignment] = useState<string>("");

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((t) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchant?.toLowerCase().includes(searchTerm.toLowerCase());

      // Envelope filter
      const matchesEnvelope =
        envelopeFilter === "all" ||
        (envelopeFilter === "unassigned" && !t.envelope_id) ||
        t.envelope_id === envelopeFilter;

      return matchesSearch && matchesEnvelope;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortField === "date") {
        comparison =
          new Date(a.transaction_date).getTime() -
          new Date(b.transaction_date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  const _handleEnvelopeUpdate = async (
    transactionId: string,
    envelopeId: string | null,
  ) => {
    await supabase
      .from("transactions")
      .update({ envelope_id: envelopeId })
      .eq("id", transactionId);
    onUpdate();
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;
    await supabase
      .from("transactions")
      .delete()
      .eq("id", deletingTransaction.id);
    setDeletingTransaction(null);
    onUpdate();
  };

  const handleEditSave = async () => {
    if (!editingTransaction) return;
    await supabase
      .from("transactions")
      .update({
        envelope_id:
          envelopeAssignment === "unassigned" ? null : envelopeAssignment,
      })
      .eq("id", editingTransaction.id);
    setEditingTransaction(null);
    onUpdate();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEnvelopeName = (envelopeId: string | null) => {
    if (!envelopeId) return "Unassigned";
    const envelope = envelopes.find((e) => e.id === envelopeId);
    return envelope?.name || "Unknown";
  };

  const getEnvelopeColor = (envelopeId: string | null) => {
    if (!envelopeId) return "#6b7280";
    const envelope = envelopes.find((e) => e.id === envelopeId);
    return envelope?.color || "#6b7280";
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={envelopeFilter} onValueChange={setEnvelopeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Envelopes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Envelopes</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {envelopes.map((env) => (
              <SelectItem key={env.id} value={env.id}>
                {env.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${sortField}-${sortDirection}`}
          onValueChange={(value) => {
            const [field, direction] = value.split("-") as [
              "date" | "amount",
              "asc" | "desc",
            ];
            setSortField(field);
            setSortDirection(direction);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (Newest)</SelectItem>
            <SelectItem value="date-asc">Date (Oldest)</SelectItem>
            <SelectItem value="amount-desc">Amount (High)</SelectItem>
            <SelectItem value="amount-asc">Amount (Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction Count */}
      <div className="text-sm text-slate-600">
        Showing {filteredTransactions.length} of {transactions.length}{" "}
        transactions
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Envelope</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(transaction.transaction_date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      {transaction.merchant &&
                        transaction.merchant !== transaction.description && (
                          <div className="text-xs text-slate-500">
                            {transaction.merchant}
                          </div>
                        )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {transaction.category || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: getEnvelopeColor(
                              transaction.envelope_id,
                            ),
                          }}
                        />
                        <span className="text-xs">
                          {getEnvelopeName(transaction.envelope_id)}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        transaction.amount > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "" : "+"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTransaction(transaction);
                            setEnvelopeAssignment(
                              transaction.envelope_id || "unassigned",
                            );
                          }}
                          className="p-1 hover:bg-slate-100 rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-3 w-3 text-slate-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingTransaction(transaction)}
                          className="p-1 hover:bg-slate-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Transaction Dialog */}
      <Dialog
        open={editingTransaction !== null}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Assign this transaction to a budget envelope.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-1">
                {editingTransaction?.description}
              </p>
              <p className="text-xs text-slate-500">
                {editingTransaction &&
                  formatDate(editingTransaction.transaction_date)}{" "}
                •{" "}
                {editingTransaction &&
                  formatCurrency(editingTransaction.amount)}
              </p>
            </div>

            <div>
              <Label htmlFor="envelope">Envelope</Label>
              <Select
                value={envelopeAssignment}
                onValueChange={setEnvelopeAssignment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select envelope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
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
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingTransaction(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deletingTransaction !== null}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingTransaction(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
