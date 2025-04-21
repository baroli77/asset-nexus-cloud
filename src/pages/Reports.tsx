
import { MainLayout } from "@/components/layout/MainLayout";
import { FileBarChart, FileSpreadsheet, FilePieChart } from "lucide-react";
import { AssetMetricsSummary } from "@/components/reports/AssetMetricsSummary";
import { AssetDistributionCharts } from "@/components/reports/AssetDistributionCharts";
import { MaintenanceReport } from "@/components/reports/MaintenanceReport";
import { FinancialReport } from "@/components/reports/FinancialReport";
import { UtilizationReport } from "@/components/reports/UtilizationReport";
import { Button } from "@/components/ui/button";
import { downloadCSV } from "@/utils/csvUtils";
import { toast } from "sonner";
import { getAssetMetrics } from "@/services/reportService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        
        <Tabs defaultValue="distribution" className="space-y-4">
          <TabsList>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="utilization">Utilization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="space-y-4">
            <AssetDistributionCharts />
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <MaintenanceReport />
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
            <FinancialReport />
          </TabsContent>
          
          <TabsContent value="utilization" className="space-y-4">
            <UtilizationReport />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
