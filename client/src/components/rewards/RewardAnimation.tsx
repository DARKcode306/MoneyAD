import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelegram } from "@/contexts/TelegramContext";

interface RewardAnimationProps {
  isVisible: boolean;
  points: number;
  onClose: () => void;
}

export default function RewardAnimation({ isVisible, points, onClose }: RewardAnimationProps) {
  const { webApp } = useTelegram();
  
  useEffect(() => {
    if (isVisible && webApp?.HapticFeedback) {
      // Trigger haptic feedback when reward is shown
      webApp.HapticFeedback.notificationOccurred('success');
    }
  }, [isVisible, webApp]);

  // Format points with commas
  const formattedPoints = points.toLocaleString();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 text-center max-w-xs mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20 
            }}
          >
            <motion.div
              className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ 
                rotate: [0, -10, 10, -5, 5, 0],
                scale: [0.9, 1.1, 1]
              }}
              transition={{ duration: 0.5 }}
            >
              <Coins className="h-8 w-8" />
            </motion.div>
            <h3 className="text-xl font-bold mb-1">Congratulations!</h3>
            <p className="text-gray-700 mb-4">
              You earned <span className="font-bold text-yellow-600">{formattedPoints} points</span>
            </p>
            <Button 
              className="w-full"
              onClick={onClose}
            >
              Awesome!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
