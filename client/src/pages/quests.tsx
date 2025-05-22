import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Star, CheckSquare, UserPlus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import TaskCard from "@/components/tasks/TaskCard";
import { Quest } from "@shared/schema";

export default function QuestsPage() {
  // Fetch quests from API
  const { data: quests = [] } = useQuery<Quest[]>({
    queryKey: ['/api/quests'],
  });

  // Daily challenge stats
  const completedQuests = quests.filter(quest => quest.completed).length;
  const totalQuests = quests.length;
  const progressPercentage = (completedQuests / totalQuests) * 100;

  return (
    <div className="fade-in">
      <h2 className="text-lg font-semibold mb-4">Daily Quests</h2>
      
      {/* Daily Challenges Summary */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white">
              <Star className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Daily Challenges</h3>
              <p className="text-sm text-gray-600">Complete {completedQuests}/{totalQuests} quests</p>
            </div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            5,000 points
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2.5 mb-1" />
      </div>
      
      {/* Quests List */}
      {quests.map((quest) => (
        <TaskCard key={quest.id}>
          <div className="flex items-center mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-${quest.colorScheme}-600 bg-${quest.colorScheme}-100`}>
              {quest.type === 'watch_ads' && <CheckSquare className="h-6 w-6" />}
              {quest.type === 'invite_friends' && <UserPlus className="h-6 w-6" />}
            </div>
            <div className="ml-3 flex-grow">
              <h3 className="font-semibold">{quest.title}</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">
                  Progress: {quest.currentProgress}/{quest.totalProgress}
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`bg-${quest.colorScheme}-500 h-1.5 rounded-full`} 
                    style={{ width: `${(quest.currentProgress / quest.totalProgress) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <div className={`bg-${quest.colorScheme}-100 text-${quest.colorScheme}-700 px-3 py-1 rounded-full text-sm font-medium`}>
                {quest.points.toLocaleString()} points
              </div>
            </div>
          </div>
          <Button 
            className="w-full"
            onClick={() => { /* In a real app, navigate to relevant section */ }}
            disabled={quest.completed}
          >
            {quest.completed ? "Completed" : "Complete Quest"}
          </Button>
        </TaskCard>
      ))}
    </div>
  );
}
