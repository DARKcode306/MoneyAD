import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader2, Users, Layers, LineChart } from "lucide-react";

export default function AdminDashboard() {
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['/api/admin/users'],
  });
  
  const { data: appTasks, isLoading: isLoadingAppTasks } = useQuery({
    queryKey: ['/api/tasks/app'],
  });
  
  const { data: linkTasks, isLoading: isLoadingLinkTasks } = useQuery({
    queryKey: ['/api/tasks/links'],
  });
  
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* User Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        
        {/* App Tasks Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Tasks</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAppTasks ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{appTasks?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        
        {/* Link Tasks Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Link Tasks</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingLinkTasks ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{linkTasks?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to the Admin Panel</CardTitle>
            <CardDescription>
              Manage your Telegram Mini App from this dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Use the sidebar navigation to access different sections of the admin panel. 
              You can manage app tasks, link tasks, quests, and users from here.
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Create and edit app tasks for users to complete</li>
              <li>Manage link shortener tasks</li>
              <li>Configure quests and rewards</li>
              <li>View and manage user accounts</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}