import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Users,
  CheckCircle,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");

    if (token && email && role) {
      setIsAuthenticated(true);
      setUserEmail(email);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserRole(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Platform
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="text-muted-foreground">
                      {userRole === "admin" ? "Admin" : "User"}:
                    </span>
                    <span className="font-medium">{userEmail}</span>
                  </div>
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign in</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-background to-brand-50/30 dark:from-brand-950/30 dark:via-background dark:to-brand-950/20" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome to the future of productivity
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
              Build amazing things{" "}
              <span className="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
                faster than ever
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our platform empowers teams to collaborate, innovate, and deliver
              exceptional results with cutting-edge tools and intuitive design.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white h-12 px-8"
                >
                  Start free trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8">
                Watch demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Trusted by 10,000+ teams worldwide
              </p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                {/* Placeholder logos */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-24 h-8 bg-muted rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your workflow and boost
              productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-xl p-8 border border-border/40 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Enterprise Security
              </h3>
              <p className="text-muted-foreground">
                Bank-level security with end-to-end encryption, SSO, and
                compliance with industry standards.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-xl p-8 border border-border/40 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground">
                Optimized performance with global CDN, instant sync, and
                real-time collaboration features.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-xl p-8 border border-border/40 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Team Collaboration
              </h3>
              <p className="text-muted-foreground">
                Seamless collaboration tools with shared workspaces, comments,
                and real-time editing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you. No hidden fees, no surprise
              charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-card rounded-xl p-8 border border-border/40">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Starter
              </h3>
              <p className="text-muted-foreground mb-6">
                Perfect for individuals
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-foreground">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["5 projects", "10GB storage", "Email support"].map(
                  (feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ),
                )}
              </ul>
              <Link to="/register">
                <Button variant="outline" className="w-full">
                  Get started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-card rounded-xl p-8 border-2 border-brand-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most popular
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Pro
              </h3>
              <p className="text-muted-foreground mb-6">
                Best for growing teams
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-foreground">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited projects",
                  "100GB storage",
                  "Priority support",
                  "Advanced analytics",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white">
                  Get started
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-card rounded-xl p-8 border border-border/40">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Enterprise
              </h3>
              <p className="text-muted-foreground mb-6">
                For large organizations
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-foreground">
                  Custom
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Pro",
                  "Unlimited storage",
                  "24/7 phone support",
                  "Custom integrations",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                Contact sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using our platform to build amazing
            things.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Start free trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 border-white text-white hover:bg-white hover:text-brand-600"
            >
              Contact sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Platform
                </span>
              </div>
              <p className="text-muted-foreground">
                Building the future of productivity, one feature at a time.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Security", "Integrations"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Press"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2">
                {["Help Center", "Contact", "Status", "Privacy"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
