import { useLocation } from "wouter";
import { ArrowLeft, Coins } from "lucide-react";
import { useTelegram } from "@/contexts/TelegramContext";
import { useUser } from "@/contexts/UserContext";
import { motion } from "framer-motion";

export default function TopBar() {
  const { webApp } = useTelegram();
  const { points } = useUser();
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    if (webApp) {
      // If we're in a Telegram WebApp, close it
      webApp.close();
    } else {
      // Otherwise, just go back in browser history
      window.history.back();
    }
  };

  // Format points with commas
  const formattedPoints = points.toLocaleString();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 flex items-center justify-between sticky top-0 z-10 shadow-lg">
      <div className="flex items-center">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
            Money
          </span>
          <span className="ml-1 text-white">DRC</span>
        </h1>
      </div>
      <div className="flex items-center">
        <motion.div 
          className="mr-4 flex items-center bg-white/10 px-4 py-1.5 rounded-full" 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Coins className="h-4 w-4 mr-2 text-yellow-300" />
          <span className="font-medium">{formattedPoints}</span>
        </motion.div>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
          <span className="text-sm font-bold">
            {useTelegram().user?.first_name?.[0] || "U"}
          </span>
        </div>
      </div>
    </div>
  );
}
