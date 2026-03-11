# Tech Stack & Architecture Document
# Driver Hiring & Management Platform

> **For AI Coding Agent:** This document defines the full technical architecture across both phases. Phase 1 uses the complete tech stack foundation — same language, framework, and DB schema that Phase 2 builds on. No throwaway code. Phase 2 only adds integrations and features on top of what Phase 1 establishes.

---

## Stack Overview

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| UI Components | ShadCN UI |
| State Management | React Context API (Phase 1) → add Redux Toolkit if needed (Phase 2) |
| Routing | React Router v6 |
| Backend | Node.js + Express.js |
| Auth | JWT (access + refresh tokens) + bcrypt |
| Database | MongoDB Atlas + Mongoose |
| File Storage | Cloudinary |
| Real-Time | Socket.io (Phase 2) |
| Maps | Google Maps API (Phase 2) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

---

## PHASE 1 — Validation Prototype

---

### Frontend Architecture

```
/src
  /components
    /ui           ← Reusable design system components (Button, Card, Input, etc.)
    /layout       ← Navbar, Footer, PageWrapper
    /shared       ← JobCard, ApplicantCard, RatingStars, NotificationBell, etc.
  /pages
    /public       ← LandingPage
    /auth         ← Login, Signup
    /driver       ← Onboarding (multi-step), Dashboard, BrowseJobs, MyApplications
    /customer     ← ProfileSetup, Dashboard, PostJob, MyJobs, ApplicantView
  /hooks          ← useAuth, useJobs, useApplications, useNotifications
  /context        ← AuthContext, NotificationContext
  /services       ← api.ts (Axios instance + all API call functions)
  /types          ← TypeScript interfaces: User, Job, Application, Rating, Notification
  /utils          ← formatDate, formatCurrency, getStatusColor, etc.
  /constants      ← JOB_TYPES, CAR_TYPES, TRANSMISSION_TYPES, CITIES
```

**Key frontend decisions:**
- Axios with request/response interceptors for JWT attach + 401 handling
- Protected route wrapper component using `AuthContext`
- Role-based routing: driver routes vs customer routes vs public routes
- `react-hook-form` + `zod` for all form validation
- `react-dropzone` for document upload UI
- Tailwind + ShadCN for all styling (no custom CSS except design tokens in `globals.css`)

---

### Backend Architecture

```
/src
  /routes
    auth.routes.ts
    driver.routes.ts
    customer.routes.ts
    jobs.routes.ts
    applications.routes.ts
    ratings.routes.ts
    notifications.routes.ts
  /controllers      ← Business logic per route group
  /middleware
    auth.middleware.ts     ← JWT verify + attach req.user
    role.middleware.ts     ← requireRole('driver' | 'customer' | 'admin')
    upload.middleware.ts   ← Multer + Cloudinary integration
  /models           ← Mongoose schemas (see DB Design below)
  /services
    cloudinary.service.ts
    notification.service.ts   ← create + fetch notifications (polling-based in Phase 1)
  /utils
    jwt.utils.ts
    bcrypt.utils.ts
    response.utils.ts    ← standardized API response shape
  /types            ← TypeScript interfaces
  /config
    db.ts            ← MongoDB Atlas connection
    cloudinary.ts    ← Cloudinary SDK init
  app.ts             ← Express app setup, middleware, route mounting
  server.ts          ← HTTP server listen
```

**API base URL structure:**
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/driver/profile
POST   /api/driver/profile
PATCH  /api/driver/profile
POST   /api/driver/documents        ← upload Aadhaar/PAN/License

POST   /api/customer/profile
GET    /api/customer/profile
PATCH  /api/customer/profile

GET    /api/jobs                    ← driver: browse; customer: my jobs
POST   /api/jobs                    ← customer: create job
GET    /api/jobs/:id
PATCH  /api/jobs/:id/status

POST   /api/applications            ← driver applies
GET    /api/applications/driver     ← driver's own applications
GET    /api/applications/job/:jobId ← customer sees applicants for their job
PATCH  /api/applications/:id        ← customer hires / driver accepts/declines

POST   /api/ratings
GET    /api/ratings/driver/:driverId

GET    /api/notifications           ← fetch unread
PATCH  /api/notifications/read      ← mark all read
```

**Standard API response shape:**
```json
{ "success": true, "data": {}, "message": "..." }
{ "success": false, "error": "...", "code": 400 }
```

---

### Database Schema (MongoDB / Mongoose)

#### `users` collection
```typescript
{
  _id: ObjectId,
  fullName: string,
  email: string,          // unique, indexed
  phone: string,          // unique
  passwordHash: string,
  role: "driver" | "customer" | "admin",
  isProfileComplete: boolean,  // default false
  createdAt: Date,
  updatedAt: Date
}
```

#### `driver_profiles` collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,       // ref: users, unique
  age: number,
  address: string,
  city: string,           // indexed
  areas: string[],        // areas within city driver works in
  transmissionTypes: ("manual" | "automatic" | "semi-automatic")[],
  vehicleCategories: ("hatchback" | "sedan" | "suv" | "luxury")[],
  documents: {
    aadhaar: { url: string, cloudinaryId: string, uploadedAt: Date },
    pan:     { url: string, cloudinaryId: string, uploadedAt: Date },
    license: { url: string, cloudinaryId: string, uploadedAt: Date },
  },
  isVerified: boolean,    // Phase 1: set true on profile completion; Phase 2: set by admin/API
  averageRating: number,  // default 0, recalculated on new rating
  totalJobsCompleted: number,
  createdAt: Date,
  updatedAt: Date
}
```

#### `customer_profiles` collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,       // ref: users, unique
  city: string,
  carDetails: {
    make: string,
    model: string
  },
  preferences: {
    transmissionType: string,
    vehicleCategory: string
  },
  averageRating: number,
  createdAt: Date,
  updatedAt: Date
}
```

#### `jobs` collection
```typescript
{
  _id: ObjectId,
  customerId: ObjectId,   // ref: users, indexed
  jobType: "hourly" | "temporary" | "permanent",
  city: string,           // indexed (for location-based querying)
  areas: string[],
  startLocation: string,
  endLocation: string,    // not required for permanent
  carType: "hatchback" | "sedan" | "suv" | "luxury",
  transmissionType: "manual" | "automatic" | "semi-automatic",
  // Hourly fields:
  estimatedDuration: number,     // hours
  expectedPayout: number,
  // Temporary fields:
  durationDays: number,
  dailyPayment: number,
  // Permanent fields:
  workingHours: "12hr" | "24x7",
  monthlySalary: number,
  status: "posted" | "applied" | "accepted" | "in_progress" | "completed" | "cancelled",
  acceptedDriverId: ObjectId | null,   // ref: users
  cancellationReason: string | null,
  // Phase 2 fields (add to schema now, leave null):
  paymentId: string | null,       // Razorpay payment ID
  location: { type: "Point", coordinates: [number, number] } | null,  // GeoJSON
  createdAt: Date,
  updatedAt: Date
}
```

> **Note:** The `paymentId` and `location` (GeoJSON) fields are defined on the schema now but left `null`. This avoids a migration in Phase 2.

#### `applications` collection
```typescript
{
  _id: ObjectId,
  jobId: ObjectId,        // ref: jobs, indexed
  driverId: ObjectId,     // ref: users, indexed
  appliedAt: Date,        // for first-applied-first ranking
  status: "pending" | "approved" | "rejected" | "withdrawn",
  // Driver's acceptance after customer picks them:
  driverResponse: "pending" | "accepted" | "declined" | null,
  createdAt: Date,
  updatedAt: Date
}
// Compound index: { jobId, driverId } — unique, prevents duplicate applications
```

#### `ratings` collection
```typescript
{
  _id: ObjectId,
  jobId: ObjectId,        // ref: jobs, unique per pair
  raterId: ObjectId,      // ref: users
  rateeId: ObjectId,      // ref: users
  rateeRole: "driver" | "customer",
  drivingSkill: number,         // 1-5 (only when rateeRole = driver)
  professionalBehavior: number, // 1-5
  punctuality: number,          // 1-5 (only when rateeRole = driver)
  overallRating: number,        // average of above, auto-calculated
  review: string | null,
  createdAt: Date
}
```

#### `notifications` collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,       // ref: users, indexed
  type: "new_job" | "application_approved" | "application_rejected" | "driver_applied" | "driver_accepted" | "driver_declined" | "job_completed",
  message: string,
  relatedJobId: ObjectId | null,
  isRead: boolean,        // default false
  createdAt: Date
  // Phase 2: add fcmToken field to users collection instead
}
```

---

### Environment Variables (Phase 1)

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/driverplatform

# JWT
JWT_SECRET=<long-random-string>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<another-long-random-string>
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

### Development Setup

```bash
# Prerequisites: Node 18+, MongoDB Atlas account, Cloudinary account

# Backend
cd backend
npm install
cp .env.example .env   # fill in env vars
npm run dev            # nodemon + ts-node

# Frontend
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm run dev            # Vite dev server on :5173
```

---

### Deployment (Phase 1)

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploy from `main` branch, set `VITE_API_URL` env var |
| Backend | Render | Web service, set all env vars, free tier OK for validation |
| Database | MongoDB Atlas | Free M0 cluster |
| File Storage | Cloudinary | Free tier (25GB) |

---

---

## PHASE 2 — Version 1.0 (Production)

> All Phase 1 code remains. The items below are additive integrations.

---

### New Integrations

#### Real-Time (Socket.io)

```typescript
// server.ts — wrap existing HTTP server
import { Server } from 'socket.io';
const io = new Server(httpServer, { cors: { origin: CLIENT_URL } });

// Emit from notification.service.ts instead of just writing to DB
io.to(`user:${userId}`).emit('notification', payload);

// Job updates
io.to(`job:${jobId}`).emit('applicant_count', { count });

// Driver location (GPS tracking)
io.on('connection', (socket) => {
  socket.on('driver:location', ({ jobId, coords }) => {
    io.to(`job:${jobId}:customer`).emit('driver:location', coords);
  });
});
```

#### Document Verification (IDfy or Karza)

```typescript
// New service: /services/verification.service.ts
// Called from PATCH /api/driver/documents after upload
// Sets driver_profiles.isVerified based on API response
// Creates admin notification if manual review needed
```

#### Payments (Razorpay)

```typescript
// New routes:
POST /api/payments/create-order    ← customer initiates payment
POST /api/payments/verify          ← verify Razorpay webhook signature
POST /api/payments/release/:jobId  ← release escrow to driver on completion
GET  /api/payments/history         ← driver or customer transaction history
```

Uses the `paymentId` field already in the `jobs` schema (just left null in Phase 1).

#### SMS / OTP (Twilio or MSG91)

```typescript
// New service: /services/otp.service.ts
// New routes:
POST /api/auth/send-otp
POST /api/auth/verify-otp
// Adds phone_verified: boolean to users schema
```

#### Push Notifications (Firebase FCM)

```typescript
// Add fcmToken: string field to users schema (already left room for this)
// New service: /services/fcm.service.ts
// Triggered alongside existing notification DB write in notification.service.ts
```

#### Geo-queries (MongoDB $near)

```typescript
// jobs schema already has location: GeoJSON field (null in Phase 1)
// Phase 2: populate on job creation with Google Maps Geocoding API
// Add 2dsphere index: jobsSchema.index({ location: '2dsphere' })
// Update GET /api/jobs to use $near query instead of city string match
```

#### In-App Chat

```typescript
// New collection: messages
{
  jobId: ObjectId,
  senderId: ObjectId,
  text: string,
  sentAt: Date,
  isRead: boolean
}
// New routes:
GET  /api/chat/:jobId
POST /api/chat/:jobId
// Socket.io: room per jobId for real-time delivery
```

#### Admin Panel Routes

```typescript
// All behind requireRole('admin') middleware (already built in Phase 1)
GET    /api/admin/stats
GET    /api/admin/verification-queue
PATCH  /api/admin/drivers/:id/verify
GET    /api/admin/users
PATCH  /api/admin/users/:id/status
GET    /api/admin/jobs
GET    /api/admin/complaints
POST   /api/admin/complaints/:id/resolve
```

---

### Production Infrastructure (Phase 2)

| Addition | Tool | Purpose |
|---|---|---|
| Caching | Redis (Upstash) | Cache job listings, rate limit counters |
| Rate Limiting | `express-rate-limit` + Redis store | Protect all API routes |
| Error Monitoring | Sentry | Frontend + backend error tracking |
| Log Management | Logtail or Datadog | Structured backend logs |
| CDN | Cloudflare or Vercel Edge | Static asset delivery |
| Process Manager | PM2 (if self-hosted) | Cluster mode on Render/Railway |

### New Environment Variables (Phase 2 additions)

```env
# Twilio / MSG91
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Firebase FCM
FIREBASE_SERVICE_ACCOUNT_JSON=

# Document Verification (IDfy/Karza)
VERIFICATION_API_KEY=
VERIFICATION_API_URL=

# Google Maps
GOOGLE_MAPS_API_KEY=

# Redis
REDIS_URL=

# Sentry
SENTRY_DSN=
```

---

## Phase 1 → Phase 2: Migration Checklist

| Task | Effort | Notes |
|---|---|---|
| Add Socket.io to existing HTTP server | Low | No route changes needed |
| Swap notification polling for Socket.io emit | Low | One-line change in `notification.service.ts` |
| Populate `location` GeoJSON on job creation | Low | Already in schema, just need Maps API key |
| Switch `isVerified` to verification API result | Low | Already boolean field, just change who sets it |
| Add `paymentId` flow (Razorpay) | Medium | Field exists, add payment routes |
| Add FCM token to user schema | Low | `ALTER`-free in MongoDB |
| Mount `/admin` router | Low | Middleware already exists |
| Add Redis for rate limiting | Low | Drop-in with `express-rate-limit` |
| Add 2dsphere index to `jobs.location` | Low | One index declaration |
