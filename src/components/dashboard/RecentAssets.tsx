
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssets } from "@/services/assetService";
import { Link } from "react-router-dom";

interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  added?: string;
}

interface RecentAssetsProps {
  recentAssets?: Asset[];
  limit?: number;
}

export const RecentAssets = ({ recentAssets: providedAssets, limit = 5 }: RecentAssetsProps) => {
  // Fetch assets if not provided via props
  const { data: assets, isLoading } = useQuery({
    queryKey: ['dashboard-recent-assets'],
    queryFn: getAssets,
    // Only fetch if props aren't provided
    enabled: !providedAssets
  });

  // Format date for display
  const formatDate = (date: string) => {
    const assetDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - assetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Process and sort assets to get the most recent ones
  const processedAssets = () => {
    if (providedAssets) return providedAssets.slice(0, limit);
    
    if (!assets) return [];
    
    return assets
      // Add formatted date display
      .map(asset => ({
        ...asset,
        added: asset.purchaseDate ? formatDate(asset.purchaseDate) : 'N/A'
      }))
      // Sort by purchase date (most recent first)
      .sort((a, b) => {
        if (!a.purchaseDate) return 1;
        if (!b.purchaseDate) return -1;
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      })
      .slice(0, limit);
  };
  
  const recentItems = processedAssets();

  if (isLoading) {
    return (
      <section className="dashboard-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recently Added Assets</h2>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <div className="p-8 text-center">Loading recent assets...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recently Added Assets</h2>
        <Button variant="outline" size="sm" asChild>
          <Link to="/assets">
            View All
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      {recentItems.length === 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="p-8 text-center">
            No assets found. <Link to="/assets/new" className="text-primary hover:underline">Add your first asset</Link>.
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Asset ID
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Location
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map((asset, index) => (
                  <tr 
                    key={asset.id} 
                    className={`border-t transition-colors hover:bg-muted/50 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/25"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                      {asset.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {asset.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {asset.category}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {asset.location}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                      {asset.added}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
