
import { MainLayout } from "@/components/layout/MainLayout";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTabs } from "@/components/reports/ReportsTabs";
import { AssetMetricsSummary } from "@/components/reports/AssetMetricsSummary";

const Reports = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <ReportsHeader />
        <AssetMetricsSummary />
        <ReportsTabs />
      </div>
    </MainLayout>
  );
};

export default Reports;
