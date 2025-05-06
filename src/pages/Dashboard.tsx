
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getUsers } from "@/services/userService";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentAssets } from "@/components/dashboard/RecentAssets";

// Mock data for charts
const assetCategoryData = [
  { name: "Electronics", value: 42 },
  { name: "Office Equipment", value: 28 },
  { name: "Furniture", value: 18 },
  { name: "IT Hardware", value: 35 },
  { name: "Software Licenses", value: 22 },
];

const assetStatusData = [
  { name: "In Use", value: 75 },
  { name: "In Storage", value: 20 },
  { name: "Under Repair", value: 5 },
  { name: "Disposed", value: 10 },
];

const assetActivityData = [
  { month: "Jan", total: 5 },
  { month: "Feb", total: 8 },
  { month: "Mar", total: 12 },
  { month: "Apr", total: 16 },
  { month: "May", total: 24 },
  { month: "Jun", total: 32 },
  { month: "Jul", total: 40 },
];

// Simulated recent assets (normally would come from API/database)
const recentAssets = [
  { id: "A-1001", name: "MacBook Pro 16\"", category: "Electronics", location: "HQ - Floor 2", added: "2 days ago" },
  { id: "A-1002", name: "Standing Desk", category: "Furniture", location: "HQ - Floor 1", added: "3 days ago" },
  { id: "A-1003", name: "Projector", category: "Office Equipment", location: "Conference Room A", added: "5 days ago" },
  { id: "A-1004", name: "Server Rack", category: "IT Hardware", location: "Server Room", added: "1 week ago" },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeUsers: 0,
    maintenanceNeeded: 0,
    checkoutsPending: 0
  });

  // Simulate data loading with real user count
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch actual user count
        const users = await getUsers();
        const activeUserCount = users.filter(user => user.status === "Active").length;
        
        setStats({
          totalAssets: 145, // Still mock data for other stats
          activeUsers: activeUserCount,
          maintenanceNeeded: 5,
          checkoutsPending: 3
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
          <Button className="mt-4 md:mt-0" onClick={() => window.location.href = "/assets/new"}>
            <Plus className="mr-2 h-4 w-4" />
            New Asset
          </Button>
        </div>

        {/* Key Stats Section */}
        <DashboardStats loading={loading} stats={stats} />
        
        {/* Charts Section */}
        <DashboardCharts 
          assetCategoryData={assetCategoryData} 
          assetActivityData={assetActivityData} 
        />

        {/* Recent Assets Section */}
        <RecentAssets recentAssets={recentAssets} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
