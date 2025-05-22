import { pgTable, text, serial, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hotel brands table to store all self-operated OYO brands
export const hotelBrands = pgTable("hotel_brands", {
  id: serial("id").primaryKey(),
  brandId: text("brand_id").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  targetAudience: text("target_audience").notNull(),
  amenities: text("amenities").notNull(),
  imageUrl: text("image_url").notNull(),
  iconClass: text("icon_class").notNull(),
  revSharePercentage: integer("rev_share_percentage").notNull(),
  defaultRate: integer("default_rate").notNull(),
  locations: text("locations").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonials from hotel partners
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  hotel: text("hotel").notNull(),
  location: text("location").notNull(),
  brand: text("brand").notNull(),
  quote: text("quote").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating").notNull(),
  featured: integer("featured").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  hotelName: text("hotel_name").notNull(),
  location: text("location").notNull(),
  rooms: integer("rooms").notNull(),
  brandPreference: text("brand_preference").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Revenue calculator results
export const calculatorResults = pgTable("calculator_results", {
  id: serial("id").primaryKey(),
  brandId: text("brand_id").notNull(),
  roomRate: integer("room_rate").notNull(),
  stayDuration: integer("stay_duration").notNull(),
  numberOfRooms: integer("number_of_rooms").notNull(),
  occupancyRate: integer("occupancy_rate").notNull(),
  totalRevenue: doublePrecision("total_revenue").notNull(),
  revShare: doublePrecision("rev_share").notNull(),
  userEmail: text("user_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHotelBrandSchema = createInsertSchema(hotelBrands).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertCalculatorResultSchema = createInsertSchema(calculatorResults).omit({
  id: true,
  createdAt: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHotelBrand = z.infer<typeof insertHotelBrandSchema>;
export type HotelBrand = typeof hotelBrands.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertCalculatorResult = z.infer<typeof insertCalculatorResultSchema>;
export type CalculatorResult = typeof calculatorResults.$inferSelect;
