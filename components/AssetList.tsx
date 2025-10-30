'use client';

import { Asset, supabase } from '@/lib/supabase';
import { Car, Home, Package, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { AssetDialog } from './AssetDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/dates';
import { useState } from 'react';

interface Props {
  assets: Asset[];
  onUpdate: () => void;
  userId: string;
}

export function AssetList({ assets, onUpdate, userId }: Props) {
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function deleteAsset(assetId: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    await supabase.from('assets').delete().eq('id', assetId);
    onUpdate();
  }

  function handleEdit(asset: Asset) {
    setEditingAsset(asset);
    setDialogOpen(true);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'vehicle':
        return <Car className="h-5 w-5 text-blue-600" />;
      case 'property':
        return <Home className="h-5 w-5 text-green-600" />;
      default:
        return <Package className="h-5 w-5 text-slate-600" />;
    }
  };

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vehicle: 'Vehicle',
      property: 'Property',
      other: 'Other',
    };
    return labels[type] || type;
  };

  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-slate-500">
          No assets yet. Add your first asset to start tracking.
        </CardContent>
      </Card>
    );
  }

  // Group assets by type
  const groupedAssets = assets.reduce((acc, asset) => {
    if (!acc[asset.asset_type]) {
      acc[asset.asset_type] = [];
    }
    acc[asset.asset_type].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  return (
    <>
      <div className="space-y-4">
        {Object.entries(groupedAssets).map(([type, typeAssets]) => (
          <div key={type}>
            <h3 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
              {getAssetTypeLabel(type)}
            </h3>
            <div className="space-y-2">
              {typeAssets.map((asset) => {
                const gain = asset.current_value - asset.purchase_price;
                const gainPercent = (gain / asset.purchase_price) * 100;

                return (
                  <Card key={asset.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {getAssetIcon(asset.asset_type)}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{asset.name}</h4>
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(asset.current_value)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Purchased: {formatCurrency(asset.purchase_price)}
                            </Badge>
                            {asset.purchase_date && (
                              <Badge variant="outline" className="text-xs">
                                {formatDate(asset.purchase_date)}
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                gain >= 0
                                  ? 'text-green-600 border-green-600'
                                  : 'text-red-600 border-red-600'
                              }`}
                            >
                              {gain >= 0 ? '+' : ''}
                              {formatCurrency(gain)} ({gainPercent.toFixed(1)}%)
                            </Badge>
                          </div>

                          {asset.notes && (
                            <p className="text-xs text-slate-500 mt-2">
                              {asset.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(asset)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteAsset(asset.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AssetDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingAsset(null);
        }}
        onSuccess={() => {
          onUpdate();
          setDialogOpen(false);
          setEditingAsset(null);
        }}
        userId={userId}
        editAsset={editingAsset}
      />
    </>
  );
}
