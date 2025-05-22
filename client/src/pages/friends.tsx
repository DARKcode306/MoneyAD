import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useTelegram } from "@/contexts/TelegramContext";
import TaskCard from "@/components/tasks/TaskCard";
import { Referral } from "@shared/schema";

export default function FriendsPage() {
  const { webApp, user } = useTelegram();
  const [copied, setCopied] = useState(false);
  
  // Fetch referrals from API
  const { data: referrals = [] } = useQuery<Referral[]>({
    queryKey: ['/api/referrals'],
  });

  // Generate referral link
  const referralId = user?.id || "demo";
  const referralLink = `https://t.me/Eg_Token_bot?start=ref${referralId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTelegram = () => {
    if (webApp) {
      // In a real app, you'd use a proper sharing mechanism
      webApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`);
    }
  };

  // Calculate stats
  const totalReferrals = referrals.length;
  const totalEarned = referrals.reduce((sum, ref) => sum + ref.pointsEarned, 0);

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Invite Friends</h2>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          1,000 points per friend
        </span>
      </div>
      
      <TaskCard>
        {/* Friends illustration */}
        <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-4 flex items-center justify-center">
          <svg width="150" height="100" viewBox="0 0 150 100" className="text-blue-400">
            <g fill="currentColor" fillRule="nonzero">
              <path d="M45 40a15 15 0 1 0 0-30 15 15 0 0 0 0 30zm0-25a10 10 0 1 1 0 20 10 10 0 0 1 0-20zM70 55a20 20 0 0 0-40 0v30h40V55zm-35 0a15 15 0 0 1 30 0v25H35V55zM105 40a15 15 0 1 0 0-30 15 15 0 0 0 0 30zm0-25a10 10 0 1 1 0 20 10 10 0 0 1 0-20zM120 55a20 20 0 0 0-40 0v30h40V55zm-35 0a15 15 0 0 1 30 0v25H85V55z" />
              <path d="M75 50a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-15a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM75 60c-5.523 0-10 4.477-10 10v20h20V70c0-5.523-4.477-10-10-10zm-5 10a5 5 0 0 1 10 0v15H70V70z" />
            </g>
          </svg>
        </div>
        
        <p className="text-gray-700 mb-4">
          Invite your friends to RewardHub and both of you will get 1,000 points when they complete their first task!
        </p>
        
        <div className="relative mb-4">
          <Input
            value={referralLink}
            className="pr-16"
            readOnly
          />
          <Button
            size="sm"
            variant="primary"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={copyToClipboard}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1" onClick={shareOnTelegram}>
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 mr-2">
              <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.22-.16-.47-.29z" fill="currentColor"/>
            </svg>
            Share in Telegram
          </Button>
          <Button variant="outline" size="icon">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </TaskCard>
      
      <h2 className="text-lg font-semibold mb-3 mt-6">Your Referrals</h2>
      
      {/* Referral stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Referrals</p>
          <p className="text-2xl font-bold text-telegram-primary">{totalReferrals}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Earned</p>
          <p className="text-2xl font-bold text-green-600">{totalEarned.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Referral list */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {referrals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 mx-auto mb-3 text-gray-300">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p>You haven't invited any friends yet</p>
            <p className="text-sm mt-1">Share your link to start earning points!</p>
          </div>
        ) : (
          referrals.map((referral) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-b border-gray-100 flex items-center"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <span className="font-medium text-gray-600">
                  {referral.name
                    .split(' ')
                    .map(name => name[0])
                    .slice(0, 2)
                    .join('')}
                </span>
              </div>
              <div className="ml-3 flex-grow">
                <p className="font-medium">{referral.name}</p>
                <p className="text-xs text-gray-500">{referral.joinedTime}</p>
              </div>
              <div className="text-green-600 font-medium">
                +{referral.pointsEarned.toLocaleString()}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
