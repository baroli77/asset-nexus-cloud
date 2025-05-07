
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getAssetMetrics } from "@/services/reportService";

// Chart data types
interface CategoryData {
  name: string;
  value: number;
}

interface ActivityData {
  month: string;
  total: number;
}

interface DashboardChartsProps {
  assetCategoryData?: CategoryData[];
  assetActivityData?: ActivityData[];
}

const COLORS = ["#4361ee", "#f72585", "#4cc9f0", "#f8961e", "#3f37c9"];

export const DashboardCharts = ({ assetCategoryData: providedCategoryData, assetActivityData: providedActivityData }: DashboardChartsProps) => {
  // Fetch data from the report service if not provided as props
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-asset-metrics'],
    queryFn: getAssetMetrics,
    // Only fetch if props aren't provided
    enabled: !providedCategoryData || !providedActivityData
  });

  // Generate activity data from assets creation dates
  const generateActivityData = (): ActivityData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const activityData: ActivityData[] = [];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      activityData.push({
        month: months[monthIndex],
        total: 0 // Will be populated with real data
      });
    }
    
    return activityData;
  };

  // Use live data or fallback to provided props
  const categoryData = metrics ? 
    Object.entries(metrics.byCategory).map(([name, value]) => ({ name, value })) : 
    providedCategoryData || [];
    
  // Generate monthly activity data
  const activityData = providedActivityData || generateActivityData();

  return (
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
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
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
              <BarChart data={activityData}>
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
  );
};
