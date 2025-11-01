# Aragon Task Management

A modern, full-stack task management application built with Next.js 15, featuring real-time task creation, management, and a beautiful user interface with dark mode support.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)

## 🎯 Overview

Aragon Task Management is a task management application that allows users to create and manage their tasks efficiently. The application features:

- **User Authentication**: Secure authentication with email and password using NextAuth.js
- **Task Management**: Full CRUD operations for tasks
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Dark Mode**: Theme switching with smooth transitions
- **Type Safety**: End-to-end type safety with TypeScript and tRPC
- **Real-time Updates**: Optimistic updates with React Query

## ✨ Features

### Implemented Features

- ✅ User authentication with email and password (NextAuth.js)
- ✅ User registration (sign up)
- ✅ User login
- ✅ Task creation with title field
- ✅ Task listing with pagination
- ✅ Task retrieval by ID
- ✅ Task update functionality
- ✅ Task deletion
- ✅ Dark/Light mode toggle
- ✅ Responsive sidebar navigation
- ✅ Protected routes with middleware
- ✅ Optimistic UI updates

### Future Enhancements

- Kanban board view (components already created)
- Task filtering and search
- Task categories/tags
- Due dates and reminders
- Task priority levels

## 🛠 Tech Stack

### Frontend
- **Next.js 15.2.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.0** - Styling
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icons
- **next-themes** - Theme management

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **Zod** - Schema validation

### Authentication & State Management
- **NextAuth.js** - Authentication with email/password
- **bcryptjs** - Password hashing
- **TanStack Query** - Server state management
- **React Hook Form** - Form management

### Development Tools
- **Bun** - Package manager and runtime
- **Prisma Studio** - Database GUI
- **ESLint** - Code linting

## 📁 Project Structure

```
aragon-task-management/
├── app/
│   ├── _trpc/              # tRPC client setup
│   │   ├── client.ts       # tRPC client configuration
│   │   └── Provider.tsx    # tRPC React Query provider
│   ├── api/
│   │   ├── auth/          # Authentication routes
│   │   │   ├── [...nextauth]/  # NextAuth API route
│   │   │   ├── login/     # Login API route
│   │   │   └── signup/    # Signup API route
│   │   └── trpc/[trpc]/   # tRPC API route handler
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── auth-error/        # Auth error page
│   ├── dashboard/          # Dashboard pages
│   │   ├── _components/    # Dashboard-specific components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── site-header.tsx
│   │   │   └── nav-user.tsx
│   │   ├── create-task/   # Create task page
│   │   └── page.tsx        # Dashboard home
│   ├── server/             # Server-side code
│   │   ├── context.ts       # tRPC context
│   │   ├── trpc.ts         # tRPC initialization
│   │   └── routers/        # tRPC routers
│   │       ├── app.ts      # Main router
│   │       └── tasks.ts    # Task router
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects to dashboard)
├── components/
│   ├── common/             # Shared components
│   │   └── kanban-board/   # Kanban board (for future use)
│   ├── ui/                 # shadcn/ui components
│   ├── auth-provider.tsx   # NextAuth session provider
│   ├── mode-toggle.tsx     # Theme switcher
│   └── theme-provider.tsx  # Theme provider
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client instance
│   └── utils.ts            # Utility functions
├── types/
│   └── next-auth.d.ts      # NextAuth type definitions
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── middleware.ts           # Next.js middleware for auth

```

## 🏗 Architecture

### Authentication Flow

1. User visits the application
2. Middleware checks authentication status using NextAuth session
3. Unauthenticated users are redirected to `/login`
4. Users can sign up at `/signup` or sign in at `/login`
5. After authentication, users access the dashboard
6. Session is managed via JWT tokens stored in HTTP-only cookies

### Data Flow

```
Client Component
    ↓
tRPC Client (app/_trpc/client.ts)
    ↓
tRPC API Route (app/api/trpc/[trpc]/route.ts)
    ↓
tRPC Router (app/server/routers/tasks.ts)
    ↓
Prisma Client (lib/prisma.ts)
    ↓
PostgreSQL Database
```

### Key Implementation Details

1. **Type Safety**: tRPC provides end-to-end type safety from database to frontend
2. **Context**: tRPC context includes authenticated user ID from NextAuth session
3. **Protected Procedures**: All task operations require authentication
4. **User Isolation**: Tasks are scoped to the authenticated user via `ownerId`
5. **Optimistic Updates**: React Query enables instant UI feedback
6. **Password Security**: Passwords are hashed using bcrypt before storage

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **PostgreSQL** database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aragon-task-management
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your environment variables (see [Environment Variables](#environment-variables))

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   bunx prisma generate
   
   # Run database migrations
   bunx prisma migrate dev
   
   # (Optional) Open Prisma Studio to view data
   bunx prisma studio
   ```

5. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# NextAuth Secret - Used for encrypting JWT tokens and sessions
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/aragon_task_management?schema=public"
```

### Generating NEXTAUTH_SECRET

1. **Generate a secure secret** using OpenSSL:
   ```bash
   openssl rand -base64 32
   ```

2. **Copy the generated string** and add it to your `.env` file as `NEXTAUTH_SECRET`

3. **Important**: Never commit your `.env` file to version control. The secret should be kept secure and different for each environment (development, staging, production).

### Database URL Format

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]?schema=public
```

For local PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/aragon_task_management?schema=public"
```

## 🗄 Database Setup

### Using PostgreSQL

1. **Install PostgreSQL** (if not installed)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Create a database**
   ```sql
   CREATE DATABASE aragon_task_management;
   ```

3. **Update DATABASE_URL** in your `.env` file

4. **Run migrations**
   ```bash
   bunx prisma migrate dev --name init
   ```

### Database Schema

The application uses the following schema:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed password
  name      String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tasks     Task[]
  
  @@index([email])
}

model Task {
  id        String   @id @default(cuid())
  title     String
  ownerId   String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  owner     User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  
  @@index([ownerId])
}
```

## 📜 Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build         # Build for production
bun run start         # Start production server
bun run lint          # Run ESLint

# Database
bunx prisma generate          # Generate Prisma Client
bunx prisma migrate dev       # Create and apply migration
bunx prisma migrate deploy    # Apply migrations in production
bunx prisma studio            # Open Prisma Studio GUI
bunx prisma db push           # Push schema changes (dev only)
```

## 🔌 API Documentation

### Task Operations

All task operations are available through tRPC. The router is accessible at `/api/trpc`.

#### Create Task
```typescript
trpc.tasks.create.useMutation({
  title: string (required, min 1 character)
})
```

#### Get All Tasks
```typescript
trpc.tasks.getAll.useQuery({
  page?: number (default: 1),
  limit?: number (default: 10, max: 100),
  search?: string (optional)
})
```

Returns:
```typescript
{
  tasks: Task[],
  pagination: {
    page: number,
    limit: number,
    totalCount: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  }
}
```

#### Get Task by ID
```typescript
trpc.tasks.getById.useQuery({
  id: string
})
```

#### Update Task
```typescript
trpc.tasks.update.useMutation({
  id: string,
  title?: string (optional, min 1 character)
})
```

#### Delete Task
```typescript
trpc.tasks.delete.useMutation({
  id: string
})
```

### Type Definitions

```typescript
type User = {
  id: string;
  email: string;
  password: string; // hashed
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type Task = {
  id: string;
  title: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 UI Components

The application uses [shadcn/ui](https://ui.shadcn.com) components:

- **Sidebar** - Collapsible navigation sidebar
- **Switch** - Theme toggle switch
- **Button** - Various button variants
- **Card** - Content containers
- **Form** - Form components with validation
- **Dialog** - Modal dialogs
- And more...

All components are fully customizable and accessible.

## 🔒 Security

- **Authentication**: All routes under `/dashboard` are protected
- **Password Security**: Passwords are hashed using bcrypt (10 rounds) before storage
- **Session Management**: JWT tokens stored in HTTP-only cookies
- **User Isolation**: Tasks are scoped to the authenticated user
- **Input Validation**: Zod schemas validate all inputs
- **Type Safety**: TypeScript and tRPC ensure type safety
- **Environment Variables**: Sensitive data stored in `.env`
- **Middleware Protection**: Route protection via Next.js middleware

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- AWS
- Railway
- Render

Make sure to:
- Set all environment variables
- Run `prisma migrate deploy` for database migrations
- Use PostgreSQL database (not SQLite for production)

## 📝 License

This project is created as an assignment/project.

## 👤 Author

Created as part of an assignment demonstrating full-stack development with modern technologies.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
