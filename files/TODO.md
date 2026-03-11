# Implementation Todo List

# Driver Hiring & Management Platform

---

## PHASE 1 — Validation Prototype

---

### Stage 1: Project Setup & Repo Structure

- [ ] Initialize monorepo with `/frontend` and `/backend` directories
- [ ] **Frontend:** Scaffold React 18 + TypeScript project with Vite (`npm create vite@latest frontend -- --template react-ts`)
- [ ] **Frontend:** Install core dependencies — `react-router-dom`, `axios`, `react-hook-form`, `zod`, `@hookform/resolvers`, `react-dropzone`
- [ ] **Frontend:** Install Tailwind CSS and configure `tailwind.config.ts` + `postcss.config.js`
- [ ] **Frontend:** Install and initialize ShadCN UI (`npx shadcn-ui@latest init`), configure `components.json`
- [ ] **Frontend:** Create folder structure: `/components/ui`, `/components/layout`, `/components/shared`, `/pages/public`, `/pages/auth`, `/pages/driver`, `/pages/customer`, `/hooks`, `/context`, `/services`, `/types`, `/utils`, `/constants`
- [ ] **Backend:** Initialize Node.js + TypeScript project (`npm init`, `tsc --init`)
- [ ] **Backend:** Install core dependencies — `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `multer`, `cloudinary`, `cookie-parser`
- [ ] **Backend:** Install dev dependencies — `typescript`, `ts-node`, `nodemon`, `@types/express`, `@types/jsonwebtoken`, `@types/bcryptjs`, `@types/cors`, `@types/multer`, `@types/cookie-parser`
- [ ] **Backend:** Create folder structure: `/src/routes`, `/src/controllers`, `/src/middleware`, `/src/models`, `/src/services`, `/src/utils`, `/src/types`, `/src/config`
- [ ] **Backend:** Create `tsconfig.json` with strict mode, ES module support, output to `/dist`
- [ ] **Backend:** Create `nodemon.json` config for `ts-node` dev server
- [ ] **Backend:** Create `.env.example` with all Phase 1 env var placeholders [ENV]
- [ ] **Frontend:** Create `.env.example` with `VITE_API_URL=http://localhost:5000` [ENV]
- [ ] Create root `.gitignore` (node_modules, dist, .env, uploads)
- [ ] Create root `README.md` with project overview and setup instructions

---

### Stage 2: Design System & Reusable UI Components

- [ ] **Tailwind config:** Define custom color tokens — `--color-primary` (#083344), `--color-accent` (#10B981), `--color-accent-hover` (#059669), `--color-mint-bg` (#ECFDF5), `--color-surface` (#F8FAFC), `--color-card` (#F1F5F9), `--color-border` (#E5E7EB), `--color-text-primary` (#111827), `--color-text-secondary` (#6B7280), `--color-text-sub-heading` (#374151)
- [ ] **globals.css:** Set CSS custom properties for all design tokens, import Inter font from Google Fonts (with system sans-serif fallback)
- [ ] **Tailwind config:** Define typography scale — H1 (48px Bold), H2 (32px Bold), H3 (22px SemiBold), Body (16px Regular), Label/Caption (13px Medium)
- [ ] **Tailwind config:** Define spacing scale (4/8/12/16/24/32/48/64/96px), border radius tokens (cards 12px, buttons 8px, inputs 8px, badges 9999px), shadow tokens (card-default, card-hover, modal)
- [ ] **Component:** `<Button variant="primary|secondary|ghost" />` — accent green primary, outlined secondary, ghost/link style; hover transitions (150ms ease)
- [ ] **Component:** `<Card />` — rounded-12px, card-default shadow, hover: `translateY(-2px)` + card-hover shadow
- [ ] **Component:** `<Input />` — border #E5E7EB, rounded-8px, focus ring in accent green
- [ ] **Component:** `<Select />` — styled dropdown with border and focus states consistent with Input
- [ ] **Component:** `<Textarea />` — multi-line input with matching design tokens
- [ ] **Component:** `<Modal />` — centered overlay, modal shadow, close button, backdrop click dismiss
- [ ] **Component:** `<Badge status="pending|approved|rejected|active|completed" />` — pill shape (9999px radius), color-coded per status
- [ ] **Component:** `<Accordion />` — FAQ-style expand/collapse, `max-height` transition 300ms ease
- [ ] **Component:** `<Tabs />` — horizontal tab navigation for dashboard sections
- [ ] **Component:** `<StatCard />` — icon + large bold number + label, mint-bg card background
- [ ] **Component:** `<JobCard />` — driver-facing job listing: Job Type badge, Location, Car Type, Transmission, Duration, Payout, Customer Rating, action button
- [ ] **Component:** `<ApplicantCard />` — customer-facing driver applicant card: Avatar, Name, Age, Rating (stars), Experience tags, Hire button
- [ ] **Component:** `<NotificationBell />` — bell icon with red unread count badge
- [ ] **Component:** `<Avatar />` — circular image with fallback initials generation
- [ ] **Component:** `<RatingStars />` — display mode (read-only) + interactive mode (clickable 1–5 stars)
- [ ] **Component:** `<EmptyState />` — illustration placeholder + descriptive text + CTA button
- [ ] **Component:** `<Loader />` — spinner animation for loading states
- [ ] **Component:** `<Skeleton />` — shimmer placeholder for content loading
- [ ] **Component:** `<Toast />` — notification toast system: slide-in from top-right, auto-dismiss after 3s, success/error/info variants
- [ ] **Layout Component:** `<Navbar />` — fixed top, white bg, bottom border; left logo, center nav links, right Login/Sign Up buttons; mobile hamburger → full-screen slide-down drawer
- [ ] **Layout Component:** `<Footer />` — dark bg (#083344), white text, 5-column layout (About / Services / For Business / Cities / Contact), bottom row with copyright + legal links
- [ ] **Layout Component:** `<PageWrapper />` — standardized page container with max-width and consistent padding
- [ ] **Utility:** Scroll fade-in animation using IntersectionObserver — `opacity 0→1` + `translateY 20px→0`

---

### Stage 3: Public Landing Page (All Sections)

- [ ] **Page:** Create `/pages/public/LandingPage.tsx` as single-page scrollable layout
- [ ] **Section 1.2:** Hero Section — mint-bg (#ECFDF5), two-column layout; left: eyebrow text, H1 headline, subtext, `Book a Driver Now` primary CTA, `Become a Driver →` ghost CTA; right: driver illustration/placeholder image; mobile: stack vertically
- [ ] **Section 1.3:** Trust & Statistics Section — white bg, 4 `<StatCard />` in a row (Happy Customers, App Rating, Trips Completed, Cities Covered); mobile: 2×2 grid
- [ ] **Section 1.4:** Why Choose Us Section — `#F8FAFC` bg, section heading, 2×2 grid of feature cards (Verified Drivers, Transparent Pricing, Fast Matching, Relax in Your Car); each card with icon + title + description + hover lift
- [ ] **Section 1.5:** Services Section — white bg, 4 service cards grid (Instant Booking, Outstation Trips, Daily Commute, Premium Drivers); each card with icon + title + 1-line description + hover border highlight in accent green
- [ ] **Section 1.6:** Safety Section — dark teal (#083344) full-width band, white text, 4 safety cards (Emergency SOS, Private Numbers, 24x7 Support, Background Verified); icons in accent green
- [ ] **Section 1.7:** Service Areas Section — two-column: left = map illustration/placeholder, right = city/area list as green pill badges; CTA: `Book Now in Your Area`
- [ ] **Section 1.8:** FAQ Section — white bg, `<Accordion />` with 5–6 platform questions, smooth expand/collapse animation
- [ ] **Section 1.9:** Driver Partner Banner — mint-bg (#ECFDF5), "Join as a Driver Partner" headline, "Earn ₹25,000+ monthly" subtext, `Join Now →` CTA
- [ ] **Section 1.10:** Business Services Banner — card-bg (#F1F5F9), "Need on-demand drivers for your business?" headline, `Learn More →` CTA
- [ ] **Section 1.11:** App Download Section — two-column: left = phone mockup placeholder, right = description + Google Play button + Apple App Store button (link to `#`)
- [ ] **Responsive:** Verify all landing page sections work at Desktop (≥1280px), Tablet (768–1279px), Mobile (<768px) breakpoints
- [ ] **Route:** Register `/` route in React Router for LandingPage

---

### Stage 4: Backend — Core Models & DB Setup

- [ ] **Config:** Create `src/config/db.ts` — MongoDB Atlas connection via Mongoose with connection error handling [ENV]
- [ ] **Config:** Create `src/config/cloudinary.ts` — Cloudinary SDK initialization with env vars [ENV]
- [ ] **Model:** `User` model (`src/models/user.model.ts`) — `_id`, `fullName`, `email` (unique, indexed), `phone` (unique), `passwordHash`, `role` (enum: driver/customer/admin), `isProfileComplete` (default false), timestamps
- [ ] **Model:** `DriverProfile` model (`src/models/driverProfile.model.ts`) — `userId` (ref: User, unique), `age`, `address`, `city` (indexed), `areas[]`, `transmissionTypes[]` (enum), `vehicleCategories[]` (enum), `documents` (aadhaar/pan/license with url, cloudinaryId, uploadedAt), `isVerified` (default false), `averageRating` (default 0), `totalJobsCompleted` (default 0), timestamps
- [ ] **Model:** `CustomerProfile` model (`src/models/customerProfile.model.ts`) — `userId` (ref: User, unique), `city`, `carDetails` (make, model), `preferences` (transmissionType, vehicleCategory), `averageRating` (default 0), timestamps
- [ ] **Model:** `Job` model (`src/models/job.model.ts`) — `customerId` (ref: User, indexed), `jobType` (enum: hourly/temporary/permanent), `city` (indexed), `areas[]`, `startLocation`, `endLocation`, `carType` (enum), `transmissionType` (enum), hourly fields (estimatedDuration, expectedPayout), temporary fields (durationDays, dailyPayment), permanent fields (workingHours enum, monthlySalary), `status` (enum, default: posted), `acceptedDriverId` (ref: User, nullable), `cancellationReason` (nullable), `paymentId` (nullable — Phase 2 placeholder), `location` GeoJSON (nullable — Phase 2 placeholder), timestamps
- [ ] **Model:** `Application` model (`src/models/application.model.ts`) — `jobId` (ref: Job, indexed), `driverId` (ref: User, indexed), `appliedAt` (Date), `status` (enum: pending/approved/rejected/withdrawn), `driverResponse` (enum: pending/accepted/declined, nullable), timestamps; compound unique index on `{ jobId, driverId }`
- [ ] **Model:** `Rating` model (`src/models/rating.model.ts`) — `jobId` (ref: Job), `raterId` (ref: User), `rateeId` (ref: User), `rateeRole` (enum: driver/customer), `drivingSkill` (1–5), `professionalBehavior` (1–5), `punctuality` (1–5), `overallRating` (auto-calculated average), `review` (nullable), `createdAt`
- [ ] **Model:** `Notification` model (`src/models/notification.model.ts`) — `userId` (ref: User, indexed), `type` (enum: new_job/application_approved/application_rejected/driver_applied/driver_accepted/driver_declined/job_completed), `message`, `relatedJobId` (ref: Job, nullable), `isRead` (default false), `createdAt`
- [ ] **Util:** Create `src/utils/response.utils.ts` — standardized API response helpers: `successResponse(res, data, message, statusCode)` and `errorResponse(res, error, statusCode)`
- [ ] **App setup:** Create `src/app.ts` — Express app setup: JSON body parser, CORS (allow CLIENT_URL), cookie-parser, route mounting
- [ ] **Server:** Create `src/server.ts` — connect to MongoDB, then start HTTP server on PORT [ENV]

---

### Stage 5: Backend — Auth API

- [ ] **Util:** Create `src/utils/jwt.utils.ts` — `generateAccessToken(userId, role)`, `generateRefreshToken(userId)`, `verifyToken(token, secret)` [ENV]
- [ ] **Util:** Create `src/utils/bcrypt.utils.ts` — `hashPassword(password)`, `comparePassword(plain, hash)`
- [ ] **Middleware:** Create `src/middleware/auth.middleware.ts` — verify JWT from Authorization header, attach `req.user` ({ userId, role })
- [ ] **Middleware:** Create `src/middleware/role.middleware.ts` — `requireRole('driver' | 'customer' | 'admin')` — returns 403 if role mismatch
- [ ] **Controller:** Create `src/controllers/auth.controller.ts` — `signup` (validate input, check duplicate email/phone, hash password, create User, return tokens), `login` (find user by email, compare password, return tokens), `logout`, `getMe` (return current user from token)
- [ ] **Route:** Create `src/routes/auth.routes.ts` — `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` (protected)
- [ ] **Mount** auth routes in `app.ts`
- [ ] [STUB] No email verification — account is active immediately after signup
- [ ] [STUB] No OTP/SMS login — email + password only
- [ ] [STUB] JWT stored in localStorage on frontend (Phase 2: httpOnly cookies + refresh rotation)

---

### Stage 6: Authentication Frontend (Signup, Login, Role-Based Routing)

- [ ] **Types:** Create `/src/types/index.ts` — TypeScript interfaces for `User`, `Job`, `Application`, `Rating`, `Notification`, `DriverProfile`, `CustomerProfile`
- [ ] **Constants:** Create `/src/constants/index.ts` — `JOB_TYPES`, `CAR_TYPES`, `TRANSMISSION_TYPES`, `CITIES`, `VEHICLE_CATEGORIES`, `JOB_STATUSES`, `APPLICATION_STATUSES`
- [ ] **Service:** Create `/src/services/api.ts` — Axios instance with `baseURL` from `VITE_API_URL`, request interceptor to attach JWT from localStorage, response interceptor for 401 handling (redirect to login)
- [ ] **Context:** Create `/src/context/AuthContext.tsx` — `AuthProvider` wrapping app; provides `user`, `login()`, `signup()`, `logout()`, `isAuthenticated`, `loading` state; persists token in localStorage [STUB]
- [ ] **Hook:** Create `/src/hooks/useAuth.ts` — convenience hook consuming AuthContext
- [ ] **Page:** Create `/pages/auth/SignupPage.tsx` — role selection (Driver / Customer toggle cards), fields: Full Name, Email, Phone, Password, Confirm Password; `react-hook-form` + `zod` validation; `Create Account` button; link to Login page
- [ ] **Page:** Create `/pages/auth/LoginPage.tsx` — Email + Password fields, `Login` button, link to Signup page, "Forgot password?" link (non-functional) [STUB]
- [ ] **Component:** Create `<ProtectedRoute />` wrapper — checks `isAuthenticated` from AuthContext, redirects to `/login` if not
- [ ] **Component:** Create `<RoleRoute role="driver|customer" />` — checks user role, redirects if wrong role
- [ ] **Router:** Set up React Router v6 in `App.tsx` — public routes (`/`, `/login`, `/signup`), driver routes (`/driver/*`), customer routes (`/customer/*`); wrap protected routes with guards
- [ ] **Navigation:** Update `<Navbar />` — show Login/Sign Up for unauthenticated; show Dashboard link + NotificationBell + user avatar/name + Logout for authenticated; role-aware dashboard link

---

### Stage 7: Driver Onboarding Flow (Multi-Step Form + Document Upload)

- [ ] **Backend — Middleware:** Create `src/middleware/upload.middleware.ts` — Multer memory storage + Cloudinary upload helper function [ENV]
- [ ] **Backend — Service:** Create `src/services/cloudinary.service.ts` — `uploadToCloudinary(fileBuffer, folder)`, `deleteFromCloudinary(cloudinaryId)` [ENV]
- [ ] **Backend — Controller:** Create `src/controllers/driver.controller.ts` — `getProfile`, `createProfile` (all personal info + location + vehicle skills), `updateProfile`, `uploadDocuments` (handle 3 file uploads to Cloudinary, store URLs in DriverProfile)
- [ ] **Backend — Route:** Create `src/routes/driver.routes.ts` — `GET /api/driver/profile`, `POST /api/driver/profile`, `PATCH /api/driver/profile`, `POST /api/driver/documents` (multer middleware for file upload); all protected + requireRole('driver')
- [ ] **Mount** driver routes in `app.ts`
- [ ] **Frontend — Page:** Create `/pages/driver/OnboardingPage.tsx` — multi-step form container with progress indicator (Step X of 4 bar at top)
- [ ] **Frontend — Step 1 (Personal Info):** Full Name, Age, Phone, Email, Address fields; `react-hook-form` + `zod` validation
- [ ] **Frontend — Step 2 (Location):** City dropdown (Select), Areas within city multi-select chip selector
- [ ] **Frontend — Step 3 (Vehicle Skills):** Transmission toggle chips (Manual / Automatic / Semi-Automatic, multi-select), Vehicle Category toggle chips (Hatchback / Sedan / SUV / Luxury, multi-select)
- [ ] **Frontend — Step 4 (Document Upload):** Three upload boxes (Aadhaar, PAN, Driving License) using `react-dropzone`; each box: drag-and-drop or click-to-browse, shows filename on upload; upload status: idle → uploading → uploaded ✓; `Submit for Verification` button
- [ ] **Frontend:** On final submit: upload documents to backend, create/update driver profile, set `isProfileComplete: true` on user, redirect to Driver Dashboard
- [ ] [STUB] `isVerified` set to `true` immediately on profile completion — no real verification

---

### Stage 8: Customer Profile Setup

- [ ] **Backend — Controller:** Create `src/controllers/customer.controller.ts` — `getProfile`, `createProfile`, `updateProfile`
- [ ] **Backend — Route:** Create `src/routes/customer.routes.ts` — `GET /api/customer/profile`, `POST /api/customer/profile`, `PATCH /api/customer/profile`; all protected + requireRole('customer')
- [ ] **Mount** customer routes in `app.ts`
- [ ] **Frontend — Page:** Create `/pages/customer/ProfileSetupPage.tsx` — single page form: Name, Phone, Email, City (required); Car Make/Model, Preferred Transmission (optional); `react-hook-form` + `zod` validation; `Save Profile` button → set `isProfileComplete: true`, redirect to Customer Dashboard

---

### Stage 9: Job Posting System (Backend + Frontend)

- [ ] **Backend — Controller:** Create `src/controllers/jobs.controller.ts` — `createJob` (validate by jobType, save with status "posted"), `getJobs` (for driver: browse by city/areas with filters; for customer: own jobs), `getJobById`, `updateJobStatus`
- [ ] **Backend — Route:** Create `src/routes/jobs.routes.ts` — `POST /api/jobs` (customer), `GET /api/jobs` (driver: browse; customer: my jobs), `GET /api/jobs/:id`, `PATCH /api/jobs/:id/status`; protected with appropriate role guards
- [ ] **Mount** job routes in `app.ts`
- [ ] **Frontend — Page/Tab:** Create `PostJobTab` component within Customer Dashboard — job type selector (Hourly / Temporary / Permanent card toggle); dynamic form fields based on selection:
  - **Hourly:** Start Location, End Location, Estimated Duration (hours), Car Type, Transmission Type, Expected Payout (₹)
  - **Temporary:** Start Location, End Location, Duration (days), Car Type, Transmission Type, Daily Payment (₹)
  - **Permanent:** Work Location, Car Type, Transmission Type, Working Hours (12hr / 24x7), Monthly Salary (₹)
- [ ] **Frontend:** `react-hook-form` + `zod` validation per job type; `Post Job` CTA; success toast on creation

---

### Stage 10: Job Marketplace (Driver Browse + Filter)

- [ ] **Backend:** Implement job filtering in `getJobs` controller — filter by: city/areas, job type, car type, transmission type, min/max pay; sort by newest first
- [ ] **Frontend — Page/Tab:** Create `BrowseJobsTab` component within Driver Dashboard — filter bar (Location, Job Type, Pay Range, Car Type, Transmission); grid of `<JobCard />` components
- [ ] **Frontend:** Each `<JobCard />` shows: Job Type badge, Location, Car Type, Transmission, Duration, Payout, Customer Rating (0 if no history), `Apply` button; applied jobs show `Applied ✓` badge (button disabled)
- [ ] **Hook:** Create `/src/hooks/useJobs.ts` — fetch jobs with filter params, manage loading/error state

---

### Stage 11: Application System (Apply, Approve, Reject)

- [ ] **Backend — Controller:** Create `src/controllers/applications.controller.ts`:
  - `applyToJob` — driver applies (check no duplicate via compound index, save with `appliedAt` timestamp)
  - `getDriverApplications` — driver's own applications with status
  - `getJobApplicants` — customer views applicants for their job; sorted by `appliedAt` ASC, ties broken by higher rating; populate driver profile info (name, age, rating, vehicle experience, verification status)
  - `updateApplication` — customer hires (set `status: approved`, reject all other applicants, set `job.acceptedDriverId`, create notifications); driver accepts/declines (`driverResponse` field)
- [ ] **Backend:** When customer hires a driver: auto-reject all other pending applications for that job; create notification for hired driver and rejected drivers
- [ ] **Backend:** When driver is hired for a job: auto-close (withdraw) all other pending applications by that same driver for other jobs
- [ ] **Backend — Route:** Create `src/routes/applications.routes.ts` — `POST /api/applications` (driver), `GET /api/applications/driver` (driver), `GET /api/applications/job/:jobId` (customer), `PATCH /api/applications/:id` (customer hires / driver accepts/declines); protected
- [ ] **Mount** application routes in `app.ts`
- [ ] **Frontend — Component:** Applicant list panel/modal for customer — triggered from `View Applicants` button on job card; displays list of `<ApplicantCard />` sorted first-applied-first, ties by rating; `Hire` button per applicant
- [ ] **Frontend — Page/Tab:** Create `MyApplicationsTab` for Driver Dashboard — list of application cards with status badges: `Pending` / `Approved` / `Rejected`; approved cards show: Customer Name, Phone, Pickup Location, Job Details + `Accept Job` / `Decline` buttons
- [ ] **Hook:** Create `/src/hooks/useApplications.ts` — apply to job, fetch driver applications, fetch job applicants, update application

---

### Stage 12: Driver & Customer Dashboards (All Tabs)

- [ ] **Frontend — Page:** Create `/pages/driver/DriverDashboard.tsx` — `<Tabs />` navigation: Browse Jobs / My Applications / Active / Completed
- [ ] **Frontend — Tab:** `Active` tab (Driver) — current in-progress job details, `Mark as Completed` button
- [ ] **Frontend — Tab:** `Completed` tab (Driver) — job history with customer rating received
- [ ] **Frontend — Page:** Create `/pages/customer/CustomerDashboard.tsx` — `<Tabs />` navigation: Post a Job / My Jobs / Completed
- [ ] **Frontend — Tab:** `My Jobs` tab (Customer) — list of active job cards; each card: Job Type badge, Location, Payout, `X applicants` count, `View Applicants` button
- [ ] **Frontend — Tab:** `Completed` tab (Customer) — past jobs with `Rate Driver` button if not yet rated; clicking opens rating modal

---

### Stage 13: Job Status Lifecycle (accepted → in_progress → completed → cancelled)

- [ ] **Backend:** Implement full status transition logic in `updateJobStatus` controller:
  - `posted → applied` (auto on first application)
  - `applied → accepted` (when customer hires and driver accepts)
  - `accepted → in_progress` (manually triggered by driver or customer)
  - `in_progress → completed` (manually marked by either party)
  - Any active status → `cancelled` (by driver or customer)
- [ ] **Backend:** Validate allowed transitions — reject invalid status changes (e.g., posted → completed)
- [ ] **Backend:** On status change: create appropriate notifications for both parties
- [ ] **Frontend:** Wire up `Mark as Completed` button on Active tab (driver), update job status via API
- [ ] **Frontend:** Wire up status change actions on Customer Dashboard (start job, mark complete)
- [ ] **Frontend:** Display current job status with appropriate `<Badge />` colors across all views

---

### Stage 14: Rating & Review System

- [ ] **Backend — Controller:** Create `src/controllers/ratings.controller.ts` — `createRating` (validate: job must be completed, rater must be participant, no duplicate rating per rater-ratee-job; auto-calculate `overallRating` as average of sub-ratings), `getDriverRatings` (all ratings for a driver)
- [ ] **Backend:** After new rating created: recalculate and update `averageRating` on `DriverProfile` or `CustomerProfile`
- [ ] **Backend — Route:** Create `src/routes/ratings.routes.ts` — `POST /api/ratings`, `GET /api/ratings/driver/:driverId`; protected
- [ ] **Mount** rating routes in `app.ts`
- [ ] **Frontend — Component:** Create `<RatingModal />` — triggered post-completion; 3 star-rating categories (Driving Skill, Professional Behavior, Punctuality) using `<RatingStars interactive />`, optional text review textarea, `Submit Rating` button
- [ ] **Frontend:** Integrate rating modal into Customer Completed tab — show prompt for unrated jobs
- [ ] **Frontend:** Display driver average rating on `<ApplicantCard />` and `<JobCard />` (customer rating shown)

---

### Stage 15: Notifications (Polling-Based)

- [ ] **Backend — Service:** Create `src/services/notification.service.ts` — `createNotification(userId, type, message, relatedJobId)` helper called from controllers when events occur
- [ ] **Backend — Controller:** Create `src/controllers/notifications.controller.ts` — `getNotifications` (fetch unread for current user, sorted newest first), `markAllRead` (set `isRead: true` for all user's notifications)
- [ ] **Backend — Route:** Create `src/routes/notifications.routes.ts` — `GET /api/notifications`, `PATCH /api/notifications/read`; protected
- [ ] **Mount** notification routes in `app.ts`
- [ ] **Backend:** Add notification creation calls to all relevant events:
  - Driver applies to job → notify customer (`driver_applied`)
  - Customer hires driver → notify driver (`application_approved`)
  - Customer rejects driver → notify driver (`application_rejected`)
  - Driver accepts job → notify customer (`driver_accepted`)
  - Driver declines job → notify customer (`driver_declined`)
  - Job completed → notify both parties (`job_completed`)
  - New job in driver's area → notify driver (`new_job`)
- [ ] **Context:** Create `/src/context/NotificationContext.tsx` — fetch notifications on interval (polling every 30s), provide `notifications`, `unreadCount`, `markAllRead()` [STUB]
- [ ] **Hook:** Create `/src/hooks/useNotifications.ts` — convenience hook consuming NotificationContext
- [ ] **Frontend — Component:** `<NotificationBell />` — bell icon in nav with red badge showing `unreadCount`; click → slide-in side panel (or dropdown); each notification: icon + text + timestamp; `Mark all as read` button; empty state: "No new notifications"

---

### Stage 16: Cancellation Flow

- [ ] **Backend:** Implement cancellation logic in `updateJobStatus` — either party can cancel `accepted` or `in_progress` jobs; accept optional `cancellationReason` text; set `job.status = "cancelled"`; create notifications for both parties
- [ ] **Backend:** No financial penalty logic in Phase 1 [STUB]
- [ ] **Frontend:** Add `Cancel Job` button on Active tab (driver) and My Jobs tab (customer) for accepted/in-progress jobs
- [ ] **Frontend:** Cancellation confirmation modal with optional reason text field
- [ ] **Frontend:** Update UI to show cancelled status on job cards

---

### Stage 17: Search & Filters (Polish)

- [ ] **Backend — Driver-side filters:** Ensure `GET /api/jobs` supports query params: `city`, `minPay`, `maxPay`, `jobType`, `carType`, `transmissionType`, `workingHours`
- [ ] **Backend — Customer-side filters:** Ensure `GET /api/applications/job/:jobId` supports query params: `minRating`, `experienceLevel`, `availability`
- [ ] **Frontend:** Driver filter bar with all filter options — dropdowns/inputs for Location, Minimum Pay, Job Type, Car Type, Transmission; apply filters to API call; clear filters button
- [ ] **Frontend:** Customer applicant filter controls — Rating minimum, Experience level; apply to applicant list display

---

### Stage 18: Responsive Design & Final Polish

- [ ] **Responsive:** Verify all pages at Desktop (≥1280px) — full multi-column, side-by-side cards
- [ ] **Responsive:** Verify all pages at Tablet (768–1279px) — 2-column grids, reduced padding
- [ ] **Responsive:** Verify all pages at Mobile (<768px) — single column, stacked sections, hamburger nav, larger touch targets (min 44px)
- [ ] **Responsive:** Navbar mobile hamburger menu → full-screen slide-down drawer
- [ ] **Interactions:** Card hover: `translateY(-2px)` + shadow deepen on all card components
- [ ] **Interactions:** Button hover: background-color transition 150ms ease
- [ ] **Interactions:** FAQ accordion: `max-height` transition 300ms ease
- [ ] **Interactions:** Scroll fade-in: `opacity 0→1 + translateY 20px→0` on viewport enter (IntersectionObserver) for landing page sections
- [ ] **Interactions:** Toast notifications: slide in from top-right, auto-dismiss after 3s
- [ ] **Empty States:** Add `<EmptyState />` components for: no jobs found, no applications, no notifications, no completed jobs
- [ ] **Loading States:** Add `<Skeleton />` loading placeholders for job lists, applicant lists, dashboard tabs
- [ ] **Error Handling:** Add error boundary and user-friendly error display for failed API calls

---

### Stage 19: Deployment

- [ ] **MongoDB Atlas:** Create free M0 cluster, get connection string, configure network access [ENV]
- [ ] **Cloudinary:** Create account, get Cloud Name / API Key / API Secret [ENV]
- [ ] **Backend — Render:** Create web service, connect Git repo, set build command (`npm install && npm run build`), start command (`node dist/server.js`), configure all environment variables [ENV]
- [ ] **Frontend — Vercel:** Connect Git repo, set Vite framework preset, configure `VITE_API_URL` to point to Render backend URL [ENV]
- [ ] **CORS:** Update backend CORS config with Vercel frontend URL
- [ ] **Verify:** End-to-end smoke test: signup → login → create profile → post job → apply → hire → accept → complete → rate

---
---

## PHASE 2 — Version 1.0 (Production)

---

### Stage 1: Real Authentication (OTP, Email Verification, Refresh Tokens)

- [ ] Integrate **Twilio** or **MSG91** for SMS OTP — create `src/services/otp.service.ts` [ENV] — replaces: Phase 1 stub (no OTP/SMS login)
- [ ] Add routes: `POST /api/auth/send-otp`, `POST /api/auth/verify-otp`
- [ ] Add `phone_verified: boolean` field to `users` schema — replaces: Phase 1 stub (no phone verification)
- [ ] Implement email verification on signup via **SendGrid** or **Resend** [ENV] — replaces: Phase 1 stub (no email verification)
- [ ] Implement refresh token rotation — `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`; store refresh tokens securely (httpOnly cookies); rotate on each refresh [ENV] — replaces: Phase 1 stub (JWT in localStorage)
- [ ] Implement session management — revoke all sessions on logout from all devices; track active sessions per user
- [ ] Add `Login with OTP` option on Login page alongside email/password — replaces: Phase 1 email/password-only login
- [ ] Frontend: update AuthContext to use httpOnly cookies + refresh token flow instead of localStorage

---

### Stage 2: Real Document Verification

- [ ] Integrate **DigiLocker API** or **IDfy/Karza** — create `src/services/verification.service.ts` [ENV] — replaces: Phase 1 stub (`isVerified: true` on profile completion)
- [ ] Implement Aadhaar verification via API — validates against DigiLocker/Karza database
- [ ] Implement PAN verification via API
- [ ] Implement Driving License validation via API
- [ ] Integrate background check via **AuthBridge** or similar [ENV]
- [ ] Change driver account flow: `isVerified` stays `false` until ALL checks pass — replaces: Phase 1 immediate activation
- [ ] Update Driver Onboarding Step 4 UI: show real verification status (pending → under review → verified / rejected with reason) — replaces: Phase 1 instant upload-and-done flow
- [ ] Create admin notifications when manual review is needed

---

### Stage 3: Admin Panel (Routes + UI)

- [ ] **Backend:** Create `src/routes/admin.routes.ts` — all behind `requireRole('admin')` middleware (already built in Phase 1); mount at `/api/admin`
- [ ] **Backend:** `GET /api/admin/stats` — platform analytics: DAU, total jobs posted, completion rate, average rating
- [ ] **Backend:** `GET /api/admin/verification-queue` — list pending driver document reviews
- [ ] **Backend:** `PATCH /api/admin/drivers/:id/verify` — approve/reject with notes
- [ ] **Backend:** `GET /api/admin/users` — searchable list of all users with filter by role/status
- [ ] **Backend:** `PATCH /api/admin/users/:id/status` — activate/deactivate/ban users
- [ ] **Backend:** `GET /api/admin/jobs` — all jobs with status filters, ability to flag/remove
- [ ] **Backend:** `GET /api/admin/complaints` + `POST /api/admin/complaints/:id/resolve` — complaint tickets with resolution workflow
- [ ] **Frontend — Page:** Create `/admin/dashboard` — platform stat cards (DAU, jobs, completion rate, avg rating) using `<StatCard />`
- [ ] **Frontend — Page:** Create `/admin/verification-queue` — table of pending driver document reviews; each row: driver info, uploaded documents (viewable), `Approve` / `Reject` buttons with notes field
- [ ] **Frontend — Page:** Create `/admin/users` — searchable, filterable table of all users; columns: Name, Role, Status, Rating, Joined Date; actions: view profile, activate/deactivate
- [ ] **Frontend — Page:** Create `/admin/jobs` — all jobs table with status filters, flag/remove actions
- [ ] **Frontend — Page:** Create `/admin/complaints` — complaint ticket list with resolution workflow UI
- [ ] **Router:** Add admin routes (`/admin/*`) with `requireRole('admin')` guard

---

### Stage 4: Real-Time Infrastructure (Socket.io)

- [ ] Install `socket.io` (backend) and `socket.io-client` (frontend) [ENV]
- [ ] **Backend:** Wrap existing HTTP server with Socket.io in `server.ts` — `const io = new Server(httpServer, { cors: { origin: CLIENT_URL } })` — replaces: Phase 1 polling-based architecture
- [ ] **Backend:** Implement Socket.io authentication middleware — verify JWT on connection
- [ ] **Backend:** Create room structure: `user:${userId}` for personal notifications, `job:${jobId}` for job updates
- [ ] **Backend:** Update `notification.service.ts` — emit Socket.io event alongside DB write: `io.to('user:${userId}').emit('notification', payload)` — replaces: Phase 1 polling-based notifications
- [ ] **Backend:** Emit live applicant count updates: `io.to('job:${jobId}').emit('applicant_count', { count })` — replaces: Phase 1 static applicant count
- [ ] **Backend:** Emit real-time status updates when driver accepts/declines
- [ ] **Frontend:** Create Socket.io connection manager hook — connect on auth, join user room, handle reconnection
- [ ] **Frontend:** Update NotificationContext to use Socket.io events instead of polling — replaces: Phase 1 30s polling interval [STUB replaced]
- [ ] **Frontend:** Live job feed — new jobs appear in driver's browse list without page refresh
- [ ] **Frontend:** Real-time applicant count on customer's job cards

---

### Stage 5: Payment & Wallet (Razorpay)

- [ ] Integrate **Razorpay** SDK — create `src/services/payment.service.ts` [ENV] — activates: `paymentId` field in jobs schema (was null in Phase 1)
- [ ] **Backend:** `POST /api/payments/create-order` — customer initiates escrow-style payment; creates Razorpay order
- [ ] **Backend:** `POST /api/payments/verify` — verify Razorpay webhook signature for payment confirmation [ENV]
- [ ] **Backend:** `POST /api/payments/release/:jobId` — release escrowed payment to driver wallet on job completion
- [ ] **Backend:** `GET /api/payments/history` — transaction history for driver or customer
- [ ] **Backend:** Implement platform fee / commission deduction logic
- [ ] **Backend:** Driver wallet model — balance, withdrawal to bank account, bank account setup
- [ ] **Backend:** Invoice generation — PDF-renderable invoice with job details, hours, payout, platform fee breakdown; download endpoint
- [ ] **Frontend — Page:** Customer Payments — add funds, view transaction history, release payment on completion
- [ ] **Frontend — Page:** Driver Wallet — balance display, withdrawal button, bank account setup form, transaction history
- [ ] **Frontend — Tab:** Add `Earnings` tab to Driver Dashboard — wallet balance + transaction history
- [ ] **Frontend — Tab:** Add `Payments` tab to Customer Dashboard
- [ ] **Frontend — Page:** Invoice screen — PDF-renderable layout, job details, hours, payout, fee breakdown, download button

---

### Stage 6: GPS Tracking (Google Maps + Socket.io)

- [ ] Integrate **Google Maps JavaScript API** — add API key [ENV] — activates: `location` GeoJSON field in jobs schema (was null in Phase 1)
- [ ] **Backend:** Socket.io driver location broadcast — `socket.on('driver:location', ({ jobId, coords }) => io.to('job:${jobId}:customer').emit('driver:location', coords))`
- [ ] **Backend:** Store driver's latest location during `in_progress` job (ephemeral, in-memory or Redis)
- [ ] **Frontend — Page:** Live GPS Tracking Screen (customer view during `in_progress`) — full-width Google Map embed, driver location marker updates via Socket.io, job summary panel overlay
- [ ] **Frontend:** Add live tracking link to Customer Dashboard for in-progress jobs
- [ ] **Frontend:** Driver-side: send location updates via Socket.io using browser Geolocation API

---

### Stage 7: In-App Chat (Per-Job Messaging)

- [ ] **Backend — Model:** Create `Message` model — `jobId` (ref: Job), `senderId` (ref: User), `text`, `sentAt`, `isRead`
- [ ] **Backend — Route:** `GET /api/chat/:jobId` — message history for a job; `POST /api/chat/:jobId` — send message; protected, only job participants can access
- [ ] **Backend:** Socket.io room per jobId — real-time message delivery on send
- [ ] **Frontend — Page:** In-app chat screen — accessible from active job card; message bubbles (driver left / customer right), timestamp per message, input bar + send button
- [ ] **Frontend:** Ensure no cross-job message leakage — chat scoped strictly to jobId

---

### Stage 8: Push Notifications (Firebase FCM)

- [ ] Integrate **Firebase Cloud Messaging (FCM)** — create `src/services/fcm.service.ts` [ENV]
- [ ] Add `fcmToken: string` field to `users` schema (MongoDB alter-free addition)
- [ ] **Backend:** Trigger FCM push alongside existing notification DB write + Socket.io emit
- [ ] **Frontend:** FCM token registration on login/page load; opt-in banner for push notification permission
- [ ] Integrate email notifications via **SendGrid** or **Resend** for key events (job completed, payment released, etc.) [ENV]

---

### Stage 9: Advanced Geo-Matching (MongoDB $near, GeoJSON)

- [ ] Add `2dsphere` index on `jobs.location` field — activates: `location: GeoJSON` field (was null in Phase 1)
- [ ] Integrate **Google Maps Geocoding API** to convert address strings to GeoJSON coordinates on job creation [ENV]
- [ ] **Backend:** Update `GET /api/jobs` to use `$near` / `$geoWithin` queries instead of city string matching — replaces: Phase 1 string-based city matching
- [ ] **Backend:** Store driver location as GeoJSON Point in `driver_profiles` schema
- [ ] **Backend:** Configurable matching radius for job proximity
- [ ] **Frontend:** Update job browse to show distance-based results; map view option

---

### Stage 10: Cancellation Penalties

- [ ] Define cancellation policy — free cancellation window (e.g., 15 minutes after acceptance) — replaces: Phase 1 stub (no financial penalty)
- [ ] **Backend:** Implement late cancellation penalty logic — deduct from driver/customer wallet balance
- [ ] **Backend:** Make cancellation policy configurable by admin
- [ ] **Frontend:** Display cancellation policy and penalty warning in cancellation modal
- [ ] **Frontend:** Admin UI to configure cancellation window and penalty amounts

---

### Stage 11: AI Job Matching (Optional / Post-Launch)

- [ ] Design matching algorithm — factor in: driver history, ratings, location proximity, vehicle skills, availability
- [ ] **Backend:** Recommend best-fit jobs to drivers based on profile + history
- [ ] **Backend:** Recommend best-fit drivers to customers when posting a job
- [ ] **Frontend:** "Recommended for you" section on driver browse jobs
- [ ] **Frontend:** "Suggested drivers" section on customer post-job confirmation

---

### Stage 12: Production Infrastructure

- [ ] Set up **Redis** (Upstash) for caching job listings and session tokens [ENV]
- [ ] Implement **rate limiting** on all API endpoints using `express-rate-limit` + Redis store
- [ ] Set up **Sentry** for frontend + backend error monitoring [ENV]
- [ ] Set up **Logtail** or **Datadog** for structured backend log management [ENV]
- [ ] Configure **CDN** (Cloudflare or Vercel Edge) for static asset delivery
- [ ] Set up **PM2** cluster mode or containerized deployment for horizontal backend scaling
- [ ] Performance audit — optimize DB queries, add missing indexes, review N+1 queries
- [ ] Security audit — OWASP Top 10 checklist, input sanitization review, CSRF protection, secure headers (helmet)
- [ ] Load testing — verify platform handles expected concurrent users

---

## Phase 1 → Phase 2: Stub Replacement Summary

| Phase 1 Stub | Phase 2 Replacement |
|---|---|
| `isVerified: true` on profile completion | DigiLocker/IDfy API verification response |
| Polling notifications (30s interval) | Socket.io real-time events |
| No payment flow | Razorpay escrow + wallet + invoicing |
| String-based city matching | MongoDB `$near` GeoJSON queries |
| In-app notifications only | FCM push + SendGrid email |
| No admin routes/panel | `/admin` router + full admin UI |
| JWT in localStorage | httpOnly cookies + refresh token rotation |
| No OTP/SMS | Twilio/MSG91 OTP flow |
| No email verification | SendGrid/Resend email verification |
| `paymentId: null` in jobs schema | Populated with Razorpay payment ID |
| `location: null` in jobs schema | Populated with GeoJSON from Google Maps Geocoding |
| No cancellation penalties | Wallet-based penalty deductions |
| "Forgot password?" non-functional | Working password reset via email/OTP |
