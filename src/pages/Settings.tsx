
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Configure your asset management system
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page allows you to customize various aspects of your asset management system,
              including organization details, notification preferences, and display options.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
