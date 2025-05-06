
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle2, Shield, BarChart3, Server, Users } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-brand-blue to-brand-deepblue text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-lg font-bold text-brand-blue">AN</span>
              </div>
              <span className="text-xl font-bold">Asset Nexus</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="link" 
                className="text-white hover:text-white/80"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button 
                className="bg-white text-brand-blue hover:bg-white/90"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </nav>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Enterprise Asset Management Made Simple
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                Asset Nexus Cloud helps organizations track, manage, and optimize their assets across the entire lifecycle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-white text-brand-blue hover:bg-white/90"
                  onClick={() => navigate("/register")}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => {
                    const demoSection = document.getElementById("demo");
                    demoSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Request Demo <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-white/20 rounded-lg blur"></div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-6 shadow-xl">
                  <img 
                    src="/placeholder.svg" 
                    alt="Asset Nexus Dashboard" 
                    className="w-full h-auto rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full h-16 bg-background" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Asset Management Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to track, manage, and optimize your organization's assets in one powerful platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Server className="h-10 w-10 text-brand-blue" />,
                title: "Asset Tracking",
                description: "Monitor location, status, and condition of all your assets in real-time with powerful tracking tools."
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-brand-pink" />,
                title: "Advanced Analytics",
                description: "Make data-driven decisions with customizable reports and insightful analytics dashboards."
              },
              {
                icon: <Shield className="h-10 w-10 text-brand-cyan" />,
                title: "Maintenance Management",
                description: "Schedule, track, and optimize maintenance activities to extend asset lifespans."
              },
              {
                icon: <Users className="h-10 w-10 text-brand-orange" />,
                title: "User Management",
                description: "Manage permissions and access controls for your entire organization."
              },
              {
                icon: <CheckCircle2 className="h-10 w-10 text-brand-blue" />,
                title: "Compliance Tools",
                description: "Stay compliant with industry regulations with built-in compliance tools and audit logs."
              },
              {
                icon: <Server className="h-10 w-10 text-brand-pink" />,
                title: "Custom Data Fields",
                description: "Define and track the asset attributes that matter most to your specific business needs."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for your organization. All plans include access to our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$99",
                description: "Perfect for small businesses just getting started with asset management.",
                features: [
                  "Up to 500 assets",
                  "3 user accounts",
                  "Basic reporting",
                  "Email support",
                  "Data export"
                ],
                highlight: false
              },
              {
                name: "Professional",
                price: "$299",
                description: "Ideal for growing businesses with more complex asset management needs.",
                features: [
                  "Up to 2,000 assets",
                  "10 user accounts",
                  "Advanced reporting & analytics",
                  "Priority email & phone support",
                  "API access",
                  "Custom fields"
                ],
                highlight: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations with advanced requirements and custom integrations.",
                features: [
                  "Unlimited assets",
                  "Unlimited users",
                  "Custom integrations",
                  "Dedicated account manager",
                  "On-site training",
                  "SLA guarantees"
                ],
                highlight: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`bg-card rounded-lg border ${
                  plan.highlight 
                    ? 'border-brand-blue shadow-lg relative' 
                    : 'border-border shadow-sm'
                } p-8 flex flex-col`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-brand-blue text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`mt-auto ${
                    plan.highlight 
                      ? 'bg-brand-blue hover:bg-brand-blue/90' 
                      : ''
                  }`}
                  onClick={() => navigate("/register")}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-card rounded-lg border shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">See Asset Nexus in Action</h2>
                <p className="text-muted-foreground mb-6">
                  Request a personalized demo to see how Asset Nexus can transform your asset management processes.
                </p>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <input 
                        type="text" 
                        id="firstName" 
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <input 
                        type="text" 
                        id="lastName" 
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Work Email
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-1">
                      Company
                    </label>
                    <input 
                      type="text" 
                      id="company" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
                    Request Demo
                  </Button>
                </form>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/placeholder.svg" 
                  alt="Asset Nexus Demo" 
                  className="w-full h-auto rounded-lg shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-blue">AN</span>
                </div>
                <span className="text-lg font-bold">Asset Nexus</span>
              </div>
              <p className="text-gray-400 mb-4">
                Enterprise asset management software for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2025 Asset Nexus. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
