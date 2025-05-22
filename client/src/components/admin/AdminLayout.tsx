import { ReactNode, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, Layers, Link, Users, Loader2, LogOut } from "lucide-react";
import { Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin is authenticated
  const { data: adminUser, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['/api/admin/me'],
    retry: false,
    onError: () => {
      // Redirect to login page if not authenticated
      navigate('/admin/login');
    }
  });

  useEffect(() => {
    // Wait for auth check to complete
    if (!isCheckingAuth) {
      setIsLoading(false);
    }
  }, [isCheckingAuth]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          <p className="text-sm text-gray-500">
            {adminUser?.username || "Loading..."}
          </p>
        </div>

        <Separator />

        <nav className="p-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate("/admin/dashboard")}
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate("/admin/app-tasks")}
          >
            <Layers className="h-4 w-4 mr-2" />
            App Tasks
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate("/admin/link-tasks")}
          >
            <Link className="h-4 w-4 mr-2" />
            Link Tasks
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate("/admin/quests")}
          >
            <Star className="h-4 w-4 mr-2" />
            Quests
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate("/admin/users")}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>

          <div className="my-4">
            <div className="text-xs font-semibold text-gray-500 px-4 mb-2">WALLET MANAGEMENT</div>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/admin/currencies")}
            >
              <svg className="h-4 w-4 mr-2" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="14.5" y1="12" y2="14.5" />
              </svg>
              Currencies
            </Button>

            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/admin/withdrawal-methods")}
            >
              <svg className="h-4 w-4 mr-2" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <rect height="16" rx="2" width="20" x="2" y="4" />
                <path d="M6 8h.01" />
                <path d="M2 12h20" />
                <path d="M6 16h.01" />
                <path d="M18 16h.01" />
              </svg>
              Withdrawal Methods
            </Button>
          </div>
        </nav>

        <div className="absolute bottom-0 p-4 w-64">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
}