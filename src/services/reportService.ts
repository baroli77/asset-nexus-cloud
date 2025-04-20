
import { Asset, getAssets } from "./assetService";

export interface AssetMetrics {
  totalAssets: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  totalValue: number;
}

export const getAssetMetrics = async (): Promise<AssetMetrics> => {
  const assets = await getAssets();
  
  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  let totalValue = 0;

  assets.forEach((asset) => {
    // Category distribution
    byCategory[asset.category] = (byCategory[asset.category] || 0) + 1;
    
    // Status distribution
    byStatus[asset.status] = (byStatus[asset.status] || 0) + 1;
    
    // Total value calculation
    if (asset.purchasePrice) {
      totalValue += parseFloat(asset.purchasePrice);
    }
  });

  return {
    totalAssets: assets.length,
    byCategory,
    byStatus,
    totalValue
  };
};
