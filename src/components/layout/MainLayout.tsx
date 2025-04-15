
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden by default on mobile */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        {/* Mobile menu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </Button>
        )}
        
        <main 
          className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${
            !isMobile ? 'ml-[240px]' : ''
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
