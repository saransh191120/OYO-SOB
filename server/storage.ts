import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  users, type User, type InsertUser,
  hotelBrands, type HotelBrand, type InsertHotelBrand,
  testimonials, type Testimonial, type InsertTestimonial,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  calculatorResults, type CalculatorResult, type InsertCalculatorResult
} from "@shared/schema";
import { eq } from 'drizzle-orm';

// Interface defining all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Hotel brand operations
  getAllHotelBrands(): Promise<HotelBrand[]>;
  getHotelBrandById(brandId: string): Promise<HotelBrand | undefined>;
  createHotelBrand(brand: InsertHotelBrand): Promise<HotelBrand>;
  updateHotelBrand(brandId: string, brand: Partial<InsertHotelBrand>): Promise<HotelBrand | undefined>;
  
  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Contact submission operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined>;
  
  // Calculator results operations
  saveCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult>;
  getCalculatorResultsByEmail(email: string): Promise<CalculatorResult[]>;
}

// In-memory storage for development/testing
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private brands: Map<string, HotelBrand>;
  private testimonialsList: Map<number, Testimonial>;
  private submissions: Map<number, ContactSubmission>;
  private calcResults: Map<number, CalculatorResult>;
  private currentIds: {
    users: number;
    testimonials: number;
    submissions: number;
    calcResults: number;
  };

  constructor() {
    this.users = new Map();
    this.brands = new Map();
    this.testimonialsList = new Map();
    this.submissions = new Map();
    this.calcResults = new Map();
    this.currentIds = {
      users: 1,
      testimonials: 1,
      submissions: 1,
      calcResults: 1
    };
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add initial hotel brands data
    const initialBrands: InsertHotelBrand[] = [
      {
        brandId: "sunday",
        name: "Sunday Hotels",
        tagline: "Premium 5-star hotel chain",
        description: "Luxury 4 & 5-star hotels for affluent leisure and senior executives. High potential in Mumbai with positive reviews highlighting professionalism and luxury standards.",
        targetAudience: "Affluent leisure travelers and senior executives",
        amenities: "Fine dining, spa, pools, concierge service, premium and luxurious accommodations",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
        iconClass: "fas fa-crown",
        revSharePercentage: 45,
        defaultRate: 4500,
        locations: "Worli, Mumbai"
      },
      {
        brandId: "palette",
        name: "OYO Palette",
        tagline: "Premium self-operated upscale resorts",
        description: "Upscale resorts crafted for premium leisure, relaxing staycations, and bleisure travelers. Palghar resort serves the extended Mumbai market with promising expansion opportunities.",
        targetAudience: "Premium leisure, staycation, and bleisure travelers",
        amenities: "Inviting pools, rejuvenating spas, unique dining, and stylish spaces to unwind",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
        iconClass: "fas fa-umbrella-beach",
        revSharePercentage: 42,
        defaultRate: 3800,
        locations: "Palghar, Mumbai Region"
      },
      {
        brandId: "clubhouse",
        name: "OYO Clubhouse",
        tagline: "Resort-style self-operated hotels",
        description: "Modern, company-serviced hotels focused on comfort and reliability. Perfect opportunity for expansion in the Mumbai market.",
        targetAudience: "Value-conscious solo travelers, couples, families, and business guests",
        amenities: "Restaurant, Wi-Fi, AC, modern decor, with pools and gyms at select locations",
        imageUrl: "https://images.unsplash.com/photo-1551516594-56cb78394645?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
        iconClass: "fas fa-glass-cheers",
        revSharePercentage: 40,
        defaultRate: 3200,
        locations: "Mumbai Suburbs"
      },
      {
        brandId: "townhouse",
        name: "OYO Townhouse",
        tagline: "Premium neighborhood hotels for millennials",
        description: "Smart, friendly neighborhood hotels designed for millennials. Established in Khar, Airport, Goregaon, Worli, with promising café expansions.",
        targetAudience: "Millennials, students, and young professionals who value affordability and local vibes",
        amenities: "In-room Netflix, high-speed Wi-Fi, signature cafes, and communal workspaces",
        imageUrl: "https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
        iconClass: "fas fa-home",
        revSharePercentage: 38,
        defaultRate: 2800,
        locations: "Khar, Airport, Goregaon, Worli"
      },
      {
        brandId: "townhouse-oak",
        name: "OYO Townhouse Oak",
        tagline: "Upscale version of the Townhouse concept",
        description: "Premium extension offering stylish, refined experiences. Locations in Vashi, Khar, Andheri East, Kopar Khairane with growth potential.",
        targetAudience: "Discerning millennials, young professionals, corporate guests",
        amenities: "Premium finishes, gym, pools, enhanced in-room comforts, restaurants",
        imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
        iconClass: "fas fa-tree",
        revSharePercentage: 40,
        defaultRate: 3000,
        locations: "Vashi, Khar, Andheri East, Kopar Khairane"
      },
      {
        brandId: "collection-o",
        name: "OYO Collection O",
        tagline: "Business hotels with standard amenities for corporate travelers",
        description: "Affordable premium features tailored for business and leisure travelers. Strong presence in Kurla, Andheri, Sanpada, Mumbai Central with growth potential.",
        targetAudience: "Value-conscious business travelers and leisure tourists",
        amenities: "AC rooms, free Wi-Fi, TV, clean linen, breakfast, 24/7 check-in available",
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
        iconClass: "fas fa-briefcase",
        revSharePercentage: 35,
        defaultRate: 2200,
        locations: "Kurla, Andheri, Sanpada, Mumbai Central"
      }
    ];
    
    initialBrands.forEach(brand => {
      const hotelBrand: HotelBrand = {
        ...brand,
        id: this.brands.size + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.brands.set(brand.brandId, hotelBrand);
    });
    
    // Add initial testimonials
    const initialTestimonials: InsertTestimonial[] = [
      {
        name: "Rajesh Sharma",
        position: "Owner",
        hotel: "Seaside Luxury Resort",
        location: "Worli, Mumbai",
        brand: "Sunday Hotels",
        quote: "Converting our property to Sunday Hotels was the best decision. Our revenue increased by 45% in just six months, and our guests love the 5-star experience. The team at OYO handled everything from training staff to upgrading our amenities.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
        rating: 5,
        featured: 1
      },
      {
        name: "Priya Patel",
        position: "Director",
        hotel: "Metro Heights",
        location: "Andheri East, Mumbai",
        brand: "OYO Townhouse Oak",
        quote: "The Townhouse Oak branding and superior booking system elevated our property's status. Young professionals love the stylish spaces, and our occupancy rates have increased to 82%. The self-operated model means we maintain consistent quality.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
        rating: 5,
        featured: 1
      },
      {
        name: "Vikram Singh",
        position: "CEO",
        hotel: "Bayview Business Suites",
        location: "Kurla, Mumbai",
        brand: "OYO Collection O",
        quote: "As a business hotel operator, I was skeptical about partnering with OYO. The Collection O self-operated model convinced us, and we've seen a 38% increase in corporate bookings. The seamless operations and standardized quality ensure our business guests keep returning.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
        rating: 4,
        featured: 1
      }
    ];
    
    initialTestimonials.forEach(testimonial => {
      const id = this.currentIds.testimonials++;
      const newTestimonial: Testimonial = {
        ...testimonial,
        id,
        createdAt: new Date(),
        featured: testimonial.featured ?? 0
      };
      this.testimonialsList.set(id, newTestimonial);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  // Hotel brand methods
  async getAllHotelBrands(): Promise<HotelBrand[]> {
    return Array.from(this.brands.values());
  }
  
  async getHotelBrandById(brandId: string): Promise<HotelBrand | undefined> {
    return this.brands.get(brandId);
  }
  
  async createHotelBrand(brand: InsertHotelBrand): Promise<HotelBrand> {
    const newBrand: HotelBrand = {
      ...brand,
      id: this.brands.size + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.brands.set(brand.brandId, newBrand);
    return newBrand;
  }
  
  async updateHotelBrand(brandId: string, brandUpdates: Partial<InsertHotelBrand>): Promise<HotelBrand | undefined> {
    const existingBrand = this.brands.get(brandId);
    if (!existingBrand) return undefined;
    
    const updatedBrand: HotelBrand = {
      ...existingBrand,
      ...brandUpdates,
      updatedAt: new Date()
    };
    
    this.brands.set(brandId, updatedBrand);
    return updatedBrand;
  }
  
  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonialsList.values());
  }
  
  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonialsList.values())
      .filter(testimonial => testimonial.featured === 1);
  }
  
  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return this.testimonialsList.get(id);
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentIds.testimonials++;
    const newTestimonial: Testimonial = {
      ...testimonial,
      id,
      createdAt: new Date(),
      featured: testimonial.featured ?? 0
    };
    this.testimonialsList.set(id, newTestimonial);
    return newTestimonial;
  }
  
  // Contact submission methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentIds.submissions++;
    const newSubmission: ContactSubmission = {
      ...submission,
      id,
      status: "new",
      createdAt: new Date()
    };
    this.submissions.set(id, newSubmission);
    return newSubmission;
  }
  
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.submissions.values());
  }
  
  async updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;
    
    const updatedSubmission: ContactSubmission = {
      ...submission,
      status
    };
    
    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }
  
  // Calculator results methods
  async saveCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult> {
    const id = this.currentIds.calcResults++;
    const newResult: CalculatorResult = {
      ...result,
      id,
      createdAt: new Date(),
      userEmail: result.userEmail ?? null
    };
    this.calcResults.set(id, newResult);
    return newResult;
  }
  
  async getCalculatorResultsByEmail(email: string): Promise<CalculatorResult[]> {
    return Array.from(this.calcResults.values())
      .filter(result => result.userEmail === email);
  }
}

// PostgreSQL Storage implementation
export class PgStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private client: ReturnType<typeof postgres>;

  constructor() {
    // Connect to PostgreSQL using the DATABASE_URL environment variable
    this.client = postgres(process.env.DATABASE_URL!);
    this.db = drizzle(this.client);
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const results = await this.db.insert(users).values(user).returning();
    return results[0];
  }
  
  // Hotel brand methods
  async getAllHotelBrands(): Promise<HotelBrand[]> {
    return this.db.select().from(hotelBrands);
  }
  
  async getHotelBrandById(brandId: string): Promise<HotelBrand | undefined> {
    const results = await this.db.select().from(hotelBrands).where(eq(hotelBrands.brandId, brandId)).limit(1);
    return results[0];
  }
  
  async createHotelBrand(brand: InsertHotelBrand): Promise<HotelBrand> {
    const results = await this.db.insert(hotelBrands).values(brand).returning();
    return results[0];
  }
  
  async updateHotelBrand(brandId: string, brand: Partial<InsertHotelBrand>): Promise<HotelBrand | undefined> {
    const results = await this.db.update(hotelBrands)
      .set({ ...brand, updatedAt: new Date() })
      .where(eq(hotelBrands.brandId, brandId))
      .returning();
    
    return results[0];
  }
  
  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return this.db.select().from(testimonials);
  }
  
  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return this.db.select().from(testimonials).where(eq(testimonials.featured, 1));
  }
  
  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const results = await this.db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    return results[0];
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const results = await this.db.insert(testimonials).values(testimonial).returning();
    return results[0];
  }
  
  // Contact submission methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const results = await this.db.insert(contactSubmissions).values(submission).returning();
    return results[0];
  }
  
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return this.db.select().from(contactSubmissions);
  }
  
  async updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined> {
    const results = await this.db.update(contactSubmissions)
      .set({ status })
      .where(eq(contactSubmissions.id, id))
      .returning();
    
    return results[0];
  }
  
  // Calculator results methods
  async saveCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult> {
    const results = await this.db.insert(calculatorResults).values(result).returning();
    return results[0];
  }
  
  async getCalculatorResultsByEmail(email: string): Promise<CalculatorResult[]> {
    return this.db.select().from(calculatorResults).where(eq(calculatorResults.userEmail, email));
  }
}

// Export the storage instance
// Use PostgreSQL in production, MemStorage for development
export const storage = process.env.NODE_ENV === 'production' 
  ? new PgStorage() 
  : new MemStorage();
