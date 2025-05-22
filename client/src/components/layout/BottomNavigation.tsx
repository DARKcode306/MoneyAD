
import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Coins, 
  CheckSquare, 
  Users, 
  Wallet 
} from "lucide-react";

const navItems = [
  { id: "earn", label: "ربح", icon: Coins, path: "/" },
  { id: "quests", label: "مهام", icon: CheckSquare, path: "/quests" },
  { id: "friends", label: "أصدقاء", icon: Users, path: "/friends" },
  { id: "wallet", label: "محفظة", icon: Wallet, path: "/wallet" },
];

export default function BottomNavigation() {
  const [, setLocation] = useLocation();
  const [currentTab, setCurrentTab] = useState("earn");
  
  const [isRootRoute] = useRoute("/");
  const [isQuestsRoute] = useRoute("/quests");
  const [isFriendsRoute] = useRoute("/friends");
  const [isWalletRoute] = useRoute("/wallet");

  useEffect(() => {
    if (isRootRoute) setCurrentTab("earn");
    else if (isQuestsRoute) setCurrentTab("quests");
    else if (isFriendsRoute) setCurrentTab("friends");
    else if (isWalletRoute) setCurrentTab("wallet");
  }, [isRootRoute, isQuestsRoute, isFriendsRoute, isWalletRoute]);

  const getIndicatorPosition = () => {
    const index = navItems.findIndex(item => item.id === currentTab);
    return `${index * 25}%`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:max-w-md md:mx-auto">
      <div className="flex justify-around relative">
        <motion.div 
          className="absolute top-0 h-1 w-1/4 bg-blue-600" 
          animate={{ left: getIndicatorPosition() }}
          transition={{ duration: 0.3 }}
        />
        
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.id} 
              href={item.path}
              className="flex-1"
              onClick={() => setCurrentTab(item.id)}
            >
              <div className={`flex flex-col items-center py-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`icon-${item.id}-${isActive ? 'active' : 'inactive'}`}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="mb-1"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                </AnimatePresence>
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
