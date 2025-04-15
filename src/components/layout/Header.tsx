
import { Bell, Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    
    const currentTheme = savedTheme || (prefersLight ? "light" : "dark");
    setTheme(currentTheme);
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="hidden md:flex md:w-full md:max-w-sm md:flex-1">
        <div className="relative flex w-full max-w-sm items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets..."
            className="w-full rounded-md border bg-background pl-8 md:w-[300px] lg:w-[400px]"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white">
                D
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex flex-col items-start">
              <span className="font-medium">Demo User</span>
              <span className="text-xs text-muted-foreground">demo@example.com</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
