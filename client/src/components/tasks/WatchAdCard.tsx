import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Coins, Loader2 } from "lucide-react";
import { ProgressWithText } from "@/components/ui/progress-with-text";
import TaskCard from "./TaskCard";
import RewardAnimation from "@/components/rewards/RewardAnimation";
import { useUser } from "@/contexts/UserContext";

export default function WatchAdCard() {
  const { watchedAdsToday, incrementWatchedAds, canWatchAd } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const MAX_ADS_PER_DAY = 30;
  const POINTS_PER_AD = 500;

  const handleWatchAd = async () => {
    if (!canWatchAd || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate ad watching with a timeout
    setTimeout(async () => {
      try {
        await incrementWatchedAds();
        setShowReward(true);
      } catch (error) {
        console.error("Error watching ad:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const closeReward = () => {
    setShowReward(false);
  };

  return (
    <>
      <TaskCard>
        {/* Video thumbnail image */}
        <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20 text-gray-400"
            >
              <rect
                x="10"
                y="20"
                width="80"
                height="60"
                rx="5"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M65 50L42.5 63.4593L42.5 36.5407L65 50Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        
        <ProgressWithText 
          current={watchedAdsToday} 
          total={MAX_ADS_PER_DAY} 
          className="mb-3" 
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 text-telegram-primary p-2 rounded-lg mr-2">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reward</p>
              <p className="font-semibold">{POINTS_PER_AD} points</p>
            </div>
          </div>
          
          <Button
            onClick={handleWatchAd}
            disabled={!canWatchAd || isLoading}
            className="px-5 py-2.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Watch Ad
              </>
            )}
          </Button>
        </div>
      </TaskCard>
      
      <RewardAnimation 
        isVisible={showReward} 
        points={POINTS_PER_AD}
        onClose={closeReward}
      />
    </>
  );
}
