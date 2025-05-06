import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, AlertTriangle, Clock, ArrowUpRight, Plus } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Link } from "react-router-dom";

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

const COLORS = ["#4361ee", "#f72585", "#4cc9f0", "#f8961e", "#3f37c9"];

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

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalAssets: 145,
        activeUsers: 12,
        maintenanceNeeded: 5,
        checkoutsPending: 3
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
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
        
        {/* Charts Section */}
        <section className="dashboard-section grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Assets by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {assetCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} assets`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asset Activity (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} assets`, 'Added']} />
                    <Bar dataKey="total" fill="#4361ee" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Assets Section */}
        <section className="dashboard-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recently Added Assets</h2>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/assets"}>
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Asset ID
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Location
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Added
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssets.map((asset, index) => (
                    <tr 
                      key={asset.id} 
                      className={`border-t transition-colors hover:bg-muted/50 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/25"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                        {asset.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        {asset.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        {asset.category}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        {asset.location}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                        {asset.added}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
