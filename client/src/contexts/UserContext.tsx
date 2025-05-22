import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTelegram } from "./TelegramContext";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  points: number;
  addPoints: (amount: number) => Promise<void>;
  watchedAdsToday: number;
  incrementWatchedAds: () => Promise<void>;
  canWatchAd: boolean;
  refetchUser: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  error: null,
  points: 0,
  addPoints: async () => {},
  watchedAdsToday: 0,
  incrementWatchedAds: async () => {},
  canWatchAd: false,
  refetchUser: () => {},
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { user: telegramUser, isReady } = useTelegram();
  const [points, setPoints] = useState(0);
  const [watchedAdsToday, setWatchedAdsToday] = useState(0);
  const MAX_ADS_PER_DAY = 30;

  // Fetch user data from the API
  const { data: userData, isLoading, error, refetch } = useQuery<User>({
    queryKey: ['/api/user'],
    enabled: isReady && !!telegramUser,
  });

  // Update points and watchedAds states when user data is available
  useEffect(() => {
    if (userData) {
      setPoints(userData.points);
      setWatchedAdsToday(userData.watchedAdsToday);
    }
  }, [userData]);

  // Add points mutation
  const addPointsMutation = useMutation({
    mutationFn: async (amount: number) => {
      await apiRequest("POST", "/api/user/points", { amount });
      return amount;
    },
    onSuccess: (amount) => {
      setPoints(prev => prev + amount);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  // Increment watched ads mutation
  const incrementWatchedAdsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/user/watched-ad", {});
      return true;
    },
    onSuccess: () => {
      setWatchedAdsToday(prev => prev + 1);
      // We also add points when watching an ad
      setPoints(prev => prev + 500);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  // Add points function
  const addPoints = async (amount: number) => {
    await addPointsMutation.mutateAsync(amount);
  };

  // Increment watched ads function
  const incrementWatchedAds = async () => {
    await incrementWatchedAdsMutation.mutateAsync();
  };

  // Check if user can watch more ads today
  const canWatchAd = watchedAdsToday < MAX_ADS_PER_DAY;

  return (
    <UserContext.Provider
      value={{
        user: userData || null,
        isLoading,
        error: error as Error,
        points,
        addPoints,
        watchedAdsToday,
        incrementWatchedAds,
        canWatchAd,
        refetchUser: refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
