
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";

const dashboardWidgets = [
  { id: "totalAssets", label: "Total Assets", defaultChecked: true },
  { id: "activeUsers", label: "Active Users", defaultChecked: true },
  { id: "maintenanceNeeded", label: "Maintenance Needed", defaultChecked: true },
  { id: "pendingCheckouts", label: "Pending Checkouts", defaultChecked: true },
  { id: "assetsByCategory", label: "Assets by Category", defaultChecked: true },
  { id: "assetActivity", label: "Asset Activity", defaultChecked: true },
  { id: "recentAssets", label: "Recently Added Assets", defaultChecked: true },
];

const DashboardPersonalization = () => {
  const [selectedWidgets, setSelectedWidgets] = useState(() => {
    const saved = localStorage.getItem('dashboardWidgets');
    return saved 
      ? JSON.parse(saved) 
      : dashboardWidgets.filter(w => w.defaultChecked).map(w => w.id);
  });

  const handleWidgetToggle = (widgetId: string) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const savePreferences = () => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(selectedWidgets));
    toast.success("Dashboard preferences saved", {
      description: "Your dashboard has been updated"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardWidgets.map((widget) => (
              <div key={widget.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={widget.id} 
                  checked={selectedWidgets.includes(widget.id)}
                  onCheckedChange={() => handleWidgetToggle(widget.id)}
                />
                <Label htmlFor={widget.id}>{widget.label}</Label>
              </div>
            ))}
          </div>
          
          <Button onClick={savePreferences} className="mt-4">
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPersonalization;
