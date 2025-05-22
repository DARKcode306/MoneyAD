import { 
  User, 
  InsertUser, 
  AppTask, 
  LinkTask, 
  Quest, 
  Referral,
  UserQuestProgress,
  InsertAppTask,
  InsertLinkTask,
  InsertQuest,
  users,
  appTasks,
  linkTasks,
  quests,
  userQuestProgress,
  referrals
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addPointsToUser(userId: number, points: number): Promise<User>;
  recordWatchedAd(userId: number): Promise<User>;
  
  // Task operations
  getAppTasks(): Promise<AppTask[]>;
  getLinkTasks(): Promise<LinkTask[]>;
  
  // Quest operations
  getQuestsWithUserProgress(userId: number): Promise<Quest[]>;
  
  // Referral operations
  getUserReferrals(userId: number): Promise<Referral[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private appTasks: Map<number, AppTask>;
  private linkTasks: Map<number, LinkTask>;
  private quests: Map<number, Quest>;
  private userQuestProgress: Map<number, UserQuestProgress>;
  private referrals: Map<number, Referral>;
  
  private nextUserId: number;
  private nextAppTaskId: number;
  private nextLinkTaskId: number;
  private nextQuestId: number;
  private nextProgressId: number;
  private nextReferralId: number;
  
  constructor() {
    this.users = new Map();
    this.appTasks = new Map();
    this.linkTasks = new Map();
    this.quests = new Map();
    this.userQuestProgress = new Map();
    this.referrals = new Map();
    
    this.nextUserId = 1;
    this.nextAppTaskId = 1;
    this.nextLinkTaskId = 1;
    this.nextQuestId = 1;
    this.nextProgressId = 1;
    this.nextReferralId = 1;
    
    // Seed data
    this.seedData();
  }
  
  // User Operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByTelegramId(telegramId: number): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.telegramId === telegramId);
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = {
      ...userData,
      id,
      points: 0,
      watchedAdsToday: 0,
      lastAdWatch: null,
      lastDailyBonus: null,
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async addPointsToUser(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = {
      ...user,
      points: user.points + points,
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async recordWatchedAd(userId: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // In a real app, you'd check if the user has already watched 30 ads today
    // and reset the counter at midnight
    
    const updatedUser = {
      ...user,
      watchedAdsToday: user.watchedAdsToday + 1,
      points: user.points + 500, // 500 points per ad
      lastAdWatch: new Date(),
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Task Operations
  async getAppTasks(): Promise<AppTask[]> {
    return Array.from(this.appTasks.values()).filter(task => task.isActive);
  }
  
  async getLinkTasks(): Promise<LinkTask[]> {
    return Array.from(this.linkTasks.values()).filter(task => task.isActive);
  }
  
  // Quest Operations
  async getQuestsWithUserProgress(userId: number): Promise<Quest[]> {
    const quests = Array.from(this.quests.values()).filter(quest => quest.isActive);
    
    // For each quest, find the user's progress
    const userQuestProgressList = Array.from(this.userQuestProgress.values())
      .filter(progress => progress.userId === userId);
    
    // Map quests with user progress
    return quests.map(quest => {
      const progress = userQuestProgressList.find(p => p.questId === quest.id);
      
      return {
        ...quest,
        currentProgress: progress ? progress.currentProgress : 0,
        completed: progress ? progress.completed : false,
      };
    });
  }
  
  // Referral Operations
  async getUserReferrals(userId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values())
      .filter(referral => referral.userId === userId);
  }
  
  // Seed data for testing
  private seedData() {
    // App Tasks
    const appTask1: AppTask = {
      id: this.nextAppTaskId++,
      title: "Join CryptoBot Channel",
      description: "Subscribe to the channel and stay for 3 days",
      points: 1500,
      estimatedTimeMinutes: 5,
      telegramUrl: "https://t.me/crypto_bot",
      iconType: "robot",
      isActive: true,
    };
    
    const appTask2: AppTask = {
      id: this.nextAppTaskId++,
      title: "Play MiniGames Bot",
      description: "Play at least 5 games to earn points",
      points: 2000,
      estimatedTimeMinutes: 15,
      telegramUrl: "https://t.me/gamee",
      iconType: "gamepad",
      isActive: true,
    };
    
    this.appTasks.set(appTask1.id, appTask1);
    this.appTasks.set(appTask2.id, appTask2);
    
    // Link Tasks
    const linkTask1: LinkTask = {
      id: this.nextLinkTaskId++,
      title: "Visit BTC News Website",
      description: "Visit the website through our short link and stay for at least 30 seconds",
      url: "https://bitcoin.org",
      points: 750,
      isActive: true,
    };
    
    this.linkTasks.set(linkTask1.id, linkTask1);
    
    // Quests
    const quest1: Quest = {
      id: this.nextQuestId++,
      title: "Watch 5 ads",
      type: "watch_ads",
      points: 1000,
      totalProgress: 5,
      colorScheme: "purple",
      isActive: true,
      currentProgress: 3, // This will be overridden
      completed: false, // This will be overridden
    };
    
    const quest2: Quest = {
      id: this.nextQuestId++,
      title: "Invite 2 friends",
      type: "invite_friends",
      points: 2000,
      totalProgress: 2,
      colorScheme: "green",
      isActive: true,
      currentProgress: 0, // This will be overridden
      completed: false, // This will be overridden
    };
    
    this.quests.set(quest1.id, quest1);
    this.quests.set(quest2.id, quest2);
    
    // Demo user for testing
    const user: User = {
      id: this.nextUserId++,
      username: "demo_user",
      password: "password", // In a real app, you'd hash this
      telegramId: 123456789,
      points: 12500,
      watchedAdsToday: 7,
      lastAdWatch: new Date(),
      lastDailyBonus: null,
    };
    
    this.users.set(user.id, user);
    
    // User quest progress
    const progress1: UserQuestProgress = {
      id: this.nextProgressId++,
      userId: user.id,
      questId: quest1.id,
      currentProgress: 3,
      completed: false,
      completedDate: null,
    };
    
    const progress2: UserQuestProgress = {
      id: this.nextProgressId++,
      userId: user.id,
      questId: quest2.id,
      currentProgress: 0,
      completed: false,
      completedDate: null,
    };
    
    this.userQuestProgress.set(progress1.id, progress1);
    this.userQuestProgress.set(progress2.id, progress2);
    
    // Referrals
    const referral1: Referral = {
      id: this.nextReferralId++,
      userId: user.id,
      referredUserId: 2,
      pointsEarned: 1000,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      name: "Alex Smith",
      joinedTime: "Joined 2 days ago",
    };
    
    const referral2: Referral = {
      id: this.nextReferralId++,
      userId: user.id,
      referredUserId: 3,
      pointsEarned: 1000,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      name: "John Doe",
      joinedTime: "Joined 5 days ago",
    };
    
    const referral3: Referral = {
      id: this.nextReferralId++,
      userId: user.id,
      referredUserId: 4,
      pointsEarned: 1000,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      name: "Maria Lopez",
      joinedTime: "Joined 1 week ago",
    };
    
    this.referrals.set(referral1.id, referral1);
    this.referrals.set(referral2.id, referral2);
    this.referrals.set(referral3.id, referral3);
  }
}

// Creating a database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByTelegramId(telegramId: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return user;
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...userData,
      points: 0,
      watchedAdsToday: 0,
    }).returning();
    return user;
  }
  
  async addPointsToUser(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({ points: user.points + points })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }
  
  async recordWatchedAd(userId: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        points: user.points + 500, 
        watchedAdsToday: user.watchedAdsToday + 1,
        lastAdWatch: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }
  
  async getAppTasks(): Promise<AppTask[]> {
    return db.select().from(appTasks).where(eq(appTasks.isActive, true));
  }
  
  async getLinkTasks(): Promise<LinkTask[]> {
    return db.select().from(linkTasks).where(eq(linkTasks.isActive, true));
  }
  
  async getQuestsWithUserProgress(userId: number): Promise<Quest[]> {
    // Get all active quests
    const allQuests = await db.select().from(quests).where(eq(quests.isActive, true));
    
    // Get user progress for these quests
    const progressRecords = await db
      .select()
      .from(userQuestProgress)
      .where(eq(userQuestProgress.userId, userId));
    
    // Combine the quest data with user progress
    return allQuests.map(quest => {
      const progress = progressRecords.find(p => p.questId === quest.id);
      
      return {
        ...quest,
        currentProgress: progress ? progress.currentProgress : 0,
        completed: progress ? progress.completed : false,
      };
    });
  }
  
  async getUserReferrals(userId: number): Promise<Referral[]> {
    // First get all referrals for this user
    const referralRecords = await db
      .select()
      .from(referrals)
      .where(eq(referrals.userId, userId));
    
    // For each referral, get the referred user's name
    const result: Referral[] = [];
    
    for (const record of referralRecords) {
      const [referredUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, record.referredUserId));
      
      if (referredUser) {
        const joinedDate = new Date(record.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let joinedTime = "Joined today";
        if (diffDays === 1) {
          joinedTime = "Joined yesterday";
        } else if (diffDays > 1 && diffDays < 7) {
          joinedTime = `Joined ${diffDays} days ago`;
        } else if (diffDays >= 7 && diffDays < 14) {
          joinedTime = "Joined 1 week ago";
        } else if (diffDays >= 14) {
          joinedTime = `Joined ${Math.floor(diffDays / 7)} weeks ago`;
        }
        
        result.push({
          ...record,
          name: referredUser.username, // Using username as name
          joinedTime
        });
      }
    }
    
    return result;
  }
  
  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }
  
  async createAppTask(taskData: InsertAppTask): Promise<AppTask> {
    const [task] = await db.insert(appTasks).values(taskData).returning();
    return task;
  }
  
  async updateAppTask(id: number, taskData: Partial<InsertAppTask>): Promise<AppTask> {
    const [task] = await db
      .update(appTasks)
      .set(taskData)
      .where(eq(appTasks.id, id))
      .returning();
    return task;
  }
  
  async deleteAppTask(id: number): Promise<void> {
    await db.delete(appTasks).where(eq(appTasks.id, id));
  }
  
  async createLinkTask(taskData: InsertLinkTask): Promise<LinkTask> {
    const [task] = await db.insert(linkTasks).values(taskData).returning();
    return task;
  }
  
  async updateLinkTask(id: number, taskData: Partial<InsertLinkTask>): Promise<LinkTask> {
    const [task] = await db
      .update(linkTasks)
      .set(taskData)
      .where(eq(linkTasks.id, id))
      .returning();
    return task;
  }
  
  async deleteLinkTask(id: number): Promise<void> {
    await db.delete(linkTasks).where(eq(linkTasks.id, id));
  }
  
  async createQuest(questData: InsertQuest): Promise<Quest> {
    const [quest] = await db.insert(quests).values(questData).returning();
    return {
      ...quest,
      currentProgress: 0,
      completed: false
    };
  }
  
  async updateQuest(id: number, questData: Partial<InsertQuest>): Promise<Quest> {
    const [quest] = await db
      .update(quests)
      .set(questData)
      .where(eq(quests.id, id))
      .returning();
    
    return {
      ...quest,
      currentProgress: 0, // These will be overridden if needed
      completed: false
    };
  }
  
  async deleteQuest(id: number): Promise<void> {
    await db.delete(quests).where(eq(quests.id, id));
  }
}

// Use DatabaseStorage for production with PostgreSQL
export const storage = new DatabaseStorage();
