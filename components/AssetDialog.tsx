"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { type Asset, supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userId: string;
  editAsset?: Asset | null;
}

export function AssetDialog({
  open,
  onOpenChange,
  onSuccess,
  userId,
  editAsset,
}: Props) {
  const [assetType, setAssetType] = useState<string>("vehicle");
  const [name, setName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editAsset) {
      setAssetType(editAsset.asset_type);
      setName(editAsset.name);
      setPurchasePrice(editAsset.purchase_price.toString());
      setCurrentValue(editAsset.current_value.toString());
      setPurchaseDate(editAsset.purchase_date || "");
      setNotes(editAsset.notes || "");
    } else {
      setAssetType("vehicle");
      setName("");
      setPurchasePrice("");
      setCurrentValue("");
      setPurchaseDate("");
      setNotes("");
    }
  }, [editAsset]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        asset_type: assetType,
        name,
        purchase_price: parseFloat(purchasePrice) || 0,
        current_value: parseFloat(currentValue) || 0,
        purchase_date: purchaseDate || null,
        notes: notes || null,
      };

      if (editAsset) {
        const { error } = await supabase
          .from("assets")
          .update(data)
          .eq("id", editAsset.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("assets").insert({
          ...data,
          user_id: userId,
        });

        if (error) throw error;
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving asset:", error);
      alert("Failed to save asset");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editAsset ? "Edit Asset" : "Add New Asset"}
            </DialogTitle>
            <DialogDescription>
              {editAsset
                ? "Update your asset details."
                : "Add an asset to track (vehicles, properties, etc.)."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="assetType">Asset Type *</Label>
              <Select
                value={assetType}
                onValueChange={setAssetType}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., 2015 Mazda 6, 123 Main St Property"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchasePrice">Purchase Price *</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="currentValue">Current Value *</Label>
                <Input
                  id="currentValue"
                  type="number"
                  step="0.01"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details (mileage, condition, etc.)..."
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editAsset ? "Update" : "Add Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
