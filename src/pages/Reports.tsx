
import { MainLayout } from "@/components/layout/MainLayout";
import { FileBarChart, FileSpreadsheet } from "lucide-react";
import { AssetMetricsSummary } from "@/components/reports/AssetMetricsSummary";
import { AssetDistributionCharts } from "@/components/reports/AssetDistributionCharts";
import { Button } from "@/components/ui/button";
import { downloadCSV } from "@/utils/csvUtils";
import { toast } from "sonner";
import { getAssetMetrics } from "@/services/reportService";

const Reports = () => {
  const handleExportReports = async () => {
    try {
      const metrics = await getAssetMetrics();
      const reportData = [
        {
          totalAssets: metrics.totalAssets,
          totalValue: metrics.totalValue,
          categories: Object.entries(metrics.byCategory).map(([category, count]) => 
            `${category}: ${count}`
          ).join('; '),
          statuses: Object.entries(metrics.byStatus).map(([status, count]) => 
            `${status}: ${count}`
          ).join('; ')
        }
      ];
      
      downloadCSV(reportData, 'asset_reports.csv');
      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report");
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              View detailed analytics and reports about your assets
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleExportReports}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileBarChart className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <AssetMetricsSummary />
        <AssetDistributionCharts />
      </div>
    </MainLayout>
  );
};

export default Reports;

