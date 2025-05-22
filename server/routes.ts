import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { currencies, withdrawalMethods } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Get current user info
  router.get("/user", async (req, res) => {
    try {
      // In a real app, you'd get the telegramId from a secure auth process
      // For demo purposes, we'll use a fixed ID
      const telegramId = 123456789;
      
      // Get user by telegramId
      let user = await storage.getUserByTelegramId(telegramId);
      
      // If user doesn't exist, create one
      if (!user) {
        user = await storage.createUser({
          username: "demo_user",
          password: "password", // In a real app, you'd hash this
          telegramId: telegramId,
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Add points to user
  router.post("/user/points", async (req, res) => {
    try {
      const { amount } = req.body;
      
      // In a real app, you'd get the telegramId from a secure auth process
      const telegramId = 123456789;
      
      // Get user by telegramId
      const user = await storage.getUserByTelegramId(telegramId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Add points to user
      const updatedUser = await storage.addPointsToUser(user.id, amount);
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error adding points:", error);
      res.status(500).json({ message: "Failed to add points" });
    }
  });
  
  // Record a watched ad
  router.post("/user/watched-ad", async (req, res) => {
    try {
      // In a real app, you'd get the telegramId from a secure auth process
      const telegramId = 123456789;
      
      // Get user by telegramId
      const user = await storage.getUserByTelegramId(telegramId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Record watched ad and add points
      const updatedUser = await storage.recordWatchedAd(user.id);
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error recording watched ad:", error);
      res.status(500).json({ message: "Failed to record watched ad" });
    }
  });
  
  // Get app tasks
  router.get("/tasks/app", async (req, res) => {
    try {
      const tasks = await storage.getAppTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching app tasks:", error);
      res.status(500).json({ message: "Failed to fetch app tasks" });
    }
  });

  // Get active currencies
  router.get("/currencies", async (req, res) => {
    try {
      const activeCurrencies = await db.select().from(currencies).where(eq(currencies.isActive, true));
      res.json(activeCurrencies);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      res.status(500).json({ message: "Failed to fetch currencies" });
    }
  });

  // Get active withdrawal methods
  router.get("/withdrawal-methods", async (req, res) => {
    try {
      const methods = await db.select().from(withdrawalMethods).where(eq(withdrawalMethods.isActive, true));
      res.json(methods);
    } catch (error) {
      console.error("Error fetching withdrawal methods:", error);
      res.status(500).json({ message: "Failed to fetch withdrawal methods" });
    }
  });
  
  // Get link tasks
  router.get("/tasks/links", async (req, res) => {
    try {
      const tasks = await storage.getLinkTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching link tasks:", error);
      res.status(500).json({ message: "Failed to fetch link tasks" });
    }
  });
  
  // Get quests
  router.get("/quests", async (req, res) => {
    try {
      // In a real app, you'd get the telegramId from a secure auth process
      const telegramId = 123456789;
      
      // Get user by telegramId
      const user = await storage.getUserByTelegramId(telegramId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get quests with user progress
      const quests = await storage.getQuestsWithUserProgress(user.id);
      
      res.json(quests);
    } catch (error) {
      console.error("Error fetching quests:", error);
      res.status(500).json({ message: "Failed to fetch quests" });
    }
  });
  
  // Get referrals
  router.get("/referrals", async (req, res) => {
    try {
      // In a real app, you'd get the telegramId from a secure auth process
      const telegramId = 123456789;
      
      // Get user by telegramId
      const user = await storage.getUserByTelegramId(telegramId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get referrals for user
      const referrals = await storage.getUserReferrals(user.id);
      
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Register all routes with /api prefix
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
