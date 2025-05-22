import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="telegram-app bg-white md:max-w-md md:mx-auto md:shadow-lg min-h-screen">
      {/* Top Bar */}
      <TopBar />
      
      {/* Main Content */}
      <div className="p-4 pb-20 overflow-y-auto">{children}</div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
