
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  added: string;
}

interface RecentAssetsProps {
  recentAssets: Asset[];
}

export const RecentAssets = ({ recentAssets }: RecentAssetsProps) => {
  return (
    <section className="dashboard-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recently Added Assets</h2>
        <Button variant="outline" size="sm" onClick={() => window.location.href = "/assets"}>
          View All
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
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
              {recentAssets.map((asset, index) => (
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
    </section>
  );
};
