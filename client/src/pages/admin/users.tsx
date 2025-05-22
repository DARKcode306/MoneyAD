import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { User } from "@shared/schema";
import { format } from "date-fns";

export default function AdminUsers() {
  // Fetch all users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  // Format dates for display
  const formatDate = (date: Date | null | string) => {
    if (!date) return "Never";
    
    // If date is a string, convert to Date object
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "MMM d, yyyy h:mm a");
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage application users and view their activity</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableCaption>List of all application users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Telegram ID</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Ads Watched Today</TableHead>
              <TableHead>Last Ad Watch</TableHead>
              <TableHead>Last Daily Bonus</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {user.telegramId ? (
                      user.telegramId
                    ) : (
                      <Badge variant="outline">Not linked</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.points}</Badge>
                  </TableCell>
                  <TableCell>{user.watchedAdsToday}</TableCell>
                  <TableCell>{formatDate(user.lastAdWatch)}</TableCell>
                  <TableCell>{formatDate(user.lastDailyBonus)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </AdminLayout>
  );
}