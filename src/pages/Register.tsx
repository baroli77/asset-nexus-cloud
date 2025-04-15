
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!companyName || !name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // For demo, we're simulating a registration process
    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please sign in.",
      });
      navigate("/login");
      setLoading(false);
    }, 1500);
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="animate-fade-in w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-brand-blue flex items-center justify-center">
            <span className="text-xl font-bold text-white">AN</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold">Create Your Account</h1>
          <p className="mt-2 text-muted-foreground">
            Start managing your company's assets today
          </p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="Your Company Ltd"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{" "}
              <a 
                href="#" 
                className="font-medium text-brand-blue hover:text-brand-deepblue"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
