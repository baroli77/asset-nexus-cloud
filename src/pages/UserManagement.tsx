
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const UserManagement = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Manage Users & Permissions</CardTitle>
              <CardDescription>
                Add, modify, and remove users from your organization
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page allows administrators to manage users within the organization.
              You can invite new users, assign roles and permissions, and control access to various
              features of the asset management system.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
