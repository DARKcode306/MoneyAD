import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  telegramId: integer("telegram_id").unique(),
  points: integer("points").notNull().default(0),
  watchedAdsToday: integer("watched_ads_today").notNull().default(0),
  lastAdWatch: timestamp("last_ad_watch"),
  lastDailyBonus: timestamp("last_daily_bonus"),
});

// Admin Users Table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  role: text("role").notNull().default("admin"), // admin, super_admin
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// App Tasks Table
export const appTasks = pgTable("app_tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").notNull(),
  estimatedTimeMinutes: integer("estimated_time_minutes").notNull(),
  telegramUrl: text("telegram_url").notNull(),
  iconType: text("icon_type").notNull().default("robot"), // robot, gamepad, etc.
  isActive: boolean("is_active").notNull().default(true),
});

// Link Tasks Table
export const linkTasks = pgTable("link_tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  points: integer("points").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// Quests Table
export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // watch_ads, invite_friends, etc.
  points: integer("points").notNull(),
  totalProgress: integer("total_progress").notNull(),
  colorScheme: text("color_scheme").notNull().default("purple"), // purple, green, etc.
  isActive: boolean("is_active").notNull().default(true),
});

// User Quests Progress Table
export const userQuestProgress = pgTable("user_quest_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  questId: integer("quest_id").notNull(),
  currentProgress: integer("current_progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  completedDate: timestamp("completed_date"),
});

// Referrals Table
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  referredUserId: integer("referred_user_id").notNull().unique(),
  pointsEarned: integer("points_earned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Currencies Table
export const currencies = pgTable("currencies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  symbol: text("symbol").notNull(),
  exchangeRate: integer("exchange_rate").notNull(), // Points per unit of currency
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Withdrawal Methods Table
export const withdrawalMethods = pgTable("withdrawal_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  minAmount: integer("min_amount").notNull(),
  maxAmount: integer("max_amount").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  requiredFields: text("required_fields").notNull(), // JSON string of required field names
  currencyId: integer("currency_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Withdrawals Table
export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  methodId: integer("method_id").notNull(),
  amount: integer("amount").notNull(), // In currency units
  pointsSpent: integer("points_spent").notNull(),
  details: text("details").notNull(), // JSON string of withdrawal details
  status: text("status").notNull().default("pending"), // pending, completed, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  telegramId: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export const insertAppTaskSchema = createInsertSchema(appTasks).pick({
  title: true,
  description: true,
  points: true,
  estimatedTimeMinutes: true,
  telegramUrl: true,
  iconType: true,
  isActive: true,
});

export const insertLinkTaskSchema = createInsertSchema(linkTasks).pick({
  title: true,
  description: true,
  url: true,
  points: true,
  isActive: true,
});

export const insertQuestSchema = createInsertSchema(quests).pick({
  title: true,
  type: true,
  points: true,
  totalProgress: true,
  colorScheme: true,
  isActive: true,
});

export const insertUserQuestProgressSchema = createInsertSchema(userQuestProgress).pick({
  userId: true,
  questId: true,
  currentProgress: true,
  completed: true,
});

export const insertReferralSchema = createInsertSchema(referrals).pick({
  userId: true,
  referredUserId: true,
  pointsEarned: true,
});

export const insertCurrencySchema = createInsertSchema(currencies).pick({
  name: true,
  code: true,
  symbol: true,
  exchangeRate: true,
  isActive: true,
});

export const insertWithdrawalMethodSchema = createInsertSchema(withdrawalMethods).pick({
  name: true,
  description: true,
  iconUrl: true,
  minAmount: true,
  maxAmount: true,
  isActive: true,
  requiredFields: true,
  currencyId: true,
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).pick({
  userId: true,
  methodId: true,
  amount: true,
  pointsSpent: true,
  details: true,
  status: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type AppTask = typeof appTasks.$inferSelect;
export type InsertAppTask = z.infer<typeof insertAppTaskSchema>;

export type LinkTask = typeof linkTasks.$inferSelect;
export type InsertLinkTask = z.infer<typeof insertLinkTaskSchema>;

export type Quest = typeof quests.$inferSelect & {
  currentProgress: number;
  completed: boolean;
};
export type InsertQuest = z.infer<typeof insertQuestSchema>;

export type UserQuestProgress = typeof userQuestProgress.$inferSelect;
export type InsertUserQuestProgress = z.infer<typeof insertUserQuestProgressSchema>;

export type Referral = typeof referrals.$inferSelect & {
  name: string;
  joinedTime: string;
};
export type InsertReferral = z.infer<typeof insertReferralSchema>;

export type Currency = typeof currencies.$inferSelect;
export type InsertCurrency = z.infer<typeof insertCurrencySchema>;

export type WithdrawalMethod = typeof withdrawalMethods.$inferSelect;
export type InsertWithdrawalMethod = z.infer<typeof insertWithdrawalMethodSchema>;

export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
