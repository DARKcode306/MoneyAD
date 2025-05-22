import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import WatchAdCard from "@/components/tasks/WatchAdCard";
import AppTaskCard from "@/components/tasks/AppTaskCard";
import LinkShortenerCard from "@/components/tasks/LinkShortenerCard";
import RewardAnimation from "@/components/rewards/RewardAnimation";
import { AppTask, LinkTask } from "@shared/schema";

export default function EarnPage() {
  const { addPoints } = useUser();
  const [showDailyBonusReward, setShowDailyBonusReward] = useState(false);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);
  const DAILY_BONUS_AMOUNT = 1000;

  // Fetch app tasks
  const { data: appTasks = [] } = useQuery<AppTask[]>({
    queryKey: ['/api/tasks/app'],
  });

  // Fetch link tasks
  const { data: linkTasks = [] } = useQuery<LinkTask[]>({
    queryKey: ['/api/tasks/links'],
  });

  const handleClaimDailyBonus = async () => {
    await addPoints(DAILY_BONUS_AMOUNT);
    setShowDailyBonusReward(true);
    setDailyBonusClaimed(true);
  };

  const handleAppTaskComplete = (taskId: number) => {
    // In a real app, this would verify task completion with the server
    console.log("Task completed:", taskId);
  };

  return (
    <div className="fade-in">
      {/* Daily Rewards Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Daily Rewards</h2>
        <AnimatePresence mode="wait">
          {!dailyBonusClaimed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center mb-4"
            >
              <div className="w-10 h-10 rounded-full bg-telegram-primary flex-shrink-0 flex items-center justify-center text-white">
                <Gift className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-grow">
                <h3 className="font-medium text-gray-800">Daily Bonus</h3>
                <p className="text-sm text-gray-600">Get your daily {DAILY_BONUS_AMOUNT.toLocaleString()} points!</p>
              </div>
              <Button onClick={handleClaimDailyBonus}>
                Claim
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Watch Ads Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Watch Ads</h2>
        <WatchAdCard />
      </div>

      {/* App Tasks Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">App Tasks</h2>
        {appTasks.map((task) => (
          <AppTaskCard 
            key={task.id} 
            task={task} 
            onComplete={handleAppTaskComplete}
          />
        ))}
      </div>

      {/* Link Shorteners Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Link Shorteners</h2>
        {linkTasks.map((task) => (
          <LinkShortenerCard key={task.id} task={task} />
        ))}
      </div>

      {/* Daily Bonus Reward Animation */}
      <RewardAnimation
        isVisible={showDailyBonusReward}
        points={DAILY_BONUS_AMOUNT}
        onClose={() => setShowDailyBonusReward(false)}
      />
    </div>
  );
}
