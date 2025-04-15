
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

const AuditLog = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Asset Activity History</CardTitle>
              <CardDescription>
                View all changes made to assets across your organization
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The audit log tracks all changes made to assets, including creation, updates, and deletions.
              Each action is recorded with the user who performed it, the date and time, and the specific changes made.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AuditLog;
