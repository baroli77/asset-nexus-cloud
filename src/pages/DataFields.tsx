
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

const DataFields = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Data Fields</h1>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Custom Field Management</CardTitle>
              <CardDescription>
                Configure and manage custom data fields for assets
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page allows administrators to create, edit, and manage custom data fields for assets.
              You can define different field types such as text, numbers, dates, dropdowns, and more to tailor
              the asset management system to your organization's specific needs.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DataFields;
