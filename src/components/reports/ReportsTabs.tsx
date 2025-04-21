
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetDistributionCharts } from "./AssetDistributionCharts";
import { MaintenanceReport } from "./MaintenanceReport";
import { FinancialReport } from "./FinancialReport";
import { UtilizationReport } from "./UtilizationReport";

export const ReportsTabs = () => {
  return (
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
  );
};
