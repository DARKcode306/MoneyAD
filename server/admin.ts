import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "./db";
import { adminUsers, insertAdminUserSchema, InsertAdminUser } from "@shared/schema";
import { eq } from "drizzle-orm";

// Admin authentication middleware
export const adminAuth = async (req: Request, res: Response, next: Function) => {
  try {
    // Check if user is authenticated via session
    if (!req.session || !(req.session as any).adminUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if the admin user exists and is active
    const [adminUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, (req.session as any).adminUser.id));
    
    if (!adminUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Attach admin user to request
    req.adminUser = adminUser;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin routes
export function registerAdminRoutes(app: express.Express) {
  const router = Router();
  
  // Admin login
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find admin user by username
      const [adminUser] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.username, username));
      
      if (!adminUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Compare password
      const isValidPassword = await bcrypt.compare(password, adminUser.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Store admin user in session
      req.session.adminUser = {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role
      };
      
      res.json({
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin logout
  router.post("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // Get current admin user
  router.get("/me", adminAuth, (req, res) => {
    res.json({
      id: req.adminUser.id,
      username: req.adminUser.username,
      email: req.adminUser.email,
      role: req.adminUser.role
    });
  });
  
  // Create admin user (requires admin auth)
  router.post("/users", adminAuth, async (req, res) => {
    try {
      // Only super_admin can create new admin users
      if (req.adminUser.role !== "super_admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Validate request body
      const validationResult = insertAdminUserSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      const userData = validationResult.data as InsertAdminUser;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create admin user
      const [adminUser] = await db
        .insert(adminUsers)
        .values({
          ...userData,
          password: hashedPassword
        })
        .returning();
      
      res.status(201).json({
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      });
    } catch (error) {
      console.error("Create admin user error:", error);
      
      // Check for unique constraint errors
      if (error.code === "23505") {
        return res.status(409).json({ message: "Username or email already exists" });
      }
      
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Register admin routes
  app.use("/api/admin", router);
  
  return router;
}

// Create a default admin user if none exists
export async function createDefaultAdminUser() {
  try {
    // Check if any admin users exist
    const adminUserCount = await db.select().from(adminUsers).execute();
    
    if (adminUserCount.length === 0) {
      // Create default admin user
      const defaultAdmin = {
        username: "admin",
        password: await bcrypt.hash("admin123", 10),
        email: "admin@example.com",
        role: "super_admin" as const
      };
      
      await db.insert(adminUsers).values(defaultAdmin);
      
      console.log("Created default admin user");
    }
  } catch (error) {
    console.error("Failed to create default admin user:", error);
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      adminUser?: any;
    }
    
    interface Session {
      adminUser?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}