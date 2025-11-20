"use client";

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
import type { Envelope } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import {
  ENVELOPE_COLORS,
  getNextEnvelopePosition,
} from "@/lib/utils/envelopes";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userId: string;
  existingEnvelopes: Envelope[];
  envelope?: Envelope | null;
}

export function EnvelopeDialog({
  open,
  onOpenChange,
  onSuccess,
  userId,
  existingEnvelopes,
  envelope,
}: Props) {
  const [name, setName] = useState(envelope?.name || "");
  const [color, setColor] = useState(envelope?.color || ENVELOPE_COLORS[0]);
  const [allocationAmount, setAllocationAmount] = useState(
    envelope?.allocation_amount.toString() || "",
  );
  const [allocationPeriod, setAllocationPeriod] = useState<
    Envelope["allocation_period"]
  >(envelope?.allocation_period || "monthly");
  const [allocationDays, setAllocationDays] = useState(
    envelope?.allocation_days?.toString() || "",
  );
  const [carryoverEnabled, setCarryoverEnabled] = useState(
    envelope?.carryover_enabled || false,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name,
      color,
      allocation_amount: Number.parseFloat(allocationAmount) || 0,
      allocation_period: allocationPeriod,
      allocation_start_date:
        envelope?.allocation_start_date ||
        new Date().toISOString().split("T")[0],
      allocation_days:
        allocationPeriod === "custom" && allocationDays
          ? Number.parseInt(allocationDays, 10)
          : null,
      carryover_enabled: carryoverEnabled,
      user_id: userId,
    };

    try {
      if (envelope) {
        // Update existing envelope
        await supabase.from("envelopes").update(data).eq("id", envelope.id);
      } else {
        // Create new envelope
        await supabase.from("envelopes").insert({
          ...data,
          position: getNextEnvelopePosition(existingEnvelopes),
        });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error saving envelope:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setColor(ENVELOPE_COLORS[0]);
    setAllocationAmount("");
    setAllocationPeriod("monthly");
    setAllocationDays("");
    setCarryoverEnabled(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {envelope ? "Edit Envelope" : "Create Envelope"}
            </DialogTitle>
            <DialogDescription>
              Set up a budget envelope to track spending in a specific category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Envelope Name</Label>
              <Input
                id="name"
                placeholder="e.g., Groceries, Rent, Entertainment"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2 mt-2">
                {ENVELOPE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === c
                        ? "border-slate-900 scale-110"
                        : "border-slate-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={allocationAmount}
                onChange={(e) => setAllocationAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="period">Budget Period</Label>
              <Select
                value={allocationPeriod}
                onValueChange={(value) =>
                  setAllocationPeriod(value as Envelope["allocation_period"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly (14 days)</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom Period</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {allocationPeriod === "custom" && (
              <div>
                <Label htmlFor="days">Custom Period (days)</Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  placeholder="30"
                  value={allocationDays}
                  onChange={(e) => setAllocationDays(e.target.value)}
                  required={allocationPeriod === "custom"}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="carryover"
                checked={carryoverEnabled}
                onChange={(e) => setCarryoverEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <Label htmlFor="carryover" className="cursor-pointer">
                Enable carryover (unused budget rolls to next period)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : envelope ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
