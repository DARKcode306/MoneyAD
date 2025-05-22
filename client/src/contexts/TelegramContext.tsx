import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getTelegramWebApp, TelegramWebApp, TelegramUser } from "@/lib/telegram";

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
  language: string;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isReady: false,
  language: "en",
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const initTelegram = () => {
      const telegramApp = getTelegramWebApp();
      if (telegramApp) {
        setWebApp(telegramApp);
        setUser(telegramApp.initDataUnsafe.user || null);
        setLanguage(telegramApp.initDataUnsafe.user?.language_code || "en");
        
        // Tell Telegram WebApp we're ready
        telegramApp.ready();
        setIsReady(true);
      } else {
        // If not in a Telegram WebApp context, we'll check again soon
        setTimeout(initTelegram, 500);
      }
    };

    initTelegram();
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        webApp,
        user,
        isReady,
        language,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};
