
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // For demo, we're using mock authentication
    // In a real app, this would be an API call
    setTimeout(() => {
      if (email === "demo@example.com" && password === "password") {
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try demo@example.com / password",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="animate-fade-in w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-brand-blue flex items-center justify-center">
            <span className="text-xl font-bold text-white">AN</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold">Asset Nexus</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-sm font-medium text-brand-blue hover:text-brand-deepblue"
                onClick={(e) => {
                  e.preventDefault();
                  toast({
                    title: "Password Reset",
                    description: "This would trigger a password reset flow in a real app."
                  });
                }}
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm font-medium">
              Remember me
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Don't have an account?{" "}
              <a 
                href="#" 
                className="font-medium text-brand-blue hover:text-brand-deepblue"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Sign up
              </a>
            </p>
          </div>
          
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Demo credentials: demo@example.com / password</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
