
import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Users, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  loading: boolean;
  stats: {
    totalAssets: number;
    activeUsers: number;
    maintenanceNeeded: number;
    checkoutsPending: number;
  };
}

export const DashboardStats = ({ loading, stats }: DashboardStatsProps) => {
  return (
    <section className="dashboard-section">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/assets" className="block">
          <Card className="card-hover transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
                  ) : (
                    stats.totalAssets
                  )}
                </div>
                <div className="rounded-full bg-brand-blue/10 p-2 text-brand-blue">
                  <Package size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/users" className="block">
          <Card className="card-hover transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 w-12 animate-pulse bg-gray-200 rounded"></div>
                  ) : (
                    stats.activeUsers
                  )}
                </div>
                <div className="rounded-full bg-brand-deepblue/10 p-2 text-brand-deepblue">
                  <Users size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/reports" className="block">
          <Card className="card-hover transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Maintenance Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 w-8 animate-pulse bg-gray-200 rounded"></div>
                  ) : (
                    stats.maintenanceNeeded
                  )}
                </div>
                <div className="rounded-full bg-brand-orange/10 p-2 text-brand-orange">
                  <AlertTriangle size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/assets" className="block">
          <Card className="card-hover transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Checkouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 w-8 animate-pulse bg-gray-200 rounded"></div>
                  ) : (
                    stats.checkoutsPending
                  )}
                </div>
                <div className="rounded-full bg-brand-cyan/10 p-2 text-brand-cyan">
                  <Clock size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
};
