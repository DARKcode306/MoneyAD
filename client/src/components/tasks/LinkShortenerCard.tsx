import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Coins } from "lucide-react";
import TaskCard from "./TaskCard";
import { LinkTask } from "@shared/schema";
import { useTelegram } from "@/contexts/TelegramContext";
import { useUser } from "@/contexts/UserContext";
import RewardAnimation from "@/components/rewards/RewardAnimation";

interface LinkShortenerCardProps {
  task: LinkTask;
}

export default function LinkShortenerCard({ task }: LinkShortenerCardProps) {
  const { webApp } = useTelegram();
  const { addPoints } = useUser();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const handleOpenLink = async () => {
    if (isCompleted) return;
    
    if (webApp) {
      webApp.openLink(task.url);
      
      // In a real app, you'd need a way to verify task completion
      // For now we'll just simulate completion after a timeout
      setTimeout(async () => {
        await addPoints(task.points);
        setIsCompleted(true);
        setShowReward(true);
      }, 2000);
    } else {
      // Fallback for non-Telegram environment
      window.open(task.url, "_blank");
    }
  };

  const closeReward = () => {
    setShowReward(false);
  };
  
  return (
    <>
      <TaskCard>
        {/* Link background image */}
        <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
            <svg width="80" height="80" viewBox="0 0 24 24" className="text-gray-400">
              <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8v-2z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        
        <div className="mb-3">
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 text-telegram-primary p-2 rounded-lg mr-2">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reward</p>
              <p className="font-semibold">{task.points} points</p>
            </div>
          </div>
          
          <Button 
            onClick={handleOpenLink}
            disabled={isCompleted}
            variant={isCompleted ? "outline" : "default"}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {isCompleted ? "Completed" : "Open Link"}
          </Button>
        </div>
      </TaskCard>
      
      <RewardAnimation 
        isVisible={showReward} 
        points={task.points}
        onClose={closeReward}
      />
    </>
  );
}
