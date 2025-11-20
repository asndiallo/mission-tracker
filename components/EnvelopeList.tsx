"use client";

import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Envelope, Transaction } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import {
  formatCurrency,
  getBudgetHealthPercentage,
  getBudgetHealthStatus,
  getEnvelopePeriodDetails,
  sortEnvelopesByPosition,
} from "@/lib/utils/envelopes";
import { EnvelopeDialog } from "./EnvelopeDialog";

interface Props {
  envelopes: Envelope[];
  transactions: Transaction[];
  onUpdate: () => void;
  userId: string;
}

export function EnvelopeList({
  envelopes,
  transactions,
  onUpdate,
  userId,
}: Props) {
  const [editingEnvelope, setEditingEnvelope] = useState<Envelope | null>(null);
  const [deletingEnvelope, setDeletingEnvelope] = useState<Envelope | null>(
    null,
  );
  const [showOptions, setShowOptions] = useState<string | null>(null);

  const sortedEnvelopes = sortEnvelopesByPosition(envelopes);

  const handleDelete = async () => {
    if (!deletingEnvelope) return;

    await supabase.from("envelopes").delete().eq("id", deletingEnvelope.id);
    setDeletingEnvelope(null);
    onUpdate();
  };

  const getHealthColor = (status: "healthy" | "warning" | "over") => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "over":
        return "bg-red-500";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEnvelopes.map((envelope) => {
          const periodDetails = getEnvelopePeriodDetails(
            envelope,
            transactions,
          );
          const healthPercentage = getBudgetHealthPercentage(
            periodDetails.spent,
            periodDetails.allocated,
          );
          const healthStatus = getBudgetHealthStatus(
            periodDetails.spent,
            periodDetails.allocated,
          );

          return (
            <Card key={envelope.id} className="p-4 relative">
              {/* Options Menu */}
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowOptions(
                      showOptions === envelope.id ? null : envelope.id,
                    )
                  }
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <MoreVertical className="h-4 w-4 text-slate-600" />
                </button>
                {showOptions === envelope.id && (
                  <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEnvelope(envelope);
                        setShowOptions(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingEnvelope(envelope);
                        setShowOptions(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Envelope Header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: envelope.color }}
                />
                <h3 className="font-semibold truncate pr-6">{envelope.name}</h3>
              </div>

              {/* Budget Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">
                    {formatCurrency(periodDetails.spent)}
                  </span>
                  <span className="text-slate-900 font-semibold">
                    {formatCurrency(periodDetails.allocated)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${getHealthColor(healthStatus)}`}
                    style={{ width: `${Math.min(healthPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span
                    className={`font-semibold ${
                      periodDetails.remaining >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(periodDetails.remaining)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Period:</span>
                  <span className="capitalize">
                    {envelope.allocation_period}
                  </span>
                </div>
                {periodDetails.carriedOver > 0 && (
                  <div className="flex justify-between">
                    <span>Carried over:</span>
                    <span className="text-green-600">
                      {formatCurrency(periodDetails.carriedOver)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <EnvelopeDialog
        open={editingEnvelope !== null}
        onOpenChange={(open) => !open && setEditingEnvelope(null)}
        onSuccess={onUpdate}
        userId={userId}
        existingEnvelopes={envelopes}
        envelope={editingEnvelope}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deletingEnvelope !== null}
        onOpenChange={(open) => !open && setDeletingEnvelope(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Envelope</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingEnvelope?.name}"? This
              will not delete associated transactions, but they will become
              unassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingEnvelope(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
