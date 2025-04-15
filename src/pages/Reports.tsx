
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBarChart } from "lucide-react";

const Reports = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileBarChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Asset Reports</CardTitle>
              <CardDescription>
                Generate custom reports based on asset data
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page will allow you to create customized reports based on your asset data. 
              You'll be able to filter by various criteria and export the results in different formats.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;
