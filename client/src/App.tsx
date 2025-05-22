import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { TelegramProvider } from "./contexts/TelegramContext";
import { UserProvider } from "./contexts/UserContext";
import MainLayout from "@/components/layout/MainLayout";
import EarnPage from "@/pages/earn";
import QuestsPage from "@/pages/quests";
import FriendsPage from "@/pages/friends";
import WalletPage from "@/pages/wallet";
import NotFound from "@/pages/not-found";

// Import admin pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminAppTasks from "@/pages/admin/app-tasks";
import AdminLinkTasks from "@/pages/admin/link-tasks";
import AdminUsers from "@/pages/admin/users";
import AdminCurrencies from "@/pages/admin/currencies";
import AdminWithdrawalMethods from "@/pages/admin/withdrawal-methods";

function Router() {
  const [location] = useLocation();
  
  // Check if we're in the admin section
  const isAdminRoute = location.startsWith("/admin");
  
  if (isAdminRoute) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/app-tasks" component={AdminAppTasks} />
        <Route path="/admin/link-tasks" component={AdminLinkTasks} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/currencies" component={AdminCurrencies} />
        <Route path="/admin/withdrawal-methods" component={AdminWithdrawalMethods} />
        <Route component={NotFound} />
      </Switch>
    );
  }
  
  // Regular app routes
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={EarnPage} />
        <Route path="/quests" component={QuestsPage} />
        <Route path="/friends" component={FriendsPage} />
        <Route path="/wallet" component={WalletPage} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </UserProvider>
      </TelegramProvider>
    </QueryClientProvider>
  );
}

export default App;
