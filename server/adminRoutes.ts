import express, { Router } from "express";
import { db } from "./db";
import { storage } from "./storage";
import { adminAuth } from "./admin";
import { 
  appTasks, 
  linkTasks, 
  currencies, 
  withdrawalMethods,
  insertAppTaskSchema, 
  insertLinkTaskSchema,
  insertCurrencySchema,
  insertWithdrawalMethodSchema
} from "@shared/schema";
import { eq } from "drizzle-orm";

// Admin routes for managing tasks
export function registerAdminApiRoutes(app: express.Express) {
  const router = Router();
  
  // Admin must be authenticated to access these routes
  router.use(adminAuth);
  
  // Get all users
  router.get("/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  // App tasks routes
  
  // Create app task
  router.post("/app-tasks", async (req, res) => {
    try {
      // Validate request body using the schema
      const validationResult = insertAppTaskSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      // Create the task
      const task = await storage.createAppTask(validationResult.data);
      
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating app task:", error);
      res.status(500).json({ message: "Failed to create app task" });
    }
  });
  
  // Update app task
  router.patch("/app-tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      // Check if task exists
      const [task] = await db.select().from(appTasks).where(eq(appTasks.id, id));
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Update the task
      const updatedTask = await storage.updateAppTask(id, req.body);
      
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating app task:", error);
      res.status(500).json({ message: "Failed to update app task" });
    }
  });
  
  // Delete app task
  router.delete("/app-tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      // Check if task exists
      const [task] = await db.select().from(appTasks).where(eq(appTasks.id, id));
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Delete the task
      await storage.deleteAppTask(id);
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting app task:", error);
      res.status(500).json({ message: "Failed to delete app task" });
    }
  });
  
  // Link tasks routes
  
  // Create link task
  router.post("/link-tasks", async (req, res) => {
    try {
      // Validate request body using the schema
      const validationResult = insertLinkTaskSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      // Create the task
      const task = await storage.createLinkTask(validationResult.data);
      
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating link task:", error);
      res.status(500).json({ message: "Failed to create link task" });
    }
  });
  
  // Update link task
  router.patch("/link-tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      // Check if task exists
      const [task] = await db.select().from(linkTasks).where(eq(linkTasks.id, id));
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Update the task
      const updatedTask = await storage.updateLinkTask(id, req.body);
      
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating link task:", error);
      res.status(500).json({ message: "Failed to update link task" });
    }
  });
  
  // Delete link task
  router.delete("/link-tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      // Check if task exists
      const [task] = await db.select().from(linkTasks).where(eq(linkTasks.id, id));
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Delete the task
      await storage.deleteLinkTask(id);
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting link task:", error);
      res.status(500).json({ message: "Failed to delete link task" });
    }
  });
  
  // Currency routes
  
  // Get all currencies
  router.get("/currencies", async (req, res) => {
    try {
      const allCurrencies = await db.select().from(currencies);
      res.json(allCurrencies);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      res.status(500).json({ message: "Failed to fetch currencies" });
    }
  });
  
  // Create currency
  router.post("/currencies", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertCurrencySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      // Create currency
      const [currency] = await db
        .insert(currencies)
        .values(validationResult.data)
        .returning();
      
      res.status(201).json(currency);
    } catch (error) {
      console.error("Error creating currency:", error);
      res.status(500).json({ message: "Failed to create currency" });
    }
  });
  
  // Update currency
  router.patch("/currencies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid currency ID" });
      }
      
      // Check if currency exists
      const [existingCurrency] = await db
        .select()
        .from(currencies)
        .where(eq(currencies.id, id));
      
      if (!existingCurrency) {
        return res.status(404).json({ message: "Currency not found" });
      }
      
      // Update currency
      const [currency] = await db
        .update(currencies)
        .set(req.body)
        .where(eq(currencies.id, id))
        .returning();
      
      res.json(currency);
    } catch (error) {
      console.error("Error updating currency:", error);
      res.status(500).json({ message: "Failed to update currency" });
    }
  });
  
  // Delete currency
  router.delete("/currencies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid currency ID" });
      }
      
      // Check if currency is used by any withdrawal method
      const withdrawalMethodsWithCurrency = await db
        .select()
        .from(withdrawalMethods)
        .where(eq(withdrawalMethods.currencyId, id));
      
      if (withdrawalMethodsWithCurrency.length > 0) {
        return res.status(400).json({ 
          message: "Cannot delete currency because it is used by withdrawal methods",
          withdrawalMethods: withdrawalMethodsWithCurrency
        });
      }
      
      // Delete currency
      await db
        .delete(currencies)
        .where(eq(currencies.id, id));
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting currency:", error);
      res.status(500).json({ message: "Failed to delete currency" });
    }
  });
  
  // Withdrawal Method routes
  
  // Get all withdrawal methods
  router.get("/withdrawal-methods", async (req, res) => {
    try {
      const allMethods = await db.select().from(withdrawalMethods);
      res.json(allMethods);
    } catch (error) {
      console.error("Error fetching withdrawal methods:", error);
      res.status(500).json({ message: "Failed to fetch withdrawal methods" });
    }
  });
  
  // Create withdrawal method
  router.post("/withdrawal-methods", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertWithdrawalMethodSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      // Check if currency exists
      const currencyId = validationResult.data.currencyId;
      const [existingCurrency] = await db
        .select()
        .from(currencies)
        .where(eq(currencies.id, currencyId));
      
      if (!existingCurrency) {
        return res.status(400).json({ message: "Currency not found" });
      }
      
      // Create withdrawal method
      const [method] = await db
        .insert(withdrawalMethods)
        .values(validationResult.data)
        .returning();
      
      res.status(201).json(method);
    } catch (error) {
      console.error("Error creating withdrawal method:", error);
      res.status(500).json({ message: "Failed to create withdrawal method" });
    }
  });
  
  // Update withdrawal method
  router.patch("/withdrawal-methods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid withdrawal method ID" });
      }
      
      // Check if method exists
      const [existingMethod] = await db
        .select()
        .from(withdrawalMethods)
        .where(eq(withdrawalMethods.id, id));
      
      if (!existingMethod) {
        return res.status(404).json({ message: "Withdrawal method not found" });
      }
      
      // If changing currency, check if new currency exists
      if (req.body.currencyId) {
        const [existingCurrency] = await db
          .select()
          .from(currencies)
          .where(eq(currencies.id, req.body.currencyId));
        
        if (!existingCurrency) {
          return res.status(400).json({ message: "Currency not found" });
        }
      }
      
      // Update method
      const [method] = await db
        .update(withdrawalMethods)
        .set(req.body)
        .where(eq(withdrawalMethods.id, id))
        .returning();
      
      res.json(method);
    } catch (error) {
      console.error("Error updating withdrawal method:", error);
      res.status(500).json({ message: "Failed to update withdrawal method" });
    }
  });
  
  // Delete withdrawal method
  router.delete("/withdrawal-methods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid withdrawal method ID" });
      }
      
      // Delete method
      await db
        .delete(withdrawalMethods)
        .where(eq(withdrawalMethods.id, id));
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting withdrawal method:", error);
      res.status(500).json({ message: "Failed to delete withdrawal method" });
    }
  });
  
  // Register admin API routes
  app.use("/api/admin", router);
}