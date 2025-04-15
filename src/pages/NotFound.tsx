
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! We couldn't find the page you're looking for.
        </p>
        <p className="text-muted-foreground mb-8">
          The page at <code className="bg-muted px-1 py-0.5 rounded">{location.pathname}</code> doesn't exist or may have been moved.
        </p>
        <Button 
          className="gap-2" 
          size="lg" 
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
