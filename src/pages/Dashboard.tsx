
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getUsers } from "@/services/userService";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentAssets } from "@/components/dashboard/RecentAssets";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/services/assetService";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeUsers: 0,
    maintenanceNeeded: 0,
    checkoutsPending: 0
  });

  // Fetch assets for calculations
  const { data: assets } = useQuery({
    queryKey: ['dashboard-assets'],
    queryFn: getAssets
  });

  // Calculate dashboard stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch actual user count
        const users = await getUsers();
        const activeUserCount = users.filter(user => user.status === "Active").length;
        
        // Calculate maintenance needed count
        const maintenanceCount = assets ? assets.filter(asset => 
          asset.status === "Under Repair" || asset.status === "Maintenance Required"
        ).length : 0;
        
        // Calculate checkout pending (this is a placeholder - you might have a different business rule)
        const checkoutCount = assets ? assets.filter(asset => 
          asset.status === "Reserved" || asset.status === "Pending Checkout"
        ).length : 0;
        
        setStats({
          totalAssets: assets?.length || 0,
          activeUsers: activeUserCount,
          maintenanceNeeded: maintenanceCount,
          checkoutsPending: checkoutCount
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (assets) {
      fetchData();
    }
  }, [assets]);

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back to your company's asset management dashboard.
            </p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/assets/new">
              <Plus className="mr-2 h-4 w-4" />
              New Asset
            </Link>
          </Button>
        </div>

        {/* Key Stats Section */}
        <DashboardStats loading={loading} stats={stats} />
        
        {/* Charts Section - using live data */}
        <DashboardCharts />

        {/* Recent Assets Section - using live data */}
        <RecentAssets />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
