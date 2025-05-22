import { ArrowRight, Coins } from "lucide-react";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/contexts/TelegramContext";
import { AppTask } from "@shared/schema";

interface AppTaskCardProps {
  task: AppTask;
  onComplete: (taskId: number) => void;
}

export default function AppTaskCard({ task, onComplete }: AppTaskCardProps) {
  const { webApp } = useTelegram();
  
  const handleOpenApp = () => {
    if (webApp) {
      // Open the Telegram link using the Telegram WebApp API
      webApp.openTelegramLink(task.telegramUrl);
      
      // In a real app, you'd need a way to verify task completion
      // For now we'll just call onComplete
      setTimeout(() => {
        onComplete(task.id);
      }, 2000);
    } else {
      // Fallback for non-Telegram environment
      window.open(task.telegramUrl, "_blank");
    }
  };

  return (
    <TaskCard>
      <div className="flex">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
          {task.iconType === "robot" && (
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-telegram-primary">
              <path d="M12 3c1.67 0 3.094.53 4.271 1.594 1.178 1.063 1.823 2.302 1.938 3.718H18c-.5 0-.927.177-1.281.532-.354.354-.531.78-.531 1.281v.5c0 .334.073.646.218.938.146.292.365.521.657.687v2.5c.292.167.51.396.656.688A2.06 2.06 0 0 1 18 16.375v.5c0 .5-.177.927-.531 1.281-.354.354-.78.532-1.281.532H7.812c-.5 0-.927-.178-1.281-.532A1.747 1.747 0 0 1 6 16.875v-.5c0-.333.073-.646.219-.937.146-.292.364-.521.656-.688v-2.5a1.516 1.516 0 0 1 .656-.687 2.06 2.06 0 0 1 .219-.938v-.5c0-.5-.177-.927-.531-1.281A1.747 1.747 0 0 0 6 8.312h-.209c.115-1.416.76-2.655 1.938-3.718C8.906 3.531 10.333 3 12 3zm-4.5 9.25c-.398 0-.75.125-1.031.375a.676.676 0 0 0-.219.5c0 .209.063.376.188.5s.312.188.562.188c.417 0 .75-.146 1-.438.25-.291.375-.646.375-1.063 0-.02-.417.001-1.25.063a8.284 8.284 0 0 1 .375-.125zm9 0c-.833-.062-1.25-.083-1.25-.063 0 .417.125.772.375 1.063s.583.438 1 .438c.25 0 .437-.63.562-.188a.674.674 0 0 0 .188-.5.676.676 0 0 0-.219-.5c-.281-.25-.635-.375-1.031-.375a8.284 8.284 0 0 1 .375.125zm-4.5 1.5c.5 0 .906.178 1.219.531A1.728 1.728 0 0 1 14 15.5c0 .5-.177.927-.531 1.281-.313.354-.719.532-1.219.532-.5 0-.906-.178-1.219-.532A1.728 1.728 0 0 1 10.5 15.5c0-.5.177-.927.531-1.281.313-.354.719-.532 1.219-.532z" fill="currentColor"/>
            </svg>
          )}
          {task.iconType === "gamepad" && (
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-purple-500">
              <path d="M21.58 16.09l-1.09-7.66A3.996 3.996 0 0 0 16.53 5H7.47a3.996 3.996 0 0 0-3.96 3.43l-1.09 7.66C2.2 18.27 3.76 20 5.97 20c1.04 0 2.05-.4 2.8-1.14L10 17.62V14H2v-2h8v-1H5V9h5V8H7V6h4v2h2V6h4v2h-3v1h5v2h-5v1h8v2h-8v3.62l1.23 1.24c.75.74 1.76 1.14 2.8 1.14 2.21 0 3.77-1.73 3.55-3.91zM7 15v-2H5v2h2zm12 0v-2h-2v2h2z" fill="currentColor"/>
            </svg>
          )}
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          <div className="flex items-center">
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium mr-2">
              <span className="flex items-center">
                <Coins className="h-3 w-3 mr-1" />
                {task.points.toLocaleString()} points
              </span>
            </div>
            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
              <span className="flex items-center">
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 mr-1">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" fill="currentColor"/>
                </svg>
                {task.estimatedTimeMinutes} minutes
              </span>
            </div>
          </div>
        </div>
        <Button 
          size="icon" 
          variant="default"
          className="ml-2 h-10 w-10 flex-shrink-0 rounded-lg"
          onClick={handleOpenApp}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </TaskCard>
  );
}
