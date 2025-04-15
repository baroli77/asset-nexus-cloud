
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  FileBarChart, 
  History, 
  Settings, 
  Users, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Assets",
    href: "/assets",
    icon: Package,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
  {
    title: "Audit Log",
    href: "/audit-log",
    icon: History,
    adminOnly: true,
  },
  {
    title: "Data Fields",
    href: "/data-fields",
    icon: Database,
    adminOnly: true,
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

// Mock user for demonstration
const mockUser = {
  name: "Demo User",
  email: "demo@example.com",
  role: "Admin"
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAdmin = mockUser.role === "Admin";
  
  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 py-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-brand-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">AN</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground">
              AssetNexus
            </h1>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto h-7 w-7 rounded-full bg-brand-blue flex items-center justify-center">
            <span className="text-white font-bold text-sm">AN</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 gap-1">
          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <TooltipProvider key={index} delayDuration={collapsed ? 100 : 1000}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "flex items-center justify-start gap-3 px-3",
                          collapsed && "justify-center px-2"
                        )}
                        onClick={() => navigate(item.href)}
                      >
                        <item.icon size={20} />
                        {!collapsed && <span>{item.title}</span>}
                      </Button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
        </nav>
      </div>
      
      <div className="mt-auto px-2 py-4">
        <TooltipProvider delayDuration={collapsed ? 100 : 1000}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex w-full items-center justify-start gap-3 px-3",
                  collapsed && "justify-center px-2"
                )}
                onClick={() => navigate("/login")}
              >
                <LogOut size={20} />
                {!collapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
        {!collapsed && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-sidebar-accent p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-white">
              {mockUser.name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {mockUser.name}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {mockUser.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
