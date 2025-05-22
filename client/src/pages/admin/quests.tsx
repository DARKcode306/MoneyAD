
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/admin/AdminLayout";
import { Quest } from "@shared/schema";
import { toast } from "@/components/ui/use-toast";

export default function QuestsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("watch_ads");
  const [points, setPoints] = useState("");
  const [totalProgress, setTotalProgress] = useState("");
  const [colorScheme, setColorScheme] = useState("purple");

  const { data: quests = [] } = useQuery<Quest[]>({
    queryKey: ['/api/admin/quests'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create quest');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/quests'] });
      setTitle("");
      setPoints("");
      setTotalProgress("");
      toast({ title: "Quest created successfully" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/quests/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete quest');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/quests'] });
      toast({ title: "Quest deleted successfully" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type || !points || !totalProgress) {
      toast({ 
        title: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    createMutation.mutate({
      title,
      type,
      points: parseInt(points),
      totalProgress: parseInt(totalProgress),
      colorScheme,
      isActive: true
    });
  };

  return (
    <AdminLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Quests</h1>

        <form onSubmit={handleSubmit} className="grid gap-4 max-w-md mb-8">
          <Input
            placeholder="Quest Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Quest Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="watch_ads">Watch Ads</SelectItem>
              <SelectItem value="invite_friends">Invite Friends</SelectItem>
              <SelectItem value="complete_tasks">Complete Tasks</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Points Reward"
            value={points}
            onChange={e => setPoints(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Total Progress Required"
            value={totalProgress}
            onChange={e => setTotalProgress(e.target.value)}
          />
          <Select value={colorScheme} onValueChange={setColorScheme}>
            <SelectTrigger>
              <SelectValue placeholder="Color Scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Add Quest</Button>
        </form>

        <div className="grid gap-4">
          {quests.map(quest => (
            <div key={quest.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
              <div>
                <h3 className="font-semibold">{quest.title}</h3>
                <p className="text-sm text-gray-600">
                  {quest.points} points | Progress: {quest.totalProgress} | Type: {quest.type}
                </p>
              </div>
              <Button 
                variant="destructive"
                onClick={() => deleteMutation.mutate(quest.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
