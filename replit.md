# OYO Premium - Luxury SOB Calculator Web Application

## Overview

This project is a web application for the OYO Premium hotel brand that features a "Stay-on-Book" (SOB) calculator to help hotel owners estimate revenue potential. The application is built using a modern stack with a React frontend and Express backend, using Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The project follows a client-server architecture with clear separation of concerns:

1. **Frontend**: React application with TypeScript, using shadcn/ui components library and TailwindCSS for styling
2. **Backend**: Express.js API server 
3. **Database**: PostgreSQL with Drizzle ORM for database interactions
4. **State Management**: React Query for server state management

The application is structured as a monorepo with client, server, and shared directories:

- `/client` - React frontend application
- `/server` - Express.js backend
- `/shared` - Common code shared between frontend and backend

## Key Components

### Frontend

- **UI Framework**: React with TypeScript
- **Component Library**: shadcn/ui components (built on Radix UI primitives)
- **Styling**: TailwindCSS with a custom theme
- **Main Components**:
  - Navigation
  - HeroSection
  - CalculatorSection (the core SOB calculator)
  - FeaturesSection
  - TestimonialsSection
  - ContactSection

The UI follows a luxury brand aesthetic with a navy and gold color scheme to match the OYO Premium branding.

### Backend

- **Server**: Express.js with TypeScript
- **API Structure**: RESTful endpoints prefixed with `/api`
- **Storage Interface**: A storage abstraction layer for database operations
- **Authentication**: Basic user authentication (username/password)

### Database

- **ORM**: Drizzle ORM
- **Schema**:
  - Users table with username and password fields
  - Type definitions using Zod for validation

### Shared Code

- Drizzle schema definitions
- TypeScript types shared between frontend and backend

## Data Flow

1. **User Registration/Authentication**:
   - User data is stored in the users table
   - Basic authentication system in place

2. **Calculator Functionality**:
   - User inputs parameters like room rate, occupancy, etc.
   - Client-side JavaScript calculates revenue projections
   - Results displayed in a user-friendly format

3. **Contact Form**:
   - Form submissions may be stored in the database (implementation pending)

## External Dependencies

### Frontend

- **UI Components**: Radix UI components (@radix-ui/*)
- **Data Fetching**: TanStack Query (@tanstack/react-query)
- **Form Handling**: React Hook Form (@hookform/resolvers)
- **Styling**: TailwindCSS with class-variance-authority, clsx
- **Icons**: FontAwesome and Lucide icons

### Backend

- **Database**: Drizzle ORM with PostgreSQL
- **Session Management**: connect-pg-simple
- **API Server**: Express.js

## Deployment Strategy

The application is configured for deployment on Replit's platform:

- **Development**: Using `npm run dev` command with hot reloading
- **Production Build**: Using `npm run build` to create a production bundle
- **Production Start**: Using `npm run start` to run the production build

Database migration is handled with Drizzle Kit:
- `npm run db:push` command pushes schema changes to the database

The application is set up to work in the Replit environment with appropriate configuration in the `.replit` file.

## Development Workflow

1. Run `npm run dev` to start the development server
2. Make changes to the client or server code
3. Test your changes in the browser
4. Use `npm run check` to validate TypeScript correctness
5. Use `npm run db:push` to update the database schema if needed
6. Deploy by pushing to the main branch, which triggers the Replit deployment workflow

## Planned Features and Improvements

Current implementation is primarily focused on the frontend UI with placeholder functionality. The backend API routes need to be fully implemented to handle:

1. User authentication and session management
2. Storing calculator configurations
3. Processing contact form submissions
4. Admin features for managing the system

The database schema may need to be extended to support these features beyond the basic users table currently defined.