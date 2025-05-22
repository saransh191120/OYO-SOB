import type { Express, Response, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertHotelBrandSchema,
  insertTestimonialSchema,
  insertContactSubmissionSchema,
  insertCalculatorResultSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all hotel brands
  app.get("/api/brands", async (req: Request, res: Response) => {
    try {
      const brands = await storage.getAllHotelBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching hotel brands:", error);
      res.status(500).json({ error: "Failed to fetch hotel brands" });
    }
  });

  // Get a specific hotel brand
  app.get("/api/brands/:brandId", async (req: Request, res: Response) => {
    try {
      const brandId = req.params.brandId;
      const brand = await storage.getHotelBrandById(brandId);
      
      if (!brand) {
        return res.status(404).json({ error: "Hotel brand not found" });
      }
      
      res.json(brand);
    } catch (error) {
      console.error(`Error fetching hotel brand ${req.params.brandId}:`, error);
      res.status(500).json({ error: "Failed to fetch hotel brand" });
    }
  });

  // Create a new hotel brand
  app.post("/api/brands", async (req: Request, res: Response) => {
    try {
      const validatedData = insertHotelBrandSchema.parse(req.body);
      const newBrand = await storage.createHotelBrand(validatedData);
      res.status(201).json(newBrand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating hotel brand:", error);
      res.status(500).json({ error: "Failed to create hotel brand" });
    }
  });

  // Update a hotel brand
  app.patch("/api/brands/:brandId", async (req: Request, res: Response) => {
    try {
      const brandId = req.params.brandId;
      const validatedData = insertHotelBrandSchema.partial().parse(req.body);
      
      const updatedBrand = await storage.updateHotelBrand(brandId, validatedData);
      
      if (!updatedBrand) {
        return res.status(404).json({ error: "Hotel brand not found" });
      }
      
      res.json(updatedBrand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating hotel brand ${req.params.brandId}:`, error);
      res.status(500).json({ error: "Failed to update hotel brand" });
    }
  });

  // Get all testimonials
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const featured = req.query.featured === 'true';
      
      const testimonials = featured 
        ? await storage.getFeaturedTestimonials()
        : await storage.getAllTestimonials();
        
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Get a specific testimonial
  app.get("/api/testimonials/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid testimonial ID" });
      }
      
      const testimonial = await storage.getTestimonialById(id);
      
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      
      res.json(testimonial);
    } catch (error) {
      console.error(`Error fetching testimonial ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch testimonial" });
    }
  });

  // Create a new testimonial
  app.post("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(newTestimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating testimonial:", error);
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // In a real-world scenario, you might want to send an email notification here
      
      res.status(201).json({ 
        success: true, 
        message: "Thank you for your inquiry. Our team will contact you shortly!",
        id: submission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error submitting contact form:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Get all contact submissions (admin endpoint)
  app.get("/api/contact", async (req: Request, res: Response) => {
    try {
      // In a production environment, this endpoint should be protected by authentication
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  // Update contact submission status (admin endpoint)
  app.patch("/api/contact/:id", async (req: Request, res: Response) => {
    try {
      // In a production environment, this endpoint should be protected by authentication
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid submission ID" });
      }
      
      const statusSchema = z.object({
        status: z.string().refine(val => ['new', 'contacted', 'completed', 'archived'].includes(val), {
          message: "Status must be one of: new, contacted, completed, archived"
        })
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const updatedSubmission = await storage.updateContactSubmissionStatus(id, status);
      
      if (!updatedSubmission) {
        return res.status(404).json({ error: "Contact submission not found" });
      }
      
      res.json(updatedSubmission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating contact submission ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update contact submission" });
    }
  });

  // Save calculator result
  app.post("/api/calculator-results", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCalculatorResultSchema.parse(req.body);
      const result = await storage.saveCalculatorResult(validatedData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error saving calculator result:", error);
      res.status(500).json({ error: "Failed to save calculator result" });
    }
  });

  // Get calculator results by email
  app.get("/api/calculator-results", async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        return res.status(400).json({ error: "Email parameter is required" });
      }
      
      const results = await storage.getCalculatorResultsByEmail(email);
      res.json(results);
    } catch (error) {
      console.error("Error fetching calculator results:", error);
      res.status(500).json({ error: "Failed to fetch calculator results" });
    }
  });

  // Fallback API endpoint for testing connection
  app.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello from OYO Self-Operated Hotels API" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
